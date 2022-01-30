const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

app.use(bodyParser.json());

let users = [{
        id: 1,
        name: "Kin",
        favoriteMovies: []

    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ['Pig']

    },
]

let movies = [{
        "Title": "SPIDER-MAN: NO WAY HOME",
        "Director": {
            "Name": "Jon Watts"
        },
        "Genre": {
            "Name": "ABC",
            "Description": "movies scripts from “Hollywood1"
        }
    },
    {
        "Title": "IN THE HEIGHTS",
        "Director": {
            "Name": "Jon M. Chu"
        },
        "Genre": {
            "Name": "BCD",
            "Description": "movies scripts from “Hollywood2"
        },
    },
    {
        "Title": "PIG",
        "Director": {
            "Name": "Michael Sarnoski"
        },
        "Genre": {
            "Name": "CDF",
            "Description": "movies scripts from “Hollywood3"
        }
    },
];

// create users:(post)
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser).send('you have added a new user.')
    } else {
        res.status(400).send('users need names')
    }

});

// create: add favoriate movie
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id} 's arry`);
    } else {
        res.status(400).send('no such user')
    }

});

// update:(put)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }


});
// read: get all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});
// read: get a singe movie

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send("no such movie")
    }
});
// read: get movie by genreName

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send("no such genre")
    }
});

// read: get movie by DirectorName

app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send("no such director")
    }
});

// delete: delete favoriate movie
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been remove to user ${id} 's arry`);
    } else {
        res.status(400).send('no such user')
    }

});

// delete: delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.json(users);
        //res.status(200).send(` user ${id} has been deleted.`);
    } else {
        res.status(400).send('no such user')
    }

});


app.listen(8080, () => console.log("listening on 8080"))