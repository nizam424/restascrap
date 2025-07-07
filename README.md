# ScrapLab

ScrapLab is a full-stack web application that allows users to scrape and browse the best restaurants in Mumbai. It features:

* **Google OAuth 2.0 authentication** (via Google Sign-In)
* **JWT-based session management** stored as HTTP-only cookies
* **Flask** backend for scraping and API endpoints
* **React** frontend with smooth scrolling, protected routes, and caching via `localStorage`

---

## 📚 Features

* **Google Login / Logout** with secure JWT stored in HTTP-only cookies
* **Restaurant Scraper**: Scrapes `https://www.timeout.com/mumbai/restaurants/best-restaurants-in-mumbai` and normalizes data
* **Caching**: Stores restaurant data in `localStorage` for 1 hour to reduce redundant API calls
* **Responsive UI**: Mobile and desktop layouts, smooth scroll navigation
* **Toast Notifications** for success/error states

---

## 🚀 Tech Stack

* **Frontend**: React, React Router, Axios, Tailwind CSS, Lucide Icons, react-hot-toast
* **Backend**: Flask, BeautifulSoup, Flask-JWT-Extended, Flask-CORS
* **Deployment**: Vercel (frontend), Render
---

## 📋 Prerequisites

* **Node.js** (v16+)
* **Python** (v3.8+)
* **Yarn** or **npm**

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/nizam_424/restascrap.git
cd restascrap
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder with the following variables:

```dotenv
# Flask settings
FLASK_ENV=development
SECRET_KEY=your-flask-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
FRONTEND_URL=https://scraplab-web.vercel.app
```

Run the Flask server:

```bash
flask run
```

The API will be available at `http://localhost:5000`.

### 3. Setup Frontend

```bash
cd ../frontend
npm install      # or yarn install
```

Create a `.env` file in the `frontend/` folder with:

```dotenv
VITE_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the development server:

```bash
npm run dev      # or yarn dev
```

Frontend will run at `http://localhost:5173`.

---

## ⚙️ Usage

1. Open your browser at `http://localhost:5173`.
2. Click **Sign Up** to log in with your Google account.
3. Navigate to **Mumbai's Best Restaurants** page to view scraped data.
4. Use the **Refresh** button to manually re-fetch data (clears cache).
5. Click **Logout** to clear your session.

---

## 🛠️ Environment Variables

Be sure to create **both** backend and frontend `.env` files and supply your own keys:

| Variable                | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `SECRET_KEY`            | Flask application secret                          |
| `JWT_SECRET_KEY`        | JWT token signing key                             |
| `GOOGLE_CLIENT_ID`      | Google OAuth 2.0 Client ID                        |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth 2.0 Client Secret                    |
| `FRONTEND_URL`          | Frontend origin for CORS                          |
| `VITE_BASE_URL`         | Backend API base URL (e.g. `http://.../api`)      |
| `VITE_GOOGLE_CLIENT_ID` | Same as `GOOGLE_CLIENT_ID` for React Google Login |

---

## 📦 Deployment

* **Frontend**: Push to GitHub & connect to Vercel. Ensure `VITE_BASE_URL` points to your deployed backend.
* **Backend**: Deploy to Render/Heroku. Configure environment variables in your host's dashboard.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
