import { Color } from 'chalk';

export interface PrintArgs {
  color: typeof Color;
  messages: string[];
  error?: boolean;
}
