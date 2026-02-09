from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import joblib
import os
import json
import numpy as np
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import re
import math
import collections
from urllib.parse import urlparse

from backend.database import init_db, get_db, User, ScanHistory
from backend.utils.auth_utils import create_access_token, decode_access_token, get_password_hash, verify_password
from backend.utils.model_utils import (
    URLFeatureExtractor, 
    SECURE_ALLOWLIST, 
    KNOWN_BRANDS, 
    SUSPICIOUS_TLDS, 
    COMMON_TLDS, 
    SUS_KEYWORDS,
    get_entropy,
    extract_features_v2
)

# --- Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    init_db()
    load_resources()
    print("Lifespan startup: Resources loaded and database initialized.")
    yield
    # Shutdown logic (if any)
    print("Lifespan shutdown: Cleaning up resources.")

app = FastAPI(title="PhishGuard AI - Security First", lifespan=lifespan)

# Enable CORS (Refined for Credential support)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://0.0.0.0:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "phishing_model.pkl")
METADATA_PATH = os.path.join(BASE_DIR, "model", "model_metadata.json")

# Global State
model = None
metadata = None

def load_resources():
    global model, metadata
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print("Unified pipeline loaded successfully.")
        except Exception as e:
            print(f"CRITICAL: Failed to load pipeline: {e}")
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, 'r') as f:
            metadata = json.load(f)

# Global state is managed during lifespan

@app.get("/")
async def root():
    return {"status": "online", "message": "PhishGuard AI Backend is active"}

@app.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}

# --- Auth Dependencies ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username: str = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# --- Models ---
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str  # This will be used as the identifier (username or email)
    password: str

class URLRequest(BaseModel):
    url: str

# --- Routes ---

@app.post("/register")
async def register(auth: UserRegister, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = db.query(User).filter((User.username == auth.username) | (User.email == auth.email)).first()
    if existing_user:
        if existing_user.username == auth.username:
            raise HTTPException(status_code=400, detail="Username already registered")
        else:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(auth.password)
    new_user = User(username=auth.username, email=auth.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Check both username and email for login
    user = db.query(User).filter((User.username == form_data.username) | (User.email == form_data.username)).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect identifier or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/predict")
async def predict(request: URLRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    global model
    
    if model is None:
        load_resources()
        if model is None:
            raise HTTPException(status_code=503, detail="Model unavailable. System is initializing.")

    try:
        url = request.url
        
        # 1. Inference using Unified Pipeline
        probs = model.predict_proba([url])
        raw_prob = float(probs[0][1])

        # 2. Advanced Inference Bridge (Probabilistic Bias Correction)
        from backend.utils.model_utils import extract_features_v3
        raw_features, phishing_prob = extract_features_v3(url, raw_prob)
        
        domain = urlparse(url).netloc.lower().replace('www.', '')
        policy_note = "Risk tier determined by calibrated behavioral analysis."
        
        # 3. Policy-Based Classification (Part 4)
        # Thresholds: 0.65+ Phishing, 0.35- Legitimate, else Suspicious
        if phishing_prob >= 0.65:
            prediction = "phishing"
            risk_level = "high"
        elif phishing_prob <= 0.35:
            prediction = "legitimate"
            risk_level = "low"
            if raw_features['is_trusted_domain']:
                policy_note = "URL matches verified trusted domain patterns."
        else:
            prediction = "suspicious"
            risk_level = "medium"
            policy_note = "Ambiguous patterns detected. Proceed with caution."

        # 3. Save to History
        history_entry = ScanHistory(
            url=url,
            prediction=prediction,
            risk_level=risk_level,
            confidence=phishing_prob,
            user_id=user.id
        )
        db.add(history_entry)
        db.commit()

        # Serialize features for response
        serialized_features = {k: float(v) if isinstance(v, (np.float64, np.int64)) else v for k, v in raw_features.items()}

        return {
            "url": url,
            "prediction": prediction,
            "risk_level": risk_level,
            "confidence": round(phishing_prob, 4),
            "policy_note": policy_note,
            "features": serialized_features
        }
    except Exception as e:
        print(f"ML Inference Error: {e}")
        raise HTTPException(status_code=400, detail=f"Phishing analysis failed: {str(e)}")

@app.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return {
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "total_scans": len(user.scans)
    }

@app.get("/history")
async def get_history(user: User = Depends(get_current_user)):
    history = []
    for entry in user.scans:
        history.append({
            "url": entry.url,
            "prediction": entry.prediction,
            "risk_level": entry.risk_level,
            "confidence": entry.confidence,
            "timestamp": entry.timestamp.isoformat()
        })
    # Sort by timestamp descending
    history.sort(key=lambda x: x["timestamp"], reverse=True)
    return history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=5000, reload=True)
