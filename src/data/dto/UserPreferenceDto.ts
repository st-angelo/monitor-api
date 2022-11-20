import { UserPreference } from "@prisma/client";

class UserPreferenceDto {
  baseCurrencyId: string;

  constructor(userPreference: UserPreference) {
    this.baseCurrencyId = userPreference.baseCurrencyId;
  }
}

export default UserPreferenceDto;