# Challenge Me App

A fun web app to beat boredom by giving you random text-based challenges and letting you respond, see and rate others' responses.

## 🚀 Features

- 🎲 Get a **random challenge** at the click of a button  
- ✍️ Submit your own creative **response**  
- ⭐ View and **rate** responses from others  
- 🗑️ **Delete** your own response  
- 🎨 Clean, responsive interface styled with **Tailwind CSS**  
- ⚙️ Backend API built with **Node.js + Express**

---

## 🧩 Tech Stack

### Frontend:
- HTML
- JavaScript (with ES6 Modules)
- Tailwind CSS

### Backend:
- Node.js
- Express

### Data Storage:
- JSON files (for challenges and responses)

---

## Folder Structure
```
project-root/
│
├── backend/
│ ├── index.js
│ ├── package.json
│ ├── data/
│ │ ├── challenges.json
│ │ └── responses.json
│ ├── routes/
│ │ ├── challenges.js
│ │ └── responses.js
│ ├── utils/
│ │ ├── fileHelpers.js
│ │ └── pickRandom.js
│ └── validators/
│ └── requestValidationSchemas.js
│
└── frontend/
├── config.js
├── index.html
├── main.js
├── api/
│ ├── challengesAPI.js
│ └── responsesAPI.js
└── dom/
├── renderChallenge.js
└── renderResponses.js
```

## 🔧 Getting Started

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node index.js
   ```
Server runs on http://localhost:5000 (or your configured port)

### 1. Frontend Setup
1. Open `frontend/index.html` in your browser.
2. Make sure the backend server is running for API calls to work.

---

## 🌐 API Endpoints

```http
GET /api/challenges/random
```
- Get a random challenge

```http
GET /api/responses/:challengeId
```
- Get all responses for a specific challenge

```http
POST /api/responses
```
- Add a new response

```http
DELETE /api/responses/:id
```
- Delete a response by ID

```http
PATCH /api/responses/:id
```
- Update a response (e.g. rating)

---

## Customization
- Add more challenges to `backend/data/challenges.json`.
- Tailwind CSS makes UI styling simple and fast
- Modular frontend structure (api/ and dom/) makes it easy to expand



## License
MIT

---
Built by Aqsa Ansari, 2025.
All features complete and ready to inspire your creativity! 🎉
