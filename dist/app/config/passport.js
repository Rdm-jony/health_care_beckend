/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../modules/user/user.model.js";
import brcypt from "bcryptjs";
import { envVars } from "./env.js";
// Local Strategy
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
            return done("User does not exist");
        }
        const isPasswordCorrect = await brcypt.compare(password, isUserExist.password);
        if (!isPasswordCorrect) {
            return done("Invalid email or password.");
        }
        if (!isUserExist.isVerified) {
            return done("User is not verified");
        }
        if (isUserExist.isBlocked) {
            return done("User is blocked");
        }
        if (isUserExist.isDeleted) {
            return done("User is deleted");
        }
        const user = isUserExist.toObject();
        delete user.password;
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// Google Strategy
passport.use(new GoogleStrategy({
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email) {
            return done(null, false, { mesaage: "No email found" });
        }
        let isUserExist = await User.findOne({ email });
        if (!isUserExist) {
            const authProvider = {
                provider: "google",
                providerId: profile.id
            };
            isUserExist = await User.create({
                email: email,
                name: profile?.displayName,
                auth: [authProvider],
                isVerified: true,
                picture: profile.photos?.[0].value
            });
        }
        if (!isUserExist.isVerified) {
            return done("User is not verified");
        }
        if (isUserExist.isBlocked) {
            return done("User is blocked");
        }
        if (isUserExist.isDeleted) {
            return done("User is deleted");
        }
        return done(null, isUserExist);
    }
    catch (error) {
        return done(error);
    }
}));
// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});
// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
