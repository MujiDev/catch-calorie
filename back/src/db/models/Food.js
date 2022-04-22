import { FoodModel } from "../schemas/food";

class Food {
    static create({ newFood }) {
        return FoodModel.create(newFood);
    }

    static findById({ id }) {
        return FoodModel.findById(id);
    }

    static findAll({ search }) {
        return FoodModel.find({ name: { $regex: new RegExp(`^${search}`, "i") } })
            .sort({ views: -1 })
            .limit(10);
    }

    static update({ id }, { toUpdate }) {
        return FoodModel.findOneAndUpdate(id, toUpdate, { new: true });
    }

    static delete({ id }) {
        return FoodModel.deleteById(id);
    }
}

export { Food };
