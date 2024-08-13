const fetchBooks = async (query) => {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=10`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map((book) => {
      const volumeInfo = book.volumeInfo;
      return {
        title: volumeInfo.title || 'N/A',
        authors: volumeInfo.authors || ['Unknown'],
        publisher: volumeInfo.publisher || 'N/A',
        publishedDate: volumeInfo.publishedDate || 'N/A',
        pageCount: volumeInfo.pageCount || 'N/A',
        categories: volumeInfo.categories || ['Uncategorized'],
        imageLinks: volumeInfo.imageLinks || {},
      };
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

const renderBooks = (books) => {
  const main = document.querySelector('main');
  main.classList.toggle('book-result');
  main.classList.toggle('container');
  main.innerHTML = '';

  const h1 = document.createElement('h1');
  h1.innerText = 'Resultados da sua busca:';
  const searchResult = document.createElement('div');
  searchResult.id = 'search-result';

  main.appendChild(h1);
  main.appendChild(searchResult);

  books.forEach((book, index) => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    bookCard.innerHTML = `
      <div class="book-cover">
        <img src="${
          book.imageLinks.thumbnail ||
          'https://via.placeholder.com/128x198'
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
      <button class="add-book" data-index=${index} >adicionar à biblioteca</button>
    `;

    searchResult.appendChild(bookCard);

    searchResult.addEventListener('click', handleAddBook);
  });
};

const handleAddBook = (event) => {
  if (!event.target.classList.contains('add-book')) return;

  const bookIndex = parseInt(event.target.getAttribute('data-index'));
  const bookToSave = window.searchResults[bookIndex];

  if (saveBookToLocalStorage(bookToSave)) {
    event.target.disabled = true;
    event.target.textContent = 'Adicionado';
    console.log(`Livro adicionado: ${JSON.stringify(bookToSave)}`);
  }
};

const searchBooks = async (query) => {
  const books = await fetchBooks(query);
  window.searchResults = books;
  renderBooks(books);
};

const saveBookToLocalStorage = (book) => {
  let library = JSON.parse(localStorage.getItem('library')) || [];

  const isBookInLibrary = library.some(
    (libraryBook) => libraryBook.title === book.title
  );

  if (!isBookInLibrary) {
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
    console.log('Book added to library');
  } else {
    console.log('Book already in library');
  }
};

const searchBtn = document.querySelector('#search-book');
searchBtn.addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    searchBooks(searchBtn.value);
  }
});
