import { InvalidParameterError } from '@domain/errors/errors';
import { randomBytes } from 'crypto';

const MIN_NAME_LENGTH = 2;
const MIN_ID_LENGTH = 16;

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

export function getRandomId(length: number): string {
  const randomBuffer = randomBytes(length);
  return randomBuffer.toString('hex');
}
