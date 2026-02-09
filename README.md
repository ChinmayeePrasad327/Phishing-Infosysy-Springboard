# PhishGuard: Neural Phishing Detection System

PhishGuard is a production-grade, full-stack cybersecurity application designed to detect phishing URLs with high precision. By leveraging machine learning models trained on structural and behavioral features, it moves beyond static blocklists to identify zero-day phishing attempts in real-time.

Built with a modern tech stack (React, FastAPI, Scikit-learn), PhishGuard demonstrates a complete end-to-end implementation of an ML-driven SaaS product, featuring secure authentication, persistent user history, and a cinematic, responsive UI.

## Key Features

- **Real-Time ML Inference**: Instant analysis of URLs using a calibrated ensemble model.
- **Advanced Feature Extraction**: Analyzes 25+ distinct signals including entropy, domain aging, and element ratios.
- **Secure Authentication**: Robust JWT-based system with protected routes and automatic session management.
- **User Dashboard**: Personalized profile with scan history, risk statistics, and account management.
- **Cinematic UI**: Motion-first design using GSAP and Tailwind CSS for a premium user experience.
- **Responsive & Accessible**: Fully responsive layout with dark/light mode support.

## System Architecture

The system follows a standard client-server architecture:

1.  **Frontend (Client)**: A React SPA that handles user interaction, form validation, and data visualization. It communicates with the backend via RESTful API calls protected by JWTs.
2.  **Backend (API)**: A FastAPI service that manages authentication, database transactions, and orchestrates the ML pipeline.
3.  **ML Engine**: A scikit-learn pipeline that pre-processes URLs, extracts numerical features, and performs inference.
4.  **Database**: SQLite (scalable to PostgreSQL) for storing user profiles and scan history.

## Machine Learning Engine

The core of PhishGuard is a supervised learning pipeline designed to classify URLs as `Legitimate`, `Suspicious`, or `Phishing`.

-   **Algorithm**: The system uses an ensemble approach, tuning **ExtraTreesClassifier** and **GradientBoostingClassifier** via RandomizedSearchCV, followed by **Sigmoid Calibration** to provide accurate probability scores.
-   **Dataset**: Trained on a stratified sample of **100,000+ URLs** (50k legitimate, 50k phishing) to ensure class balance.
-   **Feature Engineering**: The `URLFeatureExtractor` generates 26+ features, including:
    -   **Structural**: URL length, dot count, special character ratios.
    -   **Domain**: TLD analysis, IP address presence, HTTPS usage.
    -   **Entropy**: Shannon entropy scores to detect random generation (DGA).
    -   **Semantic**: Presence of sensitive keywords (e.g., "login", "verify") near brand names.
-   **Limitations**: While highly effective against structural phishing, the model may have reduced accuracy against compromised legitimate domains or sophisticated cloaking techniques.

## Tech Stack

### Frontend
-   **React 18**: Component-based UI architecture.
-   **Tailwind CSS**: Utility-first styling for rapid, consistent design.
-   **GSAP**: High-performance animations for interaction feedback.
-   **Vite**: Next-generation frontend tooling.
-   **Lucide React**: Clean, consistent icon set.

### Backend
-   **FastAPI**: High-performance, async Python web framework.
-   **SQLAlchemy**: ORM for database interactions.
-   **Pydantic**: Data validation and settings management.
-   **Python-Jose**: Secure JWT encoding/decoding.

### Machine Learning
-   **Scikit-learn**: Model training, pipelining, and evaluation.
-   **Pandas/NumPy**: Data manipulation and numerical operations.
-   **Joblib**: Model serialization.

## Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.9+)

### Local Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/phishguard.git
    cd phishguard
    ```

2.  **Backend Setup**
    Navigate to the backend directory, create a virtual environment, and install dependencies.
    ```bash
    cd backend
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    # source venv/bin/activate
    
    pip install -r requirements.txt
    python -m backend.app
    ```
    The API will start at `http://localhost:5000`.

3.  **Frontend Setup**
    Open a new terminal, navigate to the frontend directory, and start the client.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The application will start at `http://localhost:5173`.

## Environment Variables

The frontend comes pre-configured for local development. If you need to change the API endpoint, create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Folder Structure

```text
phishguard/
├── frontend/                # React Client
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application views
│   │   ├── context/         # Global state (Auth, Theme)
│   │   └── services/        # API integration
│   └── public/              # Static assets
│
├── backend/                 # FastAPI Server
│   ├── model/               # Serialized ML models & metadata
│   ├── utils/               # Helper modules (Auth, ML features)
│   ├── app.py               # API Entry point
│   ├── database.py          # Database schema & connection
│   └── train_model.py       # Model training script
│
└── README.md                # Project Documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Note: This project is for educational and defensive security purposes only.*
