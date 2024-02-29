# CAPTCHA System

## Technologies
- Backend: Python (Flask)
- Frontend: ReactJS

## Project Structure

### Backend (Flask)
```bash 

captcha-system/
│
├── backend/
│ ├── app.py # Flask application
│ └── requirements.txt # Python dependencies
│
└── frontend/ # ReactJS application
├── public/
│ └── index.html
├── src/
│ ├── App.js # Main app component
│ └── index.js # Entry point for React
├── package.json # Node.js dependencies


```



### Frontend (ReactJS)
See structure within `captcha-system/frontend/` above.

## Setup Instructions

1. **Backend Setup**
   - Navigate to `backend/` directory.
   - Install dependencies: `pip install -r requirements.txt`.
   - Run Flask app: `python app.py`.

2. **Frontend Setup**
   - Navigate to `frontend/` directory.
   - Install dependencies: `npm install`.
   - Start React app: `npm start`.

## Development Notes

- **Flask App (`app.py`)**: Setup Flask application, CORS, and API endpoints (`/generate_captcha`, `/verify_captcha`).
- **CAPTCHA Generators**: Implement minimal logic for generating text and puzzle CAPTCHAs.
- **React Components**: Create simple React components to interact with the CAPTCHA challenges provided by the backend.
- **API Communication**: Use Axios or Fetch API in React to call Flask API endpoints for CAPTCHA generation and verification.
