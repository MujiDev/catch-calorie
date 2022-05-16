import mongoose from "mongoose";

import { Award } from "./models/Award";
import { Badge } from "./models/Badge";
import { Exercise } from "./models/Exercise";
import { Food } from "./models/Food";
import { Heatmap } from "./models/Heatmap";
import { Tracking } from "./models/Tracking";
import { User } from "./models/User";

const DB_URL = process.env.MONGODB_URL || "MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요.";

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.once("open", async () => {
    const trackings = db.collection("trackings");
    const changeStream = trackings.watch();

    changeStream.on("change", async (change) => {
        const terms = async ({ user_id, trackings }) => {
            const foods = trackings.map((tracking) => tracking.food_record).flat();
            const exers = trackings.map((tracking) => tracking.exer_record).flat();
            const days = trackings.map((tracking) => new Date(tracking.date).getTime() / (24 * 60 * 60 * 1000));
            const categorys = await Promise.all(foods.map(async (food) => await Food.findByName({ name: food.name }).then((data) => data?.category)));

            // ------------ EXERCISE COUNTING ------------

            // athlete: 운동 5n회 이상 (I, II, III, IV, V, VI)
            const athlete = Math.floor(exers.length / 5);
            if (athlete >= 6) await Award.update({ user_id }, { athlete: 6 });
            else await Award.update({ user_id }, { athlete });

            // runner: 런닝 5n회 이상 (I, II, III)
            const runner = Math.floor(exers.filter((exer) => /running/i.test(exer.name)).length / 5);
            if (runner >= 3) await Award.update({ user_id }, { runner: 3 });
            else await Award.update({ user_id }, { runner });

            // climber: 등산 5n회 이상 (I, II, III)
            // const climber = Math.floor(exers.filter((exer) => /climbing/i.test(exer.name)).length / 5);
            // if (climber >= 3) await Award.update({ user_id }, { climber: 3 });
            // else await Award.update({ user_id }, { climber });

            // swimmer: 수영 5n회 이상 (I, II, III)
            const swimmer = Math.floor(exers.filter((exer) => /swimming/i.test(exer.name)).length / 5);
            if (swimmer >= 3) await Award.update({ user_id }, { swimmer: 3 });
            else await Award.update({ user_id }, { swimmer });

            // gym_rat: 웨이트 5n회 이상 (I, II, III)
            const gym_rat = Math.floor(exers.filter((exer) => /weight/i.test(exer.name)).length / 5);
            if (gym_rat >= 3) await Award.update({ user_id }, { gym_rat: 3 });
            else await Award.update({ user_id }, { gym_rat });

            // smasher: 배드민턴 5n회 이상 (I, II, III)
            // const smasher = Math.floor(exers.filter((exer) => /badminton/i.test(exer.name)).length / 5);
            // if (smasher >= 3) await Award.update({ user_id }, { smasher: 3 });
            // else await Award.update({ user_id }, { smasher });

            // triathlete: 사이클, 러닝, 수영 각 1회 이상 (I)
            const cycle = exers.filter((exer) => /cycling/i.test(exer.name)).length > 0;
            const run = exers.filter((exer) => /running/i.test(exer.name)).length > 0;
            const swim = exers.filter((exer) => /swimming/i.test(exer.name)).length > 0;
            const triathlete = cycle && run && swim;
            if (triathlete) await Award.update({ user_id }, { triathlete: 1 });

            // -------------- FOOD COUNTING --------------

            // proteiner: 프로틴 쉐이크 섭취 5n회 이상 (I, II, III)
            const proteiner = Math.floor(foods.filter((food) => /protein/i.test(food.name)).length / 5);
            if (proteiner >= 3) await Award.update({ user_id }, { proteiner: 3 });
            else await Award.update({ user_id }, { proteiner });

            // fruits_lover: 과일 섭취 5n회 이상 (I, II, III)
            // const fruits_lover = Math.floor(categorys.filter((category) => /fruit/i.test(category)).length / 5);
            // if (fruits_lover >= 3) await Award.update({ user_id }, { fruits_lover: 3 });
            // else await Award.update({ user_id }, { fruits_lover });

            // vegetables_lover: 채소 섭취 5n회 이상 (I, II, III)
            const vegetables_lover = Math.floor(categorys.filter((category) => /vegetable/i.test(category)).length / 5);
            if (vegetables_lover >= 3) await Award.update({ user_id }, { vegetables_lover: 3 });
            else await Award.update({ user_id }, { vegetables_lover });

            // yogurt_lover: 요거트 섭취 5n회 이상 (I, II, III)
            // const yogurt_lover = Math.floor(categorys.filter((category) => /yogurt/i.test(category)).length / 5);
            // if (yogurt_lover >= 3) await Award.update({ user_id }, { yogurt_lover: 3 });
            // else await Award.update({ user_id }, { yogurt_lover });

            // meat_lover: 고기 섭취 5n회 이상 (I, II, III)
            // const meat_lover = Math.floor(categorys.filter((category) => /meat/i.test(category)).length / 5);
            // if (meat_lover >= 3) await Award.update({ user_id }, { meat_lover: 3 });
            // else await Award.update({ user_id }, { meat_lover });

            // candy_lover: 사탕 섭취 5n회 이상 (I, II, III)
            // const candy_lover = Math.floor(categorys.filter((category) => /candy/i.test(category)).length / 5);
            // if (candy_lover >= 3) await Award.update({ user_id }, { candy_lover: 3 });
            // else await Award.update({ user_id }, { candy_lover });

            // gourmand: 총 섭취 칼로리 20000n kcal 이상 (I, II, III)
            const gourmand = Math.floor(foods.reduce((acc, cur) => acc + cur.calorie, 0) / 20000);
            if (gourmand >= 3) await Award.update({ user_id }, { gourmand: 3 });
            else await Award.update({ user_id }, { gourmand });

            // ------------- OTHER COUNTING --------------

            // visitor: 출석 5n회 이상 (I, II, III, IV, V, VI)
            const visitor = Math.floor(trackings.length / 5);
            if (visitor >= 6) await Award.update({ user_id }, { visitor: 6 });
            else await Award.update({ user_id }, { visitor });

            // steady: 연속 출석 5n일 이상 (I, II, III)
            let [count, steady] = [1, 1];
            for (let i = 0; i < days.length; i++) {
                if (days[i] + 1 === days[i + 1]) count++;
                else {
                    if (count > steady) steady = count;
                    count = 1;
                }
            }
            steady = Math.floor(steady / 5);
            if (steady >= 3) await Award.update({ user_id }, { steady: 3 });
            else await Award.update({ user_id }, { steady });
        };

        if (change.operationType === "insert" || change.operationType === "update") {
            const id = change.documentKey._id;
            const { user_id } = await Tracking.findById({ id });
            const trackings = await Tracking.findByUser({ user_id });

            if (!(await Award.findByUser({ user_id }))) await Award.create({ user_id });

            return terms({ user_id, trackings });
        }
    });
});

db.on("connected", () => console.log("정상적으로 MongoDB 서버에 연결되었습니다.  " + DB_URL));
db.on("error", (error) => console.error("MongoDB 연결에 실패하였습니다...\n" + DB_URL + "\n" + error));

export { Award, Badge, Exercise, Food, Heatmap, Tracking, User };
