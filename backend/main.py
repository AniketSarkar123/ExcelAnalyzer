from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_excel(file: UploadFile = File(...)):
    # Read the Excel file
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))
    
    # Calculate statistics
    numeric_columns = df.select_dtypes(include=['int64', 'float64']).columns
    
    analysis = {}
    for column in numeric_columns:
        analysis[column] = {
            "highest": float(df[column].max()),
            "lowest": float(df[column].min()),
            "average": float(df[column].mean()),
            "median": float(df[column].median()),
            "std_dev": float(df[column].std()),
            "passing_rate": float((df[column] >= 40).mean() * 100),  # Assuming 40 is passing mark
            "distribution": {
                "0-20": int(((df[column] >= 0) & (df[column] < 20)).sum()),
                "20-40": int(((df[column] >= 20) & (df[column] < 40)).sum()),
                "40-60": int(((df[column] >= 40) & (df[column] < 60)).sum()),
                "60-80": int(((df[column] >= 60) & (df[column] < 80)).sum()),
                "80-100": int(((df[column] >= 80) & (df[column] <= 100)).sum())
            }
        }
    
    return analysis