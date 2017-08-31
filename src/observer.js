/*!
 * Observer
 * Date: 2017/08/30
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

import { typeIs } from './util';

var defineProperty = Object.defineProperty;
var getPrototypeOf = Object.getPrototypeOf;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getNodeDescriptor = getPrototypeOf ? function(node, prop) {
  return getOwnPropertyDescriptor(getPrototypeOf(node), prop)
    || getOwnPropertyDescriptor(Element.prototype, prop)
    || getOwnPropertyDescriptor(HTMLElement.prototype, prop)
    || getOwnPropertyDescriptor(Node.prototype, prop);
} : function(node, prop) {
  var descr = getOwnPropertyDescriptor(node.constructor.prototype, prop);

  if (descr && descr.set) return descr;

  return getOwnPropertyDescriptor(Element.prototype, prop);
};

export default function Observer(node) {
  this.node = node;
}

Observer.prototype = {
  watch: function(prop, handler) {
    var node = this.node;
    var descr = getNodeDescriptor(node, prop);

    var config = {
      configurable: true,
      enumerable: descr.enumerable
    };

    if (descr.hasOwnProperty('value')) {
      config.writable = !!descr.writable;

      console.log(prop, descr.writable, typeof descr.value);

      return this;

      if (typeIs(descr.value, 'Function')) {
        config.value = function() {
          var value = descr.value.apply(node, arguments);

          handler.apply(node, arguments);

          return value;
        };
      } else {
        var stale = node[prop];

        if (config.writable) {
          config.set = function(value) {
            if (stale !== value) {
              handler.call(node, stale, value);

              stale = value;

              return value;
            }
          };

          config.get = function() {
            return stale;
          };
        } else {
          config.value = stale;
        }
      }
    } else {
      if (descr.set) {
        config.set = function(value) {
          var stale = node[prop];

          if (stale !== value) {
            descr.set.call(node, value)
            handler.call(node, stale, value);
          }

          return value;
        };
      }

      if (descr.get) {
        config.get = function() {
          return descr.get.call(node);
        };
      }
    }

    defineProperty(node, prop, config);

    return this;
  },
  unwatch: function(prop) {
    delete this.node[prop];

    return this;
  }
};
