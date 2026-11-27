export type Theme = 'light' | 'dark';

// The site has always been dark, so that stays the default for anyone who has not picked.
export const DEFAULT_THEME: Theme = 'dark';

// Where the choice is remembered. Written by the provider, read by the head script.
export const THEME_STORAGE_KEY = 'open-theme';

/**
 * Runs in <head> before the first paint, so the very first frame is already the right theme.
 * Setting this from a React effect instead would show the light palette for a frame.
 */
export const THEME_SCRIPT = `(function(){try{
var t=localStorage.getItem('${THEME_STORAGE_KEY}');
if(t!=='light'&&t!=='dark')t='${DEFAULT_THEME}';
document.documentElement.classList.toggle('dark',t==='dark');
document.documentElement.style.colorScheme=t;
}catch(e){document.documentElement.classList.add('dark');}})();`;
