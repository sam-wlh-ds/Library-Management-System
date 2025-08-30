import mongoose from "mongoose";
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    availability: { type: Boolean, default: true },
    bookFile: { type: String },
    reservedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const BookModel = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default BookModel;