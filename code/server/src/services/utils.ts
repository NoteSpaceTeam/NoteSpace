import { InvalidParameterError } from '@src/errors';
import { randomBytes } from 'crypto';

const MIN_NAME_LENGTH = 2;
const MIN_ID_LENGTH = 8;
const DEFAULT_ID_LENGTH = 16;

export function validateName(name: string) {
  if (name.length < MIN_NAME_LENGTH) {
    throw new InvalidParameterError('Invalid name');
  }
}

export function validateId(id: string) {
  if (id.length < MIN_ID_LENGTH) {
    throw new InvalidParameterError('Invalid id');
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new InvalidParameterError('Invalid email');
  }
}

export function validatePositiveNumber(num: number) {
  if (num < 0) {
    throw new InvalidParameterError('Invalid value');
  }
}

export function encodeToBase64(content: any): string {
  const jsonString = JSON.stringify(content);
  return Buffer.from(jsonString).toString('base64');
}

export function decodeFromBase64(base64String: string): any {
  const jsonString = Buffer.from(base64String, 'base64').toString('utf8');
  return JSON.parse(jsonString);
}

export function getRandomId(length: number = DEFAULT_ID_LENGTH): string {
  const byteLength = Math.ceil(length / 2); // each byte corresponds to 2 hex characters
  const randomBuffer = randomBytes(byteLength);
  return randomBuffer.toString('hex').slice(0, length);
}
