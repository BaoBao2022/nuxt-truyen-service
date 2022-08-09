import mongoose from 'mongoose';

const NovelDrawl = new mongoose.Schema({
    _id: { type: String, required: true },
    slug: { type: String, required: false },
});

export default mongoose.model('novel-draws', NovelDrawl);
