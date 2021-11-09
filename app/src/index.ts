import { app } from './app';
import { sequelize } from './sequelize';
import { elastic } from './elastic';

import { Cron } from './util/classes/Cron/Cron';
import { Checker } from './util/classes/Checker';
import { Logger } from './util/classes/Logger';

// Check environment setup
Checker.checkEnvironment();

// Connect to db
Logger.log({ location: 'index.ts', info: 'Connecting to database...' });
sequelize.sync(/* { force: true } */).then(() => {
    Logger.log({ location: 'index.ts', info: 'Connected to database!' });
    
    // Connect to elasticsearch
    // and initialize index and mapping
    Logger.log({ location: 'index.ts', info: 'Connecting to elasticsearch...' });
    elastic.checkConnection({ init: true/* , force: true */ }).then(async () => {
        Logger.log({ location: 'index.ts', info: 'Connected to elasticsearch!' });
        
        // Schedule CRON tasks
        Cron.scheduleTasks();
        
        // Listen
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            Logger.log({ location: 'index.ts', info: `Listening on port ${PORT}!` });
        });
    });
})
