define("css/selectbox.css.js", ["import-style"], function(require, exports, module){
var style = require("import-style");
style.css(".ui-beauty-select {\n  display: inline-block;\n  *display: inline; *zoom: 1;\n  position: relative;\n  margin: 0; padding: 0 20px 0 4px;\n  outline: 0 none;\n  text-align: left;\n  border: 1px solid #ccc;\n  overflow: hidden;\n  font-size: 0; letter-spacing: 0;\n  -webkit-text-size-adjust: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n.ui-beauty-select-hidden {\n  position: absolute;\n  top: auto; right: auto;\n  bottom: auto; left: auto;\n  z-index: -1; opacity: 0;\n  -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);\n  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);\n}\n:root .ui-beauty-select-hidden {\n  -ms-filter: none;\n  filter: none;\n}\n.ui-beauty-select-focus {\n  border: 1px solid #09e;\n}\n.ui-beauty-select-title {\n  cursor: default;\n  margin: 0; padding: 0;\n  display: inline-block;\n  *display: inline; *zoom: 1;\n  font-size: 13px;\n  width: 100%; height: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-beauty-select-disabled .ui-beauty-select-title {\n  color: #e6e6e6; cursor: not-allowed;\n}\n.ui-beauty-select-icon {\n  position: absolute;\n  top: 50%; right: 2px;\n  display: inline-block;\n  *display: inline; *zoom: 1;\n  width: 16px; height: 16px;\n  margin-top: -8px;\n  background: url(./examples/images/select.png) no-repeat center;\n}\n.ui-beauty-select-disabled .ui-beauty-select-icon {\n  cursor: not-allowed;\n  background: url(./examples/images/select-disabled.png) no-repeat center;\n}\n.ui-beauty-select-opened .ui-beauty-select-icon {\n  background: url(./examples/images/select-opened.png) no-repeat center;\n}\n.ui-beauty-select-disabled.ui-beauty-select-opened .ui-beauty-select-icon {\n  background: url(./examples/images/select-opened-disabled.png) no-repeat center;\n}\n.ui-beauty-select-dropdown {\n  position: absolute;\n  margin: 0; padding: 0;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  border: 1px solid #09e;\n  max-height: 100px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  outline: 0 none;\n  font-size: 13px;\n  line-height: 100%;\n  list-style: none;\n  background: #fff;\n}\n.ui-beauty-select-dropdown-bottom {\n  margin-top: -1px;\n}\n.ui-beauty-select-dropdown-items {\n  margin: 0; padding: 0;\n}\n.ui-beauty-select-optgroup,\n.ui-beauty-select-option {\n  white-space: nowrap;\n  outline: 0 none;\n  margin: 0;\n  padding: 6px;\n  cursor: pointer;\n  color: #333;\n  background: transparent;\n}\n.ui-beauty-select-option {\n  padding-left: 20px;\n}\n.ui-beauty-select-optgroup {\n  cursor: default;\n  color: #000;\n  font-weight: bold;\n  font-style: italic;\n  font-size: 14px;\n}\n.ui-beauty-select-option:hover {\n  background: #eee;\n}\n.ui-beauty-select-option:focus {\n  outline: 0 none;\n}\n");
});
