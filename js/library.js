function renderBooksFromLibrary() {
  const books = JSON.parse(localStorage.getItem('library'));
  const library = document.querySelector('.library');
  if (books === null) return;

  library.innerHTML = '';

  const main = document.querySelector('main');

  const h1 = document.createElement('h1');
  h1.textContent = 'Sua biblioteca:';

  main.insertBefore(h1, main.firstChild);

  books.forEach((book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
          <div class="image">
            <img
              src=${book.imageLinks.thumbnail}
              alt="Capa do livro ${book.title}"
            />
          </div>
          <div class="buttons">
            <button class="info-btn">
              info <i class="ph ph-info"></i>
            </button>
            <button class="delete-btn">
              excluir <i class="ph ph-trash"></i>
            </button>
          </div>`;
    library.appendChild(bookCard);
  });
}

renderBooksFromLibrary();
