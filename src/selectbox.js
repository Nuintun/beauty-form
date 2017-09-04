/*!
 * SelectBox
 * Date: 2015/06/12
 * https://github.com/nuintun/beautify-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beautify-form/blob/master/LICENSE
 */

import $ from 'jquery';
import Observer from './observer';
import { win, doc, activeElement } from './util';
import scrollIntoViewIfNeeded from './scrollintoviewifneeded';

var timer;
var reference = 0;
var actived = null;

// viewport size
var VIEWPORT = {
  width: win.width(),
  height: win.height()
};

/**
 * compile
 *
 * @param context
 * @param template
 * @returns {string}
 */
function compile(context, template) {
  var args = [].slice.call(arguments, 2);
  var html = template.apply(context, args);

  if ($.type(html) === 'string') {
    return html;
  } else {
    throw new TypeError('Render function must return a string.');
  }
}

export default function SelectBox(element, options) {
  var context = this;

  context.type = 'select';
  context.opened = false;
  context.destroyed = false;
  context.element = $(element);
  context.observer = new Observer(element);

  if (element.multiple || element.size > 1) {
    return context;
  }

  options = $.extend({
    title: function(element, text) {
      return '<i class="ui-beautify-select-align-middle"></i>'
        + '<span class="ui-beautify-select-title" title="' + text + '">'
        + text + '</span><i class="ui-beautify-select-icon"></i>';
    },
    dropdown: function(element, options) {
      return '<dl class="ui-beautify-select-dropdown-items">' + options + '</dl>';
    },
    optgroup: function(element, label) {
      return '<dt class="ui-beautify-select-optgroup" title="' + label + '">' + label + '</dt>';
    },
    option: function(element, option) {
      return '<dd role="option" class="ui-beautify-select-option'
        + (option.group ? ' ui-beautify-select-optgroup-option' : '')
        + (option.className ? ' ' + option.className : '') + '" '
        + option.indexAttr + '="' + option.index + '" title="'
        + option.text + '">' + option.text + '</dd>';
    },
    dropdownWidth: null,
    optionIndexAttr: 'data-option',
    optionSelectedClass: 'ui-beautify-select-option-selected',
    optionDisabledClass: 'ui-beautify-select-option-disabled'
  }, options);

  $.each(['title', 'dropdown', 'optgroup', 'option'], function(index, prop) {
    if ($.type(options[prop]) !== 'function') {
      throw new TypeError('Options.' + prop + ' must be a function.');
    }
  });

  context.options = options;

  context.__init();
}

/**
 * get
 *
 * @param element
 * @returns {*}
 */
SelectBox.get = function(element) {
  element = $(element);

  return element.data('beautify-select');
};

