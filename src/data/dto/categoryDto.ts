import { Category } from '@prisma/client';

class CategoryDto {
  id: string;
  name: string;
  description: string | null;
  color: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.color = category.color;
  }
}

export default CategoryDto;
