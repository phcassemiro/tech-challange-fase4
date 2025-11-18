import { Request, Response, NextFunction } from 'express';
declare class AuthController {
    /**
     * @swagger
     * /auth/registrar:
     *   post:
     *     summary: Registra um novo usuário
     *     tags:
     *       - Autenticação
     *     description: Cria uma nova conta de usuário no sistema.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *               cargo:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *       400:
     *         description: Erro na requisição
     *       500:
     *         description: Erro interno do servidor
     */
    static registrar(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Realiza login
     *     tags:
     *       - Autenticação
     *     description: Retorna um token JWT se as credenciais forem válidas.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *       401:
     *         description: Credenciais inválidas
     *       500:
     *         description: Erro interno do servidor
     */
    static login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
export default AuthController;
//# sourceMappingURL=authController.d.ts.map