define("css/radiobox.css.js", ["import-style"], function(require, exports, module){
var style = require("import-style");
style.css(".ui-beauty-radio {\n  border-radius: 8px;\n  background: url(./examples/images/radio.png) no-repeat center;\n}\n.ui-beauty-radio.ui-beauty-choice-checked {\n  background: url(./examples/images/radio-checked.png) no-repeat center;\n}\n.ui-beauty-radio.ui-beauty-choice-disabled {\n  cursor: not-allowed;\n  background: url(./examples/images/radio-disabled.png) no-repeat center;\n}\n.ui-beauty-radio.ui-beauty-choice-checked.ui-beauty-choice-disabled {\n  background: url(./examples/images/radio-checked-disabled.png) no-repeat center;\n}\n");
});
