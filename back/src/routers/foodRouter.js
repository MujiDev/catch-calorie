import rateLimit from "express-rate-limit";
import { Router } from "express";
import { foodService } from "../services/foodService";
import configureMeasurements, { mass } from "convert-units";

const convert = configureMeasurements({ mass });
const foodRouter = Router();


/**
 * @swagger
 * /foods:
 *  post:
 *    tags: [Food]
 *    summary: 새로운 음식 등록
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Food-add'
 *    responses:
 *      200: 
 *        description: register success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Food'
 */
// DB에 없는 음식을 새로 등록할 때
foodRouter.post("/foods", async (req, res, next) => {
    try {
        const { category, name, kcal, unit } = req.body;

        // 로그인 된 유저의 모든 food를 불러온 후 겹치는 제목이 있을경우 에러 발생.
        const foods = await foodService.getFoodByName({ name });
        if (foods) throw new Error("이미 등록되어 있는 음식입니다.");

        // const { kcal_per_100g, kcal_per_lb } = await foodService.convertUnit({ kcal, unit });
        // const kcal_per_100g = unit === "gram" ? kcal : convert(kcal).from("lb").to("g").toFixed(2) * 100;
        const kcal_per_lb = unit === "pound" ? kcal : convert(kcal * 100).from("g").to("lb").toFixed(2);
        const kcal_per_100g = unit === "gram" ? kcal : (convert(kcal * 1).from("lb").to("g") / 100).toFixed(2);

        const newFood = await foodService.addFood({ category, name, kcal_per_100g, kcal_per_lb, views: 1 });

        return res.status(201).json(newFood);
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /foods:
 *  get:
 *     tags:[Food]
 *     summary: 전체 음식 목록 가져오기
 *     responses:
 *       200: 
 *         description: food name and calories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 */

// 검색창에 검색할 때 모든 리스트 불러내는 요청
foodRouter.get("/foods", rateLimit({ windowMs: 1000, max: 5 }), async (req, res, next) => {
    try {
        const foods = await foodService.getFoodAll();

        return res.status(200).json(foods);
    } catch (error) {
        next(error);
    }
});

/**
 * 
 * @swagger
 * /foods/{id}:
 *  post:
 *     tags: [Food]
 *     summary: 음식 view 증가
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 음식 아이디
 *         required: true 
 *         schema:
 *           type: string
 *     responses:
 *         200: 
 *           description: register success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Food'
 */

// 검색 후 등록해서 조회수 올리는 요청
foodRouter.post("/foods/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await foodService.addFoodViews({ id });

        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

export { foodRouter };
