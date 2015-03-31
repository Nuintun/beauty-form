/*!
 * PopupJS
 * Date: 2014-11-09
 * https://github.com/aui/popupjs
 * (c) 2009-2014 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */

'use strict';

var count = 0,
  $ = require('jquery');

/**
 * 弹窗类
 * @constructor
 */
function Popup(){
  // 实例是否被销毁
  this.destroyed = false;

  // 使用 <dialog /> 元素可能导致 z-index 永远置顶的问题(chrome)
  this.__popup = $('<div />')
    .css({
      display: 'none',
      position: 'absolute',
      outline: 0
    })
    .attr('tabindex', '-1')
    .html(this.innerHTML)
    .appendTo('body');

  // 锁屏遮罩
  this.__backdrop = $('<div />')
    .css({
      opacity: .7,
      background: '#000'
    });

  // 锁屏时锁定 tab 焦点
  this.__mask = $('<div />')
    .attr('tabindex', 0)
    .css('opacity', 0);

  // 使用 HTMLElement 作为外部接口使用，而不是 jquery 对象
  // 统一的接口利于未来 Popup 移植到其他 DOM 库中
  this.node = this.__popup[0];
  this.backdrop = this.__backdrop[0];

  count++;
}

// 添加原型方法
Popup.prototype = {
  /**
   * 初始化完毕事件，在 show()、showModal() 执行
   * @name Popup.prototype.onshow
   * @event
   */

  /**
   * 关闭事件，在 close() 执行
   * @name Popup.prototype.onclose
   * @event
   */

  /**
   * 销毁前事件，在 remove() 前执行
   * @name Popup.prototype.onbeforeremove
   * @event
   */

  /**
   * 销毁事件，在 remove() 执行
   * @name Popup.prototype.onremove
   * @event
   */

  /**
   * 重置事件，在 reset() 执行
   * @name Popup.prototype.onreset
   * @event
   */

  /**
   * 焦点事件，在 foucs() 执行
   * @name Popup.prototype.onfocus
   * @event
   */

  /**
   * 失焦事件，在 blur() 执行
   * @name Popup.prototype.onblur
   * @event
   */

  // 浮层 DOM 素节点[*]
  node: null,
  // 遮罩 DOM 节点[*]
  backdrop: null,
  // 是否开启固定定位[*]
  fixed: false,
  // 判断对话框是否删除[*]
  destroyed: true,
  // 判断对话框是否显示
  open: false,
  // close 返回值
  returnValue: '',
  // 是否自动聚焦
  autofocus: true,
  // 对齐方式[*]
  align: 'bottom left',
  // 内部的 HTML 字符串
  innerHTML: '',
  // CSS 类名
  className: 'ui-popup',
  /**
   * 显示浮层
   * @param  anchor {HTMLElement, Event}  指定位置（可选）
   * @returns {Popup}
   */
  show: function (anchor){
    // 已销毁弹窗不做处理
    if (this.destroyed) {
      return this;
    }

    var popup = this.__popup,
      backdrop = this.__backdrop;

    this.__activeElement = this.__getActive();
    this.open = true;
    this.follow = anchor || this.follow;

    // 初始化 show 方法
    if (!this.__ready) {
      popup
        .addClass(this.className)
        .attr('role', this.modal ? 'modaldialog' : 'dialog')
        .css('position', this.fixed ? 'fixed' : 'absolute');

      // 绑定 resize 事件
      $(window).on('resize', $.proxy(this.reset, this));

      // 模态浮层的遮罩
      if (this.modal) {
        var backdropCss = {
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          userSelect: 'none',
          zIndex: this.zIndex || Popup.zIndex
        };

        // 添加类名
        popup.addClass(this.className + '-modal');

        // 设置遮罩
        backdrop
          .css(backdropCss)
          .attr('tabindex', 0)
          .addClass(this.className + '-backdrop')
          .on('focus', $.proxy(this.focus, this))
          .insertBefore(popup);

        // 锁定 tab 的焦点操作
        this.__mask.insertAfter(popup);

        // 弹窗已就绪
        this.__ready = true;
      }

      // 设定弹窗内容
      if (!popup.html()) {
        popup.html(this.innerHTML);
      }
    }

    // 弹窗添加类名
    popup
      .addClass(this.className + '-show')
      .show();

    // 显示遮罩
    backdrop.show();

    // 弹窗定位获取焦点并触发 show 事件
    this.reset().focus();
    this.__dispatchEvent('show');

    return this;
  },
  /**
   * 显示模态浮层。参数参见 show()
   * @returns {Popup}
   */
  showModal: function (){
    this.modal = true;

    // 调用 show 方法
    return this.show.apply(this, arguments);
  },
  /**
   * 关闭浮层
   * @param result
   * @returns {Popup}
   */
  close: function (result){
    // 弹窗未销毁和打开的情况下才执行逻辑
    if (!this.destroyed && this.open) {
      // 设定返回值
      if (result !== undefined) {
        this.returnValue = result;
      }

      // 隐藏弹窗和遮罩
      this.__popup.hide().removeClass(this.className + '-show');
      this.__backdrop.hide();
      this.open = false;

      // 恢复焦点，照顾键盘操作的用户
      this.blur();
      // 触发 close 事件
      this.__dispatchEvent('close');
    }

    return this;
  },
  /**
   * 销毁浮层
   * @returns {Popup}
   */
  remove: function (){
    // 已销毁的弹窗不做处理
    if (this.destroyed) {
      return this;
    }

    // 触发 beforeremove 事件
    this.__dispatchEvent('beforeremove');

    // 置空 current 引用
    if (Popup.current === this) {
      Popup.current = null;
    }

    // 从 DOM 中移除节点
    this.__popup.remove();
    this.__backdrop.remove();
    this.__mask.remove();

    // 解绑 resize 事件
    $(window).off('resize', this.reset);

    // 触发 remove 事件
    this.__dispatchEvent('remove');

    // 清理实例
    for (var i in this) {
      if (this.hasOwnProperty(i)) {
        delete this[i];
      }
    }

    return this;
  },
  /**
   * 重置位置
   * @returns {Popup}
   */
  reset: function (){
    var elem = this.follow;

    // 存在定位元素依照元素定位，否则居中显示
    if (elem) {
      this.__follow(elem);
    } else {
      this.__center();
    }

    // 触发 reset 事件
    this.__dispatchEvent('reset');

    return this;
  },
  /**
   * 让浮层获取焦点
   * @returns {Popup}
   */
  focus: function (){
    var node = this.node,
      popup = this.__popup,
      current = Popup.current,
      index = this.zIndex = Popup.zIndex++;

    if (current && current !== this) {
      current.blur(false);
    }

    // 检查焦点是否在浮层里面
    if (!$.contains(node, this.__getActive())) {
      var autofocus = popup.find('[autofocus]')[0];

      if (!this._autofocus && autofocus) {
        this._autofocus = true;
      } else {
        autofocus = node;
      }

      this.__focus(autofocus);
    }

    // 设置叠加高度
    popup.css('zIndex', index);

    Popup.current = this;
    popup.addClass(this.className + '-focus');

    // 触发 focus 事件
    this.__dispatchEvent('focus');

    return this;
  },
  /**
   * 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户
   * @returns {Popup}
   */
  blur: function (){
    var isBlur = arguments[0],
      activeElement = this.__activeElement;

    if (isBlur !== false) {
      this.__focus(activeElement);
    }

    this._autofocus = false;
    this.__popup.removeClass(this.className + '-focus');

    // 触发 blur 事件
    this.__dispatchEvent('blur');

    return this;
  },
  /**
   * 添加事件
   * @param type {String} 事件类型
   * @param callback {Function} 监听函数
   */
  addEventListener: function (type, callback){
    this.__getEventListener(type).push(callback);

    return this;
  },
  /**
   * 删除事件
   * @param type {String} 事件类型
   * @param callback {Function} 监听函数
   */
  removeEventListener: function (type, callback){
    var listeners = this.__getEventListener(type);

    for (var i = 0; i < listeners.length; i++) {
      if (callback === listeners[i]) {
        listeners.splice(i--, 1);
      }
    }

    return this;
  },
  /**
   * 获取事件缓存
   * @param type
   * @returns {*}
   * @private
   */
  __getEventListener: function (type){
    var listener = this.__listener;

    if (!listener) {
      listener = this.__listener = {};
    }

    if (!listener[type]) {
      listener[type] = [];
    }

    return listener[type];
  },
  /**
   * 派发事件
   * @param type
   * @private
   */
  __dispatchEvent: function (type){
    var listeners = this.__getEventListener(type);

    if (this['on' + type]) {
      this['on' + type]();
    }

    for (var i = 0; i < listeners.length; i++) {
      listeners[i].call(this);
    }
  },
  /**
   * 对元素安全聚焦
   * @param elem
   * @private
   */
  __focus: function (elem){
    // 防止 iframe 跨域无权限报错
    // 防止 IE 不可见元素报错
    try {
      // ie11 bug: iframe 页面点击会跳到顶部
      if (this.autofocus && !/^iframe$/i.test(elem.nodeName)) {
        elem.focus();
      }
    } catch (e) {}
  },
  /**
   * 获取当前焦点的元素
   * @returns {HTMLDocument|DocumentView}
   * @private
   */
  __getActive: function (){
    try {
      // try: ie8~9, iframe #26
      var activeElement = document.activeElement,
        contentDocument = activeElement.contentDocument;

      // 返回当前焦点元素
      return contentDocument && contentDocument.activeElement || activeElement;
    } catch (e) {}
  },
  /**
   * 居中浮层
   * @private
   */
  __center: function (){
    var popup = this.__popup,
      $window = $(window),
      $document = $(document),
      fixed = this.fixed,
      dl = fixed ? 0 : $document.scrollLeft(),
      dt = fixed ? 0 : $document.scrollTop(),
      ww = $window.width(),
      wh = $window.height(),
      ow = popup.width(),
      oh = popup.height(),
      left = (ww - ow) / 2 + dl,
      top = (wh - oh) * 382 / 1000 + dt, // 黄金比例
      style = popup[0].style;

    style.left = Math.max(parseInt(left), dl) + 'px';
    style.top = Math.max(parseInt(top), dt) + 'px';
  },
  /**
   * 指定位置 @param {HTMLElement, Event} anchor
   * @param anchor
   * @returns {*}
   * @private
   */
  __follow: function (anchor){
    var popup = this.__popup,
      $elem = anchor.parentNode && $(anchor);

    if (this.__followSkin) {
      popup.removeClass(this.__followSkin);
    }

    // 隐藏元素不可用
    if ($elem) {
      var o = $elem.offset();

      if (o.left * o.top < 0) {
        return this.__center();
      }
    }

    var that = this,
      fixed = this.fixed,
      $window = $(window),
      $document = $(document),
      winWidth = $window.width(),
      winHeight = $window.height(),
      docLeft = $document.scrollLeft(),
      docTop = $document.scrollTop(),
      popupWidth = popup.width(),
      popupHeight = popup.height(),
      width = $elem ? $elem.outerWidth() : 0,
      height = $elem ? $elem.outerHeight() : 0,
      offset = this.__offset(anchor),
      x = offset.left,
      y = offset.top,
      left = fixed ? x - docLeft : x,
      top = fixed ? y - docTop : y,
      minLeft = fixed ? 0 : docLeft,
      minTop = fixed ? 0 : docTop,
      maxLeft = minLeft + winWidth - popupWidth,
      maxTop = minTop + winHeight - popupHeight,
      css = {},
      align = this.align.split(' '),
      className = this.className + '-',
      reverse = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' },
      name = { top: 'top', bottom: 'top', left: 'left', right: 'left' },
      temp = [
        {
          top: top - popupHeight,
          bottom: top + height,
          left: left - popupWidth,
          right: left + width
        },
        {
          top: top,
          bottom: top - popupHeight + height,
          left: left,
          right: left - popupWidth + width
        }
      ],
      center = {
        left: left + width / 2 - popupWidth / 2,
        top: top + height / 2 - popupHeight / 2
      },
      range = {
        left: [minLeft, maxLeft],
        top: [minTop, maxTop]
      };

    // 超出可视区域重新适应位置
    $.each(align, function (i, val){
      // 超出右或下边界：使用左或者上边对齐
      if (temp[i][val] > range[name[val]][1]) {
        val = align[i] = reverse[val];
      }

      // 超出左或右边界：使用右或者下边对齐
      if (temp[i][val] < range[name[val]][0]) {
        align[i] = reverse[val];
      }
    });

    // 一个参数的情况
    if (!align[1]) {
      name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
      temp[1][align[1]] = center[name[align[1]]];
    }

    //添加follow的css, 为了给css使用
    className += align.join('-') + ' ' + this.className + '-follow';

    that.__followSkin = className;

    if ($elem) {
      popup.addClass(className);
    }

    css[name[align[0]]] = parseInt(temp[0][align[0]]);
    css[name[align[1]]] = parseInt(temp[1][align[1]]);

    popup.css(css);
  },
  /**
   * 获取元素相对于页面的位置（包括iframe内的元素）
   * 暂时不支持两层以上的 iframe 套嵌
   * @param anchor
   * @returns {*}
   * @private
   */
  __offset: function (anchor){
    var isNode = anchor.parentNode,
      offset = isNode ? $(anchor).offset() : {
        left: anchor.pageX,
        top: anchor.pageY
      };

    anchor = isNode ? anchor : anchor.target;

    var ownerDocument = anchor.ownerDocument,
      defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

    if (defaultView === window) {
      // IE <= 8 只能使用两个等于号
      return offset;
    }

    // {Element: Ifarme}
    var frameElement = defaultView.frameElement,
      $ownerDocument = $(ownerDocument),
      docLeft = $ownerDocument.scrollLeft(),
      docTop = $ownerDocument.scrollTop(),
      frameOffset = $(frameElement).offset(),
      frameLeft = frameOffset.left,
      frameTop = frameOffset.top;

    return {
      left: offset.left + frameLeft - docLeft,
      top: offset.top + frameTop - docTop
    };
  }
};

// 当前叠加高度
Popup.zIndex = 1024;

// 顶层浮层的实例
Popup.current = null;

// 模块接口
module.exports = Popup;
