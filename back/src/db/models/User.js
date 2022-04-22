import { UserModel } from "../schemas/user.js";

class User {
    static create({ newUser }) {
        return UserModel.create(newUser);
    }

    static findOne({ email }) {
        return UserModel.findOne({ email });
    }

    static findById({ user_id }) {
        return UserModel.findOne({ user_id });
    }

    static findAll() {
        return UserModel.find({})
    }
}

export { User };
