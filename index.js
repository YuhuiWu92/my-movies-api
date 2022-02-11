{
    "name": "my-movies-api",
    "version": "1.0.0",
    "description": "Here you can find the movies you like # my page you can find my page here: https://yuhuiwu92.github.io/my-movies-api/",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node index.js",
        "devStart": "nodemon index.js"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/YuhuiWu92/my-movies-api.git"
    },
    "keywords": [],
    "author": "Yuhui Wu",
    "license": "ISC",
    "bugs": {
        "url": "https://github.com/YuhuiWu92/my-movies-api/issues"
    },
    "homepage": "https://github.com/YuhuiWu92/my-movies-api#readme",
    "dependencies": {
        "body-parser": "^1.19.1",
        "express": "^4.17.2",
        "lodash": "^4.17.21",
        "mongoose": "^6.2.1",
        "morgan": "^1.10.0",
        "nodemon": "^2.0.15",
        "uuid": "^8.3.2"
    },
    "devDependencies": {
        "eslint": "^8.7.0"
    }
}
pp.use(express.static('public'));

// default text response at "/"
app.get()

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