import { User } from '@prisma/client';

class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.photoUrl = user.photoUrl;
  }
}

export default UserDto;
