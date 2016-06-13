/*!
 * checkbox
 * Date: 2015/6/7
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

require('./css/checkbox.css');

var $ = require('jquery');
var Choice = require('./choice');

module.exports = function (scope){
  if (!scope || !scope.nodeType
    || (scope.nodeType !== 1
    && scope.nodeType !== 9
    && scope.nodeType !== 11)) {
    scope = document.body;
  }

  $('input[type=checkbox]', scope).each(function (){
    new Choice(this);
  });
};
