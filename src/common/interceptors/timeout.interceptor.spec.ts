import { TimeoutInterceptor } from './timeout.interceptor';
import {
  CallHandler,
  ExecutionContext,
  RequestTimeoutException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { TimeoutError } from 'rxjs';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;

  beforeEach(() => {
    interceptor = new TimeoutInterceptor();
  });

  it('should pass through if execution is under 3000ms', (done) => {
    const executionContext = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => of('OK'),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: (result) => {
        expect(result).toBe('OK');
        done();
      },
    });
  });

  it('should throw RequestTimeoutException if execution exceeds 3000ms', (done) => {
    const executionContext = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () =>
        throwError(() => new TimeoutError),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: () => {
        fail('Expected a timeout error');
      },
      error: (err) => {
        expect(err).toBeInstanceOf(RequestTimeoutException);
        done();
      },
    });
  });

  it('should propagate other errors untouched', (done) => {
    const customError = new Error('Other error');
    const executionContext = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => throwError(() => customError),
    };

    interceptor.intercept(executionContext, callHandler).subscribe({
      next: () => {
        fail('Expected an error to be thrown');
      },
      error: (err) => {
        expect(err).toBe(customError);
        done();
      },
    });
  });
});
