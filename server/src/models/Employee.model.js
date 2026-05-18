import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: { type: String, required: true, trim: true },
    skills: { type: [String], default: [], validate: (v) => Array.isArray(v) },
    performanceScore: {
      type: Number,
      required: true,
      min: [0, "Performance score must be at least 0"],
      max: [100, "Performance score must be at most 100"],
    },
    experience: {
      type: Number,
      required: true,
      min: [0, "Experience cannot be negative"],
    },
    /** HR/provisioned password for employee (bcrypt); not selected in queries by default */
    passwordHash: {
      type: String,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

employeeSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

export const Employee = mongoose.model("Employee", employeeSchema);
