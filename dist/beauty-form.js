(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define('beauty-form', ['jquery'], factory) :
  (global.beautyForm = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  /*!
   * util
   * Date: 2016/06/14
   * https://github.com/nuintun/beauty-form
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
   */

  var win = $(window);
  var doc = $(document);

  /**
   * 获取当前焦点的元素
   */
  function activeElement() {
    try {
      // try: ie8~9, iframe #26
      var activeElement = document.activeElement;
      var contentDocument = activeElement.contentDocument;

      return contentDocument && contentDocument.activeElement || activeElement;
    } catch (e) {
      // do nothing
    }
  }

  /*!
   * choice
   * Date: 2015/06/07
   * https://github.com/nuintun/beauty-form
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
   */

  var reference = {};

  /**
   * radio
   *
   * @param element
   */
  function radio(element) {
    doc.find('input[type=radio][name=' + element.name + ']').each(function() {
      var choice = Choice.get(this);

      if (choice && element !== this) {
        choice.refresh();
      }
    });
  }

  /**
   * Choice
   *
   * @param element
   * @constructor
   */
  function Choice(element) {
    var context = this;

    context.destroyed = false;
    context.element = $(element);
    context.type = context.element.attr('type');
    context.type = context.type ? context.type.toLowerCase() : undefined;

    var choice = Choice.get(element);

    if (choice) {
      return choice;
    }

    if (context.type !== 'checkbox' && context.type !== 'radio') {
      throw new TypeError('The element must be a checkbox or radio.');
    }

    context.__init();
  }

  /**
   * get
   *
   * @param element
   * @returns {*}
   */
  Choice.get = function(element) {
    element = $(element);

    return element.data('beauty-choice');
  };

  /**
   * Choice.prototype
   *
   * @type {{
   *   init: Choice.init,
   *   focus: Choice.focus,
   *   blur: Choice.blur,
   *   check: Choice.check,
   *   uncheck: Choice.uncheck,
   *   enable: Choice.enable,
   *   disable: Choice.disable,
   *   refresh: Choice.refresh,
   *   beauty: Choice.beauty,
   *   destory: Choice.destory
   * }}
   */
  Choice.prototype = {
    __init: function() {
      var type = this.type;

      if (!reference[type]) {
        reference[type] = 0;

        var namespace = '.beauty-' + type;
        var selector = 'input[type=' + type + ']';

        doc.on('change' + namespace, selector, function() {
          var choice = Choice.get(this);

          if (choice) {
            if (type === 'radio') {
              radio(this);
            }

            choice.refresh();
          }
        });

        doc.on('focusin' + namespace, selector, function() {
          var choice = Choice.get(this);

          choice && choice.refresh();
        });

        doc.on('focusout' + namespace, selector, function() {
          var choice = Choice.get(this);

          choice && choice.refresh();
        });
      }

      return this.__beauty();
    },
    __beauty: function() {
      var context = this;
      var element = context.element;

      if (!Choice.get(element)) {
        var type = context.type;

        element.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-' + type + '"/>');

        reference[type]++;
        context.choice = element.parent();

        context.choice.attr('role', context.choice.type);

        element.data('beauty-choice', context);
      }

      return context.refresh();
    },
    focus: function() {
      this.element.trigger('focus');

      return this;
    },
    blur: function() {
      this.element.trigger('blur');

      return this;
    },
    check: function() {
      var context = this;
      var type = context.type;
      var element = context.element[0];

      element.checked = true;

      if (type === 'radio') {
        radio(element);
      }

      return context.refresh();
    },
    uncheck: function() {
      var context = this;
      var type = context.type;
      var element = context.element[0];

      element.checked = false;

      if (type === 'radio') {
        radio(element);
      }

      return context.refresh();
    },
    enable: function() {
      this.element[0].disabled = false;

      return this.refresh();
    },
    disable: function() {
      this.element[0].disabled = true;

      return this.refresh();
    },
    refresh: function() {
      var context = this;
      var element = context.element[0];

      context.choice
        .toggleClass('ui-beauty-choice-checked', element.checked)
        .toggleClass('ui-beauty-choice-disabled', element.disabled)
        .toggleClass('ui-beauty-choice-focus', activeElement() === element);

      return context;
    },
    destroy: function() {
      var context = this;

      if (context.destroyed) return;

      var type = context.type;
      var element = context.element;

      element.unwrap();
      element.removeData('beauty-choice');

      reference[type]--;

      if (!reference[type]) {
        var namespace = '.beauty-' + type;

        doc.off('change' + namespace);
        doc.off('focusin' + namespace);
        doc.off('focusout' + namespace);
      }

      context.destroyed = true;
    }
  };

  /*!
   * scrollIntoViewIfNeeded
   * Date: 2016/07/15
   * https://github.com/nuintun/beauty-form
   * https://github.com/stipsan/scroll-into-view-if-needed
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
   */

  // native
  var native = document.documentElement.scrollIntoViewIfNeeded;

  /**
   * scrollIntoViewIfNeeded
   *
   * @param {HTMLElement} element
   * @param {Boolean} centerIfNeeded
   * @returns
   */
  function scrollIntoViewIfNeeded(element, centerIfNeeded) {
    if (!element) {
      throw new Error('Element is required in scrollIntoViewIfNeeded');
    }

    // use native
    if (native) {
      return element.scrollIntoViewIfNeeded(centerIfNeeded);
    }

    function withinBounds(value, min, max, extent) {
      if (false === centerIfNeeded || max <= value + extent && value <= min + extent) {
        return Math.min(max, Math.max(min, value));
      } else {
        return (min + max) / 2;
      }
    }

    function makeArea(left, top, width, height) {
      return {
        left: left,
        top: top,
        width: width,
        height: height,
        right: left + width,
        bottom: top + height,
        translate: function(x, y) {
          return makeArea(x + left, y + top, width, height);
        },
        relativeFromTo: function(lhs, rhs) {
          var newLeft = left,
            newTop = top;

          lhs = lhs.offsetParent;
          rhs = rhs.offsetParent;

          if (lhs === rhs) {
            return area;
          }

          for (; lhs; lhs = lhs.offsetParent) {
            newLeft += lhs.offsetLeft + lhs.clientLeft;
            newTop += lhs.offsetTop + lhs.clientTop;
          }

          for (; rhs; rhs = rhs.offsetParent) {
            newLeft -= rhs.offsetLeft + rhs.clientLeft;
            newTop -= rhs.offsetTop + rhs.clientTop;
          }

          return makeArea(newLeft, newTop, width, height);
        }
      };
    }

    var parent;
    var area = makeArea(
      element.offsetLeft, element.offsetTop,
      element.offsetWidth, element.offsetHeight
    );

    while ((parent = element.parentNode) !== document) {
      var clientLeft = parent.offsetLeft + parent.clientLeft;
      var clientTop = parent.offsetTop + parent.clientTop;

      // make area relative to parent's client area.
      area = area.relativeFromTo(element, parent).translate(-clientLeft, -clientTop);

      var scrollLeft = withinBounds(
        parent.scrollLeft,
        area.right - parent.clientWidth, area.left,
        parent.clientWidth
      );

      var scrollTop = withinBounds(
        parent.scrollTop,
        area.bottom - parent.clientHeight, area.top,
        parent.clientHeight
      );

      parent.scrollLeft = scrollLeft;
      parent.scrollTop = scrollTop;

      // determine actual scroll amount by reading back scroll properties.
      area = area.translate(
        clientLeft - parent.scrollLeft,
        clientTop - parent.scrollTop
      );

      // rewrite element
      element = parent;
    }
  }

  /*!
   * selectbox
   * Date: 2015/06/12
   * https://github.com/nuintun/beauty-form
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
   */

  var timer;
  var reference$1 = 0;
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

  function SelectBox(element, options) {
    var context = this;

    context.type = 'select';
    context.opened = false;
    context.destroyed = false;
    context.element = $(element);

    if (context.element.attr('multiple') !== undefined || context.element.attr('size') > 1) {
      return context;
    }

    options = $.extend({
      title: function(element, text) {
        return '<i class="ui-beauty-select-align-middle"></i>'
          + '<span class="ui-beauty-select-title" title="' + text + '">'
          + text + '</span><i class="ui-beauty-select-icon"></i>';
      },
      dropdown: function(element, options) {
        return '<dl class="ui-beauty-select-dropdown-items">' + options + '</dl>';
      },
      optgroup: function(element, label) {
        return '<dt class="ui-beauty-select-optgroup" title="' + label + '">' + label + '</dt>';
      },
      option: function(element, option) {
        return '<dd role="option" class="ui-beauty-select-option'
          + (option.group ? ' ui-beauty-select-optgroup-option' : '')
          + (option.className ? ' ' + option.className : '') + '" '
          + option.indexAttr + '="' + option.index + '" title="'
          + option.text + '">' + option.text + '</dd>';
      },
      dropdownWidth: null,
      optionIndexAttr: 'data-option',
      optionSelectedClass: 'ui-beauty-select-option-selected',
      optionDisabledClass: 'ui-beauty-select-option-disabled'
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

    return element.data('beauty-select');
  };

  SelectBox.prototype = {
    __init: function() {
      var context = this;
      var type = context.type;
      var options = context.options;
      var namespace = '.beauty-' + type;

      actived = context;

      if (!reference$1) {
        var selector = 'select';

        doc.on('change' + namespace, selector, function() {
          var selectbox = SelectBox.get(this);

          if (selectbox) {
            selectbox.__renderTitlebox();
            selectbox.opened && selectbox.__refreshSelected();
          }
        });

        doc.on('focusin' + namespace + ' focusout' + namespace, selector, function() {
          var selectbox = SelectBox.get(this);

          selectbox && selectbox.__refreshSelectbox();
        });

        doc.on('mousedown' + namespace, function(e) {
          var target = e.target;
          var selectbox = actived.selectbox[0];

          if (target !== selectbox && !$.contains(selectbox, target) && actived.opened) {
            actived.close();
            actived.__refreshSelectbox();
          }
        });

        doc.on('keydown' + namespace, function(e) {
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

      context.__beauty();

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

      context.selectbox.on('mousedown' + namespace, function(e) {
        var select = context.element;

        if (select[0].disabled) return;

        e.preventDefault();

        context.focus();

        if (context.opened) {
          var target = e.target;
          var dropdown = context.dropdown[0];

          if (dropdown !== target && !$.contains(dropdown, target)) {
            context.close();
          }
        } else {
          context.open();
        }
      });

      context.selectbox.on('click' + namespace, '[' + options.optionIndexAttr + ']', function(e) {
        e.preventDefault();

        var option = $(this);

        if (option.hasClass(options.optionDisabledClass)) return;

        context.select(option.attr(options.optionIndexAttr));
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
          .removeClass('ui-beauty-select-dropdown-' + (position === 'top' ? 'bottom' : 'top'))
          .addClass('ui-beauty-select-dropdown-' + position);

        dropdown.css({
          top: position === 'bottom' ? size.selectbox.outerHeight : -size.dropdown.outerHeight
        });
      }

      return context;
    },
    __renderTitlebox: function() {
      var context = this;
      var element = context.element[0];
      var selected = $(element.options[element.selectedIndex]);

      context.titlebox.html(compile(
        context,
        context.options.title,
        selected,
        selected.html()
      ));

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
        .toggleClass('ui-beauty-select-disabled', element.disabled)
        .toggleClass('ui-beauty-select-focus', focused);

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

      var selected = dropdown
        .find('[' + options.optionIndexAttr + '=' + selectedIndex + ']');

      selected.addClass(selectedClass);

      scrollIntoViewIfNeeded(selected[0]);

      return context;
    },
    __beauty: function() {
      var context = this;
      var element = context.element;

      if (!SelectBox.get(element)) {
        element.addClass('ui-beauty-select-hidden');

        var selectbox = $('<div role="combobox" tabindex="-1" class="ui-beauty-select"/>');

        context.titlebox = $('<div class="ui-beauty-select-titlebox"/>');
        context.dropdown = $('<div role="listbox" class="ui-beauty-select-dropdown"/>');

        selectbox
          .append(context.titlebox)
          .insertAfter(context.element);

        context.selectbox = selectbox;

        reference$1++;

        element.data('beauty-select', context);
      }

      return context.refresh();
    },
    focus: function() {
      this.element.trigger('focus');

      return this;
    },
    blur: function() {
      this.element.trigger('blur');

      return this;
    },
    enable: function() {
      this.element[0].disabled = false;

      return this.__refreshSelectbox();
    },
    disable: function() {
      this.element[0].disabled = true;

      return this.__refreshSelectbox();
    },
    refresh: function() {
      var context = this;

      context.__sizeSelectbox();
      context.__renderTitlebox();
      context.__renderDropdown();
      context.__sizeDropdown();

      return context.__refreshSelectbox();
    },
    select: function(index) {
      var context = this;
      var element = context.element[0];
      var oldIndex = element.selectedIndex;

      index = index >>> 0;
      element.selectedIndex = index;

      if (oldIndex !== index) {
        context.element.trigger('change');
      }

      return this.__renderTitlebox();
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

      context.selectbox.addClass('ui-beauty-select-opened');
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
        context.selectbox.removeClass('ui-beauty-select-opened');
      }

      return context;
    },
    destroy: function() {
      var context = this;

      if (!context.destroyed) {
        var type = context.type;
        var element = context.element;
        var namespace = '.beauty-' + type;

        context.selectbox.off();
        context.element.off('keypress' + namespace);
        context.selectbox.remove();
        context.dropdown.remove();
        element.removeData('beauty-select');
        element.removeClass('ui-beauty-select-hidden');

        reference$1--;

        if (!reference$1) {
          doc.off('change' + namespace);
          doc.off('focusin' + namespace);
          doc.off('focusout' + namespace);
          doc.off('mousedown' + namespace);
          doc.off('keydown' + namespace);
          win.off('resize' + namespace);
        }

        context.destroyed = true;
      }
    }
  };

  /*!
   * index
   * Date: 2017/08/29
   * https://github.com/nuintun/beauty-form
   *
   * This is licensed under the MIT License (MIT).
   * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
   */

  function create(Class) {
    return function(method, options) {
      var args = arguments;

      if (args.length > 1) {
        options = [].slice.call(args, 1);
      } else {
        options = method;
      }

      return this.each(function(index, element) {
        var instance = Class.get(element);

        if (!instance) {
          instance = new Class(element, options);
        } else if (instance[method]) {
          instance[method].apply(instance, options);
        }
      });
    };
  }

  $.fn.checkbox = create(Choice);
  $.fn.radiobox = create(Choice);
  $.fn.selectbox = create(SelectBox);

  var index = {
    Checkbox: Choice,
    RadioBox: Choice,
    SelectBox: SelectBox
  };

  return index;

})));
