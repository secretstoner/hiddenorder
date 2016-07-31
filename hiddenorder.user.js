// ==UserScript==
// @name         The Hidden Order
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Amazon orders invisible on the page
// @author       You
// @include      http*://*.amazon.co.uk/*
// @grant        none
// ==/UserScript==

var order_numbers = [
    "xxx-yyyyyyy-zzzzzzz",
    "aaa-bbbbbbb-ccccccc"
];

try {
    window.addEventListener('load', function() {
        /*
        Once the page has loaded, get all the spans and check each one for an order number ONLY surrounded by whitespace.
        Once identified, check for a matching order number and if found, hide the seventh parent element.
        */
        
        var spans = document.getElementsByTagName('span');
        for (var x = 0; x < spans.length; x++) {
            if (spans[x].innerHTML.match(/^\s*\d+-\d+-\d+\s*$/)) {
                var order_number = spans[x].innerHTML.match(/\d+-\d+-\d+/)[0];
                if (order_numbers.indexOf(order_number) > -1) {
                    spans[x].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                }
            }
        }
    }, false);
} catch (e) {
    console.log ('AOH Error: ' + e);
}
