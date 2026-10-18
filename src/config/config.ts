import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface AppConfig {
  ui: { baseUrl: string; username?: string; password?: string };
  api: { baseUrl: string };
  run: {
    retries: number;
    ciRetries: number;
    workers: number;
    timeoutMs: number;
    expectTimeoutMs: number;
  };
  evidence: { highlightColor: string; highlightWidthPx: number };
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const CONFIG_DIR = path.resolve(__dirname, '..', '..', 'config');

function readYaml(file: string): DeepPartial<AppConfig> {
  const full = path.join(CONFIG_DIR, `${file}.yaml`);
  if (!fs.existsSync(full)) return {};
  return (yaml.load(fs.readFileSync(full, 'utf8')) ?? {}) as DeepPartial<AppConfig>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) return (override ?? base) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = isObject(value) ? deepMerge(out[key], value) : (value ?? out[key]);
  }
  return out as T;
}

function envOverrides(env: NodeJS.ProcessEnv): DeepPartial<AppConfig> {
  return {
    ui: { baseUrl: env.UI_BASE_URL, username: env.UI_USERNAME, password: env.UI_PASSWORD },
    api: { baseUrl: env.API_BASE_URL },
  };
}

/** Layers: config/default.yaml -> config/<TEST_ENV>.yaml -> environment variables. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const base = readYaml('default') as AppConfig;
  const layered = env.TEST_ENV && env.TEST_ENV !== 'default' ? readYaml(env.TEST_ENV) : {};
  return deepMerge(deepMerge(base, layered), envOverrides(env));
}

export const config = loadConfig();

export interface UiCredentials {
  username: string;
  password: string;
}

export const MISSING_CREDENTIALS_MESSAGE =
  'UI credentials are not set. Export UI_USERNAME and UI_PASSWORD ' +
  '(the demo site shows them on its /login page) to run the login tests.';

export function hasUiCredentials(cfg: AppConfig = config): boolean {
  return Boolean(cfg.ui.username && cfg.ui.password);
}

/** Returns the UI credentials or throws a clear error when they are missing. */
export function requireUiCredentials(cfg: AppConfig = config): UiCredentials {
  const { username, password } = cfg.ui;
  if (!username || !password) throw new Error(MISSING_CREDENTIALS_MESSAGE);
  return { username, password };
}
