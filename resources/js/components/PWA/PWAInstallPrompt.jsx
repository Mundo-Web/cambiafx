import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Detectar iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Detectar si ya está instalada como PWA
        const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || 
                          document.referrer.includes('android-app://');
        setIsStandalone(standalone);

        // Escuchar el evento beforeinstallprompt (Chrome/Edge/Android)
        const handleBeforeInstallPrompt = (e) => {
            console.log('PWA: beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Verificar si debe mostrar el prompt
            const hasSeenPrompt = localStorage.getItem('pwa-install-dismissed');
            const lastDismissed = localStorage.getItem('pwa-install-last-dismissed');
            const now = Date.now();
            const dayInMs = 24 * 60 * 60 * 1000;
            
            // Solo mostrar si no ha visto el prompt o han pasado más de 7 días
            if (!hasSeenPrompt || (lastDismissed && (now - parseInt(lastDismissed)) > (7 * dayInMs))) {
                setShowInstallPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Para iOS, mostrar instrucciones manuales
        if (iOS && !standalone) {
            const hasSeenIOSPrompt = localStorage.getItem('pwa-ios-install-dismissed');
            const lastIOSDismissed = localStorage.getItem('pwa-ios-install-last-dismissed');
            const now = Date.now();
            const dayInMs = 24 * 60 * 60 * 1000;
            
            if (!hasSeenIOSPrompt || (lastIOSDismissed && (now - parseInt(lastIOSDismissed)) > (7 * dayInMs))) {
                setTimeout(() => {
                    setShowInstallPrompt(true);
                }, 3000); // Mostrar después de 3 segundos
            }
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt && !isIOS) return;

        if (isIOS) {
            // Para iOS, no podemos triggear la instalación automáticamente
            // Solo mostramos las instrucciones
            return;
        }

        // Para Android/Chrome/Edge
        try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA: User accepted the install prompt');
                setShowInstallPrompt(false);
                localStorage.setItem('pwa-install-accepted', Date.now().toString());
            } else {
                console.log('PWA: User dismissed the install prompt');
                handleDismiss();
            }
            
            setDeferredPrompt(null);
        } catch (error) {
            console.error('PWA: Error during installation:', error);
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        const now = Date.now().toString();
        
        if (isIOS) {
            localStorage.setItem('pwa-ios-install-dismissed', 'true');
            localStorage.setItem('pwa-ios-install-last-dismissed', now);
        } else {
            localStorage.setItem('pwa-install-dismissed', 'true');
            localStorage.setItem('pwa-install-last-dismissed', now);
        }
    };

    // No mostrar si ya está instalada o en desktop
    if (isStandalone || (!isIOS && !deferredPrompt && !showInstallPrompt)) {
        return null;
    }

    // No mostrar en desktop (solo móvil)
    if (!window.matchMedia('(max-width: 768px)').matches) {
        return null;
    }

    if (!showInstallPrompt) return null;

    return (
        <div className="pwa-install-prompt">
            <div className="pwa-install-overlay" onClick={handleDismiss}></div>
            <div className="pwa-install-modal">
                <div className="pwa-install-header">
                    <div className="pwa-install-icon">
                        <img src="/icon-192x192.png" alt="CambiaFX" />
                    </div>
                    <div className="pwa-install-title">
                        <h3>Instalar CambiaFX</h3>
                        <p>Accede más rápido desde tu pantalla de inicio</p>
                    </div>
                    <button 
                        className="pwa-install-close" 
                        onClick={handleDismiss}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </div>
                
                <div className="pwa-install-content">
                    {isIOS ? (
                        <div className="pwa-ios-instructions">
                            <p>Para instalar esta app en tu iPhone:</p>
                            <ol>
                                <li>
                                    <span className="ios-icon">⬆️</span>
                                    Toca el botón de compartir
                                </li>
                                <li>
                                    <span className="ios-icon">➕</span>
                                    Selecciona "Añadir a pantalla de inicio"
                                </li>
                                <li>
                                    <span className="ios-icon">✅</span>
                                    Toca "Añadir" para confirmar
                                </li>
                            </ol>
                        </div>
                    ) : (
                        <div className="pwa-benefits">
                            <ul>
                                <li>✅ Acceso rápido desde tu pantalla de inicio</li>
                                <li>✅ Funciona sin conexión</li>
                                <li>✅ Experiencia como app nativa</li>
                                <li>✅ Notificaciones push</li>
                            </ul>
                        </div>
                    )}
                </div>
                
                <div className="pwa-install-actions">
                    {!isIOS && (
                        <button 
                            className="pwa-install-btn primary"
                            onClick={handleInstallClick}
                        >
                            Instalar App
                        </button>
                    )}
                    <button 
                        className="pwa-install-btn secondary"
                        onClick={handleDismiss}
                    >
                        {isIOS ? 'Entendido' : 'Ahora no'}
                    </button>
                </div>
            </div>
            
            <style>{`
                .pwa-install-prompt {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 20px;
                }
                
                .pwa-install-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                
                .pwa-install-modal {
                    position: relative;
                    background: white;
                    border-radius: 16px 16px 0 0;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
                    animation: slideUp 0.3s ease-out;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .pwa-install-header {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .pwa-install-icon img {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    margin-right: 16px;
                }
                
                .pwa-install-title {
                    flex: 1;
                }
                
                .pwa-install-title h3 {
                    margin: 0 0 4px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }
                
                .pwa-install-title p {
                    margin: 0;
                    font-size: 14px;
                    color: #666;
                }
                
                .pwa-install-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #999;
                    cursor: pointer;
                    padding: 4px;
                    line-height: 1;
                }
                
                .pwa-install-content {
                    padding: 20px;
                }
                
                .pwa-ios-instructions ol {
                    margin: 0;
                    padding-left: 0;
                    list-style: none;
                }
                
                .pwa-ios-instructions li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #333;
                }
                
                .ios-icon {
                    margin-right: 12px;
                    font-size: 20px;
                    width: 24px;
                    text-align: center;
                }
                
                .pwa-benefits ul {
                    margin: 0;
                    padding-left: 0;
                    list-style: none;
                }
                
                .pwa-benefits li {
                    margin-bottom: 8px;
                    font-size: 14px;
                    color: #333;
                }
                
                .pwa-install-actions {
                    padding: 20px;
                    border-top: 1px solid #f0f0f0;
                    display: flex;
                    gap: 12px;
                }
                
                .pwa-install-btn {
                    flex: 1;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .pwa-install-btn.primary {
                    background: #007bff;
                    color: white;
                    border: none;
                }
                
                .pwa-install-btn.primary:hover {
                    background: #0056b3;
                }
                
                .pwa-install-btn.secondary {
                    background: #f8f9fa;
                    color: #666;
                    border: 1px solid #dee2e6;
                }
                
                .pwa-install-btn.secondary:hover {
                    background: #e9ecef;
                }
                
                @media (max-width: 480px) {
                    .pwa-install-prompt {
                        padding: 0;
                    }
                    
                    .pwa-install-modal {
                        border-radius: 0;
                        max-width: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default PWAInstallPrompt;
