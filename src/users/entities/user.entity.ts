import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column()
  email: string

  @Field(() => Boolean, { nullable: true })
  @Column()
  isAdmin?: boolean
}
