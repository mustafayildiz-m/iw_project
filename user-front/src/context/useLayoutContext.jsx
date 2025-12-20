import { createContext, use, useMemo, useState, useCallback } from 'react';
import { toggleDocumentAttribute } from '@/utils/layout';
const LayoutContext = createContext(undefined);
function useLayoutContext() {
  const context = use(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within an LayoutProvider');
  }
  return context;
}
const storageThemeKey = 'SOCIAL_NEXTJS_THEME_KEY';
const themeAttributeKey = 'data-bs-theme';
const LayoutProvider = ({
  children
}) => {
  const getSavedTheme = () => {
    const foundTheme = localStorage.getItem(storageThemeKey);
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (foundTheme) {
      if (foundTheme === 'auto') {
        toggleDocumentAttribute(themeAttributeKey, preferredTheme);
        return preferredTheme;
      }
      toggleDocumentAttribute(themeAttributeKey, foundTheme);
      return foundTheme;
    }
    if (!foundTheme) localStorage.setItem(storageThemeKey, preferredTheme);
    return preferredTheme;
  };
  const INIT_STATE = {
    theme: getSavedTheme()
  };
  const [settings, setSettings] = useState(INIT_STATE);
  const [offcanvasStates, setOffcanvasStates] = useState({
    showMobileMenu: false,
    showMessagingOffcanvas: false,
    showStartOffcanvas: false,
    showConversationPanel: false
  });
  const updateSettings = _newSettings => setSettings({
    ...settings,
    ..._newSettings
  });
  const updateTheme = newTheme => {
    const foundTheme = localStorage.getItem(themeAttributeKey);
    if (foundTheme !== newTheme) {
      toggleDocumentAttribute(themeAttributeKey, newTheme);
      localStorage.setItem(storageThemeKey, newTheme);
      updateSettings({
        ...settings,
        theme: newTheme
      });
    }
  };

  const resetTheme = useCallback(() => {
    const defaultTheme = 'light';
    toggleDocumentAttribute(themeAttributeKey, defaultTheme);
    localStorage.setItem(storageThemeKey, defaultTheme);
    setSettings(prev => ({
      ...prev,
      theme: defaultTheme
    }));
  }, []);
  const toggleMessagingOffcanvas = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showMessagingOffcanvas: !offcanvasStates.showMessagingOffcanvas
    });
  };
  const toggleMobileMenu = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showMobileMenu: !offcanvasStates.showMobileMenu
    });
  };
  const toggleStartOffcanvas = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showStartOffcanvas: !offcanvasStates.showStartOffcanvas
    });
  };
  const toggleConversationPanel = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showConversationPanel: !offcanvasStates.showConversationPanel
    });
  };
  const messagingOffcanvas = {
    open: offcanvasStates.showMessagingOffcanvas,
    toggle: toggleMessagingOffcanvas
  };
  const mobileMenu = {
    open: offcanvasStates.showMobileMenu,
    toggle: toggleMobileMenu
  };
  const startOffcanvas = {
    open: offcanvasStates.showStartOffcanvas,
    toggle: toggleStartOffcanvas
  };
  const conversationPanel = {
    open: offcanvasStates.showConversationPanel,
    toggle: toggleConversationPanel
  };
  
  const contextValue = useMemo(() => ({
    ...settings,
    updateTheme,
    resetTheme,
    messagingOffcanvas,
    mobileMenu,
    startOffcanvas,
    conversationPanel
  }), [
    settings, 
    offcanvasStates.showMessagingOffcanvas,
    offcanvasStates.showMobileMenu,
    offcanvasStates.showStartOffcanvas,
    offcanvasStates.showConversationPanel,
    messagingOffcanvas,
    mobileMenu,
    startOffcanvas,
    conversationPanel,
    updateTheme
  ]);
  
  return <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>;
};
export { LayoutProvider, useLayoutContext };