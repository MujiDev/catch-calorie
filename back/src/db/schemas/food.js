import { Schema, model } from "mongoose";

const FoodSchema = new Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    kcal_per100g: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
});

const FoodModel = model("Food", FoodSchema);

export { FoodModel };
