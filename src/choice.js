/*!
 * Choice
 * Date: 2015/06/07
 * https://github.com/nuintun/beauty-form
 *
 * This is licensed under the MIT License (MIT).
 * For details, see: https://github.com/nuintun/beauty-form/blob/master/LICENSE
 */

import $ from 'jquery';
import Observer from './observer';
import { doc, activeElement } from './util';

var reference = {};

/**
 * radio
 *
 * @param element
 */
function radio(element) {
  doc
    .find('input[type=radio][name=' + element.name + ']')
    .each(function(index, radio) {
      var choice = Choice.get(radio);

      if (choice && element !== radio) {
        choice.refresh();
      }
    });
}

/**
 * Choice
 *
 * @param element
 * @constructor
 */
export default function Choice(element) {
  var context = this;

  context.destroyed = false;
  context.element = $(element);
  context.type = element.type;
  context.observer = new Observer(element);
  context.type = context.type ? context.type.toLowerCase() : undefined;

  var choice = Choice.get(element);

  if (choice) {
    return choice;
  }

  if (context.type !== 'checkbox' && context.type !== 'radio') {
    throw new TypeError('The element must be a checkbox or radio.');
  }

  context.__init();
}

/**
 * get
 *
 * @param element
 * @returns {*}
 */
Choice.get = function(element) {
  element = $(element);

  return element.data('beauty-choice');
};

/**
 * Choice.prototype
 *
 * @type {{
 *   init: Choice.init,
 *   focus: Choice.focus,
 *   blur: Choice.blur,
 *   check: Choice.check,
 *   uncheck: Choice.uncheck,
 *   enable: Choice.enable,
 *   disable: Choice.disable,
 *   refresh: Choice.refresh,
 *   beauty: Choice.beauty,
 *   destory: Choice.destory
 * }}
 */
Choice.prototype = {
  __init: function() {
    var context = this;
    var type = context.type;

    function refresh() {
      var choice = Choice.get(this);

      if (choice) {
        type === 'radio' && radio(this);

        choice.refresh();
      }
    }

    context.observer.watch('checked', refresh);
    context.observer.watch('disabled', refresh);

    if (type === 'checkbox') {
      context.observer.watch('indeterminate', refresh);
    }

    reference[type] = reference[type] || 0;

    if (!reference[type]) {
      var namespace = '.beauty-' + type;
      var selector = 'input[type=' + type + ']';

      doc.on('focusin' + namespace, selector, refresh);
      doc.on('change' + namespace, selector, refresh);
      doc.on('focusout' + namespace, selector, refresh);

      if (type === 'checkbox') {
        // If checkbox is indeterminate, IE8+ not fire change and indeterminate change event.
        doc.on('click' + namespace, selector, refresh);
      }
    }

    return context.__beauty();
  },
  __beauty: function() {
    var context = this;
    var type = context.type;
    var element = context.element;

    element.wrap('<i tabindex="-1" class="ui-beauty-choice ui-beauty-' + type + '"/>');

    context.choice = element.parent();

    context.choice.attr('role', type);

    element.data('beauty-choice', context);

    reference[type]++;

    return context.refresh();
  },
  refresh: function() {
    var context = this;
    var type = context.type;
    var choice = context.choice;
    var element = context.element[0];
    var indeterminate = element.indeterminate;

    choice
      .toggleClass('ui-beauty-choice-disabled', element.disabled)
      .toggleClass('ui-beauty-choice-focus', activeElement() === element)

    if (type === 'checkbox') {
      choice
        .toggleClass('ui-beauty-choice-checked', !indeterminate && element.checked)
        .toggleClass('ui-beauty-choice-indeterminate', indeterminate);
    } else {
      choice.toggleClass('ui-beauty-choice-checked', element.checked);
    }

    return context;
  },
  destroy: function() {
    var context = this;

    if (context.destroyed) return;

    var type = context.type;
    var element = context.element;

    element.unwrap();
    element.removeData('beauty-choice');

    context.observer.unwatch('checked');
    context.observer.unwatch('disabled');

    if (type === 'checkbox') {
      context.observer.unwatch('indeterminate');

      element.off('click' + namespace);
    }

    if (!--reference[type]) {
      var namespace = '.beauty-' + type;

      doc.off('focusin' + namespace);
      doc.off('change' + namespace);
      doc.off('focusout' + namespace);

      if (type === 'checkbox') {
        doc.off('click' + namespace);
      }

      delete reference[type];
    }

    context.destroyed = true;
  }
};
