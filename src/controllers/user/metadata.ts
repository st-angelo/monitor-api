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

export interface UpdateAccountData {
  name: string;
  nickname: string;
  baseCurrencyId: string;
}
