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

$.fn.radiobox = function (method){
  var elements = this;

  return elements.each(function (){
    var choice = Choice.get(this);

    if (!choice) {
      choice = new Choice(this);
    }

    if (arguments.length) {
      var args = [].slice.call(arguments, 1);

      choice[method] && choice[method].apply(choice, args);
    }
  });
};

module.exports = $;

});
