import {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
} from '@/config';
import { AuthType } from '@/types';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export const loadPassports = () => {
    passport.use(
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID!,
                clientSecret: FACEBOOK_APP_SECRET!,
                callbackURL: '/api/v1/auth/login-facebook/callback',
                profileFields: ['id', 'emails', 'displayName', 'photos'],
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    const {
                        id,
                        email,
                        name,
                        picture: {
                            data: { url },
                        },
                    } = profile._json;

                    cb(null, {
                        facebookId: id,
                        email,
                        fullName: name,
                        avatar: url,
                        authType: AuthType.FACEBOOK,
                    });
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

                    cb(null, {
                        googleId: sub,
                        email,
                        fullName: name,
                        avatar: picture,
                        authType: AuthType.GOOGLE,
                    });
                } catch (error) {
                    cb(error as any);
                }
            }
        )
    );
};
