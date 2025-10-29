# 📘 Project Milestones – Hito 2: Continuous Integration (CI)

## 📍 Status
**Milestone 2 – Continuous Integration (✅ Current)**  
**Milestone 1 – Repository Setup & Project Definition (Completed)**  
→ [View Hito 1 README](https://github.com/XimenaCor/IWillDoIt/blob/main/README.md)

---

## 🎯 Objective
Implement a Continuous Integration (CI) system to automatically execute tests, linting, and build processes on each push or pull request.  
This ensures that every code change is validated before integration, maintaining software quality and project stability.

---

## 🧩 Tools and Configuration Summary

| Component | Tool / Framework | Justification |
|------------|------------------|----------------|
| **Task Runner** | npm scripts | Native integration with NestJS and Node.js; simple task management. |
| **Assertion Library** | Jest (built-in) | Default with NestJS, supports TDD and BDD styles. |
| **Test Runner** | Jest | Widely used, fast, supports TypeScript and mocks. |
| **CI Platform** | GitHub Actions | Free, integrated with GitHub, simple YAML configuration. |

---

## ⚙️ Implementation Overview

- Added `.github/workflows/ci.yml` to automate:
  1. Dependency installation (`npm ci`)
  2. Lint validation (`npm run lint`)
  3. Unit tests (`npm test`)
  4. Build verification (`npm run build`)
- Added minimal Jest tests for `TaskController` and `TaskService`.
- Configured ESLint and Prettier for consistent code style.

**Result:**  
Each push or pull request to `main` triggers the workflow automatically, ensuring all checks pass before integration.

---

## 📦 Deliverables

1. **Repository with CI configuration:**  
   `.github/workflows/ci.yml` implementing automatic testing and build.
2. **Functional unit tests:**  
   Verified with Jest for controllers and services.
3. **Lint and build process validation:**  
   Ensures consistent formatting and successful compilation.
4. **README for Hito 2:**  
   Detailed explanation of tools, configuration, and CI setup.

---

## ✅ Evidence

- **Workflow status:**  
  ![CI Status](https://github.com/XimenaCor/iwilldoit/actions/workflows/ci.yml/badge.svg)
- **Execution time:** ~34 seconds  
- **Latest run:** Successful on `main` branch  
- **Log available at:** [GitHub Actions](https://github.com/XimenaCor/iwilldoit/actions)

---

## 🧠 Technical Justification

Using **NestJS** for backend development simplifies test management and automation through its native integration with **Jest**.  
Choosing **GitHub Actions** provides a free, reliable, and fully integrated CI platform that aligns with industry standards for agile development.

---

## 🔗 References
- [NestJS Documentation](https://docs.nestjs.com/)
- [Jest Framework](https://jestjs.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---
