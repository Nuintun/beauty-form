define("radiobox", ["./css/radiobox.css.js","jquery","./choice"], function(require, exports, module){
/**
 * radio
 * Date: 2015/6/7
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

require('./css/radiobox.css.js');

var $ = require('jquery');
var Choice = require('./choice');

module.exports = function (scope){
  if (!scope || !scope.nodeType
    || (scope.nodeType !== 1
    && scope.nodeType !== 9
    && scope.nodeType !== 11)) {
    scope = document.body;
  }

  $('input[type=radio]', scope).each(function (){
    new Choice(this);
  });
};

});
