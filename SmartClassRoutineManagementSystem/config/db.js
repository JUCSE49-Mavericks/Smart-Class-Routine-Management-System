//config/db.js

const mysql = require('mysql');
if (process.env.CI === 'true') {
    console.log('Skipping actual DB connection in CI environment');
    module.exports = {
        query: () => { return { yields: () => {} }; }, // Mock query method
    };
} else {

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_class_routine"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;
}
