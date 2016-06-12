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
 * proxy
 * @param callback
 * @returns {Function}
 */
function proxy(callback){
  return function (element){
    var context = this;

    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      if ($.data(this, 'data-beauty-select')) {
        callback.call(context, this);
      }
    });
  };
}

function SelectBox(scope, options){
  if (!(this instanceof SelectBox)) {
    return new SelectBox(scope);
  }

  this.type = 'select';

  if (!scope || !scope.nodeType
    || (scope.nodeType !== 1
    && scope.nodeType !== 9
    && scope.nodeType !== 11)) {
    scope = document;
  }

  this.elements = $('select', scope).not('[multiple]');

  this.init();
}

SelectBox.prototype = {
  init: function (){
    this.beauty();
  },
  focus: proxy(function (element){
    $(element.nextSibling).addClass('ui-beauty-select-focus');
  }),
  blur: proxy(function (element){
    $(element.nextSibling).removeClass('ui-beauty-select-focus');
  }),
  enable: proxy(function (element){
    $(element.nextSibling).removeClass('ui-beauty-select-disabled');
  }),
  disable: proxy(function (element){
    $(element.nextSibling).addClass('ui-beauty-select-disabled');
  }),
  refresh: proxy(function (element){
    if (element.disabled) {
      this.disable(element);
    } else {
      this.enable(element);
    }

    if (document.activeElement === element) {
      this.focus(element);
    } else {
      this.blur(element);
    }
  }),
  beauty: function (){
    var context = this;

    this.elements.each(function (){
      var element = $(this);

      if (!element.data('data-beauty-select')) {
        element.css({
          position: 'absolute',
          opacity: 0,
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          left: 'auto',
          zIndex: -1
        });

        var selectbox = $('<div tabindex="-1" class="ui-beauty-select"/>');

        selectbox.insertAfter(element);

        selectbox.css({
          width: element.outerWidth() - selectbox.outerWidth() - selectbox.width(),
          height: element.outerHeight() - selectbox.outerHeight() - selectbox.height()
        });

        reference++;

        element.data('data-beauty-select', true);
      }

      context.refresh(this);
    });
  },
  destory: function (){

  }
};

module.exports = SelectBox;
