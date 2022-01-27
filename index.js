const express = require('express'),
    morgan = require('morgan');
const app = express();

let topMovies = [{
        title: 'SPIDER-MAN: NO WAY HOME',
        director: 'Jon Watts'
    },
    {
        title: 'IN THE HEIGHTS',
        author: 'Jon M. Chu'
    },
    {
        title: 'PIG',
        author: 'Michael Sarnoski'
    }
];

app.use(morgan('common'));
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
    res.send('<p>Discover the top, most popular movies available now! Across theaters, streaming, and on-demand, these are the movies Rotten Tomatoes users are embracing at this very moment, including Eternals, Scream, and Don’t Look Up. Click on each movie for reviews and trailers, and see where to watch.</p>');

});


app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// errorHandling
// should I add this? I mean should I new and throw an Error first? or I do not need to do that,because the error-handling middleware function should log "all" application-level errors,so that if I throw only on of them,it will not enought?

/* app.get('/', (req, res) => {
    throw new Error('Something is wrong!')
}) */

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});