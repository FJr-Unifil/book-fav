import { main, clearBtn, searchBtn } from './elements.js';

const API = {
  fetchBooks: async (query) => {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}&maxResults=10`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.items ? data.items.map(API.parseBookData) : [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  parseBookData: (book) => {
    const { volumeInfo, saleInfo } = book;
    return {
      title: volumeInfo.title || 'N/A',
      authors: volumeInfo.authors || ['Unknown'],
      description: volumeInfo.description || 'N/A',
      categories: volumeInfo.categories || ['Uncategorized'],
      pageCount: volumeInfo.pageCount || 'N/A',
      publisher: volumeInfo.publisher || 'N/A',
      publishedDate: volumeInfo.publishedDate || 'N/A',
      isbn: API.getISBNs(volumeInfo.industryIdentifiers),
      language: volumeInfo.language || 'N/A',
      price: API.getPrice(saleInfo),
      imageLinks: volumeInfo.imageLinks || {},
    };
  },

  getISBNs: (industryIdentifiers) => {
    if (!industryIdentifiers)
      return { ISBN_13: 'N/A', ISBN_10: 'N/A' };

    return industryIdentifiers.reduce(
      (acc, identifier) => {
        if (
          identifier.type === 'ISBN_13' ||
          identifier.type === 'ISBN_10'
        ) {
          acc[identifier.type] = identifier.identifier;
        }
        return acc;
      },
      { ISBN_13: 'N/A', ISBN_10: 'N/A' }
    );
  },

  getPrice: (saleInfo) => {
    return saleInfo.saleability === 'FOR_SALE' && saleInfo.listPrice
      ? `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}`
      : 'NOT_FOR_SALE';
  },
};

const DOM = {
  renderBooks: (books) => {
    main.classList.add('book-result');
    main.classList.remove('container');

    if (books.length === 0) {
      main.innerHTML = `<h1>Não foram encontrados livros :(</h1>`;
      return;
    }

    main.innerHTML =
      '<h1>Resultados da sua busca:</h1><div id="search-result"></div>';

    const searchResult = document.querySelector('#search-result');

    books.forEach((book, index) => {
      const bookCard = DOM.createBookCard(book, index);
      searchResult.appendChild(bookCard);
    });

    searchResult.addEventListener('click', DOM.handleAddBook);
  },

  createBookCard: (book, index) => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
      <div class="book-cover">
        <img src="${
          book.imageLinks.thumbnail || './assets/image-not-found.jpg'
        }" alt="Capa do livro ${book.title}" />
      </div>
      <div class="book-info">
        <p><span class="title">Título: </span>${book.title}</p>
        <p><span class="title">Autor(a): </span>${book.authors.join(
          ', '
        )}</p>
        <p><span class="title">Editora: </span>${book.publisher}</p>
        <p><span class="title">Data: </span>${book.publishedDate}</p>
        <p><span class="title">Nº Páginas: </span>${
          book.pageCount
        }</p>
        <p><span class="title">Categoria: </span>${book.categories.join(
          ', '
        )}</p>
      </div>
      <button class="add-book" data-index=${index}>adicionar à biblioteca</button>
    `;
    return bookCard;
  },

  handleAddBook: (event) => {
    if (!event.target.classList.contains('add-book')) return;

    const bookIndex = parseInt(
      event.target.getAttribute('data-index')
    );
    const bookToSave = window.searchResults[bookIndex];

    if (Library.saveBook(bookToSave)) {
      event.target.disabled = true;
      event.target.textContent = 'Adicionado';
    }
  },
};

const Library = {
  saveBook: (book) => {
    let library = JSON.parse(localStorage.getItem('library')) || [];

    const isBookInLibrary = library.some(
      (libraryBook) => libraryBook.title === book.title
    );

    if (!isBookInLibrary) {
      library.push(book);
      localStorage.setItem('library', JSON.stringify(library));
      console.log('Book added to library');
      return true;
    } else {
      console.log('Book already in library');
      return false;
    }
  },
};

const App = {
  init: () => {
    searchBtn.addEventListener('keydown', App.handleSearch);
    searchBtn.addEventListener('input', App.handleClearBtnAppearence);
    clearBtn.addEventListener('click', App.handleClearSearch);
  },

  handleSearch: async (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;
      const books = await API.fetchBooks(query);
      window.searchResults = books;
      DOM.renderBooks(books);
    }
  },

  handleClearBtnAppearence: () => {
    clearBtn.style.visibility = event.target.value
      ? 'visible'
      : 'hidden';
  },

  handleClearSearch: () => {
    searchBtn.value = '';
    App.handleClearBtnAppearence();
  },
};

App.init();
