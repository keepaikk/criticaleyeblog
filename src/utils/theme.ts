export type ThemePreference = 'auto' | 'light' | 'dark';

const THEME_KEY = 'critical_eye_theme_preference_v1';

export function isDaytimeNow(): boolean {
  const hour = new Date().getHours();
  // Daytime in West Africa / Ghana is approximately 06:00 to 18:00 (6am to 6pm)
  return hour >= 6 && hour < 18;
}

export function getStoredThemePreference(): ThemePreference {
  try {
    const val = localStorage.getItem(THEME_KEY);
    if (val === 'light' || val === 'dark' || val === 'auto') {
      return val;
    }
  } catch (e) {
    console.error('Failed to read theme preference', e);
  }
  return 'auto'; // Default to automatic Day/Night detection
}

export function saveStoredThemePreference(pref: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch (e) {
    console.error('Failed to save theme preference', e);
  }
}

export function resolveEffectiveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  // 'auto' mode: check daytime vs nighttime
  return isDaytimeNow() ? 'light' : 'dark';
}

export function applyTheme(pref: ThemePreference): 'light' | 'dark' {
  const effective = resolveEffectiveTheme(pref);
  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  return effective;
}
