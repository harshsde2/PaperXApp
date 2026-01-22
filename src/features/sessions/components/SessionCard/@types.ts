/**
 * SessionCard Types
 */

import { Session } from '../../@types';

export interface SessionCardProps {
  session: Session;
  onPress: (session: Session) => void;
  onViewMatches?: (session: Session) => void;
}
