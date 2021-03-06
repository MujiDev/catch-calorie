import { TrackingModel } from "../schemas/tracking";

class Tracking {
    static create({ user_id, date, rec_cal }) {
        return TrackingModel.create({ user_id, date, rec_cal });
    }

    static findById({ id }) {
        return TrackingModel.findById(id);
    }

    static findByRecordId({ id, record }) {
        if (record === "food") return TrackingModel.findOne({ food_record: { $elemMatch: { id } } });
        else if (record === "exer") return TrackingModel.findOne({ exer_record: { $elemMatch: { id } } });
    }

    static findByRecordAndUpdate({ id, record, toUpdate }) {
        if (record === "food") {
            return TrackingModel.findOneAndUpdate(
                { food_record: { $elemMatch: { id } } },
                {
                    $set: { "food_record.$.gram": toUpdate.gram, "food_record.$.calorie": toUpdate.calorie },
                    $inc: { acc_cal: toUpdate.acc_cal },
                },
                { new: true },
            );
        } else if (record === "exer") {
            return TrackingModel.findOneAndUpdate(
                { exer_record: { $elemMatch: { id } } },
                {
                    $set: { "exer_record.$.minute": toUpdate.minute, "exer_record.$.calorie": toUpdate.calorie },
                    $inc: { acc_cal: toUpdate.acc_cal },
                },
                { new: true },
            );
        }
    }

    static findByUserAndDate({ user_id, date }) {
        return TrackingModel.findOne({ user_id, date });
    }

    static findByUser({ user_id }) {
        return TrackingModel.find({ user_id }).sort({ date: 1 });
    }

    static update({ user_id, date, toUpdate }) {
        return TrackingModel.findOneAndUpdate({ user_id, date }, toUpdate, { new: true });
    }

    static delete({ id }) {
        return TrackingModel.deleteById(id);
    }

    static deleteByUser({ user_id }) {
        return TrackingModel.deleteMany({ user_id });
    }
}

export { Tracking };
