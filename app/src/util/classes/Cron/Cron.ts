import cron from 'node-cron';

import { updateDatabase } from './cronTasks';

class Cron {
    static scheduleTasks() {
        cron.schedule('0 0 * * *', updateDatabase);
    }
}



export { Cron };