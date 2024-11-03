
function replaceDivToA() {

    if (window.location.href !== 'https://gingim.net/games/') return;

    const els = document.querySelectorAll('[data-href]');

    els.forEach((el) => {
        const gameURL = el.getAttribute('data-href');
        el.removeAttribute('data-href');

        // צור עותק של האלמנט המקורי
        const clonedEl = el.cloneNode(true);

        const aEl = document.createElement('a');
        aEl.href = gameURL;
        aEl.target = '_blank';
        aEl.appendChild(clonedEl);

        el.replaceWith(aEl);
    });
}

replaceDivToA()
