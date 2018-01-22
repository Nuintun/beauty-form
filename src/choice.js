/**
 * @module choice
 * @license MIT
 * @version 2015/06/07
 */

import $ from 'jquery';
import Observer from './observer';
import { doc, activeElement } from './util';

var reference = {};

/**
 * @function radio
 * @param {HTMLElement} element
 */
function radio(element) {
  doc.find('input[type=radio][name=' + element.name + ']').each(function(index, radio) {
    var choice = Choice.get(radio);

    if (choice && element !== radio) {
      choice.refresh();
    }
  });
}

/**
 * @class Choice
 * @param {HTMLElement} element
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
 * @function get
 * @param {HTMLElement} element
 * @returns {Choice}
 */
Choice.get = function(element) {
  element = $(element);

  return element.data('beautify-choice');
};

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

    context.observer.watch('checked', refresh).watch('disabled', refresh);

    if (type === 'checkbox') {
      context.observer.watch('indeterminate', refresh);
    }

    reference[type] = reference[type] || 0;

    if (!reference[type]) {
      var namespace = '.beautify-' + type;
      var selector = 'input[type=' + type + ']';

      doc
        .on('focusin' + namespace, selector, refresh)
        .on('change' + namespace, selector, refresh)
        .on('focusout' + namespace, selector, refresh);

      if (type === 'checkbox') {
        // If checkbox is indeterminate, IE8+ not fire change and indeterminate change event.
        doc.on('click' + namespace, selector, refresh);
      }
    }

    return context.__beautify();
  },
  __beautify: function() {
    var context = this;
    var type = context.type;
    var element = context.element;

    element.wrap('<i tabindex="-1" class="ui-beautify-choice ui-beautify-' + type + '"/>');

    context.choice = element.parent();

    context.choice.attr('role', type);

    element.data('beautify-choice', context);

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
      .toggleClass('ui-beautify-choice-disabled', element.disabled)
      .toggleClass('ui-beautify-choice-focus', activeElement() === element);

    if (type === 'checkbox') {
      choice
        .toggleClass('ui-beautify-choice-checked', !indeterminate && element.checked)
        .toggleClass('ui-beautify-choice-indeterminate', indeterminate);
    } else {
      choice.toggleClass('ui-beautify-choice-checked', element.checked);
    }

    return context;
  },
  destroy: function() {
    var context = this;

    if (context.destroyed) return;

    var type = context.type;
    var element = context.element;

    element.unwrap().removeData('beautify-choice');

    context.observer.unwatch('checked').unwatch('disabled');

    if (type === 'checkbox') {
      context.observer.unwatch('indeterminate');

      element.off('click' + namespace);
    }

    if (!--reference[type]) {
      var namespace = '.beautify-' + type;

      doc
        .off('focusin' + namespace)
        .off('change' + namespace)
        .off('focusout' + namespace);

      if (type === 'checkbox') {
        doc.off('click' + namespace);
      }

      delete reference[type];
    }

    context.destroyed = true;
  }
};
