"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// Initialize configuration
dotenv_1.default.config();
const app = express_1.default();
// require('./startup/routes')(app); // Configure routes
// require('./startup/database')(); // Connect to database
const port = process.env.PORT || process.env.SERVER_PORT;
// tslint:disable-next-line:no-console
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = server;
//# sourceMappingURL=index.js.map