import { InternalServerErrorException } from '@nestjs/common'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getManager,
  PrimaryGeneratedColumn,
} from 'typeorm'

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity({
  name: 'g5_member',
  synchronize: false,
})
export class User {
  @PrimaryGeneratedColumn({ name: 'mb_no' })
  @Field(() => Number)
  id: number

  @Field(() => String)
  @Column({
    name: 'mb_id',
    unique: true,
  })
  userId: string

  @Field(() => String)
  @Column({
    name: 'mb_email',
  })
  @IsEmail()
  email: string

  @Field(() => String)
  @Column({
    name: 'mb_name',
  })
  name: string

  @Field(() => String)
  @Column({
    name: 'mb_nick',
  })
  nickname: string

  @Field(() => String)
  @Column({
    name: 'mb_password',
  })
  password: string

  @Field(() => String)
  @Column({
    name: 'mb_tel',
  })
  phone: string

  @Column({
    name: 'mb_datetime',
  })
  @Field(() => Date)
  createdAt: Date

  @Column({
    name: 'mb_nick_date',
  })
  nickedAt: Date

  @Column({
    name: 'mb_today_login',
  })
  loginedAt: Date

  @Column({
    name: 'mb_email_certify',
  })
  certifyedAt: Date

  @Column({
    name: 'mb_open_date',
  })
  opendAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const password = await getManager().query(
          `SELECT password('${this.password}') as pass`,
        )

        this.password = password[0].pass
      } catch {
        throw new InternalServerErrorException()
      }
    }
  }

  async checkPassword(loginPassword: string): Promise<boolean> {
    try {
      const result = await getManager().query(
        `SELECT password('${loginPassword}') as pass`,
      )
      const password = result[0].pass

      return this.password === password
    } catch {
      throw new InternalServerErrorException()
    }
  }
}
