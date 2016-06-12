/**
 * Created by nuintun on 2015/3/31.
 */

'use strict';

require('./css/choice.css');

var $ = require('jquery');

var reference = {};
var doc = $(document);

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
  focus: function (element){
    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).addClass('ui-beauty-choice-focus');
    });
  },
  blur: function (element){
    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).removeClass('ui-beauty-choice-focus');
    });
  },
  check: function (element){
    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).addClass('ui-beauty-choice-checked');
    });
  },
  uncheck: function (element){
    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).removeClass('ui-beauty-choice-checked');
    });
  },
  enable: function (element){
    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).removeClass('ui-beauty-choice-disabled');
    });
  },
  disable: function (element){
    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).addClass('ui-beauty-choice-disabled');
    });
  },
  refresh: function (element){
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
  },
  beauty: function (){
    var context = this;

    this.elements.each(function (){
      var element = $(this);

      if (!element.data('data-beauty-choice')) {
        element.wrap('<i class="ui-beauty-choice ui-beauty-' + context.type + '"/>');

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
