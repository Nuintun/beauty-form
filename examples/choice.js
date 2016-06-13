define("choice", ["./css/choice.css.js","jquery"], function(require, exports, module){
/*!
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
 * Choice
 * @param element
 * @constructor
 */
function Choice(element){
  this.element = element;
  this.type = element.type ? element.type.toLowerCase() : undefined;

  var context = Choice.get(element);

  if (context) {
    return context;
  }

  if (this.type !== 'checkbox' && this.type !== 'radio') {
    throw new TypeError('The element must be a checkbox or radio.');
  }

  this.init();
}

/**
 * get
 * @param element
 * @returns {*}
 */
Choice.get = function (element){
  element = $(element);

  return element.data('data-beauty-choice');
};

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
    var type = this.type;

    if (!reference[type]) {
      reference[type] = 0;

      var selector = 'input[type=' + type + ']';

      doc.on('change.beauty-' + type, selector, function (){
        var element = this;
        var context = Choice.get(this);

        if (context) {
          if (type === 'radio') {
            doc.find(':radio[name=' + element.name + ']').each(function (){
              var context = Choice.get(this);

              if (context && element !== this) {
                context.refresh();
              }
            });
          }

          context.refresh();
        }
      });

      doc.on('focusin.beauty-' + type, selector, function (){
        var context = Choice.get(this);

        context && context.focus();
      });

      doc.on('focusout.beauty-' + type, selector, function (){
        var context = Choice.get(this);

        context && context.blur();
      });
    }

    this.beauty();
  },
  focus: function (){
    $(this.element.parentNode).addClass('ui-beauty-choice-focus');
  },
  blur: function (){
    $(this.element.parentNode).removeClass('ui-beauty-choice-focus');
  },
  check: function (){
    $(this.element.parentNode).addClass('ui-beauty-choice-checked');
  },
  uncheck: function (){
    $(this.element.parentNode).removeClass('ui-beauty-choice-checked');
  },
  enable: function (){
    $(this.element.parentNode).removeClass('ui-beauty-choice-disabled');
  },
  disable: function (){
    $(this.element.parentNode).addClass('ui-beauty-choice-disabled');
  },
  refresh: function (){
    var element = this.element;

    if (element.checked) {
      this.check();
    } else {
      this.uncheck();
    }

    if (element.disabled) {
      this.disable();
    } else {
      this.enable();
    }

    if (document.activeElement === element) {
      this.focus();
    } else {
      this.blur();
    }
  },
  beauty: function (){
    if (!Choice.get(this.element)) {
      var type = this.type;
      var element = $(this.element);

      element.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-' + type + '"/>');

      reference[type]++;

      element.data('data-beauty-choice', this);
    }

    this.refresh();
  },
  destory: function (){
    var type = this.type;

    if (Choice.get(this.element)) {
      var element = $(this.element);

      element.unwrap();
      element.removeData('data-beauty-choice');

      reference[type]--;
    }

    if (!reference[type]) {
      doc.off('change.beauty-' + type);
      doc.off('focusin.beauty-' + type);
      doc.off('focusout.beauty-' + type);
    }
  }
};

// 公开接口
module.exports = Choice;

});
