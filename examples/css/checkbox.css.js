define("css/checkbox.css.js", ["import-style"], function(require, exports, module){
var style = require("import-style");

style.css(".ui-beauty-checkbox {\n  background: url(./examples/images/checkbox.png) no-repeat center;\n}\n.ui-beauty-checkbox.ui-beauty-choice-checked {\n  background: url(./examples/images/checkbox-checked.png) no-repeat center;\n}\n.ui-beauty-checkbox.ui-beauty-choice-disabled {\n  cursor: not-allowed;\n  background: url(./examples/images/checkbox-disabled.png) no-repeat center;\n}\n.ui-beauty-checkbox.ui-beauty-choice-checked.ui-beauty-choice-disabled {\n  background: url(./examples/images/checkbox-checked-disabled.png) no-repeat center;\n}\n");
});
