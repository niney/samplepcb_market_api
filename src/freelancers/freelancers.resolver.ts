import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { AuthUser } from 'src/auth/auth-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { CategoriesInput, CategoriesOutput } from './dtos/categories.dto'
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto'
import {
  CreateFreelancerInput,
  CreateFreelancerOutput,
} from './dtos/create-freelancer.dto'
import { Category } from './entities/category.entity'
import { Freelancer } from './entities/freelancer.entity'
import { FreelancersService } from './freelancers.service'

@Resolver(() => Freelancer)
export class FreelancersResolver {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Mutation(() => CreateFreelancerOutput)
  async createFreelancer(
    @AuthUser() authUser: User,
    @Args('input') createFreelancerInput: CreateFreelancerInput,
  ): Promise<CreateFreelancerOutput> {
    return await this.freelancersService.createFreelancer(
      authUser?.id,
      createFreelancerInput,
    )
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Mutation(() => CreateCategoryOutput)
  async createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return await this.freelancersService.createCategory(createCategoryInput)
  }

  @Query(() => CategoriesOutput)
  async categories(
    @Args('input') categoriesInput: CategoriesInput,
  ): Promise<CategoriesOutput> {
    return await this.freelancersService.findCategories(categoriesInput)
  }
}
