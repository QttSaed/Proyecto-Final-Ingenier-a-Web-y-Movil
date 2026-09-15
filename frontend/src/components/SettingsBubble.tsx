import React, { useState, useEffect } from 'react';
import { settingsOutline, closeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import './SettingsBubble.css';

const SettingsBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [currentTheme, setCurrentTheme] = useState('base');

  // Aplicar el tamaño de fuente al HTML
  useEffect(() => {
    document.documentElement.style.setProperty('--font-base-size', `${fontSize}px`);
  }, [fontSize]);

  // Aplicar el tema al HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const changeFontSize = (delta: number) => {
    setFontSize(prev => {
      const newSize = prev + delta;
      // Límites razonables para la fuente
      if (newSize < 12) return 12;
      if (newSize > 24) return 24;
      return newSize;
    });
  };

  const themes = [
    { id: 'base', name: 'Original', color: '#1b1642' },
    { id: 'fire', name: 'Fuego y Oro', color: '#d32f2f' },
    { id: 'forest', name: 'Bosque Mágico', color: '#2d5a36' },
    { id: 'dark', name: 'Modo Oscuro', color: '#0d0f17' },
  ];

  return (
    <div className="settings-bubble-container">
      {isOpen && (
        <div className="settings-menu">
          <div className="settings-section">
            <h4>Tamaño de Letra</h4>
            <div className="text-controls">
              <button className="text-btn" onClick={() => changeFontSize(-2)}>A-</button>
              <button className="text-btn" onClick={() => setFontSize(16)}>A</button>
              <button className="text-btn" onClick={() => changeFontSize(2)}>A+</button>
            </div>
          </div>

          <div className="settings-section">
            <h4>Temas Visuales</h4>
            <div className="theme-options">
              {themes.map(t => (
                <button 
                  key={t.id} 
                  className={`theme-btn ${currentTheme === t.id ? 'active' : ''}`}
                  onClick={() => setCurrentTheme(t.id)}
                >
                  <span className="theme-color-dot" style={{ backgroundColor: t.color }}></span>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button className="bubble-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <IonIcon icon={isOpen ? closeOutline : settingsOutline} />
      </button>
    </div>
  );
};

export default SettingsBubble;
