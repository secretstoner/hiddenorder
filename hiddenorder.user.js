// ==UserScript==
// @name         The Hidden Order
// @namespace    https://github.com/secretstoner/hiddenorder
// @version      0.2
// @description  Make Amazon orders invisible on the page
// @author       You
// @include      http*://*.amazon.co.uk/*
// @grant        none
// ==/UserScript==

var order_numbers = [
    "xxx-xxxxxxx-xxxxxxx",
    "xxx-xxxxxxx-xxxxxxx"
];

try {
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
