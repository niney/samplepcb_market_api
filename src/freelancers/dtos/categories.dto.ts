import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/output.dto'
import { Category } from '../entities/category.entity'

@InputType()
export class CategoriesInput {
  @Field(() => Int, { nullable: true })
  parent?: number

  @Field(() => String, { nullable: true })
  slug?: string
}

@ObjectType()
export class CategoriesOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[]
}
