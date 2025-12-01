# 📘 Project Milestones – Hito 3: Microservices Design

## 📍 Status

- **Milestone 3 – Diseño de Microservicios** (✅ Current)
- **Milestone 2 – Continuous Integration** (Completed)
- **Milestone 1 – Project Setup & Definition** (Completed)

→ [View Hito 2 README](https://github.com/XimenaCor/IWillDoIt/blob/main/hito2/README.md)  
→ [View Hito 1 README](https://github.com/XimenaCor/IWillDoIt/blob/main/README.md)

---

## 🎯 Objective

Design and implement the first functional microservices of the project following a RESTful architecture and clean separation of layers.

This hito introduces:

- A **Task microservice** (core logic of the application).
- An **Offer microservice** (interacts with Task).
- Proper domain entities, DTOs, and business logic.
- A global logging system via NestJS Interceptors.
- Complete unit tests for services and controllers.
- Infrastructure required to execute the microservice.

This milestone represents the first fully functional version of the backend.

---

## 🧩 Technical Decisions Summary

| Component             | Choice                     | Justification                                                                 |
|-----------------------|----------------------------|-------------------------------------------------------------------------------|
| Framework             | NestJS                     | Modular, scalable, ideal for microservices, excellent testing and log interceptors. |
| Architectural Style   | REST API                   | Simple, standard, meets Cloud Computing hito requirements.                    |
| Business Logic Layer  | NestJS Services            | Clean separation of concerns; controllers do not include logic.               |
| Logging System        | NestJS Global Interceptor  | Centralized, lightweight, perfect for cross-cutting concerns.                 |
| Testing Framework     | Jest (default in NestJS)   | Easy mocks, snapshot support, fast execution, TS-friendly.                    |
| Data Source           | In-memory mock             | Enough to test with Postman or other tools.                    |

---

## ⚙️ Microservice Architecture

Two microservices were designed for this milestone:

### 🟦 Task Microservice
Handles the lifecycle of a task published by a user:
- Create task
- Update task
- Cancel task
- Retrieve tasks
- Manage task status transitions

### 🟩 Offer Microservice
Allows users to offer themselves to perform a task:
- Create offer
- Accept offer
- Link offer to task (via TaskService)

> **Note:** Multiple offers can exist, but only one may be accepted.

---

## 📌 Domain Entities

### Task
```json
{
  "id": number,
  "title": string,
  "description": string,
  "status": "OPEN" | "PENDING_OFFER" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  "createdAt": Date,
  "expectedFinishDate": Date,
  "locationId?": number
}
```

### Offer
```json
{
  "id": number,
  "taskId": number,
  "userId": number,
  "status": "PENDING" | "ACCEPTED" | "REJECTED"
}
```
# 📋 Business Logic & Testing Overview

## 🧠 Business Logic Overview

### ✔ Task Workflow
The task lifecycle follows this sequence:

1. **User creates a task** → Status: `OPEN`
2. **Offers exist** → Task becomes `PENDING_OFFER`
3. **Offer accepted** → Task becomes `ASSIGNED`
4. **Task completed** → Status: `COMPLETED`
5. **Task cancelled** → Status: `CANCELLED`

### ✔ Offer Workflow
The offer lifecycle operates as follows:

- **User creates an offer** → Status: `PENDING`
- **If accepted** → Status becomes `ACCEPTED` + associated task becomes `ASSIGNED`
- **Remaining offers** → May stay `PENDING` or be `REJECTED`

**Important**: Business logic lives entirely in services - no logic is implemented in controllers.

---

## 🧪 Tests Overview

Unit tests were implemented for the following components:

### ✔ TaskService
- Create a task
- Update a task
- Cancel a task
- Validate error conditions
- Handle status transitions correctly

### ✔ OfferService
- Create an offer
- Mock TaskService to simulate assignment
- Ensure valid transitions
- Test ID validation

### ✔ Controllers
- Controllers are correctly instantiated by NestJS
- Isolated tests using testing module

---

## 🚀 CI Verification

All tests pass successfully on:
- Local environment
- GitHub Actions (configured in Hito 2)

---

## 📜 Logging System

A global `LoggingInterceptor` was implemented to trace:
- Method
- Route
- Execution time

### Example Log:
[Request] GET /task
[Response] GET /task - 5ms


### Code Snippet:

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    console.log(`[Request] ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[Response] ${method} ${url} - ${Date.now() - start}ms`
        );
      }),
    );
  }
}
```
---
## 🔧  Activation

Activated globally in `main.ts`:

```typescript
app.useGlobalInterceptors(new LoggingInterceptor());
```

---
## 🔗 References
- [NestJS Documentation](https://docs.nestjs.com/)
- [Jest Framework](https://jestjs.io/)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)

---