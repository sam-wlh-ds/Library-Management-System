import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    borrowedBooks: [{
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      borrowDate: { type: Date, default: Date.now },
      dueDate: { type: Date, required: true },
      returnDate: { type: Date },
      fines: { type: Number, default: 0 }
    }],
    reservations: [{
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      reservationDate: { type: Date, default: Date.now }
    }],
    finesHistory: [{
      amount: { type: Number, required: true },
      reason: { type: String },
      datePaid: { type: Date }
    }]
});

// Check if the model already exists before compiling it.
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;