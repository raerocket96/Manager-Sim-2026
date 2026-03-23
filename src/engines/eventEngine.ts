import { GameState, GameEvent } from '../types';

const EVENT_TEMPLATES: GameEvent[] = [
  {
    id: 'star_unhappy',
    title: 'Star Player Unhappy',
    description: 'One of your key players is unhappy with their lack of playing time and demands an explanation.',
    category: 'player',
    severity: 'medium',
    choices: [
      { label: 'Promise more game time', effects: { squadMorale: 5, boardTrust: -2 } },
      { label: 'Explain the situation', effects: { squadMorale: -2, boardTrust: 2 } },
      { label: 'Ignore the complaint', effects: { squadMorale: -10, mediaPressure: 5 } }
    ]
  },
  {
    id: 'board_unhappy',
    title: 'Board is Concerned',
    description: 'The board is not satisfied with recent results and demands an immediate improvement.',
    category: 'board',
    severity: 'high',
    choices: [
      { label: 'Promise victory in next match', effects: { boardTrust: 5, mediaPressure: 10 } },
      { label: 'Ask for more time', effects: { boardTrust: -5, squadMorale: 2 } }
    ]
  },
  {
    id: 'media_criticism',
    title: 'Media Criticism',
    description: 'After the latest loss, the media has started questioning your tactical approach.',
    category: 'media',
    severity: 'low',
    choices: [
      { label: 'Defend the tactics', effects: { mediaPressure: 10, tacticalFamiliarity: 5 } },
      { label: 'Admit mistakes', effects: { mediaPressure: -5, squadMorale: -2 } }
    ]
  },
  {
    id: 'injury_crisis',
    title: 'Injury Crisis',
    description: 'Several key players have picked up minor injuries in training just before an important match.',
    category: 'injury',
    severity: 'high',
    choices: [
      { label: 'Rest the players', effects: { squadMorale: 5, momentum: -10 } },
      { label: 'Risk them', effects: { squadMorale: -5, momentum: 5 } }
    ]
  },
  {
    id: 'locker_room_conflict',
    title: 'Locker Room Conflict',
    description: 'An argument has broken out between two players in the locker room after a disagreement in training.',
    category: 'locker_room',
    severity: 'medium',
    choices: [
      { label: 'Mediate between them', effects: { squadMorale: 2, clubIdentityScore: 2 } },
      { label: 'Punish both', effects: { squadMorale: -5, boardTrust: 5 } }
    ]
  },
  {
    id: 'youth_breakthrough',
    title: 'Academy Breakthrough',
    description: 'A young player from the academy is showing exceptional form in first-team training.',
    category: 'player',
    severity: 'low',
    choices: [
      { label: 'Give him a chance', effects: { clubIdentityScore: 10, squadMorale: 5 } },
      { label: 'Keep his feet on the ground', effects: { clubIdentityScore: 2, tacticalFamiliarity: 5 } }
    ]
  },
  {
    id: 'sponsorship_deal',
    title: 'New Sponsorship Deal',
    description: 'A global brand wants to partner with the club.',
    category: 'board',
    severity: 'low',
    choices: [
      { label: 'Accept the deal', effects: { psrHeadroom: 20, boardTrust: 5 } },
      { label: 'Negotiate for more', effects: { psrHeadroom: 30, boardTrust: -2 } }
    ]
  },
  {
    id: 'legend_visit',
    title: 'Legend Visiting',
    description: 'A club legend has visited the training ground to inspire the boys.',
    category: 'locker_room',
    severity: 'low',
    choices: [
      { label: 'Let him speak to the squad', effects: { squadMorale: 15, clubIdentityScore: 5 } },
      { label: 'Private dinner', effects: { boardTrust: 5, clubIdentityScore: 2 } }
    ]
  }
];

export const generateWeeklyEvent = (state: GameState): GameEvent | null => {
  if (state.activeEvent) return null;

  // Dynamic chance based on club pressure/state
  let eventChance = 0.3;
  if (state.boardTrust < 40) eventChance += 0.15;
  if (state.squadMorale < 40) eventChance += 0.15;
  if (state.mediaPressure > 70) eventChance += 0.1;
  if (state.week % 5 === 0) eventChance += 0.2; // Regular narrative beats

  if (Math.random() > eventChance) return null;

  const availableEvents = EVENT_TEMPLATES.filter(event => {
    const cooldownWeek = state.eventCooldowns[event.id] || 0;
    if (state.week < cooldownWeek) return false;

    // Condition checks
    if (event.id === 'star_unhappy' && state.squadMorale > 70) return false;
    if (event.id === 'board_unhappy' && state.boardTrust > 60) return false;
    if (event.id === 'media_criticism' && state.mediaPressure < 40) return false;
    if (event.id === 'injury_crisis' && state.squad.filter(p => p.injuryWeeks > 0).length < 2) return false;
    if (event.id === 'locker_room_conflict' && state.squadMorale > 60) return false;
    if (event.id === 'youth_breakthrough' && state.clubIdentityScore < 30) return false;

    return true;
  });

  if (availableEvents.length === 0) return null;

  // Prioritize high severity events if they are valid
  const highSeverity = availableEvents.filter(e => e.severity === 'high');
  const pool = highSeverity.length > 0 && Math.random() > 0.5 ? highSeverity : availableEvents;

  const selected = pool[Math.floor(Math.random() * pool.length)];
  return { ...selected, id: `${selected.id}_${state.week}` };
};
