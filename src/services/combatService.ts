import gameConfig from "../config/gameConfig";

/**
 * Calcula o dano base de um personagem com base em sua classe.
 * @param character O objeto do personagem em batalha.
 * @returns O valor do dano.
 */
export const calculateCharacterDamage = (character: any): number => {
  switch (character.className.toLowerCase()) {
    case 'tank':
    case 'lutador':
    case 'ladino':
    case 'paladino':
      return character.strength || 5;
    case 'mago':
    case 'bardo':
      return character.intelligence || 5;
    default:
      return Math.max(character.strength, character.intelligence) || 5;
  }
};

/**
 * Processa o turno do jogador baseado na resposta a uma pergunta.
 * @param battleState O estado atual da batalha.
 * @param isCorrect Se a resposta do jogador foi correta.
 * @returns Um objeto com o dano causado, o dano recebido e uma mensagem.
 */
export const processAnswerTurn = (battleState: any, isCorrect: boolean) => {
  let damageDealt = 0;
  let damageTaken = 0;
  let turnResult = '';
  
  // 2. USAR O VALOR DA CONFIGURAÇÃO
  const energyRecovered = gameConfig.battle.energyRecovery; 

  if (isCorrect) {
    battleState.character.energy += energyRecovered;
    damageDealt = calculateCharacterDamage(battleState.character);
    battleState.monster.hp -= damageDealt;
    // 3. ATUALIZAR A MENSAGEM
    turnResult = `Você acertou! O monstro sofreu ${damageDealt} de dano e você recuperou ${energyRecovered} de energia.`;
  } else {
    // ... (lógica de erro continua a mesma)
  }

  return { updatedBattleState: battleState, turnResult: turnResult };
};

/**
 * Aplica o efeito de um ataque.
 * @param character O personagem que ataca.
 * @returns Um objeto com o dano causado e uma mensagem.
 */
export const performAttack = (character: any) => {
  const damageDealt = calculateCharacterDamage(character);
  const turnResult = `Você atacou! O monstro sofreu ${damageDealt} de dano.`;
  return { damageDealt, turnResult };
};

/**
 * Aplica o efeito de uma defesa.
 * @param character O personagem que defende.
 * @returns Um objeto com o novo estado de defesa e uma mensagem.
 */
export const performDefense = (character: any) => {
  // Apenas marcamos que o personagem está defendendo.
  const updatedCharacter = { ...character, isDefending: true };
  const turnResult = `Você se prepara para o próximo ataque, bloqueando o dano.`;
  return { updatedCharacter, turnResult };
};

/**
 * Aplica o efeito da habilidade especial de uma classe.
 * @param character O personagem que usa a habilidade.
 * @param monster O monstro alvo.
 * @returns Um objeto com os estados atualizados e uma mensagem do turno.
 */
export const performSkill = (character: any, monster: any) => {
  let turnResult = '';
  let updatedCharacter = { ...character };
  let updatedMonster = { ...monster };

  switch (updatedCharacter.className.toLowerCase()) {
    case 'mago':
      // 4. USAR VALORES DA CONFIGURAÇÃO PARA HABILIDADES
      const damage = updatedCharacter.intelligence * gameConfig.skills.mago.damageMultiplier;
      updatedMonster.hp -= damage;
      turnResult = `Você canaliza uma Bola de Fogo e causa ${damage} de dano arcano!`;
      break;
    case 'tank':
      const heal = gameConfig.skills.tank.healAmount;
      updatedCharacter.hp += heal;
      turnResult = `Você usa Escudo Protetor e recupera ${heal} de vida!`;
      break;
    case 'lutador':
      const criticalDamage = updatedCharacter.strength + gameConfig.skills.lutador.bonusDamage;
      updatedMonster.hp -= criticalDamage;
      turnResult = `Você desfere um Soco Devastador, causando ${criticalDamage} de dano!`;
      break;
    default:
      turnResult = `Sua classe (${updatedCharacter.className}) não possui uma habilidade especial implementada.`;
      break;
  }
  return { updatedCharacter, updatedMonster, turnResult };
};
