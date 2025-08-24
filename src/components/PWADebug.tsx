'use client'

import { useEffect, useState } from 'react'

export function PWADebug() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const checkPWACriteria = () => {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const isSecure = window.location.protocol === 'https:' || isLocalhost
      const hasManifest = document.querySelector('link[rel="manifest"]') !== null
      const hasServiceWorker = 'serviceWorker' in navigator
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInstalled = isStandalone
      
      const info = {
        // Basic PWA criteria
        isLocalhost,
        isSecure,
        hasManifest,
        hasServiceWorker,
        isStandalone,
        isInstalled,
        
        // Browser info
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        
        // PWA specific
        beforeInstallPrompt: 'beforeinstallprompt' in window,
        appInstalled: 'appinstalled' in window,
        
        // Manifest info
        manifestUrl: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
        manifestContent: null,
        
        // Service worker info
        serviceWorkerSupported: 'serviceWorker' in navigator,
        
        // Should show PWA button
        shouldShowPWAButton: isLocalhost || (isSecure && hasManifest && hasServiceWorker && !isInstalled)
      }

      // Try to fetch manifest content
      if (hasManifest) {
        fetch('/manifest.json')
          .then(response => response.json())
          .then(data => {
            info.manifestContent = data
            setDebugInfo(info)
          })
          .catch(() => {
            setDebugInfo(info)
          })
      } else {
        setDebugInfo(info)
      }
      
      // Log to console for debugging
      console.log('PWA Debug Info:', info)
    }

    checkPWACriteria()
    
    // Check again after a delay to ensure everything is loaded
    const timer = setTimeout(checkPWACriteria, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 left-4 bg-red-500 text-white p-2 rounded-lg text-xs z-50"
      >
        PWA Debug {showDebug ? 'ON' : 'OFF'}
      </button>
      
      {/* Debug panel */}
      {showDebug && (
        <div className="fixed bottom-16 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50 max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2 text-green-400">PWA Debug Info</h3>
          <div className="space-y-1">
            <div>Localhost: <span className={debugInfo.isLocalhost ? 'text-green-400' : 'text-red-400'}>{debugInfo.isLocalhost ? '✅' : '❌'}</span></div>
            <div>Secure: <span className={debugInfo.isSecure ? 'text-green-400' : 'text-red-400'}>{debugInfo.isSecure ? '✅' : '❌'}</span></div>
            <div>Manifest: <span className={debugInfo.hasManifest ? 'text-green-400' : 'text-red-400'}>{debugInfo.hasManifest ? '✅' : '❌'}</span></div>
            <div>Service Worker: <span className={debugInfo.hasServiceWorker ? 'text-green-400' : 'text-red-400'}>{debugInfo.hasServiceWorker ? '✅' : '❌'}</span></div>
            <div>Standalone: <span className={debugInfo.isStandalone ? 'text-green-400' : 'text-red-400'}>{debugInfo.isStandalone ? '✅' : '❌'}</span></div>
            <div>Before Install: <span className={debugInfo.beforeInstallPrompt ? 'text-green-400' : 'text-red-400'}>{debugInfo.beforeInstallPrompt ? '✅' : '❌'}</span></div>
            <div>App Installed: <span className={debugInfo.appInstalled ? 'text-green-400' : 'text-red-400'}>{debugInfo.appInstalled ? '✅' : '❌'}</span></div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <div className="font-bold text-yellow-400">Should Show PWA Button:</div>
              <div className={debugInfo.shouldShowPWAButton ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.shouldShowPWAButton ? '✅ YES' : '❌ NO'}
              </div>
            </div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <div>Hostname: {debugInfo.hostname}</div>
              <div>Protocol: {debugInfo.protocol}</div>
              <div>Manifest URL: {debugInfo.manifestUrl || 'Not found'}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