SelectBox.prototype = {
  __init: function() {
    var context = this;
    var type = context.type;
    var options = context.options;
    var namespace = '.beautify-' + type;

    actived = context;

    function change() {
      var selectbox = SelectBox.get(this);

      if (selectbox) {
        selectbox.__renderTitlebox();
        selectbox.opened && selectbox.__refreshSelected();
      }
    };

    function refresh() {
      var selectbox = SelectBox.get(this);

      selectbox && selectbox.__refreshSelectbox();
    };

    context.observer
      .watch('disabled', refresh)
      .watch('selectedIndex', change);

    if (!reference) {
      var selector = 'select';

      doc
        .on('focusin' + namespace, selector, refresh)
        .on('change' + namespace, selector, change)
        .on('focusout' + namespace, selector, refresh)
        .on('mousedown' + namespace, function(e) {
          var target = e.target;
          var selectbox = actived.selectbox[0];

          if (target !== selectbox && !$.contains(selectbox, target) && actived.opened) {
            actived.close();
            actived.__refreshSelectbox();
          }
        })
        .on('keydown' + namespace, function(e) {
          if (e.which === 9 || e.which === 27) {
            actived.opened && actived.close();
            actived.__refreshSelectbox();
          }
        });

      win.on('resize' + namespace, function() {
        clearTimeout(timer);

        VIEWPORT.width = win.width();
        VIEWPORT.height = win.height();

        timer = setTimeout(function() {
          actived.opened && actived.__position();
        }, 0);
      });
    }

    context.__beautify();

    context.element.on('keypress' + namespace, function(e) {
      if (e.which === 13) {
        e.preventDefault();

        if (context.opened) {
          context.close();
        } else {
          context.open();
        }
      }
    });

    context.selectbox
      .on('mousedown' + namespace, function(e) {
        e.preventDefault();

        var select = context.element;

        if (select[0].disabled) return;

        if (context.opened) {
          var target = e.target;
          var dropdown = context.dropdown[0];

          if (dropdown !== target && !$.contains(dropdown, target)) {
            context.close();
          }
        } else {
          context.open();
        }

        setTimeout(function() {
          select.focus();
        }, 0);
      })
      .on('click' + namespace, '[' + options.optionIndexAttr + ']', function(e) {
        e.preventDefault();

        var option = $(this);

        if (option.hasClass(options.optionDisabledClass)) return;

        context.element[0].selectedIndex = option.attr(options.optionIndexAttr);

        context.close();
      });

    return context;
  },
  __sizeSelectbox: function() {
    var context = this;
    var element = context.element;
    var selectbox = context.selectbox;
    var width = element.outerWidth() - selectbox.outerWidth() + selectbox.width();
    var height = element.outerHeight() - selectbox.outerHeight() + selectbox.height();

    selectbox.width(width);
    selectbox.height(height);

    return context;
  },
  __sizeDropdown: function() {
    var context = this;

    if (!context.opened) {
      context.dropdown.css('visibility', 'hidden');
      context.dropdown.appendTo(context.selectbox);
    }

    var dropdown = context.dropdown;
    var clone = context.element.clone();
    var size = {
      dropdown: {
        width: dropdown.width(),
        outerWidth: dropdown.outerWidth()
      }
    };

    clone.css({
      'position': 'absolute',
      'visibility': 'hidden',
      'width': 'auto',
      'top': '-100%',
      'left': '-100%'
    });

    clone.insertBefore(context.element);

    var width = clone.outerWidth();

    clone.remove();

    width = Math.max(width, context.element.outerWidth()) - size.dropdown.outerWidth + size.dropdown.width;
    width = Math.max(width, context.options.dropdownWidth || 0);

    dropdown.width(width);

    if (!context.opened) {
      context.dropdown.detach();
      context.dropdown.css('visibility', 'visible');
    }

    return context;
  },
  __position: function() {
    var context = this;

    if (context.opened) {
      var selectbox = context.selectbox;
      var dropdown = context.dropdown;
      var offset = selectbox[0].getBoundingClientRect();

      var size = {
        window: { height: win.height() },
        selectbox: { outerHeight: selectbox.outerHeight() },
        dropdown: { outerHeight: dropdown.outerHeight() }
      };

      var position = offset.top > win.height() - offset.bottom ? 'top' : 'bottom';

      dropdown
        .removeClass('ui-beautify-select-dropdown-' + (position === 'top' ? 'bottom' : 'top'))
        .addClass('ui-beautify-select-dropdown-' + position);

      dropdown.css({
        top: position === 'bottom' ? size.selectbox.outerHeight : -size.dropdown.outerHeight
      });
    }

    return context;
  },
  __renderTitlebox: function() {
    var template = '';
    var context = this;
    var selected = null;
    var element = context.element[0];
    var title = context.options.title;
    var selectedIndex = element.selectedIndex;

    if (selectedIndex >= 0) {
      selected = element.options[selectedIndex];
      template = selected.innerHTML;
    }

    context.titlebox.html(compile(context, title, selected, template));

    return context;
  },
  __renderDropdown: function() {
    var index = 0;
    var dropdown = '';
    var context = this;
    var options = context.options;
    var selectedIndex = context.element[0].selectedIndex;

    function option(element, group) {
      var selected = index === selectedIndex;
      var option = {
        group: group,
        index: index++,
        text: element.html(),
        indexAttr: options.optionIndexAttr,
        className: element[0].disabled ? options.optionDisabledClass : (selected ? options.optionSelectedClass : '')
      };

      dropdown += compile(
        context,
        options.option,
        element,
        option
      );
    }

    function optgroup(element) {
      dropdown += compile(
        context,
        options.optgroup,
        element,
        element.attr('label')
      );
    }

    var items = context.element.children();

    items.each(function() {
      var element = $(this);

      switch (this.nodeName.toLowerCase()) {
        case 'option':
          option(element);
          break;
        case 'optgroup':
          optgroup(element);
          element.children().each(function() {
            option($(this), element);
          });
          break;
      }
    });

    context.dropdown.html(compile(
      context,
      options.dropdown,
      items,
      dropdown
    ));

    return context;
  },
  __refreshSelectbox: function() {
    var context = this;
    var element = context.element[0];
    var selectbox = context.selectbox;
    var focused = activeElement();

    focused = context.opened
      || focused === element
      || focused === selectbox[0]
      || $.contains(selectbox[0], focused);

    selectbox
      .toggleClass('ui-beautify-select-disabled', element.disabled)
      .toggleClass('ui-beautify-select-focus', focused);

    return context;
  },
  __refreshSelected: function() {
    var context = this;
    var options = context.options;
    var dropdown = context.dropdown;
    var selectedClass = options.optionSelectedClass;
    var selectedIndex = context.element[0].selectedIndex;

    dropdown
      .find('.' + selectedClass)
      .removeClass(selectedClass);

    var selected = dropdown.find('[' + options.optionIndexAttr + '=' + selectedIndex + ']');

    selected.addClass(selectedClass);

    selected = selected[0];

    selected && scrollIntoViewIfNeeded(selected);

    return context;
  },
  __beautify: function() {
    var context = this;
    var element = context.element;

    element.addClass('ui-beautify-select-hidden');

    var selectbox = $('<div role="combobox" tabindex="-1" class="ui-beautify-select"/>');

    context.titlebox = $('<div class="ui-beautify-select-titlebox"/>');
    context.dropdown = $('<div role="listbox" class="ui-beautify-select-dropdown"/>');

    selectbox
      .append(context.titlebox)
      .insertAfter(context.element);

    context.selectbox = selectbox;

    element.data('beautify-select', context);

    reference++;

    return context.refresh();
  },
  refresh: function() {
    var context = this;

    context.__sizeSelectbox();
    context.__renderTitlebox();
    context.__renderDropdown();
    context.__sizeDropdown();

    return context.__refreshSelectbox();
  },
  open: function() {
    var context = this;

    if (context.opened) return context;

    context.opened = true;

    if (actived !== context) {
      actived.opened && actived.close();
      actived.__refreshSelectbox();
    }

    actived = context;

    context.selectbox.addClass('ui-beautify-select-opened');
    context.dropdown.appendTo(context.selectbox);
    context.__position();
    context.__refreshSelected();

    return context;
  },
  close: function() {
    var context = this;

    if (context.opened) {
      context.opened = false;

      context.dropdown.detach();
      context.selectbox.removeClass('ui-beautify-select-opened');
    }

    return context;
  },
  destroy: function() {
    var context = this;

    if (!context.destroyed) {
      var type = context.type;
      var element = context.element;
      var namespace = '.beautify-' + type;

      context.element.off('keypress' + namespace);
      context.selectbox.off().remove();
      context.dropdown.remove();

      element
        .removeData('beautify-select')
        .removeClass('ui-beautify-select-hidden');

      context.observer
        .unwatch('disabled')
        .unwatch('selectedIndex');

      if (!--reference) {
        doc
          .off('focusin' + namespace)
          .off('change' + namespace)
          .off('focusout' + namespace)
          .off('mousedown' + namespace)
          .off('keydown' + namespace);

        win.off('resize' + namespace);
      }

      context.destroyed = true;
    }
  }
};
