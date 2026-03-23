export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export type Personality = 'Professional' | 'Ego' | 'Loyal' | 'Troublemaker' | 'Leader';

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number; // Overall
  attributes: PlayerAttributes;
  stamina: number; // 0-100
  form: number; // 1-10
  morale: number; // 0-100
  personality: Personality;
  isStarting: boolean;
  matchesPlayed: number;
  injuryWeeks: number; // Weeks remaining
  injuryType?: string;
  suspensionWeeks: number; // Weeks remaining
  potential: number; // Max rating
  age: number;
  value: number;
  wage: number;
  contractYears: number;
  traits: string[];
  trainingFocus?: 'Pace' | 'Shooting' | 'Passing' | 'Dribbling' | 'Defending' | 'Physical' | 'Stamina';
  isOnTransferList?: boolean;
  happiness: {
    playingTime: number;
    wage: number;
    clubStatus: number;
  };
}

export interface AcademyPlayer {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  potential: number;
  age: number;
  clubIdentityMatch: number;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Coach' | 'Scout' | 'Physio';
  rating: number;
  wage: number;
}

export interface Trophy {
  id: string;
  name: string;
  year: number;
}

export interface Facilities {
  stadium: number;
  training: number;
  youth: number;
  medical: number;
}

export interface TransferTarget {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  value: number;
  age: number;
  club: string;
  isScouted?: boolean;
  agentEgo: number; // 1-10
  interest: number; // 0-100
}

export interface Team {
  id: string;
  name: string;
  rating: number;
}

export interface Fixture {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  homeScore: number | null;
  awayScore: number | null;
}

