/**
 * @file the aim of this file is to implement two passport strategies that will be used to authenticate requests
 * to the overall API endpoints. When the user logs in , this will function as a validation method for the username and password
 * and compare them to our users collection in the database area.
 *
 * The JWT strategy is also used, this will decode the Web Token returned to the user after having a successfull login, after it will check the user ID, and if it matches
 * the user collection in the database.
 *
 * @requires passport-local This was used to create a local strategy
 * @requires passport For authentication and validation to the requests over the API endpoints
 * @requires passport-jwt To extract tokens from the requests
 * @requires '.models.js' This is where we defined our models and schemas
 *
 * */

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(username + "  " + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("incorrect username");
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
