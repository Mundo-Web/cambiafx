import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

const PWABanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detectar iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Verificar si ya está instalada como PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone || 
                            document.referrer.includes('android-app://');

        // No mostrar si ya está instalada
        if (isStandalone) return;

        // No mostrar en desktop
        if (!window.matchMedia('(max-width: 768px)').matches) return;

        // Verificar si ya fue dismissado
        const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
        const lastDismissed = localStorage.getItem('pwa-banner-last-dismissed');
        
        if (bannerDismissed) {
            // Si han pasado más de 3 días, mostrar otra vez
            if (lastDismissed) {
                const now = Date.now();
                const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
                if ((now - parseInt(lastDismissed)) > threeDaysInMs) {
                    setShowBanner(true);
                }
            }
            return;
        }

        // Para iOS, mostrar después de 2 segundos
        if (iOS) {
            setTimeout(() => {
                setShowBanner(true);
            }, 2000);
            return;
        }

        // Para Android/Chrome/Edge - escuchar beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            console.log('PWA Banner: beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => {
                setShowBanner(true);
            }, 3000); // Mostrar después de 3 segundos
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            // Para iOS, scroll hacia arriba para mostrar la barra del navegador
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!deferredPrompt) return;

        try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA Banner: User accepted the install prompt');
                handleDismiss();
            } else {
                console.log('PWA Banner: User dismissed the install prompt');
                handleDismiss();
            }
        } catch (error) {
            console.error('PWA Banner: Error during installation:', error);
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('pwa-banner-dismissed', 'true');
        localStorage.setItem('pwa-banner-last-dismissed', Date.now().toString());
    };

    if (!showBanner) return null;

    return (
        <div className="pwa-banner">
            <div className="pwa-banner-content">
                <div className="pwa-banner-icon">
                    <img src="/icon-192x192.png" alt="CambiaFX" />
                </div>
                <div className="pwa-banner-text">
                    <div className="pwa-banner-title">
                        Instalar CambiaFX
                    </div>
                    <div className="pwa-banner-subtitle">
                        {isIOS ? 'Añadir a pantalla de inicio' : 'Acceso rápido desde tu móvil'}
                    </div>
                </div>
                <div className="pwa-banner-actions">
                    <button 
                        className="pwa-banner-install"
                        onClick={handleInstall}
                    >
                        {isIOS ? (
                            <Smartphone size={18} />
                        ) : (
                            <Download size={18} />
                        )}
                        {isIOS ? 'Ver cómo' : 'Instalar'}
                    </button>
                    <button 
                        className="pwa-banner-close"
                        onClick={handleDismiss}
                        aria-label="Cerrar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <style>{`
                .pwa-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 9999;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    animation: slideDown 0.3s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .pwa-banner-content {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    max-width: 100%;
                    margin: 0 auto;
                }
                
                .pwa-banner-icon {
                    margin-right: 12px;
                    flex-shrink: 0;
                }
                
                .pwa-banner-icon img {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                }
                
                .pwa-banner-text {
                    flex: 1;
                    min-width: 0;
                }
                
                .pwa-banner-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .pwa-banner-subtitle {
                    font-size: 12px;
                    opacity: 0.9;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .pwa-banner-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-shrink: 0;
                }
                
                .pwa-banner-install {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    backdrop-filter: blur(10px);
                }
                
                .pwa-banner-install:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }
                
                .pwa-banner-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s;
                }
                
                .pwa-banner-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                @media (max-width: 380px) {
                    .pwa-banner-content {
                        padding: 10px 12px;
                    }
                    
                    .pwa-banner-icon img {
                        width: 36px;
                        height: 36px;
                    }
                    
                    .pwa-banner-title {
                        font-size: 13px;
                    }
                    
                    .pwa-banner-subtitle {
                        font-size: 11px;
                    }
                    
                    .pwa-banner-install {
                        padding: 6px 10px;
                        font-size: 11px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PWABanner;
