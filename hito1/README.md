
----------------------------

# 🧩 IllDo – Collaborative Task & Help Exchange Platform (Cloud Computing Project)

**IllDo** is a backend-driven web application designed to connect people who **need help with everyday tasks** (such as moving furniture, walking a dog, or tutoring) with others willing to offer their time and skills.  
This project is part of the **Cloud Computing** course in the **Master’s in Computer Engineering (UGR)** and will progressively apply cloud concepts and modern deployment practices through a series of milestones.

---

## 🚀 Project Overview

### **Main Idea**
**IllDo** allows users to:
- **Post tasks or requests** describing what they need help with.  
- Indicate whether the task involves **payment or volunteering**.  
- Let other users respond by clicking **“I’ll Do”**, which locks the task for others and enables direct communication.  
- Once both agree, they can complete the task.  
(*Payment integration is planned for future milestones if time allows.*)

### **Academic Context**
This project focuses on **backend architecture and cloud deployment**.  
A frontend (possibly in React) may be added later, but it is **not required** for the current milestones.

---

## 🧠 Tech Stack (Initial)

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Backend Framework** | [NestJS](https://nestjs.com) | Scalable Node.js server-side framework |
| **Language** | TypeScript | Strong typing and maintainability |
| **Database** | PostgreSQL or MongoDB (TBD) | Persistent data storage |
| **ORM / ODM** | Prisma or TypeORM | Database abstraction layer |
| **Containerization** | Docker | Environment consistency and portability |
| **Version Control** | Git + GitHub | Project management and collaboration |
| **Deployment (Future)** | Render / Railway / AWS | Cloud hosting for backend service |

---

## 📘 Project Milestones

### **Milestone 1 – Repository Setup & Project Definition (✅ Current)**

- Initialize the project using Next.js.
- Create a single GitHub repository for both frontend and backend.
- Define the purpose, architecture, and goals in this README.

**Deliverables**
- A working GitHub repository with full documentation.  
- A clear project definition describing the problem, objectives, and structure.  
- Initial commits following best Git practices.

---

## ⚙️ NestJS Base Information

This project was bootstrapped with [Nest CLI](https://docs.nestjs.com/cli/overview):

```bash
npm i -g @nestjs/cli
nest new illdo
```

**Default Structure**
```bash
illdo/
├── src/
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
---

## 🧰 Local Deployment

Follow these steps to run IllDo locally::

```bash
# 1. Clone the repository
$ git clone https://github.com/XimenaCor/IWillDoIt.git
$ cd IWillDoIt

# 2. Install dependencies
$ npm install

# 3. Start the development server
$ npm run start:dev

# 4. Verify
Visit http://localhost:3000
You should see: Hello World
```
---

## License
This project is licensed under the [MIT License](https://github.com/XimenaCor/IWillDoIt/blob/main/LICENCE).  
© 2025 Ximena Cordero
