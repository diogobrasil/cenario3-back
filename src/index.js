//importações necessárias para o projeto
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

//configuração de json e cors
app.use(bodyParser.json());
app.use(cors());

//rota que lista todos os usuários cadastrados
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  if (users.length > 0) return res.status(200).send(users);
  return res.send("Não há usuários encontrados.");
});

//rota que cadastra um usuário
app.post("/user", async (req, res) => {
  const data = req.body;
  await prisma.user.create({
    data: {
      name: data.name,
    },
  });
  return res.sendStatus(201);
});

//rota que apaga um usuário, passando o id
app.delete("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Delete o usuário do banco de dados aqui
    const deletedUser = await prisma.user.delete({
        where: {
            id: Number(id),
        },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao deletar o usuário');
  }
});

//rota que atualiza um usuário, pelo id
app.put("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;
    // Atualize o usuário no banco de dados aqui
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: userData,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao atualizar o usuário');
  }
});

//rota que lista usuários que contenham o nome específico
app.get("/users/:name", async (req, res) => {
  const name = req.params.name;
  const user = await prisma.user.findMany({
    where: {
      name: name,
    },
  });
  if (user.length > 0) return res.status(200).send(user);
  return res.send("Usuário não encontrado.");

});

//rota que lista um usuário pelo id
app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Busque o usuário do banco de dados aqui
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao buscar o usuário');
  }
});

// Inicie o servidor na porta especificada
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = { app, server };