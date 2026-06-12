import express from "express";
import session from "express-session";
import { authRoutes } from "./routes/authRoutes";
import { tarefaRoutes } from "./routes/tarefaRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "chave-secreta-tarefas",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("public"));

// Middleware global para flash e session nas views
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  req.session.flash = null;
  res.locals.session = req.session;
  next();
});

app.use(authRoutes);
app.use(tarefaRoutes);
app.use(adminRoutes);

app.listen(3000, () => console.log("✅ App Tarefas rodando em http://localhost:3000"));
