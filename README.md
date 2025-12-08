# 🌍 Covid19-Demographic-Analyzer

Welcome to **Covid19-Demographic-Analyzer** - a lightweight, interactive platform for exploring global COVID-19 data and country demographics in one place.
Built for students, researchers, and data enthusiasts, this application combines real-time data, secure authentication, and a simple, responsive UI to help users quickly analyze COVID-19 impact and demographic context across countries.

---

## ✨ Features

- **Country Search:** View real-time COVID-19 statistics and essential demographic data (population, region, flag, currency).
- **Computed Metrics:** Automatic calculation of cases per million, deaths per million, and vaccination percentages.
- **History Tracking:** Save country snapshots and revisit your lookup history anytime.
- **User Authentication:** Secure Google OAuth login + JWT-based protected routes.
- **Data Aggregation:** Combines multiple public APIs into one unified result.
- **Responsive UI:** Clean, simple interface using HTML, CSS, JS (or Handlebars).

---

## 🗂️ Project Structure

```
Covid19-Demographic-Analyzer/
├── backend/        # Node.js + Express server, API endpoints, database logic
├── frontend/       # Frontend UI (HTML/CSS/JS) for user interaction
├── README.md       # Project documentation
└── .gitignore      # Files/folders to ignore in version control
```
---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/PrashoHaran/Covid19-Demographic-Analyzer.git  
cd Covid19-Demographic-Analyzer
```

### 2. Setup Backend

```sh
cd backend
npm install
# Configure .env
# Add your MongoDB URI, JWT secret, Google OAuth keys, and optional API keys
npm start   # or npm run dev
```

### 3. Launch Client

Open `frontend/` in your browser using a local server (e.g., Live Server extension in VS Code).

---

## 🔐 Authentication

- **JWT:** Secure login and signup.
- **Google OAuth:** One-click login with Google.

---

## 🌐 APIs Used

- [Rest Countries](https://restcountries.com/) - Country demographic details
- [COVID-19 Data API](https://disease.sh/docs/) – Live COVID-19 statistics

---

## 🛡️ Security

- Passwords hashed with bcrypt.
- JWT for secure user session management.
- API key middleware for protecting backend endpoints.
- Sensitive credentials stored only in .env (not committed).

---

## 🎨 UI/UX Highlights

- Clean and Simple UI: Lightweight HTML/CSS/JS for fast performance.
- Responsive Design: Works smoothly on both desktop and mobile.
- User-Friendly Flow: Search → View Data → Compute Metrics → Save Snapshot.

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first so improvements can be discussed.

---

## 💡 Inspiration

Created for students, researchers, and anyone curious about exploring the global impact of COVID-19.
Whether you're analyzing trends, comparing countries, or studying pandemic-related data, Covid19-Demographic-Analyzer makes it simple, visual, and accessible.

---

**Stay Safe & Stay Informed.** 🦠📊✨
 
---