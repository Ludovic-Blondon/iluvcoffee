import { ApiKeyGuard } from './api-key.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let reflector: Reflector;
  let configService: ConfigService;

  const mockReflector = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(() => {
    reflector = mockReflector as any;
    configService = mockConfigService as any;
    guard = new ApiKeyGuard(configService, reflector);
  });

  const mockContext = (headers: Record<string, string> = {}) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
      getHandler: () => 'handler',
    } as unknown as ExecutionContext;
  };

  it('should allow access to public routes', () => {
    mockReflector.get.mockReturnValue(true);
    const context = mockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if no x-api-key header is provided', () => {
    mockReflector.get.mockReturnValue(false);
    const context = mockContext();
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access if x-api-key does not match', () => {
    mockReflector.get.mockReturnValue(false);
    mockConfigService.get.mockReturnValue('correct-key');
    const context = mockContext({ 'x-api-key': 'wrong-key' });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should allow access if x-api-key matches', () => {
    mockReflector.get.mockReturnValue(false);
    mockConfigService.get.mockReturnValue('correct-key');
    const context = mockContext({ 'x-api-key': 'correct-key' });
    expect(guard.canActivate(context)).toBe(true);
  });
});
