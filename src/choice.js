/**
 * Created by nuintun on 2015/3/31.
 */

'use strict';

var $ = require('jquery');

var doc = $(document);
var reference = {};

function Choice(type, scope){
  this.type = type;

  if (!scope.nodeType || (scope.nodeType !== 1 && scope.nodeType !== 9 && scope.nodeType !== 11)) {
    scope = document;
  }

  this.elements = $('input[type=' + type + ']', scope);

  this.init();
}

Choice.prototype = {
  init: function (){
    this.beauty();

    if (!reference[this.type]) {
      doc.on('change.beauty-' + this.type, 'input[type=' + type + ']', function (){

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

      element.wrap('<i class="ui-beauty-choice ui-beauty-' + context.type + '"/>');
      element.data('data-beauty-choice', true);
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
