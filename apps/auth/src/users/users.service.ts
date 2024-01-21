import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    addUser(userInfo: CreateUserDto) {
        return this.userModel.create(userInfo)
    }

    findUserById(id: number) {
        return this.userModel.findById(id)
    }

    findUserByEmail(email: string) {
        return this.userModel.findOne({ email })
    }
}