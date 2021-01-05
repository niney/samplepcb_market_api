import { InternalServerErrorException } from '@nestjs/common'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  BeforeInsert,
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
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const password = await getManager().query(
          `SELECT password(${this.password}) as pass`,
        )

        this.password = password[0].pass
      } catch {
        throw new InternalServerErrorException()
      }
    }
  }
}
