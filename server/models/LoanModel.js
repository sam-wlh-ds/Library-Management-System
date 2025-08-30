import mongoose from "mongoose";
const { Schema } = mongoose;

const loanSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed' },
    fines: { type: Number, default: 0 }
});

const LoanModel = mongoose.models.Loan || mongoose.model('Loan', loanSchema);

export default LoanModel;