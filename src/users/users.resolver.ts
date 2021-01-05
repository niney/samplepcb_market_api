import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    // console.log('request', req)
    return await this.usersService.createAccount(createAccountInput)
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.usersService.getAll()
  }

  // @Mutation(() => Boolean)
  // createUser(@Args() createUserDto: CreateUserDto): boolean {
  //   console.log(createUserDto)
  //   return true
  // }
}
