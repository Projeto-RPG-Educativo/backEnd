import express from 'express';
import userRoutes from './routes/userRoutes'; // 1. IMPORTAR AS ROTAS DE USUÁRIO

const app = express();
const PORT = 3000;

app.use(express.json());

// 2. DIZER AO EXPRESS PARA USAR O ROTEADOR DE USUÁRIOS
// Todas as rotas definidas em userRoutes agora começarão com /api/usuarios
app.use('/api/usuarios', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
});