// require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MAX_PORT = 6000; // Set a maximum port limit

const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (port < MAX_PORT) { // Check if the port is within the limit
                console.warn(`Port ${port} is in use, trying another port...`);
                startServer(port + 1);
            } else {
                console.error(`No available ports between ${PORT} and ${MAX_PORT}. Please free a port or change the port range.`);
            }
        } else {
            throw err;
        }
    });
};

startServer(PORT);

/*
Backend Structure
backend/
├── config/
│   └── db.js
├── controllers/
│   └── superUserController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   └── superUserModel.js
├── routes/
│   └── superUserRoutes.js
├── app.js
└── server.js
*/
