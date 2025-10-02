import { Request, Response } from 'express';
import * as characterService from '../services/characterService';

export const getCharacterHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const character = await characterService.findCharacterById(id);
    if (!character) {
      return res.status(404).json({ message: 'Personagem não encontrado.' });
    }
    res.status(200).json(character);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar personagem.', error: error.message });
  }
};

export const saveProgressHandler = async (req: Request, res: Response) => {
  try {
    const { characterId, xp, hp } = req.body;
    const updatedCharacter = await characterService.updateCharacterProgress(characterId, xp, hp);
    res.status(200).json(updatedCharacter);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao salvar o progresso.', error: error.message });
  }
};

export const createCharacterHandler = async (req: Request, res: Response) => {
  try {
    // 1. O ID do usuário logado. Este dado é seguro, pois vem do token JWT
    //    que foi validado pelo nosso 'authMiddleware'.
    const userId = req.user.id;

    // 2. Os dados do personagem que o front-end enviou no corpo (Body) da requisição.
    //    Ex: nome e classe escolhidos pelo jogador na tela de criação.
    const characterData = req.body;

    // 3. Delega a lógica de criação para a camada de serviço.
    const newCharacter = await characterService.createCharacter(userId, characterData);
    
    // 4. Se tudo deu certo, retorna o status 201 (Created) e o personagem recém-criado.
    res.status(201).json(newCharacter);
  } catch (error: any) {
    // 5. Se o service jogar um erro (ex: usuário já tem um personagem), ele é capturado aqui.
    res.status(400).json({ message: error.message });
  }
};