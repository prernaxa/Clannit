# 📅 Clannit – Build Tiny Habits with Your Social Circle

A collaborative habit-tracking app where users form clans (groups), check in daily for their habits, and suggest penalties for missed check-ins. Penalties can be voted on by other members — fostering accountability and a little fun!

---

## 🚀 Features

- ✅ **User Authentication** via Supabase  
- 👥 **Group Creation & Joining**  
- ✉️ **Invite Friends via Invite Code**  
- 📆 **Habit Tracking & Daily Check-ins**  
- ⚠️ **Penalty Suggestions** for missed check-ins  
- 🗳️ **Voting System** for penalty suggestions  
- 📊 **Group Overview** with habits and check-in status  

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React  
- **Styling:** Tailwind CSS  
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime)  
- **Icons:** Lucide Icons
  
---

## 🧪 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/prernaxa/clannit.git
cd micro-habit-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Create a Supabase project at [https://supabase.com](https://supabase.com)
- Enable **Authentication** and **PostgreSQL**
- Create the following tables:  
  `groups`, `user_groups`, `penalty_suggestions`, `check_ins`, `profiles`, `habits`, `penalties`, `penalty_votes`
- You can find the SQL schema in `/supabase/schema.sql`  
  (Let me know if you want help writing the schema.)

### 4. Configure environment variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## ✅ To-Do

- [ ] Add penalty notification system  
- [ ] Show check-in streaks  
- [ ] Leaderboard for most consistent users  
- [ ] Reminder system (email or in-app)  
- [ ] Mobile-first improvements  

---

## 🙌 Contributing

Pull requests and suggestions are welcome! Feel free to fork the repo and improve it.
