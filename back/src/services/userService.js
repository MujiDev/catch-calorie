import { User } from "../db/index.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

class userAuthService {
    static async addUser({ email, password, name, gender, height, weight, icon }) {
        const user = await User.findOne({ email });
        if (user) {
            const errorMessage = "현재 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.";
            return { errorMessage };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            password: hashedPassword,
            name,
            gender,
            height,
            weight,
            icon,
        };

        const createdNewUser = await User.create({ newUser });

        return createdNewUser;
    }

    //로그인 시 확인
    static async getUser({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            const errorMessage = "가입 내역이 없는 이메일입니다. 다시 한 번 확인해 주세요.";
            return { errorMessage };
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            const errorMessage = "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
            return { errorMessage };
        }

        //로그인 성공 시 JWT 웹 토큰 생성
        const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
        const token = jwt.sign({ user_id: user._id }, secretKey, { expiresIn: "2h" });

        const loginUser = {
            token,
            email,
            name,
            gender,
            height,
            weight,
            icon,
            errorMessage: null,
        };
        return loginUser;
    }

    static async getUsers() {
        return User.findAll();
    }

    //사용자 정보 조회 시
    static async getUserById({ user_id }) {
        const user = await User.findById({ user_id });
        if (!user) {
            const errorMessage = "가입 내역이 없는 사용자입니다. 다시 한 번 확인해 주세요.";
            return { errorMessage };
        }
        return user;
    }
}

export { userAuthService };
