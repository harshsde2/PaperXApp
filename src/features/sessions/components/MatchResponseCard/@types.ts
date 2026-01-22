/**
 * MatchResponseCard Types
 */

import { MatchResponse } from '../../@types';

export interface MatchResponseCardProps {
  response: MatchResponse;
  onChat: (response: MatchResponse) => void;
  onShortlist: (response: MatchResponse) => void;
  onReject: (response: MatchResponse) => void;
}
