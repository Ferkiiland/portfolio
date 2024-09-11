const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 0,
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
      dynamicBullets: true,
      dynamicMainBullets: 2,
    },
  
    // Navigation arrows
    navigation: {
      enabled: false,
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      enabled: false,
      el: '.swiper-scrollbar',
    },
    autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true,
    },
  });