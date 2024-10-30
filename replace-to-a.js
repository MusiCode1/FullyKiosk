

const els = document.querySelectorAll('[data-href]');

els.forEach((el) => {
    const gameURL = el.getAttribute('data-href');
    
    // צור עותק של האלמנט המקורי
    const clonedEl = el.cloneNode(true);
    
    const aEl = document.createElement('a');
    aEl.href = gameURL;
    aEl.target = '_blank';
    aEl.appendChild(clonedEl);

    el.replaceWith(aEl);
});
