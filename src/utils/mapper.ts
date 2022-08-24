import { classes } from '@automapper/classes';
import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import UserDto from '../data/dto/userDto.js';
import User from '../data/entities/user.js';

const mapper = createMapper({
  strategyInitializer: classes(),
});

createMap(
  mapper,
  User,
  UserDto,
  forMember(
    destination => destination.id,
    mapFrom(source => source._id)
  )
);

export default mapper;
