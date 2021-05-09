import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/output.dto'

@InputType()
export class CreateFreelancerInput {
  @Field(() => [Number])
  categoriesIds: number[]
}

@ObjectType()
export class CreateFreelancerOutput extends CoreOutput {}
