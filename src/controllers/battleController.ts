import { Request, Response } from 'express';
import * as battleService from '../services/battleService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Controller para iniciar a batalha
export const startBattleHandler = async (req: Request, res: Response) => {
  try {
    // req.user.id é fornecido pelo authMiddleware após validar o token JWT
    const userId = req.user.id; 
    const { monsterId } = req.body; // O front-end envia o ID do monstro encontrado

    if (!monsterId) {
      return res.status(400).json({ message: 'monsterId é obrigatório.' });
    }

    const battleState = await battleService.startBattle(userId, monsterId);
    res.status(200).json(battleState);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao iniciar a batalha.', error: error.message });
  }
};

// Controller para processar a resposta do jogador
export const submitAnswerHandler = async (req: Request, res: Response) => {

  console.log('--- DADOS DO TOKEN (req.user): ---');
  console.log(req.user);
  console.log('------------------------------------');

  try {
    const userId = req.user.id;
    const { battleId, questionId, answer } = req.body; // O front-end envia os dados da jogada

    if (battleId === undefined || questionId === undefined || answer === undefined) {
      return res.status(400).json({ message: 'battleId, questionId e answer são obrigatórios.' });
    }

    const newBattleState = await battleService.processAnswer(userId, battleId, questionId, answer);
    res.status(200).json(newBattleState);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao processar a resposta.', error: error.message });
  }
};

// Nova função para salvar o progresso
export const saveProgressHandler = async (req: Request, res: Response) => {
    try {
        const { characterId, xpGanho, vidaAtual } = req.body;

        if (!characterId) {
            return res.status(400).json({ error: "ID do personagem é obrigatório." });
        }

        const personagemAtualizado = await prisma.character.update({
            where: { id: characterId },
            data: {
                xp: { increment: xpGanho },
                hp: vidaAtual,
                lastSavedAt: new Date(),
            },
            include: {
                class: true,
            }
        });

        res.json(personagemAtualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao salvar o progresso do personagem.' });
    }
};

export const handleBattleAction = async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    const userId = req.user.id;
    let result;

    // O switch direciona para a função de serviço orquestradora correta
    switch (action.toUpperCase()) {
      case 'ATTACK':
        result = await battleService.attack(userId);
        break;

      case 'DEFEND':
        result = await battleService.defend(userId);
        break;
      
      case 'ABILITY': // ✅ CASO DA HABILIDADE ADICIONADO
        result = await battleService.useSkill(userId);
        break;

      default:
        return res.status(400).json({ message: "Ação de batalha inválida." });
    }

    res.status(200).json(result);

  } catch (error: any) {
    // Erros como "Energia insuficiente" lançados pelo serviço serão capturados aqui
    res.status(400).json({ message: error.message });
  }
};