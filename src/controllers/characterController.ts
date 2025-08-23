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