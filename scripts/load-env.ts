import { loadEnvConfig } from '@next/env';

export function loadEnv() {
  loadEnvConfig(process.cwd());
}
