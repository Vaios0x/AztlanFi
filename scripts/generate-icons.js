const fs = require('fs');
const path = require('path');

// Crear un icono SVG simple para AztlanFi
const svgIcon = `
<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="24" fill="url(#gradient)"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="96" y="96" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">A</text>
  <text x="96" y="120" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="16">AztlanFi</text>
</svg>
`;

// Función para crear un PNG simple (simulado)
function createSimplePNG(size) {
  // En un entorno real, usarías una librería como sharp o canvas
  // Por ahora, creamos un archivo de placeholder
  const pngContent = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    // ... resto del PNG (simplificado)
  ]);
  
  return pngContent;
}

// Crear iconos
const iconSizes = [192, 512];

iconSizes.forEach(size => {
  // Crear SVG
  const svgPath = path.join(__dirname, '..', 'public', `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svgIcon.replace(/width="192" height="192"/g, `width="${size}" height="${size}"`));
  
  // Crear PNG placeholder
  const pngPath = path.join(__dirname, '..', 'public', `icon-${size}.png`);
  const pngContent = createSimplePNG(size);
  fs.writeFileSync(pngPath, pngContent);
  
  console.log(`✅ Icono ${size}x${size} creado`);
});

// Crear favicon
const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(faviconPath, createSimplePNG(32));
console.log('✅ Favicon creado');

console.log('🎉 Todos los iconos han sido generados en /public/');
