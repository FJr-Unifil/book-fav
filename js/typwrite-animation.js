const phrases = [
  'Isso é BookFav',
  'Crie lista de livros',
  'Local e Fácil',
];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
const typingSpeed = 100;
const pauseDuration = 500;

const typingElement = document.getElementById('typewriter');

function typeText() {
  if (isTyping) {
    if (currentCharIndex < phrases[currentPhraseIndex].length) {
      typingElement.textContent = phrases[currentPhraseIndex].slice(
        0,
        currentCharIndex + 1
      );
      currentCharIndex++;
      setTimeout(typeText, typingSpeed);
    } else {
      isTyping = false;
      setTimeout(typeText, pauseDuration);
    }
  } else {
    if (currentCharIndex > 0) {
      typingElement.textContent = phrases[currentPhraseIndex].slice(
        0,
        currentCharIndex - 1
      );
      currentCharIndex--;
      setTimeout(typeText, typingSpeed);
    } else {
      isTyping = true;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      setTimeout(typeText, pauseDuration);
    }
  }
}

typeText();
