import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/output.dto'

@InputType()
export class CreateFreelancerInput {
  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => String)
  sex: string

  @Field(() => String)
  career: string

  @Field(() => String, { nullable: true })
  userId?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  password?: string

  @Field(() => String, { nullable: true })
  phone?: string
}

@ObjectType()
export class CreateFreelancerOutput extends CoreOutput {}
