import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType()
export class CreateAccountInput extends PickType(User, [
  'userId',
  'name',
  'password',
  'phone',
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User
}
