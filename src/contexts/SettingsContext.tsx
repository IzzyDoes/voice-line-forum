
import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface SettingsContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  textToSpeech: boolean;
  toggleTextToSpeech: () => void;
  speakText: (text: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) 
      ? 'dark' 
      : 'light';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    return (savedFontSize as FontSize) || 'medium';
  });

  const [textToSpeech, setTextToSpeech] = useState<boolean>(() => {
    const savedTextToSpeech = localStorage.getItem('textToSpeech');
    return savedTextToSpeech === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('textToSpeech', textToSpeech.toString());
  }, [textToSpeech]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleTextToSpeech = () => {
    setTextToSpeech(prev => !prev);
  };

  const speakText = (text: string) => {
    if (textToSpeech && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      toggleTheme,
      fontSize,
      setFontSize,
      textToSpeech,
      toggleTextToSpeech,
      speakText
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
