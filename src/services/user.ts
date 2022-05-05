import { Doctor, Patient, User, UserDocument } from '@/models';
import { IDoctor, IPatient, IUser, OmitIsDelete, UserRole } from '@/types';
import { getFilterData } from '@/utils';
import createHttpError from 'http-errors';

export const getFilterUser = (query: Record<string, any>) => {
    return getFilterData<UserDocument>(User, query, [
        'email',
        'fullName',
        'phoneNumber',
        'role',
    ]);
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw createHttpError(404, `No user with this id: ${id}`);
    }

    return user;
};

export const newUser = async (
    createUserBody: OmitIsDelete<IUser> & { externals: IPatient | IDoctor }
) => {
    const { externals, ...rest } = createUserBody;

    const user = await User.create({ ...rest });

    if (user.role === UserRole.PATIENT) {
        const newPatient = await Patient.create({
            ...externals,
            user: user._id,
        });

        return {
            user,
            patient: newPatient,
        };
    }

    if (user.role === UserRole.DOCTOR) {
        const newDoctor = await Doctor.create({ ...externals, user: user._id });

        return {
            user,
            doctor: newDoctor,
        };
    }

    return { user };
};

interface FindAndUpdateUserProps {
    id: string;
    body: Pick<IUser, 'avatar' | 'fullName' | 'phoneNumber'>;
}

export const findAndUpdateUser = async ({
    id,
    body,
}: FindAndUpdateUserProps) => {
    const updateUser = await User.findByIdAndUpdate(
        id,
        {
            ...body,
        },
        { new: true }
    );

    if (!updateUser) {
        throw createHttpError(404, `No user with this id: ${id}`);
    }

    return updateUser;
};

export const softDeleteUser = async (id: string) => {
    const deletedUser = await User.findOneAndUpdate(
        {
            _id: id,
            role: { $ne: UserRole.ADMIN },
        },
        { isDelete: true }
    );

    if (!deletedUser) {
        throw createHttpError(
            404,
            `No user with this id: ${id} or this user is an admin!`
        );
    }

    return deletedUser;
};
