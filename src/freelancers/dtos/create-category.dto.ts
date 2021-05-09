import { InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from 'src/common/dtos/output.dto'
import { Category } from '../entities/category.entity'

@InputType()
export class CreateCategoryInput extends PickType(Category, [
  'name',
  'slug',
  'parent',
]) {}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {}
