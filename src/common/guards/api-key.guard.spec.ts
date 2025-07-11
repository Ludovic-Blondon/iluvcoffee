import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';
describe('ApiKeyGuard', () => {
  let apiKeyGuard: ApiKeyGuard;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    // Mock Reflector since it's not imported and we only need it for instantiation
    const mockReflector = { get: jest.fn() } as any;
    apiKeyGuard = new ApiKeyGuard(configService, mockReflector);
  });
  it('should be defined', () => {
    expect(apiKeyGuard).toBeDefined();
  });
});
