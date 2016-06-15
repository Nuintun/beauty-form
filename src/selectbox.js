/*!
 * selectbox
 * Date: 2015/6/12
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

require('./css/selectbox.css');

var $ = require('jquery');
var util = require('./util');

var timer;
var reference = 0;
var win = $(window);
var doc = $(document);
var actived = null;

/**
 * compile
 * @param context
 * @param template
 * @returns {string}
 */
function compile(context, template){
  var args = [].slice.call(arguments, 2);
  var html = template.apply(context, args);

  if ($.type(html) === 'string') {
    return html;
  } else {
    throw new TypeError('Render function must return a string.');
  }
}

function SelectBox(element, options){
  options = $.extend({
    select: function (element, text){
      return '<div class="ui-beauty-select-title" title="' + text + '">'
        + text + '</div><i class="ui-beauty-select-icon"></i>';
    },
    dropdown: function (element, options){
      return '<dl class="ui-beauty-select-dropdown-items">' + options + '</dl>';
    },
    optgroup: function (element, label){
      return '<dt class="ui-beauty-select-optgroup">' + label + '</dt>';
    },
    option: function (element, attr, index, text){
      return '<dd class="ui-beauty-select-option" ' + attr + '="' + index + '" tabindex="-1">' + text + '</dd>';
    },
    optionIndexAttr: 'data-option'
  }, options);

  $.each(['select', 'dropdown', 'optgroup', 'option'], function (index, prop){
    if ($.type(options[prop]) !== 'function') {
      throw new TypeError('Options.' + prop + ' must be a function.');
    }
  });

  var context = this;

  context.type = 'select';
  context.opened = false;
  context.destroyed = false;
  context.element = $(element);
  context.options = options;

  context.__init();
}

/**
 * get
 * @param element
 * @returns {*}
 */
SelectBox.get = function (element){
  element = $(element);

  return element.data('beauty-select');
};

