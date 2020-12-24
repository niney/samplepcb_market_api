import { ArgsType, Field } from '@nestjs/graphql'
import { IsBoolean, IsEmail, IsString } from 'class-validator'

@ArgsType()
export class CreateUserDto {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => Boolean)
  @IsBoolean()
  isAdmin: boolean
}
