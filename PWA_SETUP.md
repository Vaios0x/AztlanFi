# Configuración PWA para AztlanFi

## Problema Actual
La PWA no está mostrando el prompt de instalación automática como en otras dApps.

## Solución

### 1. Crear Iconos PNG Reales
Los archivos `public/icon-192.png` y `public/icon-512.png` son placeholders. Necesitas crear iconos PNG reales:

**Requisitos:**
- `icon-192.png`: 192x192 píxeles
- `icon-512.png`: 512x512 píxeles
- Formato: PNG
- Fondo: Gradiente azul (#3b82f6) a púrpura (#9333ea)
- Texto: "AF" en blanco, centrado

**Herramientas recomendadas:**
- Figma
- Adobe Illustrator
- Canva
- O cualquier editor de imágenes

### 2. Verificar Configuración
El manifiesto PWA ya está configurado correctamente en `public/manifest.json`.

### 3. Service Worker
El service worker está configurado en `public/sw.js` y se registra automáticamente.

### 4. Debug
En desarrollo, verás un panel de debug en la esquina inferior derecha que muestra:
- ✅ Secure: Debe ser verde (HTTPS o localhost)
- ✅ Manifest: Debe ser verde
- ✅ Service Worker: Debe ser verde
- ❌ Standalone: Debe ser rojo (no está instalado)
- ✅ Before Install: Debe ser verde
- ✅ App Installed: Debe ser verde

### 5. Probar la PWA
1. Abre la consola del navegador (F12)
2. Busca los logs de "PWA Debug Info"
3. Haz clic en el botón "PWA" en el navbar
4. Debería aparecer el prompt de instalación

### 6. Si no funciona
1. Verifica que los iconos PNG existen y son válidos
2. Asegúrate de estar en HTTPS o localhost
3. Limpia la caché del navegador
4. Revisa la consola para errores

## Comandos útiles
```bash
# Verificar que los archivos existen
ls -la public/icon-*.png

# Reiniciar el servidor de desarrollo
npm run dev
```

## Notas
- El prompt de instalación solo aparece si se cumplen todos los criterios PWA
- En desarrollo, el botón PWA siempre está visible para testing
- En producción, solo aparece cuando la PWA puede ser instalada
