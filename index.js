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
// Return data about a genre (description) by name(e.g., “Action”)
app.get("/genre/:Name", (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
        .then((movie) => {
            res.status(200).json(movie.Genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error" + err);
        });
});
// Return data about a director (bio, birth year, death year) by name
app.get("/director/:Name", (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
        .then((movie) => {
            res.status(200).json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error" + err);
        });
});
// Allow new users to register ==> add/post a user
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Allow users to update their user info (username, password, email, date of birth) ==> put 
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        }, { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Allow users to add a movie to their list of favorites ==> post $push or $addToSet
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
            $push: { FavoriteMovies: req.params.MovieID }
        }, { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Allow users to remove a movie from their list of favorites ==> deleteOne

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
            $pull: { FavoriteMovies: req.params.MovieID }
        }, { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// Allow existing users to deregister
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// errorHandling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});