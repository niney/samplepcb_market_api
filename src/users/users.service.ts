import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as moment from 'moment'
import { Repository } from 'typeorm'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.users.find()
  }

  async createAccount({
    userId,
    name,
    password,
    phone,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ userId })

      if (exists) {
        return { ok: false, error: 'There is a user with that userId already' }
      }

      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const today = moment().format('YYYY-MM-DD')

      await this.users.save(
        this.users.create({
          userId,
          name,
          password,
          phone,
          nickname: name,
          email: userId,
          createdAt: now,
          loginedAt: now,
          certifyedAt: now,
          nickedAt: today,
          opendAt: today,
        }),
      )

      return {
        ok: true,
      }
    } catch {
      return { ok: false, error: "Couldn't create account" }
    }
  }
}
