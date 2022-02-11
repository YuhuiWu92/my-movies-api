const express = require('express'),
    bodyParser = require("body-parser"),
    uuid = require("uuid"),
    morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));

// GET requests
// default text response at "/"

app.get('/', (req, res) => {
    res.send('Welcome to Myfilx!');
});

// get all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error" + err);
        });
});

// get all users
app.get('/users', (req, res) => {
        Users.find()
            .then((users) => {
                res.status(201).json(users);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error" + err);
            });
    })
    // get a user by username
app.get("/users/:Username", (req, res) => {
    Users.findOne((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + 'was not found');
        } else {
            res.status(200).json(user);
        }
    })
})

// Return datas about a single movie by title
app.get("/movies/:Title", (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.Title + ' was not found');
            } else {
                res.status(200).json(movie);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error" + err);
        });
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