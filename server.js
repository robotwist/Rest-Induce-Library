const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override')
const books = require('./data/books');
const app = express();
const path = require('path');
const { title } = require('process');


// ********************
//    MIDDLEWARE
// ********************

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')))

// ***************************
//      ROUTES (I.N.D.U.C.E)
// ***************************


// Index
app.get('/', (req, res) => {
    res.render('home')
});

// Index
app.get('/books', (req, res) => {
    res.render('books', { title: "Book List", books })
})

// New
app.get('/books/new', (req, res) => {
    // create a new item
    res.render('books/new', { title: 'New Book' })
});

// POST
app.post('/books', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title || "new book",
        author: req.body.author || "new author"
    }
    books.push(newBook);
    res.status(201).redirect('/books')
})


// SHOW
app.get('/books/:id', (req, res) => {
    const book = books.find(book => book.id === parseInt(req.params.id));
    if (book) {
        res.render('books/show', { title: 'Book Details', book })
    } else {
        res.status(404).render('404/notFound', { title: "Book not found" })
    }
})

app.get('/books/:id/edit', (req, res) => {
    const book = books.find(book => book.id === parseInt(req.params.id));
    if (book) {
        res.render('books/edit', { title: 'Edit Book', book });
    } else {
        res.status(404).render('404/notFound', { title: 'Book Not Found!' })
    }
})
// EDIT
// / Update - Update a book
app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...req.body };
        res.status(200).redirect(`/books`);
        // res.render('bookUpdated', { title: 'Book Updated', book: books[bookIndex] });
    } else {
        res.status(404).render('404/notFound', { title: 'Book Not Found' });
    }
});

// DELETE
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
    } else {
        res.status(404).render('404/notFound', { title: 'Book Not Found' });
    }
    res.redirect('/books');
});

// ********************
//    LISTENER
// ********************

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🎧 Server is running on http://localhost:${PORT}`);
})