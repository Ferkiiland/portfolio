// parallax.js - VERSIÓN CON LÍMITES ESTABLECIDOS

let mouseX = 0;
let mouseY = 0;
let parallaxStrength = 6; // Fuerza base
let titleParallaxStrength = 6;
let parallaxEnabled = false;

const body = document.body;
const navbar = document.querySelector('.navbar');
const titleContainer = document.querySelector('.title-container');

// Variables para calcular límites dinámicos
let maxBgMoveX = 5;
let maxBgMoveY = 5;

// Calcular límites máximos basados en el tamaño de la imagen
function calculateMaxBackgroundMovement() {
    const computedStyle = getComputedStyle(body);
    const bgSize = computedStyle.backgroundSize;
    
    // Extraer porcentaje de background-size (ej: "130% 130%")
    let bgWidthPercent, bgHeightPercent;
    
    if (bgSize.includes('%')) {
        const sizes = bgSize.split(' ');
        bgWidthPercent = parseInt(sizes[0]) || 130;
        bgHeightPercent = parseInt(sizes[1]) || 130;
    } else {
        // Valores por defecto si no se pueden obtener
        bgWidthPercent = 101;
        bgHeightPercent = 105;
    }
    
    // Calcular cuánto se puede mover sin mostrar bordes
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Imagen más grande que viewport: (bgWidth - viewport) / 2
    const imageWidth = (bgWidthPercent / 100) * viewportWidth;
    const imageHeight = (bgHeightPercent / 100) * viewportHeight;
    
    // Máximo movimiento posible antes de mostrar bordes
    maxBgMoveX = (imageWidth - viewportWidth) / 2;
    maxBgMoveY = (imageHeight - viewportHeight) / 2;
    
    console.log(`📐 Límites calculados: X: ±${maxBgMoveX.toFixed(1)}px, Y: ±${maxBgMoveY.toFixed(1)}px`);
    console.log(`📐 Viewport: ${viewportWidth}x${viewportHeight}, Imagen: ${imageWidth.toFixed(0)}x${imageHeight.toFixed(0)}`);
    
    return { maxBgMoveX, maxBgMoveY };
}

// Función para aplicar movimiento con límites estrictos
function applyBoundedMovement(xPercent, yPercent, strength, maxX, maxY) {
    // Calcular movimiento deseado
    let moveX = (xPercent - 0.5) * strength * 2; // Multiplicado para mayor sensibilidad
    let moveY = (yPercent - 0.5) * strength * 2;
    
    // Aplicar límites
    moveX = Math.max(Math.min(moveX, maxX), -maxX);
    moveY = Math.max(Math.min(moveY, maxY), -maxY);
    
    return { moveX, moveY };
}

// Sólo activar parallax después de que las animaciones de entrada hayan terminado
setTimeout(() => {
    parallaxEnabled = true;
    
    // Calcular límites iniciales
    calculateMaxBackgroundMovement();
    
    console.log("🌀 Parallax activado con límites dinámicos");
    console.log("📍 El fondo se detendrá antes de mostrar bordes blancos");
}, 1200);

// Throttling para mejor rendimiento
let isAnimating = false;
let lastTimestamp = 0;

document.addEventListener('mousemove', (e) => {
    if (!parallaxEnabled || isAnimating) return;
    
    const now = Date.now();
    if (now - lastTimestamp < 16) return; // ~60fps
    
    lastTimestamp = now;
    isAnimating = true;
    
    requestAnimationFrame(() => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const xPercent = mouseX / window.innerWidth;
        const yPercent = mouseY / window.innerHeight;
        
        // 1. Parallax del fondo con límites calculados dinámicamente
        const bgMovement = applyBoundedMovement(xPercent, yPercent, parallaxStrength, maxBgMoveX, maxBgMoveY);
        
        // Aplicar con transición suave
        body.style.transition = 'background-position 0.1s ease-out';
        body.style.backgroundPosition = `calc(50% + ${bgMovement.moveX}px) calc(50% + ${bgMovement.moveY}px)`;
        
        // 2. Parallax del navbar - MUY sutil
        const navStrength = parallaxStrength * 0.05;
        const navMaxX = 8; // Límite muy pequeño
        const navMaxY = 4;
        const navMovement = applyBoundedMovement(xPercent, yPercent, navStrength, navMaxX, navMaxY);
        
        navbar.style.transition = 'transform 0.1s ease-out';
        navbar.style.transform = `translateX(calc(-50% + ${navMovement.moveX}px)) translateY(${navMovement.moveY}px)`;
        
        // 3. Parallax del título
        const titleMovement = applyBoundedMovement(xPercent, yPercent, titleParallaxStrength, 15, 10);
        
        titleContainer.style.transition = 'transform 0.1s ease-out';
        titleContainer.style.transform = `translate(${titleMovement.moveX}px, ${titleMovement.moveY}px)`;
        
        isAnimating = false;
    });
}, { passive: true });

// Resetear cuando el mouse sale
document.addEventListener('mouseleave', () => {
    if (!parallaxEnabled) return;
    
    // Resetear a posición central con animación suave
    body.style.transition = 'background-position 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    navbar.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    titleContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    body.style.backgroundPosition = 'center center';
    navbar.style.transform = 'translateX(-50%) translateY(0)';
    titleContainer.style.transform = 'translate(0, 0)';
    
    setTimeout(() => {
        body.style.transition = '';
        navbar.style.transition = '';
        titleContainer.style.transition = '';
    }, 500);
});

