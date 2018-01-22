/**
 * @module util
 * @license MIT
 * @version 2016/06/14
 */

import $ from 'jquery';

export var win = $(window);
export var doc = $(document);

var toString = Object.prototype.toString;

/**
 * @function activeElement
 * @description 获取当前焦点的元素
 * @returns {undefined|HTMLElement}
 */
export function activeElement() {
  try {
    // Try: ie8~9, iframe #26
    var activeElement = document.activeElement;
    var contentDocument = activeElement.contentDocument;

    return (contentDocument && contentDocument.activeElement) || activeElement;
  } catch (e) {
    // Do nothing
  }
}
