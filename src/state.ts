import { encrypt, decrypt } from "./aes";

const validityPeriod = 5 * 60 * 1000; // 5 minutes

interface State {
  value: string;
  expires: number;
}

export function encodeState(value: string, password: string) {
  const state: State = { value, expires: Date.now() + validityPeriod };
  return encrypt(JSON.stringify(state), password);
}

const invalidError = new Error('state is invalid');
const expiredError = new Error('state is expired');

export function tryDecodeState(encryptedState: string, password: string): string | Error {
  let state: State;
  try {
    state = JSON.parse(decrypt(encryptedState, password));
  } catch (err) {
    return invalidError;
  }
  if (Date.now() > state.expires) {
    return expiredError;
  }
  return state.value;
}
