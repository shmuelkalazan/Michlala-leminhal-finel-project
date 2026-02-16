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
    const adminNames = [
      "דוד כהן",
      "שרה לוי",
      "יוסף ישראלי",
      "רחל אברהם",
      "משה דוד"
    ];
    const admins = await User.insertMany(
      adminNames.map((name, i: number) => ({
        name: name,
        email: `admin${i + 1}@gym.com`,
        password: hashedPassword,
        role: "admin",
        registrationDate: new Date(),
        isPayed: true,
      }))
    );

    // Create trainers
    const trainerNames = [
      "אלון כהן",
      "מיכל לוי",
      "רונן ישראלי",
      "נועה דוד",
      "עמית אברהם",
      "תמר כהן",
      "אור לוי",
      "יואב ישראלי",
      "שירה דוד",
      "איתי אברהם",
      "מור כהן",
      "דני לוי",
      "ליאור ישראלי",
      "עדי דוד",
      "גל אברהם"
    ];
    const trainers = await User.insertMany(
      trainerNames.map((name, i: number) => ({
        name: name,
        email: `trainer${i + 1}@gym.com`,
        password: hashedPassword,
        role: "trainer",
        registrationDate: new Date(),
        isPayed: true,
      }))
    );

    // Create users
    const userNames = [
      "אבי כהן",
      "בתיה לוי",
      "גד ישראלי",
      "דנה דוד",
      "הדר אברהם",
      "ויקי כהן",
      "זוהר לוי",
      "חיים ישראלי",
      "טל דוד",
      "יאיר אברהם",
      "כרמי כהן",
      "ליאת לוי",
      "מיכאל ישראלי",
      "נטע דוד",
      "סתיו אברהם",
      "עומר כהן",
      "פז לוי",
      "ציון ישראלי",
      "קרן דוד",
      "רן אברהם",
      "שי כהן",
      "תום לוי",
      "אורן ישראלי",
      "ברק דוד",
      "גיא אברהם",
      "דור כהן",
      "הילה לוי",
      "יותם ישראלי",
      "כרמל דוד",
      "לירון אברהם"
    ];
    const users = await User.insertMany(
      userNames.map((name, i: number) => ({
        name: name,
        email: `user${i + 1}@gym.com`,
        password: hashedPassword,
        role: "user",
        registrationDate: new Date(),
        isPayed: i % 2 === 0,
      }))
    );

    // Create lessons with relationships - spread over 10 months
    const lessons: any[] = [];
    const allUsers = [...users];
    
    // Calculate date range: 5 months ago to 5 months from now (10 months total)
    const now = new Date();
    const fiveMonthsAgo = new Date(now);
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
    
    const fiveMonthsFromNow = new Date(now);
    fiveMonthsFromNow.setMonth(fiveMonthsFromNow.getMonth() + 5);
    
    // Create approximately 300 lessons spread over 10 months
    // That's about 1 lesson per day on average
    const totalDays = Math.floor((fiveMonthsFromNow.getTime() - fiveMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    const lessonsToCreate = 300;
    const daysBetweenLessons = Math.floor(totalDays / lessonsToCreate);
    
    const lessonTypes = ["yoga", "pilates", "spinning", "aerobics", "crossfit"];
    const timeSlots = [
      { start: "08:00", end: "09:00" },
      { start: "10:00", end: "11:00" },
      { start: "14:00", end: "15:00" },
      { start: "16:00", end: "17:00" },
      { start: "18:00", end: "19:00" },
      { start: "19:00", end: "20:00" },
      { start: "20:00", end: "21:00" },
    ];
    
    console.log(`Creating ${lessonsToCreate} lessons over ${totalDays} days...`);
    
    for (let i = 0; i < lessonsToCreate; i++) {
      // Randomly select trainer, branch, and students
      const trainer = trainers[Math.floor(Math.random() * trainers.length)];
      if (!trainer) continue;
      
      const branch = branches[Math.floor(Math.random() * branches.length)];
      if (!branch) continue;
      
      // Assign 2-8 students to each lesson (random)
      const numStudents = 2 + Math.floor(Math.random() * 7);
      const lessonStudents: any[] = [];
      const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < Math.min(numStudents, shuffledUsers.length); j++) {
        lessonStudents.push(shuffledUsers[j]);
      }
      
      // Calculate lesson date - spread evenly over 10 months
      const daysOffset = i * daysBetweenLessons + Math.floor(Math.random() * daysBetweenLessons);
      const lessonDate = new Date(fiveMonthsAgo);
      lessonDate.setDate(lessonDate.getDate() + daysOffset);
      
      // Random time slot
      const timeSlotIndex = Math.floor(Math.random() * timeSlots.length);
      const timeSlot = timeSlots[timeSlotIndex];
      if (!timeSlot) continue;
      
      // Random lesson type
      const lessonType = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
      
      // Create lesson
      const lesson = await Lesson.create({
        title: `שיעור ${lessonType} ${i + 1} - ${branch.name}`,
        description: `שיעור ${lessonType} עם ${trainer.name}`,
        coachName: trainer.name,
        coachId: trainer._id,
        branchId: branch._id,
        date: lessonDate,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        type: lessonType,
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
      
      // Log progress every 50 lessons
      if ((i + 1) % 50 === 0) {
        console.log(`Created ${i + 1}/${lessonsToCreate} lessons...`);
      }
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
