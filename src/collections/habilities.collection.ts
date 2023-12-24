import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true},
    id: { type: Number, required: true}
});

export default mongoose.model('Habilities', schema);
