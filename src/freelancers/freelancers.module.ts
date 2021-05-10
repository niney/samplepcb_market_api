import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Freelancer } from './entities/freelancer.entity'
import { Category } from './entities/category.entity'
import { CategoryResolver, FreelancersResolver } from './freelancers.resolver'
import { FreelancersService } from './freelancers.service'
import { User } from 'src/users/entities/user.entity'
import { Service } from './entities/service.entity'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Freelancer, Service]),
    UsersModule,
  ],
  providers: [CategoryResolver, FreelancersResolver, FreelancersService],
})
export class FreelancersModule {}
