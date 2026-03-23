import { GameState, RuleEffect } from './types';

export const applyRuleEffect = (state: GameState, effect: RuleEffect): GameState => {
  return {
    ...state,
    boardTrust: Math.max(0, Math.min(100, state.boardTrust + (effect.boardTrust || 0))),
    supporterAtmosphere: Math.max(0, Math.min(100, state.supporterAtmosphere + (effect.supporterAtmosphere || 0))),
    clubIdentityScore: Math.max(0, Math.min(100, state.clubIdentityScore + (effect.clubIdentityScore || 0))),
    psrHeadroom: state.psrHeadroom + (effect.psrHeadroom || 0),
    squadMorale: Math.max(0, Math.min(100, state.squadMorale + (effect.squadMorale || 0))),
    mediaPressure: Math.max(0, Math.min(100, state.mediaPressure + (effect.mediaPressure || 0))),
    momentum: Math.max(-100, Math.min(100, state.momentum + (effect.momentum || 0))),
    tacticalFamiliarity: Math.max(0, Math.min(100, state.tacticalFamiliarity + (effect.tacticalFamiliarity || 0))),
    weeklyIncome: state.weeklyIncome + (effect.weeklyIncome || 0),
  };
};
