from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import sensor_routes

app = FastAPI()

# Allow the React frontend running on port 5173
origins = [
    "http://localhost:5173",  
    "http://localhost:3001",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
app.include_router(sensor_routes.router)

#uvicorn app:app --reload --host 0.0.0.0 --port 8000
