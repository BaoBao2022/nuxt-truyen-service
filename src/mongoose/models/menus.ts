import mongoose from 'mongoose';
const {Schema} = mongoose;
const ObjectId = mongoose.Types.ObjectId;

const MenuSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            return new ObjectId().toString()
        }
    },
    type: {
        type: String,
        default: 'menu'
    },
    typeName: {
        type: String,
        default: 'menu'
    },
    covers: [
        {
            _id: {
                type: String,
                default: function () {
                    return new ObjectId().toString()
                }
            },
            title: String,
            icon: String,
            deepLink: String,
            pathURL: String,
        }
    ],
    orderIndex: Number,
    description: String,
});

export default mongoose.model('menus', MenuSchema);
