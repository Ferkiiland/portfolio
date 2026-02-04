document.addEventListener('DOMContentLoaded', function() {
  console.log("🎨 Asegurando posición correcta del fondo...");
  
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
  
  document.body.offsetHeight;
});

window.addEventListener('load', function() {
  console.log("🎬 Iniciando animaciones de entrada...");
  
  document.body.offsetHeight;
  
  setTimeout(() => {
    document.body.style.backgroundPosition = 'center center';
    document.body.classList.add('visible');
    
    setTimeout(() => {
      const navbar = document.querySelector('.navbar');
      navbar.classList.add('visible');
      
      navbar.style.left = '50%';
      navbar.style.transform = 'translateX(-50%) translateY(0)';
      
      console.log("📍 Navbar posicionada correctamente");
    }, 150);
    
    setTimeout(() => {
      document.querySelector('.title-container').classList.add('visible');
    }, 350);
    
    setTimeout(() => {
      document.querySelector('.active-orders-badge').classList.add('visible');
    }, 300);
    
    setTimeout(() => {
      document.querySelector('.T2026').classList.add('visible');
    }, 300);
    
    console.log("✅ Animaciones de entrada completadas");
    
    setTimeout(() => {
      window.verifyPositions();
    }, 1000);
    
  }, 100);
});

window.verifyPositions = function() {
  console.log("🔍 Verificando posiciones...");
  
  const navbar = document.querySelector('.navbar');
  const navbarRect = navbar.getBoundingClientRect();
  const viewportCenter = window.innerWidth / 2;
  const navbarCenter = navbarRect.left + (navbarRect.width / 2);
  const offset = Math.abs(viewportCenter - navbarCenter);
  
  console.log(`📍 Navbar offset from center: ${offset.toFixed(2)}px`);
  
  if (offset > 5) {
    console.log("⚠️ Corrigiendo posición de navbar...");
    navbar.style.left = '50%';
    navbar.style.transform = 'translateX(-50%) translateY(0)';
  }
  
  const bgPosition = getComputedStyle(document.body).backgroundPosition;
  console.log(`🎨 Posición del fondo: ${bgPosition}`);
};

window.debugLayout = function() {
  console.log("🔍 DEBUG LAYOUT:");
  console.log("Navbar position:", getComputedStyle(document.querySelector('.navbar')).left);
  console.log("Navbar transform:", getComputedStyle(document.querySelector('.navbar')).transform);
  console.log("Body background:", getComputedStyle(document.body).backgroundPosition);
  console.log("Title transform:", getComputedStyle(document.querySelector('.title-container')).transform);
  
  document.querySelector('.navbar').style.outline = '2px solid red';
  document.querySelector('main').style.outline = '2px solid blue';
  
  setTimeout(() => {
    document.querySelector('.navbar').style.outline = 'none';
    document.querySelector('main').style.outline = 'none';
  }, 3000);
};

window.resetAnimations = function() {
  console.log("🔄 Reiniciando animaciones...");
  
  document.body.classList.remove('visible');
  document.querySelector('.navbar').classList.remove('visible');
  document.querySelector('.title-container').classList.remove('visible');
  document.querySelector('.active-orders-badge').classList.remove('visible');
  document.querySelector('.T2026').classList.remove('visible');
  
  document.body.style.backgroundPosition = 'center center';
  document.querySelector('.navbar').style.transform = 'translateX(-50%) translateY(-100%)';
  document.querySelector('.navbar').style.left = '50%';
  
  setTimeout(() => {
    document.body.style.backgroundPosition = 'center center';
    document.body.classList.add('visible');
    
    setTimeout(() => {
      const navbar = document.querySelector('.navbar');
      navbar.classList.add('visible');
      navbar.style.left = '50%';
      navbar.style.transform = 'translateX(-50%) translateY(0)';
    }, 150);
    
    setTimeout(() => {
      document.querySelector('.title-container').classList.add('visible');
    }, 350);
    
    setTimeout(() => {
      document.querySelector('.active-orders-badge').classList.add('visible');
    }, 550);
    
    setTimeout(() => {
      document.querySelector('.T2026').classList.add('visible');
    }, 750);
  }, 100);
};