require('dotenv').config();

const express = require("express");
const https = require('https')
const app = express();
const fs = require('fs');

const AuthMiddleware = require('./middlewares/AuthMiddleware');
const RequestTypeMiddleware = require('./middlewares/RequestTypeMiddleware');
const SimulationMiddleware = require('./middlewares/SimulationMiddleware');
const LoggerMiddleware = require('./middlewares/LoggerMiddleware');

const FundsController = require('./controllers/FundsController');
const StatusController = require('./controllers/StatusController');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", [
    LoggerMiddleware,
    SimulationMiddleware,
    AuthMiddleware,
    RequestTypeMiddleware,
    FundsController(),
    StatusController(),
]);

const options = {
    key: fs.readFileSync('../certificates/server-key.pem'),
    cert: fs.readFileSync('../certificates/server-crt.pem'),
    ca: [fs.readFileSync('../certificates/client-ca-crt.pem')],
    requestCert: process.env.MUTUAL_TLS_VERIFY === 'false' ? false : true,
    rejectUnauthorized: process.env.MUTUAL_TLS_VERIFY === 'false' ? false : true,
};

console.log(`Starting server: http://127.0.0.1:${process.env.PORT_NUMBER}`);
console.log(`Mutual TLS verification: ${process.env.MUTUAL_TLS_VERIFY === 'false' ? 'No' : 'Yes'}`);

https.createServer(options, app).listen(process.env.PORT_NUMBER);