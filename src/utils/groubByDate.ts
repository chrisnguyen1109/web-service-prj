import { DATE_FORMAT } from '@/config';
import { UnavailableTime } from '@/types';
import { format } from 'date-fns';

export const groupByDate = (array: UnavailableTime[]) => {
    return array.reduce(
        (acc, cur) => {
            const date = format(cur['date'], DATE_FORMAT);

            return { ...acc, [date]: (acc[date] || []).concat(cur['time']) };
        },
        {} as {
            [key: string]: string[];
        }
    );
};
