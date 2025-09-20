console.log('--- EXECUTANDO A VERSÃO MAIS RECENTE DO INDEX.TS ---');

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import userRoutes from './routes/userRoutes';
import characterRoutes from './routes/characterRoutes';
import battleRoutes from './routes/battleRoutes';
import questionRoutes from './routes/questionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- ROTEADORES ---
// Esta seção está correta e é a mais importante.
app.use('/api/usuarios', userRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/batalha', battleRoutes);
app.use('/api/perguntas', questionRoutes);

// --- INÍCIO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});