import { LoggingMiddleware } from './logging.middleware';
import { Request, Response } from 'express';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    jest.spyOn(console, 'time').mockImplementation(() => {});
    jest.spyOn(console, 'timeEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call res.on with finish event and call next()', () => {
    const req = {} as Request;
    const res = {
      on: jest.fn((event: string, callback: () => void) => {
        if (event === 'finish') {
          callback();
        }
      }),
    } as unknown as Response;
    const next = jest.fn();

    middleware.use(req, res, next);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((res as any).on).toHaveBeenCalledWith(
      'finish',
      expect.any(Function),
    );
    expect(next).toHaveBeenCalled();
    expect(console.time).toHaveBeenCalledWith('Request-response time');
    expect(console.timeEnd).toHaveBeenCalledWith('Request-response time');
  });
});
