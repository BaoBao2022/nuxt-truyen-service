import mongoose from 'mongoose';
const {Schema} = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const ChapterPreview = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    chapterOrderIndex: Number,
    chapterNum: String,
    imageRepresent: String,
    comicId: String,
    comicSlug: String,
});

export default mongoose.model('chapter-previews', ChapterPreview);
