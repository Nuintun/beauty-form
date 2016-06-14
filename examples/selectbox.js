define("selectbox", ["./css/selectbox.css.js","jquery","./util"], function(require, exports, module){
/*!
 * selectbox
 * Date: 2015/6/12
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

require('./css/selectbox.css.js');

var $ = require('jquery');
var util = require('./util');

var reference = 0;
var doc = $(document);

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
    option: function (element, selector, index, text){
      return '<dd class="' + selector + '" data-option="' + index
        + '" tabindex="-1">' + text + '</dd>';
    }
  }, options);

  $.each(['select', 'dropdown', 'optgroup', 'option'], function (index, prop){
    if ($.type(options[prop]) !== 'function') {
      throw new TypeError('Options.' + prop + ' must be a function.');
    }
  });

  this.type = 'select';
  this.opened = false;
  this.element = $(element);
  this.options = options;

  this.__init();
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
    if (!reference) {
      var type = this.type;
      var selector = 'select';

      doc.on('change.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.__refresh();
      });

      doc.on('click.beauty-' + type, '.ui-beauty-select', function (e){
        e.preventDefault();

        var select = $(this).prev();

        if (select.length && select[0].disabled) return;

        var selectbox = SelectBox.get(select);

        if (selectbox && select[0].tagName.toLowerCase() === 'select') {
          selectbox.focus();
          selectbox.open();
        }
      });

      doc.on('focusin.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.__refresh();
      });

      doc.on('focusout.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.__refresh();
      });
    }

    this.__beauty();
  },
  __Size: function (){
    var element = this.element;
    var selectbox = this.selectbox;
    var width = element.outerWidth() - selectbox.outerWidth() + selectbox.width();
    var height = element.outerHeight() - selectbox.outerHeight() + selectbox.height();

    selectbox.width(width);
    selectbox.height(height);
    selectbox.css('line-height', height + 'px');
  },
  __renderOptions: function (){
    var index = 0;
    var dropdown = '';
    var context = this;
    var options = this.options;

    function option(element){
      dropdown += compile(
        context,
        options.option,
        element,
        'ui-beauty-select-option',
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

    this.element.children().each(function (){
      var element = $(this);

      switch (this.tagName.toLowerCase()) {
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

    this.dropdown.html(compile(
      context,
      options.dropdown,
      this.dropdown,
      dropdown
    ));
  },
  __opsition: function (){
    console.log(util.offset(this.selectbox[0]));
  },
  __beauty: function (){
    var element = this.element;

    if (!SelectBox.get(element)) {
      element.addClass('ui-beauty-select-hidden');

      this.selectbox = $('<div tabindex="-1" class="ui-beauty-select"/>').insertAfter(element);
      this.dropdown = $('<div tabindex="-1" class="ui-beauty-select-dropdown"/>');

      reference++;

      element.data('beauty-select', this);
    }

    this.refresh();
  },
  __refresh: function (){
    var element = this.element[0];
    var selectbox = this.selectbox;
    var selected = $(element.options[element.selectedIndex]);

    selectbox
      .toggleClass('ui-beauty-select-disabled', element.disabled)
      .toggleClass('ui-beauty-select-focus', util.activeElement() === element);

    selectbox.html(compile(
      this,
      this.options.select,
      this.selectbox,
      selected.html()
    ));
  },
  focus: function (){
    if (util.activeElement() !== this.element[0]) {
      this.element.trigger('focus');
    }
  },
  blur: function (){
    if (util.activeElement() === this.element[0]) {
      this.element.trigger('blur');
    }
  },
  enable: function (){
    this.element[0].disabled = false;

    this.refresh();
  },
  disable: function (){
    this.element[0].disabled = true;

    this.refresh();
  },
  refresh: function (){
    this.__refresh();
    this.__Size();
    this.__renderOptions();
  },
  select: function (index){
    this.element[0].selectedIndex = index;

    this.refresh();
  },
  open: function (){
    if (this.opened) return;

    this.opened = true;

    this.__opsition();
    this.dropdown.appendTo(document.body);
    this.selectbox.addClass('ui-beauty-select-opened');
  },
  close: function (){
    if (!this.opened) return;

    this.opened = false;

    this.dropdown.remove();
    this.selectbox.removeClass('ui-beauty-select-opened');
  },
  destory: function (){
    var type = this.type;
    var element = this.element;

    if (SelectBox.get(element)) {
      element.next().remove();
      element.removeData('beauty-select');
      element.removeClass('ui-beauty-select-hidden');

      reference--;
    }

    if (!reference) {
      doc.off('change.beauty-' + type);
      doc.off('focusin.beauty-' + type);
      doc.off('focusout.beauty-' + type);
    }
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

});
