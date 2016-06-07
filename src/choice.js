/**
 * Created by nuintun on 2015/3/31.
 */

'use strict';

require('./css/choice.css');

var $ = require('jquery');

var doc = $(document);
var reference = {};

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
    this.beauty();

    var context = this;

    if (!reference[this.type]) {
      doc.on('change.beauty-' + this.type, 'input[type=' + this.type + ']', function (){
        if (this.checked) {
          context.check(this);
        } else {
          context.uncheck(this);
        }

        if (this.type === 'radio') {
          doc.find(':radio[name=' + this.name + ']').each(function (){
            if (this.checked) {
              context.check(this);
            } else {
              context.uncheck(this);
            }

            if (this.disabled) {
              context.disable(this);
            } else {
              context.enable(this);
            }
          });
        }
      });

      reference[this.type] = this.elements.length;
    } else {
      reference[this.type] += this.elements.length;
    }
  },
  beauty: function (){
    var context = this;

    this.elements.each(function (){
      var element = $(this);

      if (element.data('data-beauty-choice')) return;

      element.wrap('<i class="ui-beauty-choice ui-beauty-' + context.type + '"/>');

      if (this.checked) {
        context.check(this);
      }

      if (this.disabled) {
        context.disable(this);
      }

      element.data('data-beauty-choice', true);
    });
  },
  check: function (element){
    var context = this;

    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).addClass('ui-beauty-' + context.type + '-checked');
    });
  },
  uncheck: function (element){
    var context = this;

    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).removeClass('ui-beauty-' + context.type + '-checked');
    });
  },
  enable: function (element){
    var context = this;

    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).removeClass('ui-beauty-' + context.type + '-disabled');
    });
  },
  disable: function (element){
    var context = this;

    element = arguments.length ? $(element) : this.elements;

    element.each(function (){
      $(this.parentNode).addClass('ui-beauty-' + context.type + '-disabled');
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
    }
  }
};

// 公开接口
module.exports = Choice;
