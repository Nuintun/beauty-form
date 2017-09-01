/*!
 * Observer
 * Date: 2017/08/30
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

var defineProperty = Object.defineProperty;
var getPrototypeOf = Object.getPrototypeOf;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getNodeDescriptor = getPrototypeOf ? function(node, prop) {
  return getOwnPropertyDescriptor(getPrototypeOf(node), prop)
    || getOwnPropertyDescriptor(HTMLElement.prototype, prop)
    || getOwnPropertyDescriptor(Element.prototype, prop)
    || getOwnPropertyDescriptor(Node.prototype, prop);
} : function(node, prop) {
  var prototype = Element.prototype;

  if (!hasOwnProperty.call(prototype, prop)) {
    prototype = node.constructor.prototype;
  }

  if (hasOwnProperty.call(prototype, prop)) {
    return getOwnPropertyDescriptor(prototype, prop);
  }
};

export default function Observer(node) {
  this.node = node;
}

Observer.prototype = {
  watch: function(prop, handler) {
    var node = this.node;
    var descr = getNodeDescriptor(node, prop);

    if (descr && (descr.set || descr.get)) {
      var config = {
        configurable: true,
        enumerable: descr.enumerable
      };

      if (descr.set) {
        config.set = function(value) {
          var node = this;
          var stale = node[prop];

          if (stale !== value) {
            descr.set.call(node, value);
            handler.call(node, stale, value);
          }

          return value;
        };
      }

      if (descr.get) {
        // IE8 can't direct use: config.get = descr.get
        config.get = function() {
          return descr.get.call(this);
        }
      }

      defineProperty(node, prop, config);
    }

    return this;
  },
  unwatch: function(prop) {
    delete this.node[prop];

    return this;
  }
};
