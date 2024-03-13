const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemImageSchema = new Schema({
    itemId: {
        type: String
    },
    userEmail: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

const ItemImage = mongoose.model('Item-image', itemImageSchema);

module.exports = ItemImage;