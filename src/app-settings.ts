import { parse as parseUrl } from 'url';

export interface AppSettings {
  client_id: string;
  client_secret: string;
  bot_token: string;
  origins: string[];
  state_password: string;
  app_root: string;
  base_path: string;
  user_agent: string;
  secure_cookie: boolean;
}

export async function getAppSettings(): Promise<AppSettings> {
  const { CLIENT_ID, CLIENT_SECRET, BOT_TOKEN, STATE_PASSWORD, APP_ROOT, ORIGINS, USER_AGENT } = process.env;
  console.log(`CLIENT_ID: ${CLIENT_ID}
HAS CLIENT_SECRET: ${!!CLIENT_SECRET}
HAS BOT_TOKEN: ${!!BOT_TOKEN}
HAS STATE_PASSWORD: ${!!STATE_PASSWORD}
APP_ROOT: ${APP_ROOT}
ORIGINS: ${ORIGINS}
USER_AGENT: ${USER_AGENT}`);

  if (!CLIENT_ID || !CLIENT_SECRET || !BOT_TOKEN || !STATE_PASSWORD || !APP_ROOT || !ORIGINS || !USER_AGENT) {
    throw new Error('missing app settings.');
  }

  const client_id = CLIENT_ID;
  const client_secret = CLIENT_SECRET;
  const bot_token = BOT_TOKEN;
  const state_password = STATE_PASSWORD;
  const { app_root, base_path, secure_cookie } = parseAppRoot(APP_ROOT);
  const origins = ORIGINS.split(',');
  const user_agent = USER_AGENT;

  if (state_password.length !== 32) {
    throw new Error('"state-password" must be 32 characters.');
  }

  return { client_id, client_secret, state_password, bot_token, origins, app_root, base_path, user_agent, secure_cookie };
}

function parseAppRoot(url: string) {
  const parsed = parseUrl(url);
  let app_root = parsed.href!;
  let base_path = parsed.pathname!;
  if (app_root.endsWith('/')) {
    app_root = app_root.substr(0, app_root.length - 1);
  }
  if (base_path.endsWith('/')) {
    base_path = base_path.substr(0, base_path.length - 1);
  }
  const secure_cookie = parsed.protocol === 'https:';
  return { app_root, base_path, secure_cookie };
}
