import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import { Branch } from "./models/branch.js";
import { Lesson } from "./models/lessons.js";
import { User } from "./models/user.js";

const seedDatabase = async () => {
  try {
    await connectDB();

    // בדיקה אם כבר יש נתונים
    const existingUsers = await User.countDocuments();
    const shouldCleanDB = existingUsers === 0;
    
    if (shouldCleanDB) {
      // ניקוי DB רק אם אין משתמשים
      await Branch.deleteMany({});
      await Lesson.deleteMany({});
      await User.deleteMany({});
    } else {
      console.log("⚠️ Database already has data. Updating branches with locations only.");
    }

    // ---------- סניפים ----------
    const branchLocations = [
      { lat: 31.7683, lon: 35.2137, name: "Branch 1", address: "Street 1", phone: "050-0000000" },
      { lat: 32.0853, lon: 34.7818, name: "Branch 2", address: "Street 2", phone: "050-0000001" },
      { lat: 31.2621, lon: 34.8018, name: "Branch 3", address: "Street 3", phone: "050-0000002" },
      { lat: 32.7940, lon: 34.9896, name: "Branch 4", address: "Street 4", phone: "050-0000003" },
      { lat: 31.9510, lon: 34.8881, name: "Branch 5", address: "Street 5", phone: "050-0000004" },
    ];
    
    // עדכון כל הסניפים הקיימים להוסיף להם מיקום
    const existingBranches = await Branch.find();
    const branches = [];
    
    // עדכון סניפים קיימים עם מיקום
    for (let i = 0; i < existingBranches.length; i++) {
      const branch = existingBranches[i];
      const loc = branchLocations[i % branchLocations.length];
      if (branch && loc) {
        branch.latitude = loc.lat;
        branch.longitude = loc.lon;
        await branch.save();
        branches.push(branch);
      }
    }
    
    // יצירת סניפים חדשים אם צריך
    if (existingBranches.length < branchLocations.length) {
      for (let i = existingBranches.length; i < branchLocations.length; i++) {
        const loc = branchLocations[i];
        if (loc) {
          const newBranch = await Branch.create({
            name: loc.name,
            address: loc.address,
            phone: loc.phone,
            latitude: loc.lat,
            longitude: loc.lon,
          });
          branches.push(newBranch);
        }
      }
    }
    
    // אם אין סניפים כלל, ניצור אותם
    if (branches.length === 0) {
      const createdBranches = await Branch.insertMany(
        branchLocations.map((loc) => ({
          name: loc.name,
          address: loc.address,
          phone: loc.phone,
          latitude: loc.lat,
          longitude: loc.lon,
        }))
      );
      branches.push(...createdBranches);
    }

    // אם יש משתמשים קיימים, רק מעדכן סניפים ולא יוצר משתמשים/שיעורים
    if (shouldCleanDB) {
      // ---------- מנהלים ----------
      const hashedPassword = await bcrypt.hash("123456", 10);
      const admins = await User.insertMany(
        Array.from({ length: 3 }).map((_, i) => ({
          name: `Admin ${i + 1}`,
          email: `admin${i + 1}@test.com`,
          password: hashedPassword,
          role: "admin",
          registrationDate: new Date(),
          isPayed: true,
        }))
      );

      // ---------- מאמנים ----------
      const trainers = await User.insertMany(
        Array.from({ length: 10 }).map((_, i) => ({
          name: `Trainer ${i + 1}`,
          email: `trainer${i + 1}@test.com`,
          password: hashedPassword,
          role: "trainer",
          registrationDate: new Date(),
          isPayed: true,
        }))
      );

      // ---------- תלמידים ----------
      const students = await User.insertMany(
        Array.from({ length: 30 }).map((_, i) => ({
          name: `Student ${i + 1}`,
          email: `student${i + 1}@test.com`,
          password: hashedPassword,
          role: "user",
          registrationDate: new Date(),
          isPayed: i % 2 === 0,
        }))
      );

      // ---------- שיעורים ----------
      const lessons: any[] = [];

      for (let i = 0; i < 15; i++) {
        const trainer = trainers[i % trainers.length];
        if (!trainer) continue;
        
        const lessonStudents = students.slice(i * 2, i * 2 + 4);
        const branch = branches[i % branches.length];
        if (!branch) continue;

        const lesson = await Lesson.create({
          title: `Lesson ${i + 1}`,
          coachName: trainer.name,
          coachId: trainer._id,
          date: new Date(),
          startTime: "18:00",
          endTime: "19:00",
          type: "group",
          students: lessonStudents.map(s => s._id),
          maxPatricipants: 10,
        });

        lessons.push(lesson);

        // קישור שיעור למאמן
        await User.findByIdAndUpdate(trainer._id, {
          $push: { lessons: lesson._id },
        });

        // קישור שיעור לתלמידים
        for (const student of lessonStudents) {
          await User.findByIdAndUpdate(student._id, {
            $push: { lessons: lesson._id },
          });
        }

        // קישור שיעור לסניף
        await Branch.findByIdAndUpdate(branch._id, {
          $push: { lessons: lesson._id },
        });
      }

      console.log("✅ Database seeded successfully");
      console.log(`📊 Created: ${branches.length} branches, ${admins.length} admins, ${trainers.length} trainers, ${students.length} students, ${lessons.length} lessons`);
    } else {
      console.log("✅ Branches updated with locations successfully");
      console.log(`📊 Updated ${branches.length} branches with coordinates`);
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
