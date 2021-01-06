import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return await this.usersService.createAccount(createAccountInput)
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return await this.usersService.login(loginInput)
  }

  @Query(() => User)
  me(@Context() context) {
    console.log(context.token)
    return this.usersService.findById(878)
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
