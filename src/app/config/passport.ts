/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import brcypt from "bcryptjs"

// Local Strategy
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExists = await User.findOne({ email });
            if (!isUserExists) {
                return done("User does not exist")
            }
            const isPasswordCorrect = await brcypt.compare(password, isUserExists.password as string);
            if (!isPasswordCorrect) {
                return done("Invalid email or password.");
            }

            return done(null, isUserExists)
        } catch (error) {
           return done(error)
        }

    })
)

// Serialize user for session
passport.serializeUser((user:any, done:any) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});