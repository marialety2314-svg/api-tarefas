import { Router, Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";
import { requireAuth } from "../middlewares/authMiddleware";

export const tarefaRoutes = Router();

// Aplicar requireAuth em todas as rotas de tarefas
tarefaRoutes.use(requireAuth);

tarefaRoutes.get("/tarefas", async (req: Request, res: Response) => {
  const tarefas = await TarefaModel.listarPorUsuario(req.session.userId!);
  res.render("tarefas", { 
    nome: req.session.userName, 
    tarefas 
  });
});

tarefaRoutes.post("/tarefas", async (req: Request, res: Response) => {
  const { texto } = req.body;
  if (texto?.trim()) {
    await TarefaModel.adicionar(req.session.userId!, texto);
    req.session.flash = "Tarefa adicionada!";
  }
  res.redirect("/tarefas");
});

tarefaRoutes.post("/tarefas/:id/concluir", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await TarefaModel.concluir(id, req.session.userId!);
  res.redirect("/tarefas");
});

tarefaRoutes.post("/tarefas/:id/remover", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await TarefaModel.remover(id, req.session.userId!);
  res.redirect("/tarefas");
});
