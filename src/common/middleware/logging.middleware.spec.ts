import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    jest.spyOn(console, 'time').mockImplementation(() => { });
    jest.spyOn(console, 'timeEnd').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call res.on with finish event and call next()', () => {
    const req = {};
    const res = {
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      }),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(next).toHaveBeenCalled();
    expect(console.time).toHaveBeenCalledWith('Request-response time');
    expect(console.timeEnd).toHaveBeenCalledWith('Request-response time');
  });
});
