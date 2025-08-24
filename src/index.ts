import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import characterRoutes from './routes/characterRoutes';
import battleRoutes from './routes/battleRoutes';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o Express entender JSON
app.use(express.json());

// Roteadores
app.use('/api/usuarios', userRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/batalha', battleRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});

