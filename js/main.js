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
  const searchResultElement =
    document.getElementById('search-result');
  searchResultElement.innerHTML = '';

  console.log(searchResultElement);

  books.forEach((book) => {
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
      <button class="add-book">adicionar à biblioteca</button>
    `;

    searchResultElement.appendChild(bookCard);
  });
};

const searchBooks = async (query) => {
  const books = await fetchBooks(query);
  renderBooks(books);
};

const searchBtn = document.querySelector('#search-book');
searchBtn.addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    searchBooks(searchBtn.value);
  }
});
