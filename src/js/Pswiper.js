const swiper = new Swiper('.Pswiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true,
    },
    effect: 'fade',
    fadeEffect: {
    crossFade: true
    },
});