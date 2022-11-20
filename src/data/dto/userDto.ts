import { User, UserPreference } from '@prisma/client';
import UserPreferenceDto from './UserPreferenceDto';

class UserDto {
  id: string;
  name: string;
  nickname: string | null;
  email: string;
  avatarUrl: string | null;
  preferences: UserPreferenceDto | null;

  constructor(user: User & { UserPreference: UserPreference | null }) {
    this.id = user.id;
    this.name = user.name;
    this.nickname = user.nickname;
    this.email = user.email;
    this.avatarUrl = user.avatarUrl;
    this.preferences = user.UserPreference && new UserPreferenceDto(user.UserPreference);
  }
}

export default UserDto;
