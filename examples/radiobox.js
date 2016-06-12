define("radiobox", ["./css/radiobox.css.js","./choice"], function(require, exports, module){
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

var Choice = require('./choice');

module.exports = function (scope){
  return new Choice('radio', scope);
};

});
