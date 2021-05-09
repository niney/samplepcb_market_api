import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { CoreEntity } from 'src/common/entities/core.entity'
import { User } from 'src/users/entities/user.entity'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
// import { Category } from './category.entity'
import { Service } from './service.entity'

@InputType('FreelancerInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Freelancer extends CoreEntity {
  @OneToOne(
    () => User,
    user => user.freelancer,
    { onDelete: 'CASCADE' },
  )
  user: User

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string

  // @Field(() => [Category])
  // @ManyToMany(() => Category)
  // services: Category[]

  @Field(() => [Service])
  @OneToMany(
    () => Service,
    service => service.freelancer,
  )
  services: Service[]
}
