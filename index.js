const app = require('./src/app');
const APP_PORT = process.env.APP_PORT || 3000;

app.listen(APP_PORT, () => 
    console.log(`Server listening on port ${APP_PORT}`)
);