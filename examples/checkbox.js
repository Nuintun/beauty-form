define("checkbox", ["./css/checkbox.css.js","./choice"], function(require, exports, module){
/**
 * Created by nuintun on 2015/3/31.
 */

'use strict';

require('./css/checkbox.css.js');

var Choice = require('./choice');

module.exports = function (scope){
  return new Choice('checkbox', scope);
};

});
