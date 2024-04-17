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

  async generateAndHashOtp6Figures(): Promise<[string, string]> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = randomBytes(8).toString('hex');
    const hashedOtp = (await scrypt(otp, salt, 32)) as Buffer;
    return [otp, `${salt}.${hashedOtp.toString('hex')}`];
  }

  async validateOtp(otp: string, storedOtp: string): Promise<boolean> {
    const [salt, storedHash] = storedOtp.split('.');
    const hash = (await scrypt(otp, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }
}
