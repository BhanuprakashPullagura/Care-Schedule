import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // REQUIRED FOR LOGIN
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    image: { type: String, required: true },

    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },

    about: { type: String, default: "" },

    available: { type: Boolean, default: true },

    fees: { type: Number, required: true },

    slots_booked: { type: Object, default: {} },

    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
    },

    date: { type: Number, default: Date.now },
  },
  { minimize: false }
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
