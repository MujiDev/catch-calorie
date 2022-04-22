import { Router } from "express";
import { foodService } from "../services/foodService";

const foodRouter = Router();

foodRouter.post("/foods/create", async (req, res, next) => {
    try {
        const { category, name, kcal_per100g } = req.body;

        // 로그인 된 유저의 모든 food를 불러온 후 겹치는 제목이 있을경우 에러 발생.
        const foods = await foodService.getFoodAll({ user_id });
        for (let i = 0; i < foods.length; i++) {
            if (foods[i].title === name) {
                throw new Error("이미 사용중인 제목입니다.");
            }
        }

        const newFood = await foodService.addFood({ category, name, kcal_per100g });

        return res.status(201).json(newFood);
    } catch (error) {
        next(error);
    }
});

// foodRouter.get("/foods/:id", async function (req, res, next) {
//     try {
//         const { id } = req.params;

//         const food = await foodService.getfood({ id });
//         if (food.errorMessage) {
//             throw new Error(food.errorMessage);
//         }

//         return res.status(200).json(food);
//     } catch (error) {
//         next(error);
//     }
// });

foodRouter.get("/foods", async function (req, res, next) {
    try {
        const { search } = req.query;

        const foods = await foodService.getFoodAll({ search });

        return res.status(200).json(foods);
    } catch (error) {
        next(error);
    }
});

// foodRouter.put("/foods/:id", login_required, async (req, res, next) => {
//     try {
//         const user_id = req.currentUserId;
//         const { id } = req.params;
//         const { title, description, from_date, to_date } = req.body;
//         const toUpdate = { title, description, from_date, to_date };

//         const food = await foodService.getfood({ id });
//         // req.currentUserId의 값과 food.user_id의 값을 비교해 관리자 인증
//         if (user_id !== food.user_id) {
//             throw new Error("접근할 권한이 없습니다.");
//         }

//         const updatedfood = await foodService.setfood({ id }, { toUpdate });
//         if (updatedfood.errorMessage) {
//             throw new Error(updatedfood.errorMessage);
//         }

//         return res.status(200).json(updatedfood);
//     } catch (error) {
//         next(error);
//     }
// });

foodRouter.post("/api/foods/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const food = await foodService.addFoodViews({ id });
        console.log(food);
        // user = await UserModel.findOneAndUpdate({ id }, { $push: { likes: user_id } }, { new: true });

        return res.status(200).json({ result: "success", likes: food.views });
    } catch (error) {
        next(error);
    }
});

export { foodRouter };
