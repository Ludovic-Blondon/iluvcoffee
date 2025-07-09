import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';
describe('ApiKeyGuard', () => {
  let apiKeyGuard: ApiKeyGuard;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    apiKeyGuard = new ApiKeyGuard(configService);
  });
  it('should be defined', () => {
    expect(apiKeyGuard).toBeDefined();
  });
});
