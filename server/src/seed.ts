import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import { Branch } from "./models/branch.js";
import { Lesson } from "./models/lessons.js";
import { User } from "./models/user.js";

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🗑️ Cleaning database...");
    // ניקוי מלא של ה-DB
    await Branch.deleteMany({});
    await Lesson.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Database cleaned");

    // ---------- סניפים (10 סניפים) ----------
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
    
    console.log("📦 Creating branches...");
    const branches = await Branch.insertMany(
      branchLocations.map((loc) => ({
        name: loc.name,
        address: loc.address,
        phone: loc.phone,
        latitude: loc.lat,
        longitude: loc.lon,
      }))
    );
    console.log(`✅ Created ${branches.length} branches`);

    // ---------- מנהלים (5 מנהלים) ----------
    console.log("👔 Creating admins...");
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
    console.log(`✅ Created ${admins.length} admins`);

    // ---------- מאמנים (15 מאמנים) ----------
    console.log("💪 Creating trainers...");
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
    console.log(`✅ Created ${trainers.length} trainers`);

    // ---------- משתמשים (30 משתמשים) ----------
    console.log("👤 Creating users...");
    const users = await User.insertMany(
      Array.from({ length: 30 }).map((_, i: number) => ({
        name: `משתמש ${i + 1}`,
        email: `user${i + 1}@gym.com`,
        password: hashedPassword,
        role: "user",
        registrationDate: new Date(),
        isPayed: i % 2 === 0, // חצי מהם שילמו
      }))
    );
    console.log(`✅ Created ${users.length} users`);

    // ---------- שיעורים (20 שיעורים) ----------
    console.log("📚 Creating lessons...");
    const lessons: any[] = [];
    const allUsers = [...users]; // כל המשתמשים

    for (let i = 0; i < 20; i++) {
      const trainer = trainers[i % trainers.length];
      if (!trainer) continue;
      
      // כל שיעור מקושר לסניף
      const branch = branches[i % branches.length];
      if (!branch) continue;

      // כל שיעור יש לו 3-5 תלמידים
      const numStudents = 3 + (i % 3); // 3, 4, או 5 תלמידים
      const startIndex = (i * 2) % allUsers.length;
      const lessonStudents = [];
      
      // לוקח תלמידים בצורה מעגלית
      for (let j = 0; j < numStudents; j++) {
        const studentIndex = (startIndex + j) % allUsers.length;
        const student = allUsers[studentIndex];
        if (student) {
          lessonStudents.push(student);
        }
      }

      // יצירת השיעור עם branchId
      const lesson = await Lesson.create({
        title: `שיעור ${i + 1} - ${branch.name}`,
        coachName: trainer.name,
        coachId: trainer._id,
        branchId: branch._id, // קישור לסניף
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000), // כל שיעור ביום אחר
        startTime: `${18 + (i % 3)}:00`, // 18:00, 19:00, או 20:00
        endTime: `${19 + (i % 3)}:00`,
        type: i % 2 === 0 ? "group" : "personal",
        students: lessonStudents.map(s => s?._id).filter(id => id !== undefined),
        maxPatricipants: 10,
      });

      lessons.push(lesson);

      // קישור שיעור למאמן
      await User.findByIdAndUpdate(trainer._id, {
        $addToSet: { lessons: lesson._id },
      });

      // קישור שיעור לכל תלמיד
      for (const student of lessonStudents) {
        await User.findByIdAndUpdate(student._id, {
          $addToSet: { lessons: lesson._id },
        });
      }

      // קישור שיעור לסניף (גם דרך ה-array של הסניף)
      await Branch.findByIdAndUpdate(branch._id, {
        $addToSet: { lessons: lesson._id },
      });
    }

    console.log(`✅ Created ${lessons.length} lessons`);

    // סיכום
    console.log("\n✅ Database seeded successfully!");
    console.log("📊 Summary:");
    console.log(`   - ${branches.length} branches`);
    console.log(`   - ${admins.length} admins`);
    console.log(`   - ${trainers.length} trainers`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${lessons.length} lessons`);
    console.log("\n🔗 All relationships created:");
    console.log("   ✓ Lessons linked to branches (branchId)");
    console.log("   ✓ Lessons linked to trainers (coachId)");
    console.log("   ✓ Users enrolled in lessons (students)");
    console.log("   ✓ Trainers have lessons in their profile");
    console.log("   ✓ Users have lessons in their profile");
    console.log("   ✓ Branches have lessons in their profile");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
