define("choice", ["./css/choice.css.js","jquery"], function(require, exports, module){
/**
 * choice
 * Date: 2015/6/7
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

require('./css/choice.css.js');

var $ = require('jquery');

var reference = {};
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
      if ($.data(this, 'data-beauty-choice')) {
        callback.call(context, this);
      }
    });
  };
}

/**
 * Choice
 * @param type
 * @param scope
 * @constructor
 */
function Choice(type, scope){
  this.type = type;

  if (!scope || !scope.nodeType
    || (scope.nodeType !== 1
    && scope.nodeType !== 9
    && scope.nodeType !== 11)) {
    scope = document;
  }

  this.elements = $('input[type=' + type + ']', scope);

  this.init();
}

/**
 * Choice.prototype
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
  init: function (){
    var context = this;

    if (!reference[this.type]) {
      reference[this.type] = 0;

      var selector = 'input[type=' + this.type + ']';

      doc.on('change.beauty-' + this.type, selector, function (){
        var element = this;

        context.refresh(this);

        if (context.type === 'radio') {
          doc.find(':radio[name=' + this.name + ']').each(function (){
            if (element !== this) {
              context.refresh(this);
            }
          });
        }
      });

      doc.on('focusin.beauty-' + this.type, selector, function (){
        context.focus(this);
      });

      doc.on('focusout.beauty-' + this.type, selector, function (){
        context.blur(this);
      });
    }

    this.beauty();
  },
  focus: proxy(function (element){
    $(element.parentNode).addClass('ui-beauty-choice-focus');
  }),
  blur: proxy(function (element){
    $(element.parentNode).removeClass('ui-beauty-choice-focus');
  }),
  check: proxy(function (element){
    $(element.parentNode).addClass('ui-beauty-choice-checked');
  }),
  uncheck: proxy(function (element){
    $(element.parentNode).removeClass('ui-beauty-choice-checked');
  }),
  enable: proxy(function (element){
    $(element.parentNode).removeClass('ui-beauty-choice-disabled');
  }),
  disable: proxy(function (element){
    $(element.parentNode).addClass('ui-beauty-choice-disabled');
  }),
  refresh: proxy(function (element){
    if (element.checked) {
      this.check(element);
    } else {
      this.uncheck(element);
    }

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

      if (!element.data('data-beauty-choice')) {
        element.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-' + context.type + '"/>');

        reference[context.type]++;

        element.data('data-beauty-choice', true);
      }

      context.refresh(this);
    });
  },
  destory: function (){
    var context = this;

    this.elements.each(function (){
      var element = $(this);

      if (element.data('data-beauty-choice')) {
        element.unwrap();
        element.removeData('data-beauty-choice');

        reference[context.type]--;
      }
    });

    if (!reference[this.type]) {
      doc.off('change.beauty-' + this.type);
      doc.off('focusin.beauty-' + this.type);
      doc.off('focusout.beauty-' + this.type);
    }
  }
};

// 公开接口
module.exports = Choice;

});
