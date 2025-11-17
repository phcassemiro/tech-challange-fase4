"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const mongoose_1 = __importDefault(require("mongoose"));
async function conectaNaDatabase() {
    const connectionString = process.env.DB_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("DB_CONNECTION_STRING não definida");
    }
    mongoose_1.default.connect(connectionString);
    return mongoose_1.default.connection;
}
;
exports.default = conectaNaDatabase;
//# sourceMappingURL=dbConfig.js.map