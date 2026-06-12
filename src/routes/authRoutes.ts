import { Router, Request, Response } from "express";
import * as UserModel from "../models/userModel";

export const authRoutes = Router();

authRoutes.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

authRoutes.get("/registro", (req: Request, res: Response) => {
  res.render("registro");
});

authRoutes.post("/registro", async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || senha?.length < 6) {
    req.session.flash = "Dados inválidos. A senha deve ter no mínimo 6 caracteres.";
    return res.redirect("/registro");
  }

  try {
    await UserModel.registrar(nome, email, senha);
    req.session.flash = "Conta criada com sucesso! Faça seu login.";
    res.redirect("/login");
  } catch (error: any) {
    req.session.flash = error.message;
    res.redirect("/registro");
  }
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const user = await UserModel.login(email, senha);

  if (!user) {
    req.session.flash = "Email ou senha incorretos.";
    return res.redirect("/login");
  }

  req.session.userId = user.id;
  req.session.userName = user.nome;
  req.session.role = user.role;
  res.redirect("/tarefas");
});

authRoutes.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
