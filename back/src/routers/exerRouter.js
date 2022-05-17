import rateLimit from "express-rate-limit";
import { Router } from "express";
import { exerService } from "../services/exerService";
import { login_required } from "../middlewares/login_required";

const exerRouter = Router();


/**
 * @swagger
 * /exercises:
 *  get:
 *    tags:[Exercise]
 *    summary: 전체 운동 목록 반환
 *    responses:
 *      200:
 *        description: The list of exercises
 *        content:
 *          application/json:
 *            schema:
 *              $ref : '#/components/schemas/Exercise'
 */

// 검색창에 검색할 때 모든 리스트 불러내는 요청
exerRouter.get("/exercises", rateLimit({ windowMs: 1000, max: 5 }), async (req, res, next) => {
    try {
        const exercises = await exerService.getExerAll();
        if (exercises.errorMessage) throw new Error(exercises.errorMessage);

        return res.status(200).json(exercises);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /exercises/{id}:
 *   post:
 *     tags:[Exercise]
 *     summary: 운동 view 증가
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 운동 아이디
 *         required: true 
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: register success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 */

// 검색 후 등록해서 조회수 올리는 요청
exerRouter.post("/exercises/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await exerService.addExerViews({ id });

        return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /exercises:
 *   post:
 *     tags: [Exercise]
 *     summary: 새로운 운동 등록
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exercise-add'
 *         
 *     responses:
 *       200: 
 *         description: register success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 */

// DB에 없는 운동 새로 등록할 때
exerRouter.post("/exercises", login_required, async (req, res, next) => {
    try {
        const { name, kcal, unit } = req.body; // validation

        const exercise = await exerService.getExerByName({ name });
        if (exercise) throw new Error("Router: 이미 등록되어 있는 운동입니다.");

        const { kcal_per_lb, kcal_per_kg } = await exerService.convertUnit({ kcal, unit });

        const newExercise = await exerService.addExer({
            name,
            kcal_per_kg,
            kcal_per_lb,
        });
        if (newExercise.errorMessage) throw new Error(newExercise.errorMessage);

        return res.status(201).json(newExercise);
    } catch (error) {
        next(error);
    }
});

export { exerRouter };
