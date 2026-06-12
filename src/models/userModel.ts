import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

const ARQUIVO = "dados/usuarios.json";
const SALT_ROUNDS = 10;

export async function carregar(): Promise<User[]> {
  try {
    const data = await readFile(ARQUIVO, "utf-8");
    return JSON.parse(data);
  } catch {
    await writeFile(ARQUIVO, "[]");
    return [];
  }
}

async function salvar(users: User[]): Promise<void> {
  await writeFile(ARQUIVO, JSON.stringify(users, null, 2));
}

export async function buscarPorEmail(email: string): Promise<User | undefined> {
  const users = await carregar();
  return users.find((u) => u.email === email);
}

export async function buscarPorId(id: number): Promise<User | undefined> {
  const users = await carregar();
  return users.find((u) => u.id === id);
}

export async function registrar(nome: string, email: string, senhaTexto: string): Promise<User> {
  const users = await carregar();
  
  if (users.some((u) => u.email === email)) {
    throw new Error("Email já cadastrado");
  }

  const senhaHash = await bcrypt.hash(senhaTexto, SALT_ROUNDS);
  
  // Primeiro usuário registrado = admin automático
  const role = users.length === 0 ? Role.ADMIN : Role.USER;

  const novo: User = {
    id: (users.at(-1)?.id ?? 0) + 1,
    nome,
    email,
    senha: senhaHash,
    role,
  };

  users.push(novo);
  await salvar(users);
  return novo;
}

export async function login(email: string, senhaTexto: string): Promise<User | null> {
  const user = await buscarPorEmail(email);
  if (!user) return null;

  const senhaCorreta = await bcrypt.compare(senhaTexto, user.senha);
  return senhaCorreta ? user : null;
}
