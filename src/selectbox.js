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
    select: '<div class="ui-beauty-select-title">{{text}}</div><i class="ui-beauty-select-icon"></i>',
    dropdown: '<dl class="ui-beauty-select-dropdown">{{options}}</dl>',
    optgroup: '<dt class="ui-beauty-select-optgroup">{{label}}</dt>',
    option: '<dd class="ui-beauty-select-option" data-option="{{index}}" tabindex="-1">{{text}}</dd>'
  }, options);

  this.init();
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
  init: function (){
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

      doc.on('focusin.beauty-' + type, '.ui-beauty-select', function (){
        var select = $(this).prev();

        if (select[0].nodeName.toUpperCase() === 'SELECT' && SelectBox.get(select)) {
          select.trigger('focus');
        }
      });

      doc.on('focusout.beauty-' + this.type, '.ui-beauty-select', function (){
        var select = $(this).prev();

        if (select[0].nodeName.toUpperCase() === 'SELECT' && SelectBox.get(select)) {
          select.trigger('blur');
        }
      });
    }

    this.beauty();
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
  refresh: function (){
    var element = this.element[0];
    var selectbox = this.selectbox;

    selectbox
      .toggleClass('ui-beauty-select-disabled', element.disabled)
      .toggleClass('ui-beauty-select-focus', document.activeElement === element);
  },
  beauty: function (){
    var element = this.element;

    if (!SelectBox.get(element)) {
      element.addClass('ui-beauty-select-hidden');

      var selectbox = $('<div tabindex="-1" class="ui-beauty-select"/>');

      selectbox.insertAfter(element);

      var width = element.outerWidth() - selectbox.outerWidth() + selectbox.width();
      var height = element.outerHeight() - selectbox.outerHeight() + selectbox.height();

      selectbox.width(width);
      selectbox.height(height);

      reference++;
      this.selectbox = selectbox;
      this.dropdown = $('<div class="ui-beauty-select-dropdown"/>');

      element.data('beauty-select', this);
    }

    this.refresh();
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
