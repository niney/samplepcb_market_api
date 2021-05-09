import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsInt, IsString } from 'class-validator'
import { CoreEntity } from 'src/common/entities/core.entity'
import { Column, Entity, OneToMany } from 'typeorm'
// import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
// import { Freelancer } from './freelancer.entity'
import { Service } from './service.entity'

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string

  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  slug: string

  @Field(() => Number)
  @Column()
  @IsInt()
  parent: number

  @Field(() => Number)
  @Column()
  @IsInt()
  order: number

  // @Field(() => [Freelancer])
  // @ManyToMany(
  //   () => Freelancer,
  //   freelancer => freelancer.services,
  // )
  // @JoinTable()
  // freelancers: Freelancer[]

  @Field(() => Service, { nullable: true })
  @OneToMany(
    () => Service,
    service => service.category,
  )
  services?: Service[]
}
