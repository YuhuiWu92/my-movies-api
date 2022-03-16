const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');

// Uncomment this only for HEROKU
// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Uncomment this if you want to connect to Mongo Atlas DB
mongoose.connect("mongodb+srv://admin:admin@yuhuidb.y3ahh.mongodb.net/myFlimDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

// Comment this when you want to push things to heroku and uncomment if you want to connect to your local DB
// mongoose.connect("mongodb://localhost:27017/myFlimDB", { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

//app.use(express.static('public'));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// use CORS
const cors = require('cors');
// let allowedOrigins = ['http://localhost:8080', 'http://localhost:53123', 'https://my-film-flix.herokuapp.com'];
/* app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
})); */

// Allow all origins
app.use(cors({}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('common'));

// GET requests
// default text response at "/"

app.get('/', passport.authenticate('jwt', { session: false }),(req, res) => {
    res.send('Welcome to My film flix!');
});
// 
app.get('/docs', (req, res) => {
    res.sendFile(__dirname + '/public/documentation.html');
});



// get all movies,remove the authentication middleware
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error" + err);
        });
});

// get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.find()
            .then((users) => {
                res.status(200).json(users);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error" + err);
            });
    })
    // get a user by username
app.get("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.Username)
    Users.findOne({Username: req.params.Username}, (err, user) => {
        if (err) {
            res.status(500).send("Something went wrong", err.message);
        }
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
app.post('/users',
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

// Allow users to update their user info (username, password, email, date of birth) ==> put 
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
