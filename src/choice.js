/*!
 * choice
 * Date: 2015/6/7
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

require('./css/choice.css');

var $ = require('jquery');

var reference = {};
var doc = $(document);

/**
 * radio
 * @param element
 */
function radio(element){
  doc.find('input[type=radio][name=' + element.name + ']').each(function (){
    var choice = Choice.get(this);

    if (choice && element !== this) {
      choice.refresh();
    }
  });
}

/**
 * Choice
 * @param element
 * @constructor
 */
function Choice(element){
  this.element = $(element);
  this.type = this.element.attr('type');
  this.type = this.type ? this.type.toLowerCase() : undefined;

  var choice = Choice.get(element);

  if (choice) {
    return choice;
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

  return element.data('beauty-choice');
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
        var choice = Choice.get(this);

        if (choice) {
          if (type === 'radio') {
            radio(this);
          }

          choice.refresh();
        }
      });

      doc.on('focusin.beauty-' + type, selector, function (){
        var choice = Choice.get(this);

        choice && choice.refresh();
      });

      doc.on('focusout.beauty-' + type, selector, function (){
        var choice = Choice.get(this);

        choice && choice.refresh();
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
  check: function (){
    var type = this.type;
    var element = this.element[0];

    element.checked = true;

    if (type === 'radio') {
      radio(element);
    }

    this.refresh();
  },
  uncheck: function (){
    var type = this.type;
    var element = this.element[0];

    element.checked = false;

    if (type === 'radio') {
      radio(element);
    }

    this.refresh();
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

    this.choice
      .toggleClass('ui-beauty-choice-checked', element.checked)
      .toggleClass('ui-beauty-choice-disabled', element.disabled)
      .toggleClass('ui-beauty-choice-focus', document.activeElement === element);
  },
  beauty: function (){
    var element = this.element;

    if (!Choice.get(element)) {
      var type = this.type;

      element.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-' + type + '"/>');

      reference[type]++;
      this.choice = element.parent();

      element.data('beauty-choice', this);
    }

    this.refresh();
  },
  destory: function (){
    var type = this.type;
    var element = this.element;

    if (Choice.get(element)) {
      element.unwrap();
      element.removeData('beauty-choice');

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
