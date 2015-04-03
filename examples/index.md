# Demo

---

## Normal usage

````html
<a id="one" href="javascript:;">弹窗一</a>
````

````javascript
var popup;
var $ = require('jquery');
var Popup = require('../lib/popup');

popup = new Popup()
popup.innerHTML = '<button id="two">你好！</button>';

$('#one').on('click', function(){ 
  popup.showModal();
});

$(document).on('keyup', function(e){
  if(popup && Popup.current === popup && e.which === 27){
    popup.close();
  }
});
````