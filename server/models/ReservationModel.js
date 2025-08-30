import mongoose from "mongoose";
const { Schema } = mongoose;

const reservationSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    reservationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' }
});

const ReservationModel = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

export default ReservationModel;