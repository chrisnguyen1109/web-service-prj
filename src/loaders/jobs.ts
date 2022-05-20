import { CronJob } from 'cron';

import { removePreviousUnvailbleTime } from '@/services';

export const loadJobs = () => {
    // remove the previously unavailable time of doctor every 1am
    new CronJob(
        '00 00 01 * * *',
        async () => {
            await removePreviousUnvailbleTime();
        },
        null,
        true,
        'Asia/Bangkok'
    ).start();
};
