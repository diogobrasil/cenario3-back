const pkg = require("@prisma/client");

const { PrismaClient } = pkg;

const client = new PrismaClient();

module.exports = { client };