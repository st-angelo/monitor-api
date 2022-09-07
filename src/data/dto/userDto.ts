import { User } from '@prisma/client';

class UserDto {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.photoUrl = user.photoUrl;
  }
}

export default UserDto;
