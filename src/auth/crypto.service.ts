import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class CryptoService {
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    const [salt, storedHash] = storedPassword.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }
}
