/**
 * @module index
 * @license MIT
 * @version 2017/08/29
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
  CheckBox: Choice,
  RadioBox: Choice,
  SelectBox: SelectBox
};
