import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsBoolean } from 'class-validator'
import { CoreEntity } from 'src/common/entities/core.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Category } from './category.entity'
import { Freelancer } from './freelancer.entity'

@InputType('ServiceInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Service extends CoreEntity {
  @Field(() => Boolean)
  @Column()
  @IsBoolean()
  isTop: boolean

  @Field(() => Freelancer)
  @ManyToOne(
    () => Freelancer,
    freelancer => freelancer.services,
  )
  freelancer: Freelancer

  @Field(() => Category)
  @ManyToOne(
    () => Category,
    category => category.services,
  )
  category: Category
}
