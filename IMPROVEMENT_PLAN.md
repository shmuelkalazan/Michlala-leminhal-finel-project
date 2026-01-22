# תוכנית שיפור מפורטת - מערכת ניהול חדר כושר

## 🔴 שלב 1: תיקונים קריטיים (חובה!)

### 1.1 הוספת JWT Authentication

**בעיה:** אין authentication אמיתי - כל אחד יכול לזייף headers.

**פתרון:**

#### שלב א': התקנת חבילות
```bash
cd server
npm install jsonwebtoken @types/jsonwebtoken
```

#### שלב ב': יצירת JWT Service
**קובץ חדש:** `server/src/services/jwtService.ts`
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
};
```

#### שלב ג': עדכון Login Controller
**קובץ:** `server/src/controllers/userController.ts`
```typescript
import { generateToken } from '../services/jwtService.js';

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    const token = generateToken(user.id, user.role);
    
    res.status(200).json({
      user: toAuthUser(user),
      token
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
```

#### שלב ד': יצירת Auth Middleware
**קובץ חדש:** `server/src/middlewares/auth.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwtService.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  req.user = { id: decoded.userId, role: decoded.role };
  next();
};
```

#### שלב ה': עדכון Authorize Middleware
**קובץ:** `server/src/middlewares/authorize.ts`
```typescript
import { Request, Response, NextFunction } from 'express';

export const authorize = (...allowedRoles: Array<"admin" | "trainer" | "user">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };
};
```

#### שלב ו': עדכון Routes
**קובץ:** `server/src/routes/userRouter.ts`
```typescript
import { authenticate } from '../middlewares/auth.js';

// הוסף authenticate לפני authorize
router.put("/:id", authenticate, authorize("admin"), updateUserController);
router.delete("/:id", authenticate, authorize("admin"), deleteUserController);
```

#### שלב ז': עדכון Client
**קובץ:** `client/src/api/auth.ts`
```typescript
export const login = async (payload: Credentials) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  const data = await handleResponse(response);
  
  // שמור token ב-localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
};

// הוסף function לשליחת token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};
```

---

### 1.2 הוספת Input Validation

**בעיה:** אין בדיקת קלט - המערכת פגיעה.

**פתרון:**

#### שלב א': התקנת express-validator
```bash
cd server
npm install express-validator
```

#### שלב ב': יצירת Validation Middleware
**קובץ חדש:** `server/src/middlewares/validate.ts`
```typescript
import { validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    next();
  };
};
```

#### שלב ג': יצירת Validation Rules
**קובץ חדש:** `server/src/validators/userValidators.ts`
```typescript
import { body } from 'express-validator';

export const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
```

#### שלב ד': שימוש ב-Validation
**קובץ:** `server/src/routes/userRouter.ts`
```typescript
import { validate } from '../middlewares/validate.js';
import { validateSignup, validateLogin } from '../validators/userValidators.js';

router.post("/signup", validate(validateSignup), createUserController);
router.post("/login", validate(validateLogin), loginController);
```

---

### 1.3 תיקון כל ה-`any` Types

**בעיה:** שימוש ב-`any` מבטל את היתרונות של TypeScript.

**פתרון:**

#### שלב א': יצירת Types משותפים
**קובץ:** `client/src/types/interface.ts` (עדכון)
```typescript
// הוסף:
export interface DashboardData {
  totals: {
    totalUsers: number;
    totalLessons: number;
    totalBranches: number;
  };
  branchesOccupancy: Array<{
    _id: string;
    name: string;
    address: string;
    phone: string;
    activeRegistrations: number;
  }>;
  trainersOccupancy: Array<{
    trainerId: string;
    trainerName: string;
    trainerEmail: string;
    lessonsCount: number;
    studentsCount: number;
  }>;
  usersLessons: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    lessonsCount: number;
  }>;
}
```

#### שלב ב': עדכון Components
**קובץ:** `client/src/pages/admin/AdminDashboard.tsx`
```typescript
// במקום:
const [data, setData] = useState<any>(null);

