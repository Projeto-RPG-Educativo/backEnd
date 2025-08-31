import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import userRoutes from './routes/userRoutes';
import characterRoutes from './routes/characterRoutes';
import battleRoutes from './routes/battleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- ROTEADORES ---
app.use('/api/usuarios', userRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/batalha', battleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});