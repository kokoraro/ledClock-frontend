"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary packages
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// Initialize Express app
const app = (0, express_1.default)();
// Use body-parser middleware to parse JSON requests
app.use(body_parser_1.default.json());
// Serve static files from 'public' directory
app.use(express_1.default.static('public'));
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
