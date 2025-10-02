import { Request, Response } from 'express';
import * as saveService from '../services/saveService';

export const saveGameHandler = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { characterId, slotName, characterState } = req.body;

  const save = await saveService.createOrUpdateSave(
    userId,
    characterId,
    slotName,
    characterState
  );
  
  res.status(201).json(save);
};

export const listSavesHandler = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const saves = await saveService.getSavesForUser(userId);
  res.status(200).json(saves);
};