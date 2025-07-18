import { WrapResponseInterceptor } from './wrap-response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('WrapResponseInterceptor', () => {
  let interceptor: WrapResponseInterceptor;

  beforeEach(() => {
    interceptor = new WrapResponseInterceptor();
  });

  it('should wrap the response in a "data" object', (done) => {
    const context = {} as ExecutionContext;
    const responseData = { message: 'Hello world' };

    const callHandler: CallHandler = {
      handle: () => of(responseData),
    };

    interceptor.intercept(context, callHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({ data: responseData });
        done();
      },
      error: () => {
        fail('Should not throw');
        done();
      },
    });
  });
});
