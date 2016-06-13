define("selectbox", ["./css/selectbox.css.js","jquery"], function(require, exports, module){
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

var reference = 0;
var doc = $(document);

function SelectBox(element, options){
  this.type = 'select';
  this.element = element;

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

        if (select) {
          select.refresh();
        }
      });

      doc.on('focusin.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        if (select) {
          select.refresh();
        }
      });

      doc.on('focusout.beauty-' + type, selector, function (){
        var select = SelectBox.get(this);

        if (select) {
          select.refresh();
        }
      });

      doc.on('focusin.beauty-' + type, '.ui-beauty-select', function (){
        var select = this.previousSibling;

        if (select.nodeName.toUpperCase() === 'SELECT' && $.data(select, 'beauty-select')) {
          select.focus();
        }
      });

      doc.on('focusout.beauty-' + this.type, '.ui-beauty-select', function (){
        var select = this.previousSibling;

        if (select.nodeName.toUpperCase() === 'SELECT' && $.data(select, 'beauty-select')) {
          select.blur();
        }
      });
    }

    this.beauty();
  },
  focus: function (){
    this.element.focus();
  },
  blur: function (){
    this.element.blur();
  },
  enable: function (){
    this.element.disabled = false;

    this.refresh();
  },
  disable: function (){
    this.element.disabled = true;

    this.refresh();
  },
  refresh: function (){
    var element = this.element;

    $(element.nextSibling)
      .toggleClass('ui-beauty-select-disabled', element.disabled)
      .toggleClass('ui-beauty-select-focus', document.activeElement === element);
  },
  beauty: function (){
    var element = $(this.element);

    if (!SelectBox.get(element)) {
      element.addClass('ui-beauty-select-hidden');

      var selectbox = $('<div tabindex="-1" class="ui-beauty-select"/>');

      selectbox.insertAfter(element);
      selectbox.width(element.outerWidth() - selectbox.outerWidth() + selectbox.width());
      selectbox.height(element.outerHeight() - selectbox.outerHeight() + selectbox.height());

      reference++;

      element.data('beauty-select', this);
    }

    this.refresh();
  },
  destory: function (){
    var type = this.type;
    var element = $(this.element);

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