SelectBox.prototype = {
  __init: function (){
    var context = this;
    var options = context.options;

    if (!reference) {
      var type = this.type;
      var selector = 'select';

      doc.on('change.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.__refresh();
      });

      doc.on('focusin.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.__refresh();
      });

      doc.on('focusout.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.__refresh();
      });

      win.on('resize.beauty-' + type, function (){
        clearTimeout(timer);

        timer = setTimeout(function (){
          actived && actived.__position();
        }, 0);
      });
    }

    context.__beauty();

    context.selectbox.on('mousedown.beauty-' + type, function (e){
      e.preventDefault();

      var select = context.element;

      if (select[0].disabled) return;

      context.focus();

      if (context.opened) {
        context.close();
      } else {
        context.open();
      }
    });

    context.dropdown.on('click.beauty-' + type, '[' + options.optionIndexAttr + ']', function (e){
      e.preventDefault();

      context.select($(this).attr(options.optionIndexAttr));
      context.close();
    });

    context.dropdown.on('focusin.beauty-' + type, function (e){
      context.focus();
    });

    return context;
  },
  __Size: function (){
    var element = this.element;
    var selectbox = this.selectbox;
    var width = element.outerWidth() - selectbox.outerWidth() + selectbox.width();
    var height = element.outerHeight() - selectbox.outerHeight() + selectbox.height();

    selectbox.width(width);
    selectbox.height(height);
    selectbox.css('line-height', height + 'px');

    return this;
  },
  __renderOptions: function (){
    var index = 0;
    var dropdown = '';
    var context = this;
    var options = context.options;

    function option(element){
      dropdown += compile(
        context,
        options.option,
        element,
        options.optionIndexAttr,
        index++,
        element.html()
      );
    }

    function optgroup(element){
      dropdown += compile(
        context,
        options.optgroup,
        element,
        element.attr('label')
      );
    }

    context.element.children().each(function (){
      var element = $(this);

      switch (this.nodeName.toLowerCase()) {
        case 'option':
          option(element);
          break;
        case 'optgroup':
          optgroup(element);
          element.children().each(function (){
            option($(this));
          });
          break;
      }
    });

    context.dropdown.html(compile(
      context,
      options.dropdown,
      context.dropdown,
      dropdown
    ));

    return context;
  },
  __position: function (){
    var context = this;

    if (!context.opened) return context;

    var selectbox = context.selectbox;
    var dropdown = context.dropdown;
    var offset = selectbox.offset();
    var scrollTop = doc.scrollTop();
    var size = {
      window: {
        height: win.height()
      },
      selectbox: {
        outerWidth: selectbox.outerWidth(),
        outerHeight: selectbox.outerHeight()
      },
      dropdown: {
        width: dropdown.width(),
        outerWidth: dropdown.outerWidth(),
        outerHeight: dropdown.outerHeight()
      }
    };
    var position = offset.top - scrollTop;

    position = position > size.window.height - position - size.selectbox.outerHeight
      ? 'top'
      : 'bottom';

    dropdown.addClass('ui-beauty-select-dropdown-' + position);

    dropdown.css({
      left: offset.left,
      top: position === 'bottom'
        ? offset.top + size.selectbox.outerHeight
        : offset.top - size.dropdown.outerHeight,
      width: Math.max(
        size.selectbox.outerWidth - size.dropdown.outerWidth + size.dropdown.width,
        size.dropdown.width
      )
    });

    return this;
  },
  __beauty: function (){
    var context = this;
    var element = context.element;

    if (!SelectBox.get(element)) {
      element.addClass('ui-beauty-select-hidden');

      context.selectbox = $('<div tabindex="-1" class="ui-beauty-select"/>').insertAfter(element);
      context.dropdown = $('<div tabindex="-1" class="ui-beauty-select-dropdown"/>');

      reference++;

      element.data('beauty-select', context);
    }

    return context.refresh();
  },
  __refresh: function (){
    var context = this;
    var element = context.element[0];
    var selectbox = context.selectbox;
    var selected = $(element.options[element.selectedIndex]);
    var focused = util.activeElement();

    focused = context.opened
      || focused === element
      || focused === context.selectbox[0]
      || focused === context.dropdown[0]
      || $.contains(context.selectbox, focused)
      || $.contains(context.dropdown, focused);

    selectbox
      .toggleClass('ui-beauty-select-disabled', element.disabled)
      .toggleClass('ui-beauty-select-focus', focused);

    selectbox.html(compile(
      context,
      context.options.select,
      context.selectbox,
      selected.html()
    ));

    return context;
  },
  focus: function (){
    this.element.trigger('focus');

    return this;
  },
  blur: function (){
    this.element.trigger('blur');

    return this;
  },
  enable: function (){
    this.element[0].disabled = false;

    return this.refresh();
  },
  disable: function (){
    this.element[0].disabled = true;

    return this.refresh();
  },
  refresh: function (){
    this.__refresh();
    this.__Size();

    return this.__renderOptions();
  },
  select: function (index){
    this.element[0].selectedIndex = index;

    return this.refresh();
  },
  open: function (){
    var context = this;

    actived = this;

    if (context.opened) return context;

    context.opened = true;

    context.selectbox.addClass('ui-beauty-select-opened');
    context.dropdown.appendTo(document.body);
    context.__position();

    return context;
  },
  close: function (){
    var context = this;

    actived = null;

    if (!context.opened) return context;

    context.opened = false;

    context.dropdown.detach();
    context.selectbox.removeClass('ui-beauty-select-opened');

    return context;
  },
  destroy: function (){
    var context = this;

    if (context.destroyed) return;

    var type = context.type;
    var element = context.element;

    context.selectbox.off();
    context.dropdown.off();
    context.selectbox.remove();
    context.dropdown.remove();
    element.removeData('beauty-select');
    element.removeClass('ui-beauty-select-hidden');

    reference--;

    if (!reference) {
      doc.off('change.beauty-' + type);
      doc.off('focusin.beauty-' + type);
      doc.off('focusout.beauty-' + type);
      win.off('resize.beauty-' + type);
    }

    context.destroyed = true;
  }
};

$.fn.selectbox = function (){
  var elements = this;
  var method, options;
  var args = [].slice.call(arguments, 1);

  method = options = arguments[0];

  return elements.each(function (){
    var select = SelectBox.get(this);

    if (!select) {
      select = new SelectBox(this, options);
    }

    if ($.type(method) === 'string') {
      select[method] && select[method].apply(select, args);
    }
  });
};

module.exports = $;
