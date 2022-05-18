import express from "express";
import cors from "cors";
import schedule from "node-schedule";
// import swaggerUi from "swagger-ui-express";
// import swaggerJSDoc from "swagger-jsdoc";

import { awardRouter } from "./routers/awardRouter";
import { badgeRouter } from "./routers/badgeRouter";
import { exerRouter } from "./routers/exerRouter";
import { foodRouter } from "./routers/foodRouter";
import { heatmapRouter } from "./routers/heatmapRouter";
import { trackingRouter } from "./routers/trackingRouter";
import { userRouter } from "./routers/userRouter";

import { errorMiddleware } from "./middlewares/errorMiddleware";
import heatmap_scheduler from "./middlewares/heatmap_scheduler";

import { swaggerUi, specs } from "./swagger.js";

const app = express();

// Options for the swagger docs
// const options = {
//     swaggerDefinition: {
//         info: {
//             title: "Catch Calorie",
//             version: "1.0.0",
//             description: "Catch Calorie API Docs",
//         },
//         host: "elice-kdt-ai-4th-team13.elicecoding.com",
//         basePath: "/",
//     },
//     apis: ["./src/routers/*"],
// };
// const specs = swaggerJSDoc(options);

// CORS 에러 방지
app.use(cors());

// express 기본 제공 middleware
// express.json(): POST 등의 요청과 함께 오는 json형태의 데이터를 인식하고 핸들링할 수 있게 함.
// express.urlencoded: 주로 Form submit 에 의해 만들어지는 URL-Encoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 매일 00시 00분 00초마다 heatmap DB 업데이트
schedule.scheduleJob("0 0 0 * * *", heatmap_scheduler);

// 기본 페이지, 브라우저에서 로그아웃 시 연결되게 하여 쿠키에 저장된 refresh token 삭제
app.get("/", (req, res) => res.send("안녕하세요, 13팀 데이터 분석 프로젝트 API 입니다."));

// router, service 구현 (userRouter는 맨 위에 있어야 함.)
app.use(userRouter);
app.use(awardRouter);
app.use(badgeRouter);
app.use(exerRouter);
app.use(foodRouter);
app.use(heatmapRouter);
app.use(trackingRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 순서 중요 (router 에서 next() 시 아래의 에러 핸들링  middleware로 전달됨)
app.use(errorMiddleware);

export { app };
