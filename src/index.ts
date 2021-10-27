import { app } from './app';
import { sequelize } from './connection';

const PORT = process.env.PORT || 8080;
sequelize.sync(/* { force: true } */).then(() => {
    console.log('Connected to database!');
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}!`);
    });
})