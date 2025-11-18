/* eslint-disable no-undef */
import mongoose from "mongoose";
async function conectaNaDatabase() {
    const connectionString = process.env.DB_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("DB_CONNECTION_STRING não definida");
    }
    mongoose.connect(connectionString);
    return mongoose.connection;
}
;
export default conectaNaDatabase;
//# sourceMappingURL=dbConfig.js.map