const root = document.documentElement;
const toggleThemeBtn = document.querySelector('#theme-toggle');

toggleThemeBtn.addEventListener('click', () => {
  root.classList.toggle('light');
  root.classList.toggle('dark');
});