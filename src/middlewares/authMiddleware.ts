import { Request, Response, NextFunction } from "express";
import { Role } from "../models/userModel";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    req.session.flash = "Você precisa estar logado para acessar esta página.";
    return res.redirect("/login");
  }
  next();
}

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      req.session.flash = "Sessão expirada. Faça login novamente.";
      return res.redirect("/login");
    }

    if (req.session.role !== role) {
      req.session.flash = "Acesso negado: Você não tem permissão para acessar esta página.";
      return res.redirect("/tarefas");
    }

    next();
  };
}
