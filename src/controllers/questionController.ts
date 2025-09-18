import { Request, Response } from 'express';
import * as questionService from '../services/questionService';

export const getRandomQuestionHandler = async (req: Request, res: Response) => {
  try {
    // 1. Chama a função do service que busca a pergunta no banco.
    const question = await questionService.getRandomQuestion();
    
    // 2. Se tudo deu certo, envia a pergunta com status 200 (OK).
    res.status(200).json(question);
  } catch (error: any) {
    // 3. Se o service lançar um erro (ex: nenhuma pergunta encontrada),
    //    capturamos o erro aqui e enviamos uma resposta apropriada (404 Not Found).
    res.status(404).json({ message: error.message });
  }
};