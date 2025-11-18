"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = __importDefault(require("./swagger"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const route_1 = __importDefault(require("./routes/route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Conexão com o banco
(async () => {
    try {
        const conexao = await (0, dbConfig_1.default)();
        conexao.on("error", (erro) => {
            console.error("Erro de conexão:", erro);
        });
        conexao.once("open", () => {
            console.log("Conexão com o banco feita com sucesso");
        });
    }
    catch (error) {
        console.error("Erro ao conectar com o banco:", error);
    }
})();
// Aplicação das rotas
app.use("/api", route_1.default);
// Documentação Swagger
(0, swagger_1.default)(app);
exports.default = app;
//# sourceMappingURL=app.js.map