// שנה ל:
import { DashboardData } from '../../types/interface';
const [data, setData] = useState<DashboardData | null>(null);

// ותקן את ה-map:
{(data.branchesOccupancy || []).map((b) => (
  <li key={b._id}>{b.name}: {b.activeRegistrations}</li>
))}
```

**עשה אותו דבר ב:**
- `BranchesAdmin.tsx` - יצור `Branch[]` type
- `UsersAdmin.tsx` - יצור `User[]` type
- `TrainerLessons.tsx` - תקן את ה-`any` ב-`getCoachId`

---

### 1.4 ניקוי קבצים לא בשימוש

**קבצים למחיקה:**
- `client/src/nothing.ts` - מחק
- `client/src/routs.ts` - בדוק אם בשימוש, אם לא - מחק

**פקודה:**
```bash
rm client/src/nothing.ts
# בדוק routs.ts לפני מחיקה
```

---

### 1.5 תיקון שגיאת כתיב

**קובץ:** `server/src/services/userServic.ts`

**שורה 22:**
```typescript
// לפני:
preferredLanguege: user.preferredLanguege || "en",

// אחרי:
preferredLanguage: user.preferredLanguage || "en",
```

**גם ב-Model:**
**קובץ:** `server/src/models/user.ts`
```typescript
// שורה 10:
preferredLanguage?: string;  // במקום preferredLanguege

// שורה 25:
preferredLanguage: { type: String, default: "en" },
```

**גם ב-Service:**
**קובץ:** `server/src/services/userServic.ts`
```typescript
// שורה 98:
return User.findByIdAndUpdate(id, { preferredLanguage: language }, { new: true });
```

---

## 🟡 שלב 2: שיפורים חשובים

### 2.1 יצירת README מקיף

**קובץ:** `README.md` (בשורש הפרויקט)

```markdown
# 🏋️ Gym Management System

מערכת ניהול מקיפה לחדר כושר עם תמיכה ב-3 תפקידים: משתמש, מאמן ומנהל.

## ✨ תכונות

### למשתמש:
- הרשמה והתחברות
- צפייה בשיעורים זמינים
- הרשמה וביטול הרשמה לשיעורים
- צפייה בשיעורים שלי

### למאמן:
- יצירה ועדכון שיעורים
- מחיקת שיעורים
- צפייה בתלמידים רשומים
- דשבורד עם תפוסת שיעורים

### למנהל:
- ניהול משתמשים (יצירה, עדכון, מחיקה, שינוי תפקיד)
- ניהול סניפים (יצירה, עדכון, מחיקה)
- דשבורד עם סטטיסטיקות:
  - תפוסת סניפים
  - תפוסת מאמנים
  - ספירת שיעורים למשתמשים

### תכונות כלליות:
- 🌍 תמיכה ב-5 שפות (עברית, אנגלית, צרפתית, ספרדית, ערבית)
- 🗺️ מפה אינטראקטיבית עם מיקומי סניפים (OpenLayers)
- 🌤️ מזג אוויר נוכחי (OpenWeatherMap API)
- 📱 Responsive design

## 🛠️ טכנולוגיות

### Frontend:
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Jotai** - State management
- **react-i18next** - Internationalization
- **OpenLayers** - Maps
- **SCSS Modules** - Styling

### Backend:
- **Node.js** - Runtime
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcrypt** - Password hashing
- **JWT** - Authentication

## 📦 התקנה והפעלה

### דרישות מוקדמות:
- Node.js 18+
- MongoDB (local או Atlas)
- npm או yarn

### שלב 1: Clone הפרויקט
```bash
git clone <repository-url>
cd Michlala-leminhal-finel-project
```

### שלב 2: התקנת תלויות
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### שלב 3: הגדרת Environment Variables

