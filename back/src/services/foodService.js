import { Food } from "../db";

class foodService {
    static addFood({ category, name, kcal_per100g }) {
        return Food.create({ newFood: { category, name, kcal_per100g } });
    }

    static async getFood({ id }) {
        const food = await Food.findById({ id });
        if (!food) return { errorMessage: "음식를 찾을 수 없습니다." };

        return food;
    }

    static getFoodAll({ search }) {
        return Food.findAll({ search });
    }

    static async setfood({ id }, { toUpdate }) {
        const food = await this.getFood({ _id });
        if (!food) return { errorMessage: "음식를 찾을 수 없습니다." };

        const setfood = await Food.update({ id }, { toUpdate });
        return setfood;
    }

    static async deleteFood({ id }) {
        const food = await this.getFood({ id });
        if (!food) return { errorMessage: "음식를 찾을 수 없습니다." };

        const deleteFood = await Food.delete({ id });
        return deleteFood;
    }

    static addFoodViews({ id }) {
        return Food.update({ id }, { toUpdate: { $inc: { views: 1 } } }, { new: true });
    }
}

export { foodService };
