import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";

const userAuthRouter = Router();

userAuthRouter.post("/user/register", async function (req, res, next) {
    try {
        // if (is.emptyObject(req.body)) {
        //     throw new Error("header의 Content-Type을 application/json으로 설정해주세요.");
        // }
        const { email, password, name, gender, height, weight, icon } = req.body;

        const newUser = await userAuthService.addUser({
            email,
            password,
            name,
            gender,
            height,
            weight,
            //이미지 처리는 후에 진행할 예정
            icon,
        });

        if (newUser.errorMessage) {
            throw new Error(newUser.errorMessage);
        }

        return res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

userAuthRouter.post("/user/login", async function (req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await userAuthService.getUser({ email, password });

        if (user.errorMessage) {
            throw new Error(user.errorMessage);
        }

        return res.status(200).send(user);
    } catch (error) {
        next(error);
    }
});

userAuthRouter.get("/user/current", login_required, async function (req, res, next) {
    try {
        const user_id = req.currentUserId;
        const currentUserInfo = await userAuthService.getUserById({ user_id });

        if (currentUserInfo.errorMessage) {
            throw new Error(currentUserInfo.errorMessage);
        }

        return res.status(200).send(currentUserInfo);
    } catch (error) {
        next(error);
    }
});

userAuthRouter.get("/user/:id", login_required, async function (req, res, next) {
    try {
        const { id } = req.params;
        const currentUserInfo = await userAuthService.getUserById({ id });
        if (currentUserInfo.errorMessage) {
            throw new Error(currentUserInfo.errorMessage);
        }

        return res.status(200).send(currentUserInfo);
    } catch (error) {
        next(error);
    }
});

userAuthRouter.get("/userlist", login_required, async function (req, res, next) {
    try {
        const users = await userAuthService.getUsers();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// jwt 토큰 기능 확인함. 삭제해도 되는 라우터임

userAuthRouter.get("/afterlogin", login_required, function (req, res, next) {
    res.status(200).send(`안녕하세요 ${req.currentUserId}님, jwt 웹 토큰 기능 정상 작동 중입니다.`);
});

export { userAuthRouter };
