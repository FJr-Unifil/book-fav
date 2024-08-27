import { library, main, header, footer } from './elements.js';

const LibraryDom = {
  renderBooksFromLibrary: () => {
    const books = LibraryMethods.getBooks();

    if (books.length === 0) {
      library.innerHTML = LibraryDom.getEmptyLibraryHTML();
      const deleteAllBtn = document.querySelector('#delete-all-btn');
      if (deleteAllBtn) {
        deleteAllBtn.remove();
      }
      return;
    }
  
    let deleteAllBtn = document.querySelector('#delete-all-btn');
    if (!deleteAllBtn) {
      deleteAllBtn = document.createElement('button');
      deleteAllBtn.id = 'delete-all-btn';
      deleteAllBtn.innerHTML = `
        <i class="ph ph-warning"></i>
        Excluir Todos
      `;
      main.insertBefore(deleteAllBtn, library);
  }

    library.innerHTML = '';
    books.forEach((book, index) => {
      const bookCard = LibraryDom.createBookCard(book, index);
      library.appendChild(bookCard);
    });

    LibraryApp.setupDeleteAllButton();
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
    const bookInfoContainer = document.createElement('div');
    bookInfoContainer.className = 'book-info-container';

    LibraryDom.applyBlurEffect();

    bookInfoContainer.innerHTML = LibraryDom.getBookInfoHTML(book);
    bookInfoContainer.addEventListener('click', EventHandlers.handleCloseBookInfoModal);
    main.appendChild(bookInfoContainer);
  },

  renderDeleteBookModal: (index) => {
    LibraryDom.applyBlurEffect();
    const deleteBookModal = document.createElement('div');
    deleteBookModal.className = 'delete-book-modal';
    deleteBookModal.innerHTML = `
      <h2>Tem certeza que deseja excluir este livro?</h2>
      <div class="buttons">
        <button class="cancel-btn">Cancelar</button>
        <button class="confirm-btn" data-index="${index}">Confirmar</button>
      </div>
    `;
    deleteBookModal.addEventListener('click', EventHandlers.handleConfirmDelete);
    main.appendChild(deleteBookModal);
  },

  getBookInfoHTML: (book) => `
    <div class="book-info-header">
      <h1>INFORMAÇÕES DO LIVRO</h1>
      <button class="close-button">
        <i class="ph ph-x-circle"></i>
      </button>
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
    header.style.filter = 'blur(4px)';
    library.style.filter = 'blur(4px)';
    footer.style.filter = 'blur(4px)';
  },

  removeBlurEffect: () => {
    header.style.filter = '';
    library.style.filter = '';
    footer.style.filter = '';
  },

  closeBookInfoModal: () => {
    LibraryDom.removeBlurEffect();
    const bookInfoContainer = document.querySelector(
      '.book-info-container'
    );
    main.removeChild(bookInfoContainer);
  },

  closeDeleteBookModal: () => {
    LibraryDom.removeBlurEffect();
    const deleteBookModal = document.querySelector(
      '.delete-book-modal'
    );
    main.removeChild(deleteBookModal);
  },

  renderDeleteAllModal: () => {
    LibraryDom.applyBlurEffect();
    const deleteAllModal = document.createElement('div');
    deleteAllModal.className = 'delete-book-modal';
    deleteAllModal.innerHTML = `
      <h2>Deseja mesmo remover TODOS os livros da sua biblioteca?</h2>
      <div class="buttons">
        <button class="cancel-btn">Cancelar</button>
        <button class="confirm-btn">Confirmar</button>
      </div>
    `;
    deleteAllModal.addEventListener('click', EventHandlers.handleConfirmDeleteAll);
    main.appendChild(deleteAllModal);
  },

  closeDeleteAllModal: () => {
    LibraryDom.removeBlurEffect();
    const deleteAllModal = document.querySelector('.delete-book-modal');
    main.removeChild(deleteAllModal);
  }
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

  deleteAllBooks: () => {
    localStorage.removeItem('library');
  }
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
    LibraryDom.renderDeleteBookModal(index);
  },

  handleCloseBookInfoModal: (event) => {
    if (event.target.closest('.close-button')) {
      LibraryDom.closeBookInfoModal();
    }
  },

  handleConfirmDelete: (event) => {
    if (event.target.closest('.cancel-btn')) {
      LibraryDom.closeDeleteBookModal();
    }
    if (event.target.closest('.confirm-btn')) {
      const index = event.target.getAttribute('data-index');
      LibraryMethods.deleteBook(index);
      LibraryDom.closeDeleteBookModal();
      LibraryDom.renderBooksFromLibrary();
    }
    return;
  },
  
  handleDeleteAllClick: (event) => {
    if (!event.target.closest('#delete-all-btn')) return;
    LibraryDom.renderDeleteAllModal();
  },

  handleConfirmDeleteAll: (event) => {
    if (event.target.closest('.cancel-btn')) {
      LibraryDom.closeDeleteAllModal();
    }
    if (event.target.closest('.confirm-btn')) {
      LibraryMethods.deleteAllBooks();
      LibraryDom.closeDeleteAllModal();
      LibraryDom.renderBooksFromLibrary();
    }
  },

  handleKeyPress: (event) => {
    if (event.key === 'Escape') {
      const bookInfoModal = document.querySelector('.book-info-container');
      const deleteBookModal = document.querySelector('.delete-book-modal');
      const deleteAllModal = document.querySelector('.delete-all-modal');
      if (bookInfoModal) {
        LibraryDom.closeBookInfoModal();
      } 
      if (deleteBookModal) {
        LibraryDom.closeDeleteBookModal();
      }
      if (deleteAllModal) {
        LibraryDom.closeDeleteAllModal();
      }
    }
  }
};

const LibraryApp = {
  init: () => {
    LibraryDom.renderBooksFromLibrary();
    LibraryApp.addEventListeners();
    LibraryApp.setupDeleteAllButton();
  },

  addEventListeners: () => {
    library.addEventListener('click', (event) => {
      EventHandlers.handleInfoClick(event);
      EventHandlers.handleDeleteClick(event);
    });

    main.addEventListener('click', EventHandlers.handleCloseModal);
    document.addEventListener('keydown', EventHandlers.handleKeyPress);
  },

  setupDeleteAllButton: () => {
    const deleteAllBtn = document.querySelector('#delete-all-btn');
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener('click', EventHandlers.handleDeleteAllClick);
    }
  }
};

LibraryApp.init();
