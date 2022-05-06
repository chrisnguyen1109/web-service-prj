import { UnavailableTime } from '@/types';
import { format } from 'date-fns';

export const checkSimilarTime = (
    assignmentTime: UnavailableTime,
    unavailableTime: UnavailableTime
) => {
    return (
        format(unavailableTime.date, 'dd/MM/yyyy') ===
            format(assignmentTime.date, 'dd/MM/yyyy') &&
        unavailableTime.time === assignmentTime.time
    );
};
