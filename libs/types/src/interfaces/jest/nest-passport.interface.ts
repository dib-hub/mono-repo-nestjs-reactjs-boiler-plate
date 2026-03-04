export interface NestPassportMockModule {
  AuthGuard: (strategy?: string | string[]) => new (...args: unknown[]) => unknown;
}
