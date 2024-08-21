const root = document.documentElement;
const toggleThemeBtn = document.querySelector('#theme-toggle');

const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const THEME_KEY = 'bf-theme';

function loadTheme() {
  root.className = localStorage.getItem(THEME_KEY) || LIGHT_THEME;
}

function updateThemeOnLocalStorage() {
  localStorage.getItem(THEME_KEY) == LIGHT_THEME
    ? localStorage.setItem(THEME_KEY, DARK_THEME)
    : localStorage.setItem(THEME_KEY, LIGHT_THEME);
}

toggleThemeBtn.addEventListener('click', () => {
  updateThemeOnLocalStorage();
  loadTheme();
});

loadTheme();
