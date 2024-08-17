const LibraryDom = {
  renderBooksFromLibrary: () => {
    const books = LibraryMethods.getBooks();
    const library = document.querySelector('.library');

    if (books.length === 0) {
      library.innerHTML = LibraryDom.getEmptyLibraryHTML();
      return;
    }

    library.innerHTML = '';
    books.forEach((book, index) => {
      const bookCard = LibraryDom.createBookCard(book, index);
      library.appendChild(bookCard);
    });
  },

  getEmptyLibraryHTML: () => `
    <div class="empty-library">
      <img
        src="./assets/empty.svg"
        alt="Representação de uma prancheta vazia"
      />
      <h2>Que vazio 😮</h2>
    </div>`,

  createBookCard: (book, index) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
      <div class="image">
        <img
          src=${
            book.imageLinks.thumbnail ||
            './assets/image-not-found.jpg'
          }
          alt="Capa do livro ${book.title}"
        />
      </div>
      <div class="buttons">
        <button class="info-btn" data-index="${index}">
          info <i class="ph ph-info"></i>
        </button>
        <button class="delete-btn" data-index="${index}">
          excluir <i class="ph ph-trash"></i>
        </button>
      </div>`;
    return bookCard;
  },

  renderBookInformation: (book) => {
    const main = document.querySelector('main');
    const bookInfoContainer = document.createElement('div');
    bookInfoContainer.className = 'book-info-container';

    LibraryDom.applyBlurEffect();

    bookInfoContainer.innerHTML = LibraryDom.getBookInfoHTML(book);
    main.appendChild(bookInfoContainer);
  },

  getBookInfoHTML: (book) => `
    <div class="book-info-header">
      <h1>INFORMAÇÕES DO LIVRO</h1>
      <button class="close-button">
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
      <p><span class="label">título:</span> ${book.title}</p>
      <p><span class="label">autores:</span> ${book.authors.join(
        ', '
      )}</p>
      <p><span class="label">descrição:</span> ${book.description}</p>
      <p><span class="label">categoria:</span> ${book.categories.join(
        ', '
      )}</p>
      <p><span class="label">total de páginas:</span> ${
        book.pageCount
      }</p>
      <p><span class="label">editora:</span> ${book.publisher}</p>
      <p><span class="label">data publicação:</span> ${
        book.publishedDate
      }</p>
      <p><span class="label">ISBN 13:</span> ${book.isbn.ISBN_13}</p>
      <p><span class="label">ISBN 10:</span> ${book.isbn.ISBN_10}</p>
      <p><span class="label">idioma:</span> ${book.language}</p>
      <p><span class="label">preço:</span> ${book.price}</p>
    </div>`,

  applyBlurEffect: () => {
    ['header', '.library', 'footer'].forEach((selector) => {
      document.querySelector(selector).style.filter = 'blur(4px)';
    });
  },

  removeBlurEffect: () => {
    ['header', '.library', 'footer'].forEach((selector) => {
      document.querySelector(selector).style.filter = '';
    });
  },

  closeModal: () => {
    LibraryDom.removeBlurEffect();
    const main = document.querySelector('main');
    const bookInfoContainer = document.querySelector(
      '.book-info-container'
    );
    main.removeChild(bookInfoContainer);
  },
};

const LibraryMethods = {
  getBooks: () => JSON.parse(localStorage.getItem('library')) || [],

  deleteBook: (index) => {
    let library = LibraryMethods.getBooks();
    if (library && Array.isArray(library)) {
      library.splice(index, 1);
      localStorage.setItem('library', JSON.stringify(library));
    }
  },
};

const EventHandlers = {
  handleInfoClick: (event) => {
    if (!event.target.classList.contains('info-btn')) return;
    const index = event.target.getAttribute('data-index');
    const book = LibraryMethods.getBooks()[index];
    LibraryDom.renderBookInformation(book);
  },

  handleDeleteClick: (event) => {
    if (!event.target.classList.contains('delete-btn')) return;
    const index = event.target.getAttribute('data-index');
    LibraryMethods.deleteBook(index);
    LibraryDom.renderBooksFromLibrary();
  },

  handleCloseModal: (event) => {
    if (event.target.closest('.close-button')) {
      LibraryDom.closeModal();
    }
  },
};

const LibraryApp = {
  init: () => {
    LibraryDom.renderBooksFromLibrary();
    LibraryApp.addEventListeners();
  },

  addEventListeners: () => {
    const library = document.querySelector('.library');
    library.addEventListener('click', (event) => {
      EventHandlers.handleInfoClick(event);
      EventHandlers.handleDeleteClick(event);
    });

    document
      .querySelector('main')
      .addEventListener('click', EventHandlers.handleCloseModal);
  },
};

LibraryApp.init();
