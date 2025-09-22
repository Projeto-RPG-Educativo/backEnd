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

app.use(express.json());
const corsOptions = {
  origin: '*', // Para produção, use a URL do seu front-end.
  methods: 'GET,POST,PUT,DELETE,PATCH,HEAD, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization', // <-- A LINHA MÁGICA
};
app.use(cors(corsOptions));


// --- ROTEADORES ---
app.use('/api/usuarios', userRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/batalha', battleRoutes);
app.use('/api/perguntas', questionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});