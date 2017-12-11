import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';

const encryptionAlgorithm = 'aes-256-gcm';

export function encrypt(text: string, password: string) {
  const iv = randomBytes(16);
  const cipher = createCipheriv(encryptionAlgorithm, password, iv);
  let cipherText = cipher.update(text, 'utf8', 'hex');
  cipherText += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return iv.toString('hex') + authTag + cipherText;
}

export function decrypt(text: string, password: string) {
  if (text.length < 64) {
    throw new Error('invalid cipher text');
  }
  const iv = Buffer.from(text.substr(0, 32), 'hex');
  const authTag = Buffer.from(text.substr(32, 32), 'hex');
  const cipherText = text.substr(64);
  const decipher = createDecipheriv(encryptionAlgorithm, password, iv);
  decipher.setAuthTag(authTag);
  let dec = decipher.update(cipherText, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
