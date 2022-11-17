import { User } from '@prisma/client';

class UserDto {
  id: string;
  name: string;
  nickname: string | null;
  email: string;
  avatarUrl: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.nickname = user.nickname;
    this.email = user.email;
    this.avatarUrl = user.avatarUrl;
  }
}

export default UserDto;
