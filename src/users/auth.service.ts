import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

//scrypt is async by nature and required to use as a callback. we dont want to use callback so we use primisify to make it a promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    //see if email is in use
    const users = await this.usersService.find(email);

    if (users.length) throw new BadRequestException('email in use');
    //hash user password
    //-generate a salt
    //---generate 8 bytes of decimal number and turn it into a hexadecimal string
    const salt = randomBytes(8).toString('hex');
    //-hash the salt and generate together
    //--hash the password with the salt, 32 strong
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //---this is to help typescript to let it know what hash' type is. otherwise it says unknown

    //-join the hashed result and the salrt together.
    const result = salt + '.' + hash.toString('hex');

    //create new user and save it
    const user = await this.usersService.create(email, result);
    //return the user;

    const payload = { sub: user.id, email: user.email };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong email or password');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }
}

// // auth.service.ts
// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async signup(email: string, password: string) {
//     const users = await this.usersService.find(email);
//     if (users.length) throw new BadRequestException('email in use');

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await this.usersService.create(email, hashedPassword);

//     const accessToken = this.generateAccessToken(user.id, user.email);

//     return {
//       user,
//       token: accessToken,
//     };
//   }

//   async signin(email: string, password: string) {
//     const [user] = await this.usersService.find(email);
//     if (!user) throw new NotFoundException('User not found');

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       throw new BadRequestException('wrong email or password');
//     }

//     const accessToken = this.generateAccessToken(user.id, user.email);

//     return {
//       user,
//       token: accessToken,
//     };
//   }

//   private generateAccessToken(userId: string, userEmail: string): string {
//     const payload = { sub: userId, email: userEmail };
//     return this.jwtService.sign(payload);
//   }
// }
