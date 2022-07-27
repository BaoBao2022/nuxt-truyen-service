import mongoose from 'mongoose';
const {Schema} = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const ChapterSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    chapterNum: String,
    chapterName: String,
    pages: [],
    chapterOrderIndex: Number,
    createdAt: String,
    isUnlocked: Boolean,
    likedCount: Number,
    slug: String,
    totalComment: Number,
    unlockChapter: {},
    viewCount: Number,
    isVipFreeComic: Boolean
});

export default mongoose.model('chapters', ChapterSchema);
