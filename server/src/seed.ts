import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import { Branch } from "./models/branch.js";
import { Lesson } from "./models/lessons.js";
import { User } from "./models/user.js";

/**
 * Seed database with initial data
 * Creates branches, admins, trainers, users, and lessons with relationships
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Branch.deleteMany({});
    await Lesson.deleteMany({});
    await User.deleteMany({});

    // Create branches
    const branchLocations = [
      { lat: 31.7683, lon: 35.2137, name: "ירושלים - מרכז", address: "רחוב יפו 15, ירושלים", phone: "02-1234567" },
      { lat: 32.0853, lon: 34.7818, name: "תל אביב - צפון", address: "רחוב דיזנגוף 100, תל אביב", phone: "03-2345678" },
      { lat: 31.2621, lon: 34.8018, name: "באר שבע - מרכז", address: "שדרות רגר 1, באר שבע", phone: "08-3456789" },
      { lat: 32.7940, lon: 34.9896, name: "חיפה - מרכז", address: "רחוב הרצל 50, חיפה", phone: "04-4567890" },
      { lat: 31.9510, lon: 34.8881, name: "אשדוד - מרכז", address: "רחוב הרצל 20, אשדוד", phone: "08-5678901" },
      { lat: 32.0809, lon: 34.8338, name: "רמת גן - מרכז", address: "רחוב ביאליק 10, רמת גן", phone: "03-6789012" },
      { lat: 32.1663, lon: 34.8433, name: "נתניה - מרכז", address: "רחוב הרצל 30, נתניה", phone: "09-7890123" },
      { lat: 32.0853, lon: 34.7818, name: "רמת השרון - מרכז", address: "רחוב ויצמן 5, רמת השרון", phone: "03-8901234" },
      { lat: 31.8969, lon: 34.8173, name: "רחובות - מרכז", address: "רחוב הרצל 15, רחובות", phone: "08-9012345" },
      { lat: 32.6996, lon: 35.3035, name: "טבריה - מרכז", address: "רחוב הגליל 25, טבריה", phone: "04-0123456" },
    ];
    
    const branches = await Branch.insertMany(
      branchLocations.map((loc) => ({
        name: loc.name,
        address: loc.address,
        phone: loc.phone,
        latitude: loc.lat,
        longitude: loc.lon,
      }))
    );

    // Create admins
    const hashedPassword = await bcrypt.hash("123456", 10);
    const admins = await User.insertMany(
      Array.from({ length: 5 }).map((_, i: number) => ({
        name: `מנהל ${i + 1}`,
        email: `admin${i + 1}@gym.com`,
        password: hashedPassword,
        role: "admin",
        registrationDate: new Date(),
        isPayed: true,
      }))
    );

    // Create trainers
    const trainers = await User.insertMany(
      Array.from({ length: 15 }).map((_, i: number) => ({
        name: `מאמן ${i + 1}`,
        email: `trainer${i + 1}@gym.com`,
        password: hashedPassword,
        role: "trainer",
        registrationDate: new Date(),
        isPayed: true,
      }))
    );

    // Create users
    const users = await User.insertMany(
      Array.from({ length: 30 }).map((_, i: number) => ({
        name: `משתמש ${i + 1}`,
        email: `user${i + 1}@gym.com`,
        password: hashedPassword,
        role: "user",
        registrationDate: new Date(),
        isPayed: i % 2 === 0,
      }))
    );

    // Create lessons with relationships
    const lessons: any[] = [];
    const allUsers = [...users];

    for (let i = 0; i < 20; i++) {
      const trainer = trainers[i % trainers.length];
      if (!trainer) continue;
      
      // Link each lesson to a branch
      const branch = branches[i % branches.length];
      if (!branch) continue;

      // Assign 3-5 students to each lesson
      const numStudents = 3 + (i % 3);
      const startIndex = (i * 2) % allUsers.length;
      const lessonStudents = [];
      
      // Assign students in circular manner
      for (let j = 0; j < numStudents; j++) {
        const studentIndex = (startIndex + j) % allUsers.length;
        const student = allUsers[studentIndex];
        if (student) {
          lessonStudents.push(student);
        }
      }

      // Create lesson with branchId
      const lesson = await Lesson.create({
        title: `שיעור ${i + 1} - ${branch.name}`,
        coachName: trainer.name,
        coachId: trainer._id,
        branchId: branch._id,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        startTime: `${18 + (i % 3)}:00`,
        endTime: `${19 + (i % 3)}:00`,
        type: i % 2 === 0 ? "group" : "personal",
        students: lessonStudents.map(s => s?._id).filter(id => id !== undefined),
        maxPatricipants: 10,
      });

      lessons.push(lesson);

      // Link lesson to trainer
      await User.findByIdAndUpdate(trainer._id, {
        $addToSet: { lessons: lesson._id },
      });

      // Link lesson to each student
      for (const student of lessonStudents) {
        await User.findByIdAndUpdate(student._id, {
          $addToSet: { lessons: lesson._id },
        });
      }

      // Link lesson to branch
      await Branch.findByIdAndUpdate(branch._id, {
        $addToSet: { lessons: lesson._id },
      });
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
