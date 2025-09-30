// O estado das batalhas ativas agora vive aqui, isolado.
const activeBattles: any = {};

/**
 * Busca a batalha ativa para um determinado usuário.
 * @param userId ID do usuário.
 * @returns O estado da batalha ou undefined se não houver.
 */
export const getActiveBattle = (userId: number) => {
  return activeBattles[userId];
};

/**
 * Salva ou atualiza o estado da batalha para um usuário.
 * @param userId ID do usuário.
 * @param battleState O objeto completo do estado da batalha.
 */
export const setActiveBattle = (userId: number, battleState: any) => {
  activeBattles[userId] = battleState;
};

/**
 * Remove a batalha ativa de um usuário, geralmente ao final do combate.
 * @param userId ID do usuário.
 */
export const removeActiveBattle = (userId: number) => {
  delete activeBattles[userId];
};