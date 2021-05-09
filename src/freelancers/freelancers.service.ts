import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { In, Repository } from 'typeorm'
import { CategoriesInput, CategoriesOutput } from './dtos/categories.dto'
import { CategoryInput, CategroyOutput } from './dtos/category.dto'
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
import { Service } from './entities/service.entity'

@Injectable()
export class FreelancersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Freelancer)
    private readonly freelancers: Repository<Freelancer>,
    @InjectRepository(Service)
    private readonly services: Repository<Service>,
  ) {}

  async createCategory({
    name,
    slug,
    parent,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      const categorySlug = slug
        .trim()
        .toLowerCase()
        .replace(/ /g, '-')

      const exists = await this.categories.findOne({ slug: categorySlug })

      if (exists) {
        return {
          ok: false,
          error: 'There is a category with that name already',
        }
      }

      const last = await this.categories.findOne({
        where: {
          parent,
        },
        order: {
          order: 'DESC',
        },
      })

      const order = !last ? 1 : last.order + 1

      await this.categories.save(
        this.categories.create({ name, parent, order, slug: categorySlug }),
      )

      return {
        ok: true,
      }
    } catch {
      return {
        ok: false,
        error: 'Could not create category',
      }
    }
  }

  async findCategories({
    parent,
    slug,
  }: CategoriesInput): Promise<CategoriesOutput> {
    try {
      let slugParent = 0
      if (slug) {
        const category = await this.categories.findOne({ slug })

        if (category) {
          slugParent = category.id
        }
      }

      const searchParent = parent ?? slugParent

      if (searchParent < 0) {
        return {
          ok: false,
          error: 'wroong input value',
        }
      }

      const categories = await this.categories.find({
        where: { parent: searchParent },
        order: {
          order: 'ASC',
        },
      })

      return {
        ok: true,
        categories,
      }
    } catch {
      return {
        ok: false,
        error: 'could not load Categories',
      }
    }
  }

  async findCategoryByParent({
    parent = 0,
  }: CategoryInput): Promise<CategroyOutput> {
    try {
      const categories = await this.categories.find({ parent })

      return {
        ok: true,
        categories,
      }
    } catch {
      return {
        ok: false,
        error: 'could not load Category',
      }
    }
  }

  async createFreelancer(
    userId: number,
    { categoriesIds }: CreateFreelancerInput,
  ): Promise<CreateFreelancerOutput> {
    try {
      // const services = await this.categories.find({
      //   id: In(categoriesIds),
      // })

      const categories = await this.categories.find({
        id: In(categoriesIds),
      })

      const freelancer = await this.freelancers.save(this.freelancers.create())

      categories.map(async category => {
        await this.services.save(
          this.services.create({
            category,
            freelancer,
          }),
        )
      })

      // const freelancer = await this.freelancers.save(
      //   this.freelancers.create({
      //     services,
      //   }),
      // )

      const user = await this.users.findOne(
        { id: userId },
        { relations: ['freelancer'] },
      )

      user.freelancer = freelancer

      await this.users.save(user)

      return {
        ok: true,
      }
    } catch {
      return {
        ok: false,
        error: 'Could not create Freelancer',
      }
    }
  }
}
