const mongoose = require('mongoose');

// set Schema for movies
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

// set Schema for users
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
});
//Create 2 models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
// export 2 Schemas:movie and user
module.exports.Movie = Movie;
module.exports.User = User;