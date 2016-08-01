// ==UserScript==
// @name         The Hidden Order
// @namespace    https://github.com/secretstoner/hiddenorder
// @version      0.3
// @description  Make Amazon orders invisible on the page
// @author       You
// @include      http*://*.amazon.co.uk/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var keys_down = [];
var order_numbers = [];

function doc_keyUp(e) {
  // Javascript keycodes: http://keycode.info/
  keys_down[e.keyCode] = false;
}
function doc_keyDown(e) {
  keys_down[e.keyCode] = true;
  if (keys_down[72] && keys_down[65] && keys_down[79]) {  // H + A + O
    
      // If a key combination has been met reset the down keys
      keys_down = [];
  	var new_order_number = prompt ('Enter the order number');
    var t = order_numbers.push(new_order_number);
    GM_setValue('amazon', order_numbers);
  } else if (keys_down[83] && keys_down[65] && keys_down[79]) { // S + A + O
      keys_down = [];
      var remove_order_number = prompt ('Enter order number');
      order_numbers.splice (order_numbers.indexOf(remove_order_number), 1);
      GM_setValue('amazon', order_numbers);
  }
}
function get_orders() {
    order_numbers = GM_getValue('amazon',[]);
    console.log (order_numbers);
}

try {
    document.addEventListener('keyup', doc_keyUp, false);
    document.addEventListener('keydown', doc_keyDown, false);
    get_orders();
    /*
        Get all the spans and check each one for an order number ONLY surrounded by whitespace.
        Once identified, check for a matching order number and if found, hide the seventh parent element.
        */

    var spans = document.getElementsByTagName('span');
    var order_count = 0, orders_hidden = 0;
    var order_text;

    for (var x = 0; x < spans.length; x++) {
        if (spans[x].innerHTML.match(/^\s*\d+-\d+-\d+\s*$/)) {
            order_count++;
            var order_number = spans[x].innerHTML.match(/\d+-\d+-\d+/)[0];
            if (order_numbers.indexOf(order_number) > -1) {
                spans[x].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                orders_hidden++;
            } else if (spans[x].innerHTML.match(/\d+ hidden orders/)) {
                order_text = spans[x];
            }
        }
    }
    /*
TODO: https://github.com/secretstoner/hiddenorder/issues/2
    order_text.innerHTML = (order_count - orders_hidden) + ' hidden orders';
*/
    console.log (order_count + ' orders found; ' + orders_hidden + ' orders hidden');
} catch (e) {
    console.log ('AOH Error: ' + e);
}
