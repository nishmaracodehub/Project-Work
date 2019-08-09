// Book Class
class Book {

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {

    // Add Book to List
    addBookToList(book){
        const list = document.getElementById('book-list');

        //create tr element
        const row = document.createElement('tr');

        // add columns to row
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        // append row to the list
        list.appendChild(row);
    }

    // Show Alert
    showAlert(message,className){
        // create div element
        const div = document.createElement('div');

        // Add a class to div
        div.className = `alert ${className}`;

        // Create a text node to div
        div.appendChild(document.createTextNode(message));

        // Get Parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        //insert alert
        container.insertBefore(div, form);

        // Set Timeout for alert
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000)
    }

    // Delete Book
    deleteBook(target) {
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    // Clear Fields
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class LocalStorage {
    static getBooks(){
        let books;
        // check localstorage
        if(localStorage.getItem('books') == null){
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books',books));
        }

        return books;
    }

    static displayBooks(){
        const books = LocalStorage.getBooks();

        books.forEach(function(book){
            const ui = new UI();
            ui.addBookToList(book);
        })
    }

    static addBook(book){
        const books = LocalStorage.getBooks();
        // push a book item
        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = LocalStorage.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', LocalStorage.displayBooks);

// Event Listeners

document.getElementById('book-form').addEventListener('submit', function(e){

    const title = document.getElementById('title').value, 
          author = document.getElementById('author').value, 
          isbn = document.getElementById('isbn').value;
    
    // Instantiate Book class
    const book = new Book(title, author, isbn);

    // Instantiate UI class
    const ui = new UI();

    if(title === '' || author === '' || isbn === ''){
        // Error Alert
        ui.showAlert('Please fill in all the fields', 'error');
    } else {
        // add book to list
        ui.addBookToList(book);

        // add to local storage
        LocalStorage.addBook(book);

        // Success Alert
        ui.showAlert('Book Added Successfully', 'success');

        // clear input Fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event Listener for Deleting the Book

document.getElementById('book-list').addEventListener('click', function(e){
    // Instantiate UI Class
    const ui = new UI();

    // Delete book from the list
    ui.deleteBook(e.target);
    
    // Delete book from Local Storage
    LocalStorage.removeBook(e.target.parentElement.previousElementSibling.textContent)

    // Show Alert
    ui.showAlert('Book Deleted!', 'success');

    e.preventDefault();
})