**Backend** (`server/.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gymDatabase
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:3000
VITE_WEATHER_API_KEY=your-openweathermap-api-key
```

### שלב 4: Seed Database
```bash
cd server
npm run seed
```

### שלב 5: הפעלת השרתים

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

האפליקציה תהיה זמינה ב: `http://localhost:5173`

## 👤 משתמשים לדוגמה

לאחר הרצת seed, תוכל להתחבר עם:

**מנהל:**
- Email: `admin1@test.com`
- Password: `123456`

**מאמן:**
- Email: `trainer1@test.com`
- Password: `123456`

**משתמש:**
- Email: `student1@test.com`
- Password: `123456`

## 📚 API Documentation

### Authentication
- `POST /users/signup` - הרשמה
- `POST /users/login` - התחברות

### Users
- `GET /users` - קבלת כל המשתמשים (admin only)
- `GET /users/:id` - קבלת משתמש ספציפי
- `PUT /users/:id` - עדכון משתמש (admin only)
- `DELETE /users/:id` - מחיקת משתמש (admin only)
- `PUT /users/:id/role` - שינוי תפקיד (admin only)

### Lessons
- `GET /lessons` - קבלת כל השיעורים
- `GET /lessons/:id` - קבלת שיעור ספציפי
- `POST /lessons` - יצירת שיעור (trainer/admin)
- `PUT /lessons/:id` - עדכון שיעור (trainer/admin)
- `DELETE /lessons/:id` - מחיקת שיעור (trainer/admin)

### Branches
- `GET /branches` - קבלת כל הסניפים
- `GET /branches/public` - קבלת סניפים (public)
- `GET /branches/:id` - קבלת סניף ספציפי
- `POST /branches` - יצירת סניף (admin only)
- `PUT /branches/:id` - עדכון סניף (admin only)
- `DELETE /branches/:id` - מחיקת סניף (admin only)

### Admin
- `GET /admin/dashboard` - דשבורד מנהל (admin only)

## 🧪 בדיקות

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📝 מבנה הפרויקט

```
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API calls
│   │   ├── state/         # State management
│   │   ├── locales/       # Translations
│   │   └── types/          # TypeScript types
│   └── public/            # Static files
│
├── server/                 # Backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Middleware functions
│   │   └── utils/          # Utility functions
│   └── seed.ts            # Database seeding
│
└── README.md              # This file
```

## 🔒 אבטחה

- Passwords מוצפנים עם bcrypt
- JWT tokens לאימות
- Role-based access control (RBAC)
- Input validation
- CORS מוגדר

## 🤝 תרומה

זהו פרויקט גמר. לא מתקבלות תרומות כרגע.

## 📄 רישיון

ISC

## 👨‍💻 מפתח

שמואל קלזאן - פרויקט גמר 2026

## 🙏 תודות

- OpenWeatherMap - Weather API
- OpenLayers - Maps library
- MongoDB - Database
```

---

### 2.2 הוספת בדיקות בסיסיות

**קובץ:** `server/package.json` (עדכון)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0"
  }
}
```

**קובץ:** `server/jest.config.js` (חדש)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};
```

**קובץ:** `server/src/services/__tests__/userService.test.ts` (חדש)
```typescript
import { registerUser, authenticateUser } from '../userServic.js';
import { User } from '../../models/user.js';

describe('User Service', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = await registerUser(userData);
    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email.toLowerCase());
  });
  
  it('should not register duplicate email', async () => {
    // Test implementation
  });
});
```

---

## 📋 Checklist לפני הגשה

- [ ] ✅ JWT Authentication מוגדר
- [ ] ✅ Input Validation על כל ה-routes
- [ ] ✅ כל ה-`any` types תוקנו
- [ ] ✅ קבצים לא בשימוש נמחקו
- [ ] ✅ שגיאת כתיב תוקנה
- [ ] ✅ README מקיף נוצר
- [ ] ✅ API Documentation נוצר
- [ ] ✅ לפחות 5 Unit tests
- [ ] ✅ Error Handling משופר
- [ ] ✅ Loading States נוספו
- [ ] ✅ Code review בוצע
- [ ] ✅ כל ה-linter errors תוקנו

---

*תוכנית זו נוצרה ב-${new Date().toLocaleDateString('he-IL')}*
