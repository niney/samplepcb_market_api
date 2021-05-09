import { InternalServerErrorException } from '@nestjs/common'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { Freelancer } from 'src/freelancers/entities/freelancer.entity'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getManager,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum UserRole {
  Client = 'Client',
  Developer = 'Developer',
  Administrator = 'Administrator',
}

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity({
  name: 'g5_member',
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
    name: 'mb_password',
    select: false,
  })
  password: string

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

  @Column({
    name: 'mb_nick_date',
    type: 'date',
    default: '0000-00-00',
  })
  nickedAt: Date

  @Field(() => String)
  @Column({
    name: 'mb_email',
  })
  @IsEmail()
  email: string

  @Column()
  mb_homepage: string

  @Column({
    type: 'tinyint',
    default: 0,
  })
  mb_level: number

  @Column({
    name: 'mb_sex',
    type: 'char',
    length: 1,
  })
  sex: string

  @Column({
    name: 'mb_birth',
  })
  birth: string

  @Field(() => String)
  @Column({
    name: 'mb_tel',
  })
  tel: string

  @Field(() => String)
  @Column({
    name: 'mb_hp',
  })
  phone: string

  @Column({
    type: 'varchar',
    length: 20,
  })
  mb_certify: string

  @Column({
    type: 'tinyint',
    default: 0,
  })
  mb_adult: number

  @Column()
  mb_dupinfo: string

  @Column({
    type: 'char',
    length: 3,
  })
  mb_zip1: string

  @Column({
    type: 'char',
    length: 3,
  })
  mb_zip2: string

  @Column()
  mb_addr1: string

  @Column()
  mb_addr2: string

  @Column()
  mb_addr3: string

  @Column()
  mb_addr_jibeon: string

  @Column({
    type: 'text',
  })
  mb_signature: string

  @Column()
  mb_recommend: string

  @Column({
    type: 'int',
  })
  mb_point: number

  @Index('mb_today_login')
  @Column({
    name: 'mb_today_login',
    type: 'datetime',
    default: '0000-00-00 00:00:00',
  })
  loginedAt: Date

  @Column()
  mb_login_ip: string

  @Field(() => Date)
  @Index('mb_datetime')
  @Column({
    name: 'mb_datetime',
    type: 'datetime',
    default: '0000-00-00 00:00:00',
  })
  createdAt: Date

  @Column()
  mb_ip: string

  @Column({
    length: 8,
  })
  mb_leave_date: string

  @Column({
    length: 8,
  })
  mb_intercept_date: string

  @Column({
    name: 'mb_email_certify',
    type: 'datetime',
    default: '0000-00-00 00:00:00',
  })
  certifyedAt: Date

  @Column()
  mb_email_certify2: string

  @Column({
    type: 'text',
  })
  mb_memo: string

  @Column()
  mb_lost_certify: string

  @Column({
    type: 'tinyint',
    default: 0,
  })
  mb_mailling: number

  @Column({
    type: 'tinyint',
    default: 0,
  })
  mb_sms: number

  @Column({
    type: 'tinyint',
    default: 0,
  })
  mb_open: number

  @Column({
    name: 'mb_open_date',
    type: 'date',
    default: '0000-00-00',
  })
  opendAt: Date

  @Column({
    type: 'text',
  })
  mb_profile: string

  @Column()
  mb_memo_call: string

  @Column({
    type: 'tinyint',
    default: 0,
  })
  mb_partner_auth: number

  @Column()
  mb_1: string

  @Column()
  mb_2: string

  @Column()
  mb_3: string

  @Column()
  mb_4: string

  @Column()
  mb_5: string

  @Column()
  mb_6: string

  @Column()
  mb_7: string

  @Column()
  mb_8: string

  @Column()
  mb_9: string

  @Column()
  mb_10: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  mb_11: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  mb_12: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  mb_13: string

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mb_14: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  mb_15: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  mb_16: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  mb_17: string

  @OneToOne(
    () => Freelancer,
    freelancer => freelancer.user,
  )
  @JoinColumn()
  freelancer: Freelancer

  // @Column({ nullable: true })
  // freelancerId: number

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
