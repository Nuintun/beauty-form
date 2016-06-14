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

var reference = 0;
var doc = $(document);

/**
 * template
 * @param template
 * @param data
 * @returns {void|string|XML}
 */
function template(template, data){
  return template.replace(/{{(.*?)}}/g, function ($1, $2){
    return data[$2];
  });
}

function SelectBox(element, options){
  this.type = 'select';
  this.element = $(element);
  this.options = $.extend({
    select: '<div class="ui-beauty-select-title" title="{{text}}">{{text}}</div><i class="ui-beauty-select-icon"></i>',
    dropdown: '<dl class="ui-beauty-select-dropdown-items">{{options}}</dl>',
    optgroup: '<dt class="ui-beauty-select-optgroup">{{label}}</dt>',
    option: '<dd class="{{class}}" data-option="{{index}}" tabindex="-1">{{text}}</dd>'
  }, options);

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

        select && select.refresh();
      });

      doc.on('focusin.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.refresh();
      });

      doc.on('focusout.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        select && select.refresh();
      });

      doc.on('click.beauty-' + type, '.ui-beauty-select', function (e){
        e.preventDefault();

        var select = $(this).prev();

        if (select.length && select[0].disabled) return;

        var selectbox = SelectBox.get(select);

        if (selectbox && select[0].tagName.toLowerCase() === 'select') {
          select.trigger('focus');
          selectbox.open();
        }
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
    var options = this.options;
    var data = this.element.data();

    function option(element){
      dropdown += template(options.option, $.extend({}, data, element.data(), {
        index: index++,
        text: element.html(),
        class: 'ui-beauty-select-option'
      }));
    }

    function optgroup(element){
      dropdown += template(options.optgroup, { label: element.attr('label') });
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

    this.dropdown.html(template(options.dropdown, { options: dropdown }));
  },
  __opsition: function (){

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

    this.refresh(true);
  },
  focus: function (){
    this.element.trigger('focus');
  },
  blur: function (){
    this.element.trigger('blur');
  },
  enable: function (){
    this.element[0].disabled = false;

    this.refresh();
  },
  disable: function (){
    this.element[0].disabled = true;

    this.refresh();
  },
  refresh: function (force){
    var element = this.element[0];
    var selectbox = this.selectbox;

    selectbox
      .toggleClass('ui-beauty-select-disabled', element.disabled)
      .toggleClass('ui-beauty-select-focus', util.activeElement() === element);

    selectbox.html(template(this.options.select, {
      text: $(element.options[element.selectedIndex]).text()
    }));

    if (force) {
      this.__Size();
      this.__renderOptions();
    }
  },
  select: function (index){
    this.element[0].selectedIndex = index;

    this.refresh();
  },
  open: function (){
    this.__opsition();
    this.dropdown.appendTo(document.body);
    this.selectbox.addClass('ui-beauty-select-opened');
  },
  close: function (){
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
