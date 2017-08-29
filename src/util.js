/*!
 * util
 * Date: 2016/06/14
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

export var win = $(window);
export var doc = $(document);

/**
 * 获取当前焦点的元素
 */
export function activeElement() {
  try {
    // try: ie8~9, iframe #26
    var activeElement = document.activeElement;
    var contentDocument = activeElement.contentDocument;

    return contentDocument && contentDocument.activeElement || activeElement;
  } catch (e) {
    // do nothing
  }
}
