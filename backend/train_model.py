import pandas as pd
import numpy as np
import joblib
import os
import json
from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import recall_score, f1_score, classification_report

# Import the custom transformer from the shared utility
from backend.utils.model_utils import URLFeatureExtractor

# --- Constants & Configuration ---
DATA_PATH = "final_phishing_url_dataset.csv"
MODEL_SAVE_PATH = "backend/model/phishing_model.pkl"
METADATA_PATH = "backend/model/model_metadata.json"

def train_unified():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset {DATA_PATH} not found.")
        return

    print("Loading and sampling data...")
    df = pd.read_csv(DATA_PATH)
    # Stratified sample - larger for better calibration
    df = df.groupby('label', group_keys=False).apply(lambda x: x.sample(n=min(len(x), 50000), random_state=42))
    
    X = df['url']
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models_to_tune = [
        {
            "name": "ExtraTrees",
            "model": ExtraTreesClassifier(class_weight='balanced', random_state=42, n_jobs=-1, max_depth=15),
            "params": {
                'clf__n_estimators': [100, 200],
                'clf__min_samples_leaf': [2, 5]
            }
        },
        {
            "name": "GradientBoosting",
            "model": GradientBoostingClassifier(random_state=42, max_depth=5),
            "params": {
                'clf__n_estimators': [100, 200],
                'clf__learning_rate': [0.05, 0.1]
            }
        }
    ]

    best_pipeline = None
    best_score = float('inf')
    best_name = ""

    for m_info in models_to_tune:
        print(f"\nTuning {m_info['name']}...")
        
        pipe = Pipeline([
            ('features', URLFeatureExtractor()),
            ('scaler', StandardScaler()),
            ('clf', m_info['model'])
        ])
        
        search = RandomizedSearchCV(
            pipe, m_info['params'], 
            n_iter=5, cv=StratifiedKFold(n_splits=3), 
            scoring='neg_log_loss', n_jobs=-1, random_state=42
        )
        search.fit(X_train, y_train)
        
        score = -search.best_score_
        print(f"  Best LogLoss: {score:.4f}")
        
        if score < best_score:
            best_score = score
            best_pipeline = search.best_estimator_
            best_name = m_info['name']

    print(f"\nWinning Model: {best_name}")

    # --- Feature Importance ---
    try:
        clf_model = best_pipeline.named_steps['clf']
        importances = clf_model.feature_importances_
        feature_names = best_pipeline.named_steps['features'].feature_names
        feat_imp = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        print("\nTop Features:")
        for name, val in feat_imp[:10]:
            print(f"  {name}: {val:.4f}")
    except:
        pass

    # --- Calibration ---
    print("Applying sigmoid probability calibration...")
    
    final_clf = best_pipeline.named_steps['clf']
    calibrated_clf = CalibratedClassifierCV(final_clf, cv=3, method='sigmoid')
    
    production_pipeline = Pipeline([
        ('features', best_pipeline.named_steps['features']),
        ('scaler', best_pipeline.named_steps['scaler']),
        ('clf', calibrated_clf)
    ])
    
    print("Fitting production pipeline...")
    production_pipeline.fit(X_train, y_train)

    # Evaluation
    print("\nFinal Evaluation:")
    y_pred = production_pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))

    # Export
    print(f"Exporting unified pipeline to {MODEL_SAVE_PATH}")
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    joblib.dump(production_pipeline, MODEL_SAVE_PATH)
    
    metadata = {
        "model_name": best_name,
        "calibrated": True
    }
    with open(METADATA_PATH, 'w') as f:
        json.dump(metadata, f, indent=4)
        
    print("Unified Pipeline Rebuild Complete.")

if __name__ == "__main__":
    train_unified()
