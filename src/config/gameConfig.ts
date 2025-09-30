// src/config/gameConfig.ts

// Neste objeto, definimos todas as constantes relacionadas ao balanceamento do jogo.
const gameConfig = {
  costs: {
    attack: 2,
    defend: 1,
    ability: 3,
  },
  battle: {
    xpWinReward: 50,
    energyRecovery: 10,
  },
  skills: {
    mago: {
      damageMultiplier: 2,
    },
    tank: {
      healAmount: 15,
    },
    lutador: {
      bonusDamage: 10,
    },
  },
};

export default gameConfig;