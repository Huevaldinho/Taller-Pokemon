import mongoose from "mongoose";

const schema = new mongoose.Schema({
    pokedexNumber: { type: Number, required: true},
    name: { type: String, required: true },
    habilities: { type: Array, required:true },//? Array de strings, de objetos o de numbers?
    description: { type: String, required:true},
    primaryType: { type: String , required: true},
    secondaryType: { type: String, required: false},
});

export default mongoose.model('Pokemon', schema);
