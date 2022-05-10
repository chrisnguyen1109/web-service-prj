import { User, UserDocument } from '@/models';
import { FieldUserUpdate, IUser, OmitIsDelete, UserRole } from '@/types';
import { getFilterData, getRecordData, omitValueObj } from '@/utils';
import { startOfDay } from 'date-fns';
import createHttpError from 'http-errors';

export const getFilterUser = (query: Record<string, any>) => {
    return getFilterData<UserDocument>(User, query, [
        'email',
        'fullName',
        'phoneNumber',
        'role',
        'specialisation',
        'descriptions',
    ]);
};

export const getUserById = async (id: string, query: Record<string, any>) => {
    const user = await getRecordData<UserDocument>(User, id, query);

    if (!user) {
        throw createHttpError(404, `No user with this id: ${id}`);
    }

    return user;
};

export const newUser = async (createUserBody: OmitIsDelete<IUser>) => {
    const user = await User.create({ ...createUserBody });

    return user;
};
interface FindAndUpdateUserProps {
    id: string;
    body: FieldUserUpdate;
    currentRole: UserRole;
}

export const findAndUpdateUser = async ({
    id,
    body,
    currentRole,
}: FindAndUpdateUserProps) => {
    const matchingUser = await User.findById(id);

    if (!matchingUser) {
        throw createHttpError(404, `No user with this id: ${id}`);
    }

    if (
        currentRole === UserRole.DOCTOR &&
        matchingUser.role !== UserRole.PATIENT
    ) {
        throw createHttpError(
            403,
            'You do not have permission to perform this action!'
        );
    }

    const newBody = (() => {
        switch (true) {
            case matchingUser.role === UserRole.PATIENT: {
                return omitValueObj(body, [
                    'descriptions',
                    'specialisation',
                    'unavailableTime',
                    'facility',
                ]);
            }
            case matchingUser.role === UserRole.DOCTOR: {
                return omitValueObj(body, ['healthInfor']);
            }
            default: {
                return omitValueObj(body, [
                    'descriptions',
                    'specialisation',
                    'unavailableTime',
                    'facility',
                    'healthInfor',
                ]);
            }
        }
    })();

    const updateUser = await User.findByIdAndUpdate(
        id,
        {
            ...newBody,
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

export const removePreviousUnvailbleTime = async () => {
    return User.updateMany(
        {},
        {
            $pull: {
                unavailableTime: {
                    date: {
                        $lte: startOfDay(new Date()),
                    },
                },
            },
        }
    );
};
