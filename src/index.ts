
import dotenv from "dotenv";
import express from "express";

// Initialize configuration
dotenv.config();

const app = express();

// require('./startup/routes')(app); // Configure routes
// require('./startup/database')(); // Connect to database

const port = process.env.PORT || process.env.SERVER_PORT;

// tslint:disable-next-line:no-console
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = server;
