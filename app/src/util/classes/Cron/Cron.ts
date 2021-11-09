import cron from 'node-cron';

import { updateItems } from './cronTasks';

class Cron {
    static scheduleTasks() {
        cron.schedule('0 0 * * *', updateItems);
    }
}

export { Cron };