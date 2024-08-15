function renderBooksFromLibrary() {
  const books = JSON.parse(localStorage.getItem('library'));
  const library = document.querySelector('.library');
  if (books.length === 0) {
    library.innerHTML = `
        <div class="empty-library">
          <img
            src="./assets/empty.svg"
            alt="Representação de uma prancheta vazia"
          />
          <h2>Que vazio 😮</h2>
        </div>`;
    return;
  }

  library.innerHTML = '';

  books.forEach((book, index) => {
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
            <button class="info-btn" data-index="${index}" onclick="showBookInformation(event)">
              info <i class="ph ph-info"></i>
            </button>
            <button class="delete-btn" data-index="${index}" onclick="deleteBook(event)" >
              excluir <i class="ph ph-trash"></i>
            </button>
          </div>`;
    library.appendChild(bookCard);
  });
}

function renderBookInformation(book) {
  const main = document.querySelector('main');
  const bookInfoContainer = document.createElement('div');
  bookInfoContainer.className = 'book-info-container';

  const header = document.querySelector('header');
  const library = document.querySelector('.library');
  const footer = document.querySelector('footer');

  header.style.filter = 'blur(4px)';
  library.style.filter = 'blur(4px)';
  footer.style.filter = 'blur(4px)';

  bookInfoContainer.innerHTML = `
      <div class="book-info-header">
        <h1>INFORMAÇÕES DO LIVRO</h1>
        <button class="close-button" onclick="closeModal()">
          <i class="ph ph-x-circle"></i>
        </button>
        <img
          src="assets/paper-clip.svg"
          alt="A paper clip"
          class="left"
        />
        <img
          src="assets/paper-clip.svg"
          alt="A paper clip"
          class="right"
        />
      </div>
      <div class="book-info-content">
        <p>
          <span class="label">título:</span>
          ${book.title}
        </p>
        <p><span class="label">autores:</span>
          ${book.authors.join(',')}
        </p>
        <p>
          <span class="label">descrição:</span>
          ${book.description}
        </p>
        <p><span class="label">categoria:</span>
          ${book.categories.join(',')}
        </p>
        <p><span class="label">total de páginas:</span>
          ${book.pageCount}
        </p>
        <p>
          <span class="label">editora:</span>
          ${book.publisher}
        </p>
        <p><span class="label">data publicação:</span>
          ${book.publishedDate}
        </p>
        <p><span class="label">ISBN 13:</span>
          ${book.isbn.ISBN_13}
        </p>
        <p><span class="label">ISBN 10:</span>
          ${book.isbn.ISBN_10}
        </p>
        <p><span class="label">idioma:</span>
          ${book.language}
        </p>
        <p><span class="label">preço:</span>
          ${book.price}
        </p>
      </div>`;

  main.appendChild(bookInfoContainer);
}

const closeModal = () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const library = document.querySelector('.library');
  const footer = document.querySelector('footer');
  const bookInfoContainer = document.querySelector(
    '.book-info-container'
  );

  header.style.filter = '';
  library.style.filter = '';
  footer.style.filter = '';

  main.removeChild(bookInfoContainer);
};

const showBookInformation = (event) => {
  let library = JSON.parse(localStorage.getItem('library'));
  const book = library[event.target.getAttribute('data-index')];
  renderBookInformation(book);
};

const deleteBook = (event) => {
  let library = JSON.parse(localStorage.getItem('library'));
  if (library && Array.isArray(library)) {
    library.splice(event.target.getAttribute('data-index'), 1);
    localStorage.setItem('library', JSON.stringify(library));
    renderBooksFromLibrary();
  }
};

renderBooksFromLibrary();
