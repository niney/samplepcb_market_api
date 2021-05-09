import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/output.dto'
import { Category } from '../entities/category.entity'
import { Freelancer } from '../entities/freelancer.entity'

@InputType()
export class CategoryInput {
  @Field(() => Int, { nullable: true })
  parent?: number

  @Field(() => String, { nullable: true })
  slug?: string
}

@ObjectType()
export class CategroyOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[]

  @Field(() => [Freelancer], { nullable: true })
  freelancers?: Freelancer[]
}
