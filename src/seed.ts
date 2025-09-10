import mongoose, { Types } from "mongoose";
import env from "./config/env.js";
import { User } from "./features/user.js";
import { Note } from "./features/note.js";

const MONGO_URI = env.ATLAS_URI;

const sampleUsers = [
  {
    username: "Toriality",
    password: "password",
  },
  {
    username: "JohnDoe",
    password: "password2",
  },
];

interface NoteSeed {
  title: string;
  desc: string;
  user?: Types.ObjectId;
}

const sampleNotes: NoteSeed[] = [
  {
    title: "Welcome to ScratchBook!",
    desc: `
Welcome to ScratchBook!

This is a simple note taking app that I built for my portfolio. It uses MERN (MongoDB, Express, React, Node) stack. I hope you enjoy it!

- Toriality
`,
  },
  {
    title: "Second Note",
    desc: "Hello world!",
  },
  {
    title: "Grocery List",
    desc: `
- Milk
- Eggs
- Bread
- Avocados
- Coffee beans
- Dark chocolate
- Almond butter
- Quinoa
`,
  },
  {
    title: "Project Ideas",
    desc: `
1. Habit tracker with streaks
2. Minimalist Pomodoro timer
3. Markdown blog CMS
4. AI-powered journaling app
5. Local event discovery map
`,
  },
  {
    title: "API Endpoints to Build",
    desc: `
GET    /api/notes      → list all
POST   /api/notes      → create
GET    /api/notes/:id  → single note
PUT    /api/notes/:id  → update
DELETE /api/notes/:id  → delete
`,
  },
  {
    title: "React Hooks I Use Daily",
    desc: `
- useState
- useEffect
- useContext
- useReducer (for complex state)
- useCallback / useMemo (optimizations)
- useRef (DOM & persisting values)
`,
  },
  {
    title: "Books to Read in 2025",
    desc: `
- Atomic Habits – James Clear
- Deep Work – Cal Newport
- The Psychology of Money – Morgan Housel
- Project Hail Mary – Andy Weir
- Sapiens – Yuval Noah Harari
`,
  },
  {
    title: "Password Reset Instructions",
    desc: `
Step 1: Go to Settings > Security
Step 2: Click “Forgot Password?”
Step 3: Check email (including spam)
Step 4: Click reset link
Step 5: Enter new password twice
Step 6: Login & celebrate 🎉
`,
  },
  {
    title: "Travel Bucket List",
    desc: `
✈️ Japan – Kyoto temples & ramen
🏔️ Switzerland – Alps & chocolate
🏛️ Greece – Santorini sunset
🏜️ Morocco – Sahara desert camp
🦘 Australia – Great Barrier Reef
`,
  },
  {
    title: "Morning Routine",
    desc: `
6:30 AM – Wake up, no snooze
6:35 – Drink water + stretch
6:45 – Meditate 10 min
7:00 – Journal 3 things I’m grateful for
7:15 – Cold shower (yes, really)
7:30 – Coffee + plan day
`,
  },
  {
    title: "Bug: Note Saving Fails on Mobile",
    desc: `
Repro:
- Open app on iOS Safari
- Type long note (>500 chars)
- Tap Save → spinner runs forever

Possible cause:
- Timeout on backend?
- CORS issue?
- Body parser limit?

Priority: HIGH
`,
  },
  {
    title: "Quotes I Love",
    desc: `
“Imagination is more important than knowledge.” – Einstein

“The only way to do great work is to love what you do.” – Jobs

“Done is better than perfect.” – Sheryl Sandberg

“What would you do if you weren’t afraid?” – Spencer Johnson
`,
  },
  {
    title: "CSS Variables for Theme",
    desc: `
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --bg: #f9fafb;
  --text: #1f2937;
  --border: #e5e7eb;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}
`,
  },
  {
    title: "Meeting Notes – UX Review",
    desc: `
Attendees: Alex, Sam, Jordan

Feedback:
- Increase font size on mobile
- Add “undo delete” snackbar
- Reduce animation duration
- Add dark mode toggle (top right)

Action Items:
- Sam → mockups by Friday
- Jordan → implement undo
- Alex → user testing next week
`,
  },
  {
    title: "Dumbest Things I’ve Googled",
    desc: `
- “Can you microwave a grape?” (yes, but it explodes 💥)
- “Why do cats hate cucumbers?”
- “How to unsend email gmail 2025”
- “Is water wet?”
- “Can birds fart?” (apparently rarely)
`,
  },
  {
    title: "Environment Variables Needed",
    desc: `
MONGODB_URI=your_uri_here
JWT_SECRET=supersecretkey123
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
`,
  },
  {
    title: "Keyboard Shortcuts",
    desc: `
Cmd+N → New Note
Cmd+S → Save Note
Cmd+F → Search Notes
Cmd+D → Delete Note
Cmd+/ → Toggle this help
Cmd+Shift+D → Duplicate Note
`,
  },
  {
    title: "App Name Ideas",
    desc: `
- ScratchBook ✅ (current)
- NoteNest
- BrainBites
- ThoughtJar
- MemoMagnet
- IdeaInk
- QuickScribble
`,
  },
  {
    title: "User Feedback (from Twitter)",
    desc: `
@devjane: “Love the minimal UI! Please add export to PDF!”

@techtom: “Crashes when pasting 10k chars. Fix pls.”

@uxlaura: “Dark mode or I riot 😜”

@noteguru: “Tagging system? Would pay for this.”
`,
  },
  {
    title: "Deployment Checklist",
    desc: `
✅ Buy domain
✅ Setup MongoDB Atlas
✅ Configure env vars
✅ Build React app
✅ Test API routes
✅ Setup PM2 / systemd
✅ Enable HTTPS (Let’s Encrypt)
✅ Monitor with Sentry
✅ Celebrate 🍾
`,
  },
  {
    title: "Cat’s Vet Appointment",
    desc: `
Dr. Whiskers - PetCare Clinic
📅 May 18, 2025 @ 3:30 PM
📍 123 Paw Street, Meowville

Bring:
- Vaccination records
- $85 payment
- Treats for good behavior 😸

Symptoms: Sneezing + lazy. Probably just drama.
`,
  },
  {
    title: "Random Thoughts at 2AM",
    desc: `
Why do we say “tuna fish” but not “beef mammal”?

If I delete this app, do my notes know they’re gone?

Is a hotdog a sandwich? Let’s not start this again.

I should sleep. But also... one more note?
`,
  },
  {
    title: "Thank You Note",
    desc: `
To whoever is reading this —

Thanks for checking out ScratchBook. Whether you’re a recruiter, a fellow dev, or just curious — I appreciate you taking the time.

Built with ☕ and curiosity.

— Toriality
`,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    console.log("🧹 Cleaning database...");
    await Promise.all([User.deleteMany({}), Note.deleteMany({})]);
    console.log("✅ Cleaned database");

    console.log("🌱 Seeding users...");
    const users = await User.create(sampleUsers);
    console.log(`✅ Seeded ${users.length} users`);

    console.log("🌱 Seeding notes...");
    sampleNotes.forEach((note) => {
      note.user = users[0]._id;
    });

    const posts = await Note.create(sampleNotes);
    console.log(`✅ Seeded ${posts.length} notes`);

    console.log("✅ Seeding complete");
  } catch (err) {
    console.error("🚨 Error during seed", err);
  } finally {
    console.log("🌱 Closing connection to MongoDB...");
    mongoose.connection.close();
    console.log("✅ Connection closed");
  }
}

seed()
