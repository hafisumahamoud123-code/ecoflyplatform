from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random

app = FastAPI(title="Eco-Fly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Database
fields_db = [
    {"id": 1, "name": "North Plot", "crop_type": "maize", "area_hectares": 2.5, "planting_date": (datetime.now() - timedelta(days=30)).isoformat()},
    {"id": 2, "name": "South Plot", "crop_type": "tomatoes", "area_hectares": 1.2, "planting_date": (datetime.now() - timedelta(days=15)).isoformat()},
    {"id": 3, "name": "East Plot", "crop_type": "cassava", "area_hectares": 4.0, "planting_date": (datetime.now() - timedelta(days=180)).isoformat()},
]
reports_db = []
listings_db = []
next_id = 1

@app.get("/")
def root():
    return {"message": "🌾 Eco-Fly API is running!"}

@app.get("/fields/farmer/{farmer_id}")
def get_fields(farmer_id: int):
    return fields_db

@app.post("/missions/run/{field_id}")
def run_mission(field_id: int, price_per_kg: float = 1.8, min_order_kg: float = 100):
    field = next((f for f in fields_db if f["id"] == field_id), None)
    if not field:
        raise HTTPException(404, "Field not found")
    
    health = random.randint(65, 98)
    base_yield = {"maize": 5000, "tomatoes": 3000, "cassava": 12000}.get(field["crop_type"], 4000)
    yield_kg = round(base_yield * (health / 100) * random.uniform(0.9, 1.1), 0)
    harvest_date = (datetime.now() + timedelta(days=random.randint(20, 90))).isoformat()
    
    global next_id
    report_id = next_id
    next_id += 1
    reports_db.append({"id": report_id, "field_id": field_id, "health_score": health, "estimated_yield_kg": yield_kg, "predicted_harvest_date": harvest_date})
    
    listing_id = next_id
    next_id += 1
    listings_db.append({"id": listing_id, "report_id": report_id, "price_per_kg": price_per_kg, "min_order_kg": min_order_kg, "status": "available"})
    
    return {
        "message": "✅ Scan complete",
        "report": reports_db[-1],
        "listing": listings_db[-1]
    }

@app.get("/marketplace/listings")
def get_listings():
    result = []
    for listing in listings_db:
        if listing["status"] == "available":
            report = next((r for r in reports_db if r["id"] == listing["report_id"]), None)
            if report:
                field = next((f for f in fields_db if f["id"] == report["field_id"]), None)
                result.append({
                    "id": listing["id"],
                    "price_per_kg": listing["price_per_kg"],
                    "min_order_kg": listing["min_order_kg"],
                    "status": listing["status"],
                    "report": {
                        "health_score": report["health_score"],
                        "estimated_yield_kg": report["estimated_yield_kg"],
                        "predicted_harvest_date": report["predicted_harvest_date"],
                        "field": {"crop_type": field["crop_type"] if field else "unknown"}
                    }
                })
    return result

@app.post("/preorders/")
def place_preorder(listing_id: int, buyer_id: int = 2, quantity_kg: float = 200, deposit_paid: float = 30):
    listing = next((l for l in listings_db if l["id"] == listing_id), None)
    if not listing:
        raise HTTPException(404, "Listing not found")
    if listing["status"] != "available":
        raise HTTPException(400, "Already reserved")
    listing["status"] = "reserved"
    return {"message": "🎉 Pre-order placed!", "preorder": {"id": 999, "status": "confirmed"}}
