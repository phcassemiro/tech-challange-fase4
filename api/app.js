import express from 'express';
import cors from 'cors';
import swaggerDocs from './swagger.js';
import conectaNaDatabase from './src/config/dbConfig.js';
import routes from './src/routes/route.js';

const app = express();
app.use(cors());

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
  console.error("Erro de conexão:", erro);
});

conexao.once("open", () => {
  console.log("Conexão com o banco feita com sucesso");
});

app.use(express.json());

routes(app);

swaggerDocs(app);

export default app;
