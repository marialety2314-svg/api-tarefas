import { Router, Request, Response } from "express";
import * as UserModel from "../models/userModel";
import * as TarefaModel from "../models/tarefaModel";
import { requireRole } from "../middlewares/authMiddleware";
import { Role } from "../models/userModel";

export const adminRoutes = Router();

adminRoutes.get("/admin", requireRole(Role.ADMIN), async (req: Request, res: Response) => {
  const usuarios = await UserModel.carregar();
  
  // O Admin pode ver as tarefas de TODOS os usuários
  // Vamos buscar as tarefas para cada usuário para exibir no painel
  const usuariosComTarefas = await Promise.all(
    usuarios.map(async (u) => {
      const tarefas = await TarefaModel.listarPorUsuario(u.id);
      return { ...u, tarefas };
    })
  );

  res.render("admin", { usuarios: usuariosComTarefas });
});
