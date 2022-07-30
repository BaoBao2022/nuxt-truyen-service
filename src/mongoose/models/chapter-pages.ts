import mongoose from 'mongoose';
const {Schema} = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const ChapterPageSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    chapterId: String,
    chapterSlug: String,
    linkHD: String,
    linkSD: String,
    width: Number,
    height: Number,
    pageNum: Number
});

export default mongoose.model('chapter-pages', ChapterPageSchema);
