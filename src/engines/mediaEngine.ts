import { GameState, MediaSource, MediaHeadline, PressConference } from '../types';

export const MEDIA_OUTLETS: MediaSource[] = [
  { id: 'the_athletic', name: 'The Athletic', bias: 'neutral', style: 'analytical' },
  { id: 'the_sun', name: 'The Sun', bias: 'negative', style: 'tabloid' },
  { id: 'sky_sports', name: 'Sky Sports', bias: 'neutral', style: 'analytical' },
  { id: 'daily_mail', name: 'Daily Mail', bias: 'negative', style: 'tabloid' },
  { id: 'bbc_sport', name: 'BBC Sport', bias: 'neutral', style: 'analytical' },
  { id: 'fan_tv', name: 'Fan TV', bias: 'negative', style: 'fan' },
  { id: 'club_insider', name: 'Club Insider', bias: 'positive', style: 'fan' },
];

export const generateMediaReaction = (state: GameState, context: { result: 'win' | 'draw' | 'loss', opponent: string, goalsFor: number, goalsAgainst: number }): MediaHeadline[] => {
  const headlines: MediaHeadline[] = [];
  const { result, opponent, goalsFor, goalsAgainst } = context;
  const clubName = state.clubProfile?.name || 'The Club';
  const shortName = state.clubProfile?.shortName || 'The Club';

  MEDIA_OUTLETS.forEach(source => {
    let title = '';
    let tone: 'positive' | 'neutral' | 'negative' = 'neutral';

    if (result === 'win') {
      tone = source.bias === 'negative' ? 'neutral' : 'positive';
      if (goalsFor >= 3) {
        title = source.style === 'tabloid' ? `GOAL FEST! ${goalsFor} goals against ${opponent}` : `Dominant performance as ${shortName} swept aside ${opponent}`;
      } else {
        title = source.style === 'fan' ? `Victory! Solid performance against ${opponent}` : `${shortName} secured vital points against ${opponent}`;
      }
    } else if (result === 'loss') {
      tone = source.bias === 'positive' ? 'neutral' : 'negative';
      if (goalsAgainst >= 3) {
        title = source.style === 'tabloid' ? `CRISIS! Humiliation against ${opponent}` : `Defensive collapse leads to heavy defeat against ${opponent}`;
      } else {
        title = source.style === 'fan' ? `Not good enough. Another loss against ${opponent}` : `${shortName} fell short in narrow defeat against ${opponent}`;
      }
    } else {
      title = source.style === 'analytical' ? `Tactical stalemate: ${shortName} drew against ${opponent}` : `Points shared after the final whistle`;
    }

    // Add state-based flavor
    if (state.boardTrust < 30 && source.style === 'tabloid') {
      title = `SACK WATCH: Is time up for the manager at ${shortName}?`;
      tone = 'negative';
    } else if (state.squadMorale < 40 && source.style === 'fan') {
      title = `Locker room leaks? Morale at rock bottom in ${shortName}`;
      tone = 'negative';
    }

    headlines.push({
      id: `headline-${source.id}-${Date.now()}-${Math.random()}`,
      sourceId: source.id,
      title,
      tone,
      timestamp: Date.now()
    });
  });

  return headlines;
};

export const generatePressConference = (state: GameState, context: { type: 'pre_match' | 'post_loss' | 'board_pressure' | 'event' }): PressConference | null => {
  const pc: PressConference = {
    id: `pc-${Date.now()}`,
    title: context.type === 'pre_match' ? 'Pre-Match Press Conference' : 'Emergency Press Briefing',
    description: context.type === 'pre_match' ? 'The media is gathered before the big game.' : 'Journalists are demanding answers after recent events.',
    questions: []
  };

  if (context.type === 'post_loss') {
    pc.questions.push({
      text: "That was a disappointing result. What went wrong today?",
      options: [
        { label: "We will bounce back, I have full faith in the boys.", tone: 'Confident', effects: { squadMorale: 5, mediaPressure: 5 } },
        { label: "We need to analyze the mistakes and improve.", tone: 'Calm', effects: { tacticalFamiliarity: 5, mediaPressure: -5 } },
        { label: "The refereeing was questionable at best.", tone: 'Defensive', effects: { mediaPressure: 15, boardTrust: -5 } },
        { label: "The performance was unacceptable from everyone.", tone: 'Aggressive', effects: { squadMorale: -10, boardTrust: 5 } }
      ]
    });
  } else if (context.type === 'board_pressure') {
    pc.questions.push({
      text: "Rumors are circulating about your future. Do you still have the board's backing?",
      options: [
        { label: "I am focused on the long-term project here.", tone: 'Calm', effects: { boardTrust: 5, mediaPressure: -5 } },
        { label: "Results will speak for themselves soon.", tone: 'Confident', effects: { momentum: 10, mediaPressure: 10 } },
        { label: "That's a question for the board, not me.", tone: 'Defensive', effects: { mediaPressure: 15, boardTrust: -10 } },
        { label: "Stop listening to tabloid nonsense.", tone: 'Aggressive', effects: { mediaPressure: 20, supporterAtmosphere: 5 } }
      ]
    });
  } else {
    pc.questions.push({
      text: "How is the team spirit ahead of the next fixture?",
      options: [
        { label: "The atmosphere is electric, we are ready.", tone: 'Confident', effects: { squadMorale: 5, momentum: 5 } },
        { label: "We are working hard on the training ground.", tone: 'Calm', effects: { tacticalFamiliarity: 5, mediaPressure: -5 } },
        { label: "We've had some distractions, but we're focused.", tone: 'Defensive', effects: { mediaPressure: 5 } },
        { label: "I don't discuss internal matters with the press.", tone: 'Aggressive', effects: { mediaPressure: 10, squadMorale: -5 } }
      ]
    });
  }

  return pc;
};
