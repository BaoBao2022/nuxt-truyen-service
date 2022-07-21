import mongoose from 'mongoose';
const { Schema } = mongoose;

const MangaSchema = new Schema({
    type: String,
    name: String,
    status: String,
    author: String,
    review: String,
    otherName: String,
    thumbnail: String,
    updatedAt: String,
    updated: String,
    view: String,
    follow: String,
    comment: String,
    slug: String,
    genres: [
        {
            genreTitle: String,
            slug: String
        },
    ],
    chapSuggests: [],
    chapterList: [],
});

export default mongoose.model('manga', MangaSchema);
