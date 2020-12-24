import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateUserDto } from './dtos/create-user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.usersService.getAll()
  }

  @Mutation(() => Boolean)
  createUser(@Args() createUserDto: CreateUserDto): boolean {
    console.log(createUserDto)
    return true
  }
}
