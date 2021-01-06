import { Inject, Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { CONFIG_OPTIONS } from 'src/common/common.constants'
import { JwtModuleOptions } from './jwt.interface'

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(id: number): string {
    return jwt.sign({ id }, this.options.secretKey)
  }

  verify(token: string) {
    return jwt.verify(token, this.options.secretKey)
  }
}
