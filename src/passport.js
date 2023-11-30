import passport from "passport";
import { usersManager } from "./managers/usersManager.js";
import { Strategy as LocalStrategy } from "passport-local";
import { hashData, compareData } from "./utils.js";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy } from "passport-jwt";

//crear estrategias local
passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return done(null, false);
      }
      try {
        const hashPassword = await hashData(password);
        const userCreated = await usersManager.createOne({
          ...req.body,
          password: hashPassword,
        });
        done(null, userCreated);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      if (!email || !password) {
        return done(null, false);
      }

      try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
          return done(null, false);
        }

        const isPasswordValid = await compareData(password, user.password);

        if (!isPasswordValid) {
          return done(null, false);
        }

        const sessionInfo =
          email === "adminCoder@coder.com"
            ? { email, first_name: user.first_name, role: "admin" }
            : { email, first_name: user.first_name, role: "user" };
        req.session.user = sessionInfo;
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//github

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: "Iv1.0b43c39bcd8e0954",
      clientSecret: "11d1ed499874e32ae49057ead0e59b1f9347583f",
      callbackURL: "http://localhost:8080/api/sessions/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userDB = await usersManager.findByEmail(profile._json.email);

        //login

        if (userDB) {
          if (userDB.isGitHub) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }

        //signup

        const infoUser = {
          first_name: profile._json.name.split(" ")[0],
          last_name: profile._json.name.split(" ")[1],
          email: profile._json.email,
          password: " ",
          isGitHub: true,
        };
        const createdUSER = await usersManager.createOne(infoUser);
        done(null, createdUSER);
      } catch (error) {
        done(error);
      }
    }
  )
);

//google

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "699876434350-6kouohm9s40794r366b70q1jp0t4kin2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userDB = await usersManager.findByEmail(profile._json.email);

        //login

        if (userDB) {
          if (userDB.isGoogle) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }

        //signup

        const infoUser = {
          first_name: profile._json.given_name,
          last_name: profile._json.family_name,
          email: profile._json.email,
          password: " ",
          isGoogle: true,
        };
        const createdUSER = await usersManager.createOne(infoUser);
        done(null, createdUSER);
      } catch (error) {
        done(error);
      }
    }
  )
);

const fromCookies = (req) => {
  return req.cookies.token;
};

//jwt

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secretJWT",
    },
    async (jwt_payload, done) => {
      try {
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersManager.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
