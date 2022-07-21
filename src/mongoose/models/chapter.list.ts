import mongoose from 'mongoose';
const { Schema } = mongoose;

const ChapterListSchema = new Schema({
    slug: String,
    chapterId: String,
    chapterNumber: String,
    chapterTitle: String,
    updatedAt: String,
    view: String
});

export default mongoose.model('chapter-list', ChapterListSchema);
