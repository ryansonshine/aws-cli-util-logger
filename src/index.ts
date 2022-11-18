import chalk from 'chalk';
import os from 'os';
import { PrintArgs } from './types';
import { promisify } from 'util';
import { exec } from 'child_process';

export interface AwsCliUtilLoggerOptions {
  /**
   * Name of the npm package.
   *
   * @example
   * "aws-sso-creds-helper"
   */
  packageName: string;
  /**
   * Name of the bin command.
   *
   * @example
   * "ssocreds"
   */
  binCommand?: string;
  /**
   * Enables verbose logging.
   *
   * @default
   * false
   */
  verbose?: boolean;
  /**
   * When true, disables **ALL** logging output.
   *
   * @default
   * false
   */
  disabled?: boolean;
  /**
   * Debug flag for your CLI.
   *
   * @default
   * "--debug"
   */
  debugFlag?: string;
}

export class AwsCliUtilLogger {
  name: string;
  binCommand?: string;
  debugFlag: string;
  disabled: boolean;
  LOG_PREFIX: string;
  SEPARATOR: string;
  verbose: boolean;
  constructor({
    packageName,
    disabled,
    verbose,
    binCommand,
    debugFlag = '--debug',
  }: AwsCliUtilLoggerOptions) {
    this.name = packageName;
    this.binCommand = binCommand;
    this.debugFlag = debugFlag;
    this.disabled = disabled ?? false;
    this.LOG_PREFIX = `[${this.name}]:`;
    this.SEPARATOR = ', ';
    this.verbose = verbose ?? false;
  }

  public success(...messages: string[]): void {
    this.print({ color: 'green', messages });
  }

  public info(...messages: string[]): void {
    this.print({ color: 'cyan', messages });
  }

  public warn(...messages: string[]): void {
    this.print({ color: 'yellow', messages });
  }

  public error(...messages: string[]): void {
    this.print({ color: 'red', messages, error: true });
  }

  public debug(...messages: string[]): void {
    if (this.verbose) {
      this.print({ color: 'gray', messages });
    }
  }

  public log(...messages: string[]): void {
    this.print({ color: 'white', messages });
  }

  public setVerbose(level: boolean): void {
    this.verbose = level;
  }

  public isVerbose(): boolean {
    return this.verbose;
  }

  public disable(): void {
    this.disabled = true;
  }

  public enable(): void {
    this.disabled = false;
  }

  public handleError = (e: Error | unknown, debug = false): void => {
    this.enable();
    if (e instanceof Error) {
      this.error(e.message);
      if (e.stack && debug) {
        this.log(e.stack);
      }
    } else {
      this.error('An unknown error has occured');
    }
    if (!debug) {
      this.info(
        chalk.dim(
          `Run ${this.binCommand || 'the command again'} with ${chalk.dim(
            this.debugFlag
          )} flag for more details.`
        )
      );
    }
  };

  public async logSystemInfo(profile: string): Promise<void> {
    const [cliVersion, profileConfig] = await Promise.all([
      this.getCliVersion(),
      this.getCliConfig(profile),
    ]);

    this.debug('===========');
    this.debug('SYSTEM INFO');
    this.debug('===========');
    this.debug(`AWS CLI Version ${cliVersion}`);
    this.debug(`OS ${os.platform()} ${os.release()}`);
    this.debug(`Node ${process.version}`);

    this.debug('==============');
    this.debug('PROFILE CONFIG');
    this.debug('==============');
    this.debug(profileConfig);
  }

  private formatMessages(messages: string[]): string {
    return messages.join(this.SEPARATOR);
  }

  private print({ color, messages, error = false }: PrintArgs): void {
    if (!this.disabled) {
      console[error ? 'error' : 'log'](
        `${chalk[color].bold(this.LOG_PREFIX, this.formatMessages(messages))}`
      );
    }
  }

  private async getCliVersion(): Promise<string> {
    const pexec = promisify(exec);
    let version = '';
    try {
      const { stdout = '' } = await pexec('aws --version');
      version = stdout.replace('\n', '');
    } catch (e) {
      version = 'NOT FOUND';
    }
    return version;
  }

  private async getCliConfig(profile = 'default'): Promise<string> {
    const pexec = promisify(exec);
    let config = '';
    try {
      const { stdout = '' } = await pexec(
        `aws configure list --profile ${profile}`
      );
      config += `\n${stdout}`;
    } catch (e) {
      config = 'NOT FOUND';
    }
    return config;
  }
}
