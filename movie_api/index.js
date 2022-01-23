const express = require('express'),
    morgan = require('morgan');
const app = express();

app.use(morgan('common'));

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

// GET requests
app.get('/', (req, res) => {
    res.send('Discover the top, most popular movies available now! Across theaters, streaming, and on-demand, these are the movies Rotten Tomatoes users are embracing at this very moment, including Eternals, Scream, and Don’t Look Up. Click on each movie for reviews and trailers, and see where to watch.');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// errorHandling

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {

});
// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});