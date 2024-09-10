import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt'

@Injectable()
export class EncryptionsService {

  async hash(plain: string): Promise<string> {
    return hash(plain, +process.env.HASH_ROUNDS || 12);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }

}
