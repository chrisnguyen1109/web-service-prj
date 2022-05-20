import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';

import {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
} from '@/config';
import { User } from '@/models';
import { checkLogin, newUser } from '@/services';
import { AuthType } from '@/types';

export const loadPassports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await checkLogin({ email, password });

                    done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID!,
                clientSecret: FACEBOOK_APP_SECRET!,
                callbackURL: '/api/v1/auth/login-facebook/callback',
                profileFields: ['id', 'emails', 'displayName', 'photos'],
            },
            async (_accessToken, _refreshToken, profile, cb) => {
                try {
                    const {
                        id,
                        email,
                        name,
                        picture: {
                            data: { url },
                        },
                    } = profile._json;

                    let user = await User.findOne({ email });

                    if (!user) {
                        user = await newUser({
                            facebookId: id,
                            email,
                            fullName: name,
                            avatar: url,
                            authType: AuthType.FACEBOOK,
                        } as any);
                    }

                    cb(null, user);
                } catch (error) {
                    cb(error);
                }
            }
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID!,
                clientSecret: GOOGLE_CLIENT_SECRET!,
                callbackURL: '/api/v1/auth/login-google/callback',
            },
            async (_accessToken, _refreshToken, profile, cb) => {
                try {
                    const { sub, name, picture, email } = profile._json;

                    let user = await User.findOne({ email });

                    if (!user) {
                        user = await newUser({
                            googleId: sub,
                            email,
                            fullName: name,
                            avatar: picture,
                            authType: AuthType.GOOGLE,
                        } as any);
                    }

                    cb(null, user);
                } catch (error) {
                    cb(error as any);
                }
            }
        )
    );
};
