const phrases = [
  'Isso é BookFav',
  'Crie lista de livros',
  'Local e Fácil',
];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
const typingSpeed = 150;
const pauseDuration = 1000;

const typingElement = document.getElementById('typewriter');

function typeText() {
  if (currentCharIndex < phrases[currentPhraseIndex].length) {
    typingElement.textContent = phrases[currentPhraseIndex].slice(
      0,
      currentCharIndex + 1
    );
    currentCharIndex++;
    setTimeout(animation, typingSpeed);
  } else {
    isTyping = false;
    setTimeout(animation, pauseDuration);
  }
}

function eraseText() {
  if (currentCharIndex > 0) {
    typingElement.textContent = phrases[currentPhraseIndex].slice(
      0,
      currentCharIndex - 1
    );
    currentCharIndex--;
    setTimeout(animation, typingSpeed);
  } else {
    isTyping = true;
    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    setTimeout(animation, pauseDuration);
  }
}

function animation() {
  if (isTyping) {
    typeText();
  } else {
    eraseText();
  }
}

animation();
