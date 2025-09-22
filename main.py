from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Load trained model
model = joblib.load("diabetes_model.pkl")

app = FastAPI(title="Diabetes Prediction API")

# Request body model
class DiabetesInput(BaseModel):
    pregnancies: int
    glucose: float
    bloodpressure: float
    skinthickness: float
    insulin: float
    bmi: float
    dpf: float
    age: int

app.mount("/static", StaticFiles(directory="build/static"), name="static")

# Health check endpoint
# @app.get("/")
# def read_root():
#     return {"message": "Diabetes Prediction API is working!"}

@app.get("/")
async def serve_react():
    index_path = os.path.join("build", "index.html")
    return FileResponse(index_path)

# Prediction endpoint
@app.post("/predict")
def predict_diabetes(data: DiabetesInput):
    # Convert input to numpy array
    input_data = np.array([[data.pregnancies, data.glucose, data.bloodpressure,
                            data.skinthickness, data.insulin, data.bmi, data.dpf, data.age]])
    
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]  # Probability of having diabetes
    
    return {"prediction": int(prediction), "probability": float(probability)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
