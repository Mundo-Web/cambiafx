import React, { useState, useEffect } from 'react';
import { Smartphone, Download, ExternalLink } from 'lucide-react';

const AppStoreLinks = ({ apps = [] }) => {
    const [deviceInfo, setDeviceInfo] = useState({
        isAndroid: false,
        isIOS: false,
        isHuawei: false,
        isMobile: false,
        showAppLinks: false
    });

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Detectar sistemas operativos
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isHuawei = /huawei|honor/i.test(userAgent) || /harmony/i.test(userAgent);
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        // Verificar si ya está instalada como PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone || 
                            document.referrer.includes('android-app://');

        // Solo mostrar si es móvil y no está instalada como PWA
        const showAppLinks = isMobile && !isStandalone && (isAndroid || isIOS || isHuawei);
        
        setDeviceInfo({
            isAndroid,
            isIOS,
            isHuawei,
            isMobile,
            showAppLinks
        });
    }, []);

    // Filtrar apps por tipo de dispositivo
    const getAppForDevice = () => {
        if (!apps || apps.length === 0) return null;

        // Buscar por nombre de la app (Google Play, App Store, etc.)
        if (deviceInfo.isAndroid) {
            return apps.find(app => 
                app.name?.toLowerCase().includes('google play') ||
                app.name?.toLowerCase().includes('android') ||
                app.name?.toLowerCase().includes('play store')
            );
        }
        
        if (deviceInfo.isIOS) {
            return apps.find(app => 
                app.name?.toLowerCase().includes('app store') ||
                app.name?.toLowerCase().includes('ios') ||
                app.name?.toLowerCase().includes('apple')
            );
        }
        
        if (deviceInfo.isHuawei) {
            return apps.find(app => 
                app.name?.toLowerCase().includes('app gallery') ||
                app.name?.toLowerCase().includes('huawei') ||
                app.name?.toLowerCase().includes('harmony')
            );
        }

        return null;
    };

    const currentApp = getAppForDevice();

    // No mostrar si no hay apps o no es dispositivo móvil
    if (!deviceInfo.showAppLinks || !currentApp) {
        return null;
    }

    const getStoreName = () => {
        if (deviceInfo.isAndroid) return 'Google Play';
        if (deviceInfo.isIOS) return 'App Store';
        if (deviceInfo.isHuawei) return 'AppGallery';
        return 'Tienda de Apps';
    };

    const getStoreIcon = () => {
        if (deviceInfo.isAndroid) return '📱';
        if (deviceInfo.isIOS) return '🍎';
        if (deviceInfo.isHuawei) return '📲';
        return '📱';
    };

    return (
        <div className="app-store-banner">
            <div className="app-store-content">
                <div className="app-store-icon">
                    {currentApp.image ? (
                        <img src={`/api/cover/thumbnail/${currentApp.image}`} alt={currentApp.name} />
                    ) : (
                        <div className="default-icon">
                            <Smartphone size={32} />
                        </div>
                    )}
                </div>
                
                <div className="app-store-text">
                    <div className="app-store-title">
                        Descarga CambiaFX
                    </div>
                    <div className="app-store-subtitle">
                        {getStoreIcon()} Disponible en {getStoreName()}
                    </div>
                </div>
                
                <div className="app-store-action">
                    <a 
                        href={currentApp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-store-button"
                    >
                        <Download size={18} />
                        Descargar
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            <style>{`
                .app-store-banner {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9998;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    animation: slideUp 0.3s ease-out;
                    max-width: 300px;
                    width: auto;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .app-store-content {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    gap: 12px;
                }
                
                .app-store-icon img {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    object-fit: cover;
                }
                
                .default-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .app-store-text {
                    flex: 1;
                    min-width: 0;
                }
                
                .app-store-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .app-store-subtitle {
                    font-size: 13px;
                    opacity: 0.9;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .app-store-action {
                    flex-shrink: 0;
                }
                
                .app-store-button {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 10px 16px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                    backdrop-filter: blur(10px);
                }
                
                .app-store-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                    color: white;
                    text-decoration: none;
                }
                
                @media (max-width: 480px) {
                    .app-store-banner {
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                    }
                    
                    .app-store-content {
                        padding: 12px;
                    }
                    
                    .app-store-icon img,
                    .default-icon {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .app-store-title {
                        font-size: 15px;
                    }
                    
                    .app-store-subtitle {
                        font-size: 12px;
                    }
                    
                    .app-store-button {
                        padding: 8px 12px;
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AppStoreLinks;
