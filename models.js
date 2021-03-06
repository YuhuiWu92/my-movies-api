/**
 * @file models.js file will implement schemas for documents in the movies and users collections in
 * my myFlix database. Models are created through these schemas, which are used in http requests
 * to Api endpoints to read, update, create and delete these documents from my database. Mongoose is
 * connected to the database using the connect method in the index file.
 * @requires mongoose Connects the app to the database and implements data schemas using models.
 * @requires bcrypt This is  used to implement secutiry and encryption on user passwords.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// set Schema for movies
const movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

// set Schema for users
const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});
// hash passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//Create 2 models
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// export 2 Schemas:movie and user
module.exports = { Movie, User };
