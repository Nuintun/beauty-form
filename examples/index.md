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

$('#one').on('click', function(){
  popup = new Popup()
  popup.innerHTML = '<button id="two">弹窗二</button>';
  popup.addEventListener('show', function(){
    $('#two').on('click', function(){
      var popup = new Popup()
      popup.innerHTML = '<button id="close">关闭</button>';
      popup.addEventListener('show', function(){
        $('#close').on('click', function(){
          popup.remove();
        });
      });     
      popup.showModal();
    });
  });
  popup.showModal();
});

$(document).on('keyup', function(e){
  if(popup && Popup.current === popup && e.which === 27){
    popup.remove();
  }
});
````