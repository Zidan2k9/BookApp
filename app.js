/*jshint esversion: 6 */

//Book Class

class Book{
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class

class UI{
  static displayBooks(){



    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book){
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">Delete Book</a></td>
    `;

    list.appendChild(row);
  }

  static clearFields(){
    document.querySelector('#title').value ='';
    document.querySelector('#author').value ='';
    document.querySelector('#isbn').value ='';
  }

  static deleteBook(el){
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message,classNeme){
    const div = document.createElement('div');
    div.className =`alert alert-${classNeme}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    //remove alert after 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(),3000);
  }
}

//Store Class - Handles Storage

class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }
    else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book){
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books',JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();

    books.forEach((book, index) =>{
      if(book.isbn === isbn){
        books.splice(index,1);
      }
    });

    localStorage.setItem('books',JSON.stringify(books));
  }
}

//Event: Display Books

document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event: Add a Book

document.querySelector('#book-form').addEventListener('submit',(e) => {

//Prevent actual sumbit
e.preventDefault();


//Get form values
const title = document.querySelector('#title').value;
const author = document.querySelector('#author').value;
const isbn = document.querySelector('#isbn').value;

//Validate
if(title === '' || author === '' || isbn === ''){
  //alert('fill in all fields');
  UI.showAlert('Please fill in all fields','danger');
}
else{

  //instantiate books
  const book = new Book(title,author,isbn);
  //console.log(book);


  //Add book to UI
  UI.addBookToList(book);

  //Add book to Store
  Store.addBook(book);

  //Clear fields

  UI.clearFields();

//show success message
  UI.showAlert('Book added to Library','success');
}
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click',(e) =>{
  //removing book from UI
  UI.deleteBook(e.target);

  //remove book from Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


  UI.showAlert('Book deleted successfully','success');
});
