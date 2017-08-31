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
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getNodeDescriptor = getPrototypeOf ? function(node, prop) {
  return getOwnPropertyDescriptor(getPrototypeOf(node), prop)
    || getOwnPropertyDescriptor(Element.prototype, prop)
    || getOwnPropertyDescriptor(HTMLElement.prototype, prop);
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

    defineProperty(node, prop, {
      configurable: true,
      enumerable: descr.enumerable,
      set: function(value) {
        var stale = node[prop];

        if (stale !== value) {
          setTimeout(function() {
            handler.call(node, stale, value);
          }, 0);
        }

        return descr.set.call(node, value);
      },
      get: function() {
        return descr.get.call(node);
      }
    });

    return this;
  },
  unwatch: function(prop) {
    delete this.node[prop];

    return this;
  }
}
