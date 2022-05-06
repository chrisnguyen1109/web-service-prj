import { Assignment, AssignmentDocument, User } from '@/models';
import { IAssignment, OmitIsDelete, UserRole } from '@/types';
import { checkSimilarTime, getFilterData, getRecordData } from '@/utils';
import createHttpError from 'http-errors';

export const getFilterAssignment = (query: Record<string, any>) => {
    return getFilterData<AssignmentDocument>(Assignment, query, [
        'status',
        'notes',
    ]);
};

export const getAssignmentById = async (
    id: string,
    query: Record<string, any>
) => {
    const assignment = await getRecordData<AssignmentDocument>(
        Assignment,
        id,
        query
    );

    if (!assignment) {
        throw createHttpError(404, `No assignment with this id: ${id}`);
    }

    return assignment;
};

export const newAssignment = async (assignment: OmitIsDelete<IAssignment>) => {
    const { patient, doctor } = assignment;

    const matchingPatient = await User.findById(patient as string);
    if (!matchingPatient || matchingPatient.role !== UserRole.PATIENT) {
        throw createHttpError(404, `No patient with this id: ${patient}`);
    }

    const matchingDoctor = await User.findById(doctor as string);
    if (!matchingDoctor || matchingDoctor.role !== UserRole.DOCTOR) {
        throw createHttpError(404, `No doctor with this id: ${doctor}`);
    }

    return Assignment.create({ ...assignment });
};

interface FindAndUpdateAssignmentProps {
    id: string;
    body: Pick<IAssignment, 'status' | 'notes'>;
}

export const findAndUpdateAssignment = async ({
    id,
    body,
}: FindAndUpdateAssignmentProps) => {
    const updateAssignment = await Assignment.findByIdAndUpdate(
        id,
        {
            ...body,
        },
        { new: true }
    );

    if (!updateAssignment) {
        throw createHttpError(404, `No assignment with this id: ${id}`);
    }

    return updateAssignment;
};

export const softDeleteAssignment = async (id: string) => {
    const deletedAssignment = await Assignment.findByIdAndUpdate(id, {
        isDelete: true,
    });

    if (!deletedAssignment) {
        throw createHttpError(404, `No assignment with this id: ${id}`);
    }

    const doctor = await User.findById(deletedAssignment.doctor);
    if (!doctor) {
        throw createHttpError(
            404,
            `No doctor with this id: ${deletedAssignment.doctor}`
        );
    }

    doctor.unavailableTime = doctor.unavailableTime!.filter(
        value => !checkSimilarTime(deletedAssignment.assignmentTime, value)
    );

    await doctor.save();

    return deletedAssignment;
};
