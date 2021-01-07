import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as moment from 'moment'
import { JwtService } from 'src/jwt/jwt.service'
import { Repository } from 'typeorm'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { UserProfileOutput } from './dtos/user-profile.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

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

  async login({ userId, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { userId },
        { select: ['id', 'password'] },
      )

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        }
      }

      const passwordCorrect = await user.checkPassword(password)
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        }
      }

      const token = this.jwtService.sign(user.id)

      return {
        ok: true,
        token,
      }
    } catch {
      return {
        ok: false,
        error: "Can't log user in.",
      }
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id })
      return { ok: true, user }
    } catch {
      return { ok: false, error: 'User Not Found' }
    }
  }
}
