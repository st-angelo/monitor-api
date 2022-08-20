import amClasses from '@automapper/classes';
import amCore from '@automapper/core';
import UserDto from '../data/dto/userDto.js';
import User from '../data/entities/user.js';

const mapper = amCore.createMapper({
  name: 'main',
  pluginInitializer: amClasses.classes,
});

mapper.createMap(User, UserDto).forMember(
  destination => destination.id,
  amCore.mapFrom(source => source._id)
);

export default mapper;
