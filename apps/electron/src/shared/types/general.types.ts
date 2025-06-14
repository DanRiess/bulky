import { ApiStatus } from "@web/api/api.types";

export type TradeNotification = {
  notificationType: "trade";
  ign: string;
  league: string;
  tradeData: string;
  timestamp: number;
  inviteSent: boolean;
  show: boolean;
  timeout: NodeJS.Timeout | undefined;
};

/**
 * Decoded minified trade notification.
 * All values have already been converted to display values in this type.
 * E. g. 'category' might be something like '8 Mod Maps with Regex'
 */
export type DecodedMTN = {
  category: string;
  trades: string[];
  chaosPerDiv: number;
  fullPrice: number;
  regex?: string;
};

export type SplitClientTxtLine = {
  date: string;
  time: string;
  code: string;
  sender: string;
  message: string;
};

export type ErrorNotification = {
  notificationType: "error";
  message: string;
  status: ApiStatus;
  timestamp: number;
  ttl: number;
  timeout?: NodeJS.Timeout;
};
