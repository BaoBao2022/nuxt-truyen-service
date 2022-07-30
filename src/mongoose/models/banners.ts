import mongoose from 'mongoose';

const {Schema} = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const BannerSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    type: {
        type: String,
        default: 'banner'
    },
    typeName: {
        type: String,
        default: 'Banner'
    },
    covers: [
        {
            _id: {
                type: String,
                default: function () {
                    return new ObjectId().toString()
                }
            },
            active: Boolean,
            animations: [
                {
                    image: String,
                    direction: String,
                    distance: Number,
                    duration: Number,
                }
            ],
            author: {
                _id: {
                    type: String,
                    default: function () {
                        return new ObjectId().toString()
                    }
                },
                name: String,
                avatar: String,
                username: String,
            },
            type: String,
            link: String,
            slug: String,
            comicName: String,
            bannerType: String,
            comicId: String

        }
    ],
    orderIndex: Number,
    description: String,
});

export default mongoose.model('banners', BannerSchema);
