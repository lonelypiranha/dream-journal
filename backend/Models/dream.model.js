import mongoose from 'mongoose';
const dreamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title required'],
        trim: false,
    },
    content: {
        type: String,
        required: [true, 'Dream content required'],
        trim: false,
    },
    genre: {
        type: String,
        required: [true, 'Genre required'],
        trim: false,
    },
    analysis: {
        type: String,
        required: [true, 'Analysis required'],
        trim: false,
    },
    image: {
        type: String,
        required: [true, 'Image required'],
        trim: false,
    }
})

const Dream = mongoose.model('Dream', dreamSchema);
export default Dream;