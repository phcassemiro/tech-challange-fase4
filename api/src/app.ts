import express, { Application } from 'express';
import cors from 'cors';
import swaggerDocs from './swagger';
import conectaNaDatabase from './config/dbConfig';
import routes from './routes/route';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Conexão com o banco
(async () => {
  try {
    const conexao = await conectaNaDatabase();

    conexao.on("error", (erro) => {
      console.error("Erro de conexão:", erro);
    });

    conexao.once("open", () => {
      console.log("Conexão com o banco feita com sucesso");
    });
  } catch (error) {
    console.error("Erro ao conectar com o banco:", error);
  }
})();

// Aplicação das rotas
app.use("/api", routes);

// Documentação Swagger
swaggerDocs(app);

export default app;