// Recalcular límites al cambiar tamaño de ventana
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        calculateMaxBackgroundMovement();
        
        // Resetear posición si parallax está activo
        if (parallaxEnabled) {
            body.style.backgroundPosition = 'center center';
            navbar.style.transform = 'translateX(-50%) translateY(0)';
            titleContainer.style.transform = 'translate(0, 0)';
        }
    }, 250);
});

// Ajustar límites dinámicamente según el tamaño de la pantalla
function updateParallaxForScreenSize() {
    const width = window.innerWidth;
    
    if (width < 768) {
        parallaxStrength = 8; // Menor fuerza en móviles
        titleParallaxStrength = 0.6;
    } else {
        parallaxStrength = 15; // Fuerza normal en desktop
        titleParallaxStrength = 1;
    }
    
    // Recalcular límites con nueva fuerza
    calculateMaxBackgroundMovement();
    
    console.log(`📱 Parallax ajustado para ${width}px: fuerza=${parallaxStrength}`);
}

// Inicializar ajustes
updateParallaxForScreenSize();

// Función para forzar recalculo de límites
window.recalculateParallaxLimits = function() {
    calculateMaxBackgroundMovement();
    console.log("🔄 Límites de parallax recalculados");
    return { maxBgMoveX, maxBgMoveY };
};

// Función para ajustar parámetros del parallax
window.adjustParallax = function(strength = 15, titleStrength = 1) {
    parallaxStrength = Math.min(Math.max(strength, 5), 25);
    titleParallaxStrength = Math.min(Math.max(titleStrength, 0.3), 1.5);
    
    // Recalcular límites con nueva fuerza
    calculateMaxBackgroundMovement();
    
    console.log(`🎛️ Parallax ajustado: fondo=${parallaxStrength}, título=${titleParallaxStrength}`);
    console.log(`📏 Límites actuales: X: ±${maxBgMoveX.toFixed(1)}px, Y: ±${maxBgMoveY.toFixed(1)}px`);
    
    return { parallaxStrength, titleParallaxStrength, maxBgMoveX, maxBgMoveY };
};

// Debug helper mejorado
window.debugParallax = function() {
    console.log("🔧 DEBUG PARALLAX DETALLADO:");
    console.log(`Fuerza fondo: ${parallaxStrength}`);
    console.log(`Fuerza título: ${titleParallaxStrength}`);
    console.log(`Límites movimiento: X: ±${maxBgMoveX.toFixed(1)}px, Y: ±${maxBgMoveY.toFixed(1)}px`);
    
    const bgPos = getComputedStyle(body).backgroundPosition;
    const bgSize = getComputedStyle(body).backgroundSize;
    console.log(`Background position: ${bgPos}`);
    console.log(`Background size: ${bgSize}`);
    
    // Calcular posición actual relativa
    const bgPosValues = bgPos.split(' ');
    if (bgPosValues.length >= 2) {
        const xPos = bgPosValues[0];
        const yPos = bgPosValues[1];
        
        // Intentar extraer valores numéricos
        const xMatch = xPos.match(/(-?\d+(\.\d+)?)/);
        const yMatch = yPos.match(/(-?\d+(\.\d+)?)/);
        
        if (xMatch && yMatch) {
            const currentX = parseFloat(xMatch[0]);
            const currentY = parseFloat(yMatch[0]);
            const percentX = (currentX / maxBgMoveX * 100).toFixed(1);
            const percentY = (currentY / maxBgMoveY * 100).toFixed(1);
            
            console.log(`Posición actual: X: ${currentX}px (${percentX}% del límite), Y: ${currentY}px (${percentY}% del límite)`);
        }
    }
    
    console.log(`Título transform: ${getComputedStyle(titleContainer).transform}`);
    console.log(`Navbar transform: ${getComputedStyle(navbar).transform}`);
};

// Función para probar límites extremos
window.testParallaxLimits = function() {
    if (!parallaxEnabled) {
        console.log("⚠️ Parallax no está activado aún");
        return;
    }
    
    console.log("🧪 Probando límites del parallax...");
    
    // Test esquina superior izquierda
    simulateMousePosition(0, 0);
    setTimeout(() => {
        console.log("↖️ Esquina superior izquierda");
        window.debugParallax();
    }, 100);
    
    // Test esquina superior derecha
    setTimeout(() => {
        simulateMousePosition(window.innerWidth, 0);
        console.log("↗️ Esquina superior derecha");
        window.debugParallax();
    }, 300);
    
    // Test esquina inferior izquierda
    setTimeout(() => {
        simulateMousePosition(0, window.innerHeight);
        console.log("↙️ Esquina inferior izquierda");
        window.debugParallax();
    }, 500);
    
    // Test esquina inferior derecha
    setTimeout(() => {
        simulateMousePosition(window.innerWidth, window.innerHeight);
        console.log("↘️ Esquina inferior derecha");
        window.debugParallax();
    }, 700);
    
    // Volver al centro
    setTimeout(() => {
        simulateMousePosition(window.innerWidth / 2, window.innerHeight / 2);
        console.log("🎯 Regresando al centro");
    }, 900);
};

// Función auxiliar para simular posición del mouse
function simulateMousePosition(x, y) {
    const event = new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        bubbles: true
    });
    document.dispatchEvent(event);
}

console.log("%c🌀 PARALLAX CON LÍMITES ESTABLECIDOS", "color: #5865f2; font-size: 14px; font-weight: bold;");
console.log("📍 El fondo se detendrá automáticamente antes de mostrar bordes");
console.log("\n📋 Comandos disponibles:");
console.log("- window.adjustParallax(12, 0.8) // Ajustar fuerza");
console.log("- window.debugParallax() // Ver estado actual");
console.log("- window.recalculateParallaxLimits() // Recalcular límites");
console.log("- window.testParallaxLimits() // Probar límites extremos");