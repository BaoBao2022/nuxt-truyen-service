import mongoose from 'mongoose';
const {Schema} = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const TrendingSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    type: {
        type: String,
        default: 'trending',

    },
    typeName: {
        type: String,
        default: 'Có chắc HOT là đây'
    },
    contents: [
        {
            _id: {
                type: String,
                default: function () {
                    return new ObjectId().toString()
                }
            },
            name: String,
            slug: String,
            type: String,
            comics: [
                {
                    _id: {
                        type: String,
                        default: function () {
                            return new ObjectId().toString()
                        }
                    },
                    comicName: String,
                    verticalLogo: String,
                    slug: String,
                    status: String,
                    type: String,
                    publishedAt: String,
                    isNew: Boolean,
                    author: {},
                    categories: [],
                    comingSoon: {},
                    newestChapter: String
                }
            ],
            comicsReviewNewest: [
                {
                    _id: {
                        type: String,
                        default: function () {
                            return new ObjectId().toString()
                        }
                    },
                    comicName: String,
                    verticalLogo: String,
                    slug: String,
                    contentReview: String,
                    status: String,
                    createdAt: String,
                    author: {},
                    userComment: {},
                    comingSoon: {}
                }
            ]
        }
    ],
    orderIndex: Number,
    description: String,
});

export default mongoose.model('trending', TrendingSchema);
