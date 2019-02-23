'use strict';

const express = require('express');
const app = express();

require('./startup/routes')(app); // Configure routes
require('./startup/database')(); // Connect to database


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));


module.exports = server;
