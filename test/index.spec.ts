import { AwsCliUtilLogger } from '../src';
import * as nodeUtil from 'util';
import * as cp from 'child_process';

const logSpy = jest.spyOn(console, 'log');
const errorSpy = jest.spyOn(console, 'error');

jest.mock('util');
jest.mock('child_process');

describe('logger', () => {
  let logger: AwsCliUtilLogger;
  beforeEach(() => {
    logger = new AwsCliUtilLogger({
      packageName: 'aws-cli-util-logger',
    });
    jest.clearAllMocks();
  });

  describe('non-error non-debug log methods', () => {
    const methods: (keyof Pick<
      typeof logger,
      'success' | 'info' | 'warn' | 'log'
    >)[] = ['success', 'info', 'warn', 'log'];

    it('should log on each standard method', () => {
      expect.assertions(methods.length);

      methods.forEach((method, i) => {
        const msg = `test-${i}`;
        const expected = expect.stringContaining(msg);

        logger[method](msg);

        expect(logSpy).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('debug', () => {
    it('should log when verbose is true', () => {
      logger.setVerbose(true);
      logger.debug('test');

      expect(logSpy).toHaveBeenCalled();
    });

    it('should not log when verbose is false', () => {
      logger.debug('test');

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should call console error', () => {
      logger.error('test');

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('disable', () => {
    it('should not print to console when after disabled', () => {
      logger.info('first');
      logger.disable();
      logger.info('second');

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('first'));
    });
  });

  describe('enable', () => {
    it('should print to console when enabled after disabled', () => {
      logger.disable();
      logger.info('should not log');
      logger.enable();
      logger.info('should log');

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('should log')
      );
    });
  });

  describe('isVerbose', () => {
    it('should return true when verbose is set to true', () => {
      logger.setVerbose(true);

      const result = logger.isVerbose();

      expect(result).toEqual(true);
    });
  });

  describe('handleError', () => {
    const error = new Error('test error');

    it('should enable logger', () => {
      const spy = jest.spyOn(logger, 'enable');
      logger.handleError(error);

      expect(spy).toHaveBeenCalled();
    });

    it('should log stack if stack is present and debug is true', () => {
      const spy = jest.spyOn(logger, 'log');
      logger.handleError(error, true);

      expect(spy).toHaveBeenCalledWith(error.stack);
    });

    it('should log info message with debug details if debug is disabled', () => {
      const spy = jest.spyOn(logger, 'info');
      const expected = expect.stringContaining('--debug');

      logger.handleError(error, false);

      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('should log an unknown error has occured when the error is not an instance of error', () => {
      const spy = jest.spyOn(logger, 'error');
      const notAnError = {};

      logger.handleError(notAnError);

      expect(spy).toHaveBeenCalledWith('An unknown error has occured');
    });
  });

  describe('logSystemInfo', () => {
    it('should invoke exec for cli version', async () => {
      const exec = jest.spyOn(cp, 'exec');
      jest.spyOn(nodeUtil, 'promisify').mockImplementation(exec => exec);

      await logger.logSystemInfo('default');

      expect(exec).toHaveBeenCalledWith('aws --version');
    });

    it('should invoke exec for the aws cli config', async () => {
      const exec = jest.spyOn(cp, 'exec');
      jest.spyOn(nodeUtil, 'promisify').mockImplementation(exec => exec);

      await logger.logSystemInfo('default');

      expect(exec).toHaveBeenCalledWith('aws configure list --profile default');
    });
  });
});
