export interface AddCategoryBody {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateCategoryBody {
  name?: string;
  description?: string;
  color?: string;
}
