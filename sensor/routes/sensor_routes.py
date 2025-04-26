# routes/sensor_routes.py
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import asyncio
from services.soil import read_soil
from services.dht22 import read_dht22
import json

router = APIRouter(prefix="/luntian/api")

async def sensor_event_generator():
    while True:
        soil = read_soil()
        dht = read_dht22()

        data = {
            "soil": soil,
            "dht": dht
        }

        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(1)  # Stream every 1 second

@router.get("/sensor-stream")
async def sensor_stream(request: Request):
    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "http://localhost:5173",  
    }
    return StreamingResponse(sensor_event_generator(), headers=headers)
