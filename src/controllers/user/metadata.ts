export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export interface AddCategoryBody {
  name: string;
  description?: string;
  color: string;
  transactionTypeId: string;
}

export interface UpdateCategoryBody {
  name?: string;
  description?: string;
  color?: string;
}
