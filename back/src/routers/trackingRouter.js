import dayjs from "dayjs";
import { Router } from "express";
import { trackingService } from "../services/trackingService";
import { login_required } from "../middlewares/login_required";
import configureMeasurements, { mass, length } from "convert-units";
const convert = configureMeasurements({ mass, length });

const trackingRouter = Router();

/**
 * @openapi
 * /tracking/{user_id}:
 *  get:
 *    description: "유저별 트래킹 정보를 보내는 요청"
 *    parameters:
 *      - name: limit
 *        in: params
 *        description: "Limits the number of items on a page"
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: "Successfully returned a list of artists"
 *        content:
 *          application/json:
 */
trackingRouter.get("/tracking/:user_id", async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const date = dayjs().add(9, "hour").format("YYYY-MM-DD");

        const tracking = await trackingService.getTrackingByUserAndDate({ user_id, date });
        if (!tracking) return trackingService.addTracking({ user_id, date });

        return res.status(200).send(tracking);
    } catch (error) {
        next(error);
    }
});

// 유저가 섭취한 음식을 등록할 때
trackingRouter.post("/tracking/food", login_required, async (req, res, next) => {
    try {
        const user_id = req.currentUserId;
        const { name, weight, unit } = req.body;
        const date = dayjs().add(9, "hour").format("YYYY-MM-DD");

        const converted_weight = unit === "us" ? convert(Number(weight)).from("lb").to("g").toFixed(0) : Number(weight);
        const newTracking = await trackingService.addFoodTracking({ user_id, date, name, gram: converted_weight });

        return res.status(201).json(newTracking);
    } catch (error) {
        next(error);
    }
});

// 유저가 소모한 운동을 등록할 때
trackingRouter.post("/tracking/exer", login_required, async (req, res, next) => {
    try {
        const user_id = req.currentUserId;
        const { name, minute } = req.body;
        const date = dayjs().add(9, "hour").format("YYYY-MM-DD");

        const newTracking = await trackingService.addExerTracking({ user_id, date, name, minute });

        return res.status(201).json(newTracking);
    } catch (error) {
        next(error);
    }
});

// 유저가 이미 등록한 음식 수정할 때
trackingRouter.put("/tracking/food", login_required, async (req, res, next) => {
    try {
        const { id, weight, unit } = req.body;

        const updatedTracking = await trackingService.setFoodTracking({ id, weight, unit });

        return res.status(200).send(updatedTracking);
    } catch (error) {
        next(error);
    }
});

// 유저가 이미 등록한 운동 수정할 때
trackingRouter.put("/tracking/exer", login_required, async (req, res, next) => {
    try {
        const { id, minute } = req.body;

        const updatedTracking = await trackingService.setExerTracking({ id, minute });

        return res.status(200).send(updatedTracking);
    } catch (error) {
        next(error);
    }
});

// 유저가 이미 등록한 음식 삭제할 때
trackingRouter.delete("/tracking/food/:id", login_required, async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedTracking = await trackingService.deleteFoodTracking({ id });

        return res.status(201).json(deletedTracking);
    } catch (error) {
        next(error);
    }
});

// 유저가 이미 등록한 운동 삭제할 때
trackingRouter.delete("/tracking/exer/:id", login_required, async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedTracking = await trackingService.deleteExerTracking({ id });

        return res.status(201).json(deletedTracking);
    } catch (error) {
        next(error);
    }
});

export { trackingRouter };
