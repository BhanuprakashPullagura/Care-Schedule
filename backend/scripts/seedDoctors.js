// backend/scripts/seedDoctors.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Doctor from "../models/doctorModel.js";

dotenv.config();

// ---------- FEES BASED ON SPECIALITY ----------
const specialityFees = {
  "General physician": 500,
  "Pediatricians": 600,
  "Dermatologist": 700,
  "Neurologist": 900,
  "Gastroenterologist": 1000,
  "Gynecologist": 1100,
  "Cardiologist": 1300,
  "Orthopedic": 1200,
  "Ophthalmologist": 800,
  "ENT Specialist": 750,
  Dentist: 600,
  Psychiatrist: 1400,
  Oncologist: 1500,
};

// ---------- ORIGINAL DOCTOR LIST ----------
let doctors = [
  {
    name: "Dr. Richard James",
    speciality: "General physician",
    image: "/doctor/doc1.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "Experienced general physician focused on preventive care and patient education.",
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Emily Larson",
    speciality: "Gynecologist",
    image: "/doctor/doc2.png",
    degree: "MBBS",
    experience: "3 Years",
    about: "Compassionate gynecologist delivering personalized women’s healthcare.",
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    image: "/doctor/doc3.png",
    degree: "MBBS",
    experience: "1 Years",
    about: "Dermatologist with expertise in treating common skin conditions.",
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Christopher Lee",
    speciality: "Pediatricians",
    image: "/doctor/doc4.png",
    degree: "MBBS",
    experience: "2 Years",
    about: "Pediatrician focused on child growth, development and family care.",
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Jennifer Garcia",
    speciality: "Neurologist",
    image: "/doctor/doc5.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "Neurologist experienced in diagnosing and managing neurological disorders.",
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Andrew Williams",
    speciality: "Neurologist",
    image: "/doctor/doc6.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "Neurologist with interest in headache and neurodegenerative disorders.",
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Christopher Davis",
    speciality: "General physician",
    image: "/doctor/doc7.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "General physician providing preventive and acute care services.",
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Timothy White",
    speciality: "Gynecologist",
    image: "/doctor/doc8.png",
    degree: "MBBS",
    experience: "3 Years",
    about: "Skilled gynecologist providing compassionate reproductive healthcare.",
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Ava Mitchell",
    speciality: "Dermatologist",
    image: "/doctor/doc9.png",
    degree: "MBBS",
    experience: "1 Years",
    about: "Dermatology specialist with a focus on skin health and acne management.",
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Jeffrey King",
    speciality: "Pediatricians",
    image: "/doctor/doc10.png",
    degree: "MBBS",
    experience: "2 Years",
    about: "Friendly pediatrician focused on children's wellness and immunizations.",
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Zoe Kelly",
    speciality: "Neurologist",
    image: "/doctor/doc11.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "Neurologist with experience in stroke and epilepsy management.",
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Patrick Harris",
    speciality: "Gastroenterologist",
    image: "/doctor/doc12.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "Gastroenterologist specializing in digestive health and endoscopy.",
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Chloe Evans",
    speciality: "General physician",
    image: "/doctor/doc13.png",
    degree: "MBBS",
    experience: "4 Years",
    about: "General physician committed to patient-centered primary care.",
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Ryan Martinez",
    speciality: "Gynecologist",
    image: "/doctor/doc14.png",
    degree: "MBBS",
    experience: "3 Years",
    about: "Gynecologist with expertise in prenatal and women's health.",
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Amelia Hill",
    speciality: "Dermatologist",
    image: "/doctor/doc15.png",
    degree: "MBBS",
    experience: "1 Years",
    about: "Dermatologist focusing on gentle, evidence-based skin care.",
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
];

// ---------- ADD EMAIL + PASSWORD ----------
const addLoginCredentials = async () => {
  const password = "doctor123";
  const hashedPassword = await bcrypt.hash(password, 10);

  doctors = doctors.map((doc, index) => ({
    ...doc,
    email: `doctor${index + 1}@gmail.com`,
    password: hashedPassword,
    fees: specialityFees[doc.speciality] || 800,
  }));
};

// ---------- SEED FUNCTION ----------
const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✔ MongoDB connected");
    await addLoginCredentials();

    await Doctor.deleteMany();
    console.log("✔ Old doctors removed");

    await Doctor.insertMany(doctors);
    console.log("🎉 Doctors added with login credentials!");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seedDoctors();
