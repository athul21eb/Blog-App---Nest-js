import { CreateUserDto } from '@/user/dto/createUser.dto';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { LoginUserDto } from '@/user/dto/loginUser.dto';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const existedEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existedEmail) {
      throw new HttpException(
        'email is already existed , try agian with another email',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const existedUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existedUsername) {
      throw new HttpException(
        'Username is already existed , try agian with another Username',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    const savedUser = await this.userRepository.save(newUser);
    return this.generateUserResponse(savedUser);
  }

  generateJWTToken(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }
  generateUserResponse(user: UserEntity): IUserResponse {
    if (!user.id) {
      throw new HttpException('user data is missing', HttpStatus.BAD_REQUEST);
    }
    return {
      user: { ...user, token: this.generateJWTToken(user) },
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const userFound = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!userFound) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const matchPassword = await compare(
      loginUserDto.password,
      userFound.password,
    );

    if (!matchPassword) {
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
    }

    delete userFound.password;
    return this.generateUserResponse(userFound);
  }

  async userFindById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException(' user is not found ', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userFindById(userId);

    Object.assign(user, updateUserDto);

    return  this.userRepository.save(user);
  }
}
