import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReadManga = new Schema({
    name: String,
    status: String,
    author: String,
    review: String,
    otherName: String,
    thumbnail: String,
    updatedAt: String,
    view: String,
    follow: String,
    comment: String,
    slug: String,
    genres: [],
    chapSuggests: [],
});

export default mongoose.model('read-manga', ReadManga);
