console.log("🚀 Inicializando tsParticles en About...");

setTimeout(() => {
  tsParticles.load("tsparticles", {
    preset: "stars",
    background: {
      color: "transparent",
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.3,
          sync: false
        }
      },
      size: {
        value: 2.5,
        random: true,
        anim: {
          enable: true,
          speed: 3,
          size_min: 0.5,
          sync: false
        }
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: "#ffffff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "bounce",
        bounce: true
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      }
    },
    retina_detect: true
  }).then(container => {
    console.log("✅ tsParticles cargado correctamente en About");
    
    const canvas = container.canvas.element;
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.transform = 'none';
      
      container.canvas.resize();
      
      console.log("🎯 Canvas configurado. Dimensiones:", canvas.width, "x", canvas.height);
    }
    
    setTimeout(() => {
      if (container && container.canvas) {
        container.canvas.resize();
        console.log("🔄 Canvas redimensionado después de delay");
      }
    }, 100);
  }).catch(error => {
    console.error("❌ Error cargando tsParticles:", error);
  });
}, 500);

window.addEventListener('resize', function() {
  const container = tsParticles.domItem(0);
  if (container && container.canvas) {
    setTimeout(() => {
      container.canvas.resize();
      console.log("📏 Canvas redimensionado por resize");
    }, 100);
  }
  
  setTimeout(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar.classList.contains('visible')) {
      navbar.style.left = '50%';
      navbar.style.transform = 'translateX(-50%) translateY(0)';
    }
  }, 50);
});

window.setParticleCount = function(count) {
  const container = tsParticles.domItem(0);
  if (container) {
    container.options.particles.number.value = count;
    container.refresh();
    console.log(`✨ Partículas ajustadas a: ${count}`);
  }
};

window.setParticleSpeed = function(speed) {
  const container = tsParticles.domItem(0);
  if (container) {
    container.options.particles.move.speed = speed;
    container.refresh();
    console.log(`⚡ Velocidad ajustada a: ${speed}`);
  }
};

console.log("%c✨ CONTROLES DISPONIBLES ✨", "color: #5865f2; font-size: 14px; font-weight: bold;");
console.log("Usa estos comandos en la consola:");
console.log("- window.debugLayout()");
console.log("- window.verifyPositions()");
console.log("- window.setParticleCount(120)");
console.log("- window.setParticleSpeed(1.5)");
console.log("- window.resetAnimations()");