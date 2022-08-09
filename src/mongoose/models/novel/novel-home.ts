import mongoose from 'mongoose';
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const NovelHomeSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString();
        },
    },
    type: String,
    typeName: String,
    covers: [],
    orderIndex: Number,
    description: String,
});

export default mongoose.model('novels-homes', NovelHomeSchema);
