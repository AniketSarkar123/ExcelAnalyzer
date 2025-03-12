# Web App: Excel Analysis & Visualization

## Overview
This web application allows users to upload Excel files for analysis. The backend (FastAPI) processes the file, extracting statistical insights, while the frontend (Angular) provides an interactive UI to upload files and display the results.

## Features
- Upload Excel files for analysis.
- Extract statistical insights like highest, lowest, average, median, and distribution of values.
- Responsive UI for an interactive experience.
- Integration between Angular frontend and FastAPI backend.

## Technologies Used
- **Frontend:** Angular 19, TypeScript, HttpClient, CSS
- **Backend:** FastAPI, Python, Pandas, OpenPyXL
- **Database:** SQLite (optional for storing results)

## Installation & Setup
### 1. Clone the Repository
```sh
git clone <repository-url>
cd <repository-folder>
```

### 2. Backend Setup (FastAPI)
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```
- The API will be available at `http://localhost:8000`

### 3. Frontend Setup (Angular)
```sh
cd frontend
npm install
ng serve
```
- The Angular app will be available at `http://localhost:4200`

## Usage
1. Open the frontend in a browser (`http://localhost:4200`).
2. Select an Excel file and upload it.
3. The backend processes the file and returns statistical insights.
4. Results are displayed dynamically in the UI.

## API Endpoints
### `POST /analyze`
- **Description:** Accepts an Excel file and returns statistical insights.
- **Request:** Multipart Form Data (Excel File)
- **Response Example:**
  ```json
  {
    "column_name": {
      "highest": 98,
      "lowest": 12,
      "average": 56.3,
      "median": 55,
      "std_dev": 15.2,
      "passing_rate": 80.5,
      "distribution": { "0-20": 5, "20-40": 10, "40-60": 15, "60-80": 20, "80-100": 50 }
    }
  }
  ```

## Folder Structure
```
project-folder/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── data.db (optional)
├── frontend/
│   ├── angular.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.html
│   │   │   ├── data.service.ts
│   │   ├── global_styles.css
│   ├── package.json
```

## Future Enhancements
- Add user authentication.
- Store results in a database.
- Improve visualization with charts.

## License
MIT License

