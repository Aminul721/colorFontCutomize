document.querySelectorAll(".vertical-num-scroll").forEach(function (innerNumberDiv) {
    const dataNumValue = innerNumberDiv.getAttribute("data-num");
    const dataValueArray = dataNumValue.split('');
    const createElementDiv = document.createElement('div');
    createElementDiv.classList.add('vertical-num-wrap');
    innerNumberDiv.appendChild(createElementDiv);

    dataValueArray.forEach(function (item) {
        const itemCreateElementDiv = document.createElement('div');
        itemCreateElementDiv.classList.add('number-item');
        if (item === ',' || item === '.') {
            let createSpan = document.createElement('span');
            createSpan.classList.add('number');
            createSpan.innerText = item;
            itemCreateElementDiv.appendChild(createSpan);
            createElementDiv.appendChild(itemCreateElementDiv);
        } else {
            for (let i = 0; i <= 19; i++) {
                let createSpan = document.createElement('span');
                createSpan.classList.add('number');
                createSpan.innerText = i % 10;

                if (item == i % 10 && i > 5 && i < 16) { createSpan.classList.add('current'); }
                itemCreateElementDiv.appendChild(createSpan);
            }
            observeFunction(itemCreateElementDiv);
            createElementDiv.appendChild(itemCreateElementDiv);
        }

        // bgColor js
        let bgColor = true;
        if(!bgColor){
            const bg_item_wrap = innerNumberDiv.querySelector('.bg-item-wrap');
            const bgCreateElementDiv = document.createElement('div');
            bgCreateElementDiv.classList.add('bg-number-item');
            bg_item_wrap.appendChild(bgCreateElementDiv);
        }
    });
});
function observeFunction(itemCreateElementDiv) {
    const verticalScrollNUm = document.querySelectorAll('.vertical-num-scroll');
    const options = { rootMargin: '0px', threshold: 1 };
    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => { animationFun(itemCreateElementDiv); }, 150);
            }
        })
    }, options);
    verticalScrollNUm.forEach(item => { observer.observe(item); });
}
function animationFun(animation_item) {
    let height = animation_item.querySelector('span').getBoundingClientRect().height;
    let currentIndex = Array.from(animation_item.querySelectorAll('.number')).findIndex((animation_span) =>
        animation_span.classList.contains('current')
    );

    let transformHeight = height * currentIndex + 'px';
    animation_item.style.transform = `translateY(-${transformHeight})`;
}