export interface LeagueTableEntry {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

export interface Tactics {
  formation: '4-2-3-1' | '4-3-3' | '4-4-2' | '3-5-2';
  mentality: 'Attacking' | 'Balanced' | 'Defensive';
  pressing: 'High' | 'Mid' | 'Low';
  passing: 'Short' | 'Mixed' | 'Direct';
  tempo: 'Slow' | 'Normal' | 'Fast';
  defensiveLine: 'High' | 'Standard' | 'Deep';
  playerInstructions: Record<string, string>; // playerId -> instruction
}

export interface SeasonHistory {
  season: number;
  position: number;
  points: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
}

export type ManagerPerk = 'Tactician' | 'Motivator' | 'Youth Specialist';

export type Weather = 'Clear' | 'Rain' | 'Snow' | 'Heatwave';

export interface SocialPost {
  id: string;
  handle: string;
  name: string;
  text: string;
  likes: number;
  retweets: number;
  timestamp: number;
  isVerified?: boolean;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  era: string;
  stats: string;
  description: string;
}

export interface RuleEffect {
  morale?: number;
  boardTrust?: number;
  supporterAtmosphere?: number;
  clubIdentityScore?: number;
  psrHeadroom?: number;
  squadMorale?: number;
  mediaPressure?: number;
  momentum?: number;
  tacticalFamiliarity?: number;
  weeklyIncome?: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: "player" | "board" | "media" | "injury" | "locker_room";
  severity: "low" | "medium" | "high";
  choices: {
    label: string;
    effects: RuleEffect;
    moraleImpact?: number;
    boardImpact?: number;
  }[];
}

export interface MediaSource {
  id: string;
  name: string;
  bias: 'positive' | 'neutral' | 'negative';
  style: 'tabloid' | 'analytical' | 'fan';
}

export interface MediaHeadline {
  id: string;
  sourceId: string;
  title: string;
  tone: 'positive' | 'neutral' | 'negative';
  timestamp: number;
}

export interface PressConference {
  id: string;
  title: string;
  description: string;
  questions: {
    text: string;
    options: {
      label: string;
      tone: 'Confident' | 'Calm' | 'Defensive' | 'Aggressive';
      effects: RuleEffect;
    }[];
  }[];
}

export type ClubPhilosophy = 'Attacking' | 'Defensive' | 'Youth' | 'Financial' | 'Balanced';

export interface ClubProfile {
  id: string;
  name: string;
  shortName: string;
  stadium: string;
  philosophy: ClubPhilosophy;
  boardExpectations: string;
  fanExpectations: string;
  transferBudget: number;
  wageBudget: number;
  squadStrength: number;
  academyStrength: number;
  commercialStrength: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  primaryColor: string;
  secondaryColor: string;
  foundedYear?: number;
  historicalTrophies?: {
    league: number;
    championsLeague: number;
    faCup: number;
    leagueCup: number;
  };
}

export interface ClubObjective {
  id: string;
  title: string;
  description: string;
  type: 'league' | 'goals' | 'academy' | 'morale' | 'psr' | 'momentum';
  target: number;
  progress: number;
  reward: RuleEffect;
  penalty: RuleEffect;
  deadline: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface GameState {
  databaseYear: number | null;
  selectedClubId: string | null;
  clubProfile: ClubProfile | null;
  managerPerk: ManagerPerk | null;
  squad: Player[];
  academyPlayers: AcademyPlayer[];
  staff: Staff[];
  trophies: Trophy[];
  facilities: Facilities;
  teams: Team[];
  fixtures: Fixture[];
  leagueTable: LeagueTableEntry[];
  boardTrust: number;
  supporterAtmosphere: number;
  clubIdentityScore: number;
  psrHeadroom: number;
  squadMorale: number;
  newsFeed: NewsItem[];
  socialFeed: SocialPost[];
  hallOfFame: HallOfFameEntry[];
  week: number;
  weather: Weather;
  tactics: Tactics;
  captainId: string | null;
  history: SeasonHistory[];
  weeklyIncome: number;
  transferTargets: TransferTarget[];
  isPaused: boolean;
  loading: boolean;
  dressingRoomCliques: {
    name: string;
    playerIds: string[];
    influence: number;
  }[];
  mediaPressure: number; // 0-100
  momentum: number; // -100 to 100
  tacticalFamiliarity: number; // 0-100
  boardObjectives: { id: string; text: string; target: number; current: number; deadline: number; type: 'points' | 'identity' | 'psr' }[];
  playerPromises: Record<string, { type: 'playtime' | 'contract'; deadline: number }>;
  rivalryMatches: string[]; // team IDs
  trainingIntensity: 'Low' | 'Normal' | 'High';
  trainingFocus: 'Fitness' | 'Attack' | 'Defense';
  activeEvent: GameEvent | null;
  activePressConference: PressConference | null;
  mediaHeadlines: MediaHeadline[];
  eventCooldowns: Record<string, number>; // eventId -> week available
  objectives: ClubObjective[];
  moraleConsistency: number; // For tracking high_morale objective
}

export interface NewsItem {
  id: string;
  text: string;
  type: 'neutral' | 'positive' | 'negative' | 'urgent';
  timestamp: number;
  week?: number;
}

export interface SaveMetadata {
  id: string;
  name: string;
  clubName: string;
  databaseYear: number;
  week: number;
  timestamp: number;
  isAutosave?: boolean;
}

export interface SaveSlot {
  metadata: SaveMetadata;
  state: GameState;
}

export type ActionType = 
  | { type: 'SELECT_DATABASE'; payload: { year: number } }
  | { type: 'SELECT_CLUB'; payload: { clubId: string, perk: ManagerPerk } }
  | { type: 'TOGGLE_STARTING'; payload: string }
  | { type: 'CHANGE_TACTICS'; payload: Partial<Tactics> }
  | { type: 'SET_CAPTAIN'; payload: string }
  | { type: 'SIMULATE_MATCH'; payload: { result: 'win' | 'draw' | 'loss', opponentId: string, goalsFor: number, goalsAgainst: number, subsMade: {in: string, out: string}[], teamTalkEffect?: number } }
  | { type: 'PRESS_CONFERENCE'; payload: { boardEffect: number, fanEffect: number, moraleEffect: number, newsText: string } }
  | { type: 'MAKE_TRANSFER'; payload: { player: TransferTarget, cost: number, success: boolean } }
  | { type: 'SELL_PLAYER'; payload: { playerId: string, price: number } }
  | { type: 'SET_TRANSFER_LIST'; payload: { playerId: string, status: boolean } }
  | { type: 'RENEW_CONTRACT'; payload: { playerId: string, wage: number, years: number } }
  | { type: 'PROMOTE_ACADEMY'; payload: string }
  | { type: 'SET_TRAINING_FOCUS'; payload: { playerId: string, focus: Player['trainingFocus'] } }
  | { type: 'UPGRADE_FACILITY'; payload: 'stadium' | 'training' | 'youth' }
  | { type: 'SCOUT_PLAYER'; payload: string }
  | { type: 'MEDICAL_TREATMENT'; payload: { playerId: string, type: 'rest' | 'injection' } }
  | { type: 'NEW_SEASON' }
  | { type: 'END_SEASON'; payload: SeasonHistory }
  | { type: 'TRIGGER_EVENT'; payload: { newsText: string, effects: Partial<GameState> } }
  | { type: 'ADD_NEWS'; payload: NewsItem }
  | { type: 'ADD_SOCIAL_POST'; payload: SocialPost }
  | { type: 'ADD_TO_HALL_OF_FAME'; payload: HallOfFameEntry }
  | { type: 'PLAYER_ACTION'; payload: { playerId: string, action: 'fine' | 'praise' | 'promise' | 'untouchable', value?: any } }
  | { type: 'QUICK_DECISION'; payload: { type: 'morale_boost' | 'rest_squad' | 'press_conf' } }
  | { type: 'INFRASTRUCTURE_UPGRADE'; payload: { type: 'stadium' | 'training' | 'medical' } }
  | { type: 'ACADEMY_ACTION'; payload: { type: 'invest' | 'mentor', payload?: any } }
  | { type: 'MEDICAL_ACTION'; payload: { playerId: string, type: 'specialist' | 'force_play' } }
  | { type: 'DRESSING_ROOM_ACTION'; payload: { type: 'resolve_conflict' | 'punish' | 'leadership', payload?: any } }
  | { type: 'SET_TRAINING_CONFIG'; payload: { intensity?: 'Low' | 'Normal' | 'High', focus?: 'Fitness' | 'Attack' | 'Defense' } }
  | { type: 'RESOLVE_EVENT'; payload: { choiceIndex: number } }
  | { type: 'RESOLVE_PRESS_QUESTION'; payload: { questionIndex: number, optionIndex: number } }
  | { type: 'UPDATE_OBJECTIVES' }
  | { type: 'ADD_OBJECTIVE'; payload: ClubObjective }
  | { type: 'MATCH_DECISION'; payload: { type: 'risk_player' | 'rotate' | 'focus_player' | 'praise_team' | 'criticize_team', value?: any } }
  | { type: 'SAVE_GAME'; payload: { name: string, isAutosave?: boolean } }
  | { type: 'LOAD_GAME'; payload: GameState };
