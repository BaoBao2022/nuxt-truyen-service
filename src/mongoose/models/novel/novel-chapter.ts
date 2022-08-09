import mongoose from 'mongoose';
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const NovelChapterSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString();
        },
    },
    chapterNum: Number,
    chapterName: String,
    novelId: String,
    novelSlug: String,
    createdAt: String,
    slug: String,
    unlockChapter: {},
    valueAD: Number,
    valueCoin: Number,
    isUnlocked: Boolean,
    content: String,
    ogImage: String,
});

export default mongoose.model('novel-chapters', NovelChapterSchema);
