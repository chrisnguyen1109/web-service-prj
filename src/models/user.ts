import { IUser, UserRole } from '@/types';
import {
    checkMultipleWords,
    groupByDate,
    omitValueObj,
    trimmedStringType,
} from '@/utils';
import mongoose, { Document, Model, Query, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { DEFAULT_AVATAR, BCRYPT_SALT } from '@/config';
import { Facility } from './facility';
import createHttpError from 'http-errors';

export interface UserDocument extends IUser, Document {
    checkPasswordModified: (jwtIat: number) => boolean;
}

interface UserModel extends Model<UserDocument> {}

const userSchema: Schema<UserDocument, UserModel> = new Schema(
    {
        fullName: {
            ...trimmedStringType,
            required: [true, 'Full name field must be required!'],
            validate: {
                validator: (val: string) => checkMultipleWords(val, 2),
                message: 'Full name contains at least 2 words',
            },
        },
        email: {
            ...trimmedStringType,
            required: [true, 'Email field must be required!'],
            unique: true,
            validate: [validator.isEmail, 'Invalid email format!'],
        },
        password: {
            ...trimmedStringType,
            required: [true, 'Password field must be required!'],
            minlength: [
                6,
                'Password must have more or equal than 6 characters!',
            ],
        },
        phoneNumber: {
            ...trimmedStringType,
            validate: [validator.isMobilePhone, 'Invalid phone number format!'],
        },
        avatar: {
            ...trimmedStringType,
            validate: [validator.isURL, 'Invalid url!'],
            default: DEFAULT_AVATAR,
        },
        role: {
            type: String,
            enum: {
                values: Object.values(UserRole),
                message: `Role is either: ${Object.values(UserRole).join(
                    ', '
                )}`,
            },
            default: UserRole.PATIENT,
        },
        passwordModified: {
            type: Date,
        },
        descriptions: {
            ...trimmedStringType,
        },
        specialisation: {
            ...trimmedStringType,
            required: [
                function (this: UserDocument) {
                    return this.role === UserRole.DOCTOR;
                },
                'Specialisation field must be required!',
            ],
        },
        unavailableTime: {
            type: [
                {
                    date: Date,
                    time: {
                        ...trimmedStringType,
                    },
                },
            ],
            default: undefined,
        },
        facility: {
            type: Schema.Types.ObjectId,
            ref: 'Facility',
            required: [
                function (this: UserDocument) {
                    return this.role === UserRole.DOCTOR;
                },
                'Doctor must belong to a facility!',
            ],
        },
        healthInfor: {
            bmiAndBsa: {
                ...trimmedStringType,
            },
            bloodPressure: {
                ...trimmedStringType,
            },
            temprature: {
                ...trimmedStringType,
            },
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                const response = omitValueObj(ret, [
                    '__v',
                    'password',
                    'passwordModified',
                    'isDelete',
                ]);

                doc.unavailableTime?.length > 0 &&
                    (response.unavailableTime = groupByDate(
                        doc.unavailableTime
                    ));

                return response;
            },
        },
        toObject: { virtuals: true },
        id: false,
    }
);

userSchema.virtual('patientAssignments', {
    ref: 'Assignment',
    foreignField: 'patient',
    localField: '_id',
});

userSchema.virtual('doctorAssignments', {
    ref: 'Assignment',
    foreignField: 'doctor',
    localField: '_id',
});

userSchema.pre<Query<UserDocument | UserDocument[], UserDocument>>(
    /^find/,
    async function (next) {
        this.find({ isDelete: { $ne: true } });

        next();
    }
);

userSchema.pre('save', async function (next) {
    if (this.isNew && this.role === UserRole.DOCTOR) {
        const facility = await Facility.findById(this.facility);

        if (!facility) {
            throw createHttpError(
                404,
                `No facility with this id: ${this.facility}`
            );
        }
    }

    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(BCRYPT_SALT ? +BCRYPT_SALT : undefined);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordModified = new Date();

    next();
});

userSchema.methods.checkPasswordModified = function (jwtIat: number) {
    if (this.passwordModified) {
        return (
            parseInt((this.passwordModified.getTime() / 1000).toString()) >
            jwtIat
        );
    }

    return false;
};

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
