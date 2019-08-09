// Book Constructor
function Book (title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor
function UI() {}

UI.prototype.addBookToList = function(book) {
    const list = document.getElementById('book-list');
    // create table body row element
    const row = document.createElement('tr');
    // insert columns to rows
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
}

UI.prototype.showAlert = function (message, classname){
    // Create a div
    const div = document.createElement('div');
    //Add classes
    div.className = `alert ${classname}`;
    //Add textnode
    div.appendChild(document.createTextNode(message));
    //Get Parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    //insert Alert
    container.insertBefore(div, form);

    //timeout after 3secs
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);

}

// prototype for delete book
UI.prototype.deleteBook = function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }

}

UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

// Event Listeners

document.getElementById('book-form').addEventListener('submit', function(e){
    //get form values
    const title = document.getElementById('title').value, 
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    //Instantiate book
    const book = new Book(title, author, isbn);
    const ui = new UI();

    // Validation
    if(title === '' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('Please fill in all the fields', 'error');
    } else {
        // Add book to table list
        ui.addBookToList(book);

         //Success Alert
         ui.showAlert('Book added sucesfully', 'success')

        //clear fields
        ui.clearFields();
    }

    e.preventDefault();
})

//Event listener for delete

document.getElementById('book-list').addEventListener('click', function(e){

    const ui = new UI();
    ui.deleteBook(e.target);

    // show alert
    ui.showAlert('Book Removed!!', 'success');

    e.preventDefault();
})