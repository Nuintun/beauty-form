/*!
 * index
 * Date: 2017/08/29
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

import './css/choice.css';
import './css/checkbox.css';
import './css/radiobox.css';
import './css/selectbox.css';

import $ from 'jquery';
import Choice from './choice';
import SelectBox from './selectbox';

function create(Class) {
  return function(method, options) {
    if (method === 'api') {
      return Class.get(this[0]);
    }

    var args = arguments;

    if (args.length > 1) {
      options = [].slice.call(args, 1);
    }

    options = options || [];

    return this.each(function(index, element) {
      var api = Class.get(element);

      if (!api) {
        // If not init, options = method
        api = new Class(element, method);
      }

      // Call method
      if (api[method]) {
        api[method].apply(api, options);
      }
    });
  };
}

$.fn.checkbox = create(Choice);
$.fn.radiobox = create(Choice);
$.fn.selectbox = create(SelectBox);

export default {
  Checkbox: Choice,
  RadioBox: Choice,
  SelectBox: SelectBox
};
