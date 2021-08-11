import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAll() {
    return await this.userModel.find().select('-password').exec();
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async getById(id: string) {
    return await this.userModel.findById(id).select('-password').exec();
  }

  async create(user: User) {
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;
    const createdUser = new this.userModel(user);
    const newUser = await createdUser.save();
    return await this.getById(newUser._id);
  }

  async update(id: string, user: User) {
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;
    await this.userModel.updateOne({ _id: id }, user).exec();
    return this.getById(id);
  }

  async delete(id: string) {
    return await this.userModel.deleteOne({ _id: id }).exec();
  }
}
