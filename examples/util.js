define("util", ["jquery"], function(require, exports, module){
/*!
 * util
 * Date: 2016/6/14
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

'use strict';

var $ = require('jquery');

module.exports = {
  // 获取当前焦点的元素
  activeElement: function (){
    try {
      // try: ie8~9, iframe #26
      var activeElement = document.activeElement;
      var contentDocument = activeElement.contentDocument;

      return contentDocument && contentDocument.activeElement || activeElement;
    } catch (e) {
      // do nothing
    }
  },
  // 获取元素相对于页面的位置（包括iframe内的元素）
  // 暂时不支持两层以上的 iframe 套嵌
  offset: function (anchor){
    var offset = $(anchor).offset();
    var ownerDocument = anchor.ownerDocument;
    var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

    if (defaultView == window) {
      // IE <= 8 只能使用两个等于号
      return offset;
    }

    // {Element: Ifarme}
    ownerDocument = $(ownerDocument);

    var docLeft = ownerDocument.scrollLeft();
    var docTop = ownerDocument.scrollTop();
    var frameElement = defaultView.frameElement;
    var frameOffset = $(frameElement).offset();
    var frameLeft = frameOffset.left;
    var frameTop = frameOffset.top;

    return {
      left: offset.left + frameLeft - docLeft,
      top: offset.top + frameTop - docTop
    };
  }
};

});
