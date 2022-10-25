import { Category } from '@prisma/client';

class CategoryDto {
  id: string;
  code: string | null;
  name: string | null;
  description: string | null;
  color: string;

  constructor(category: Category) {
    this.id = category.id;
    this.code = category.code;
    this.name = category.name;
    this.description = category.description;
    this.color = category.color;
  }
}

export default CategoryDto;
