import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    // =============================
    // BASIC USER INFO
    // =============================
    name: { 
        type: String, 
        required: true,
        trim: true
    },

    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: { 
  type: String,
  default: '',
  trim: true
},

    password: { 
        type: String, 
        required: true 
    },

    // =============================
    // PROFILE INFO
    // =============================
    image: { 
        type: String, 
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURBVHgB7d0JchvHFcbxN+C+iaQolmzFsaWqHMA5QXID+wZJTmDnBLZu4BvER4hvYJ/AvoHlimPZRUngvoAg4PkwGJOiuGCd6df9/1UhoJZYJIBvXndPL5ndofljd8NW7bP8y79bZk+tmz8ATFdmu3nWfuiYfdNo2383389e3P5Xb9B82X1qs/YfU3AB1Cuzr+3cnt8U5Mb132i+7n5mc/a9EV4gDF37Z15Qv3/9a/fz63/0VgXOw/uFdexLAxCqLze3s+flL/4IcK/yduwrAxC0zoX9e+u9rJfVXoB7fV41m7u2YQBCt2tt+6v6xEUfeM6+ILyAGxv9QWbL+iPOPxoAX2Zts9GZtU8NgDudln3eyNvQnxgAd/Lw/k194I8NgD+ZPc2aO92uAXCpYQDcIsCAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADCDg=='
    },

    address: { 
        type: Object, 
        default: { line1: '', line2: '' } 
    },

    gender: { 
        type: String, 
        default: 'Not Selected' 
    },

    dob: { 
        type: String, 
        default: 'Not Selected' 
    },

    // =============================
    // OTP SECURITY FIELDS
    // =============================
    otp: { 
        type: String 
    },

    otpExpiry: { 
        type: Number   // Stored as timestamp (Date.now())
    },

    isOtpVerified: { 
        type: Boolean, 
        default: false 
    }

}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
