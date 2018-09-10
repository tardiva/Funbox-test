'use strict';

(function() {

    var cards = document.querySelectorAll('.js-card');
    var links = document.querySelectorAll('.js-link');

    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', toggleSelectionByCard);
        cards[i].addEventListener('mouseleave', turnHoverOn);
        links[i].addEventListener('click', toggleSelection);
    }

    function toggleSelectionByCard(event) {
        toggleSelection(event);
        turnHoverOff(event);
    }

    function toggleSelection(event) {
        event.preventDefault();

        var item = event.target.closest('.js-item');

        if (item.classList.contains('js-disabled')) {
            return;
        }
        var card = item.querySelector('.js-card');
        item.classList.toggle('grid-item--selected');
        card.classList.toggle('card--selected');
    }

    function turnHoverOn(event) {
        var el = event.target.closest('.js-card');

        if (el.classList.contains('no-hover')) {
            el.classList.remove('no-hover');
        }
    }

    function turnHoverOff(event) {
        var el = event.target.closest('.js-card');

        if (!el.classList.contains('no-hover')) {
            el.classList.add('no-hover');
        }
    }
})();

