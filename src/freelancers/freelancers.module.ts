import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Freelancer } from './entities/freelancer.entity'
import { Category } from './entities/category.entity'
import { CategoryResolver, FreelancersResolver } from './freelancers.resolver'
import { FreelancersService } from './freelancers.service'
import { User } from 'src/users/entities/user.entity'
import { Service } from './entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Freelancer, Service])],
  providers: [CategoryResolver, FreelancersResolver, FreelancersService],
})
export class FreelancersModule {}
