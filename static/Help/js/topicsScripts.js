if(localStorage.getItem('lang') == 'fa'){
    let elements = document.querySelectorAll(".left-frame-topic");
    elements.forEach(el => {
        el.classList.remove('left-frame-topic');
        el.classList.add('right-frame-topic');
    });
}else{
    const elements = document.querySelectorAll(".right-frame-topic");
    elements.forEach(el => {
        el.classList.remove('right-frame-topic');
        el.classList.add('left-frame-topic');
    });
}