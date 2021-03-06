// ==UserScript==
// @name         The Hidden Order
// @namespace    https://github.com/secretstoner/hiddenorder
// @version      0.4
// @description  Make Amazon orders invisible on the page
// @author       You
// @include      http*://*.amazon.co.uk/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var keys_down = [];
var order_numbers = [];

function doc_keyDown(e) {
    /*
    Log each key as it's pressed and check for certain combinations of keys pressed at the same time.
    If a combination is met, then all keys should be reset (the prompt causes the user to release the keys but the keyup doesn't register.
    */

    keys_down[e.keyCode] = true;
    if (keys_down[72] && keys_down[65] && keys_down[79]) {  // H + A + O
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
function doc_keyUp(e) {
    // Javascript keycodes: http://keycode.info/
    keys_down[e.keyCode] = false;
}

function get_orders() {
    order_numbers = GM_getValue('amazon',[]);
}

try {
    /*
    Get all the spans and check each one for an order number ONLY surrounded by whitespace.
    Once identified, check for a matching order number and if found, hide the seventh parent element.
    
    Lastly change the number of orders text on to match the new number of orders
    */
    var ts_start = Date.now();

    document.addEventListener('keyup', doc_keyUp, false);
    document.addEventListener('keydown', doc_keyDown, false);
    get_orders();

    var spans = document.getElementsByTagName('span');
    var order_count = 0, orders_hidden = 0;

    for (var x = 0; x < spans.length; x++) {
        if (spans[x].innerHTML.match(/^\s*\d+-\d+-\d+\s*$/)) {
            order_count++;
            var order_number = spans[x].innerHTML.match(/\d+-\d+-\d+/)[0];
            if (order_numbers.indexOf(order_number) > -1) {
                spans[x].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                orders_hidden++;
            }
        }
    }

    var order_text = document.getElementsByClassName('num-orders');
    if (order_text.length == 1) {
        order_text[0].innerHTML = (order_count - orders_hidden) + ' hidden orders';
    } else {
        console.log ('AOH Error: more or less than one order_text element');
        console.log (order_text);
    }

    console.log ('THO: ' + order_count + ' found; ' + orders_hidden + ' hidden; in ' + (Date.now() - ts_start) + 'ms');
} catch (e) {
    console.log ('AOH Error: ' + e);
}
