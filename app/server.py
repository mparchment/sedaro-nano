import json
import hashlib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import sim
from fastapi.middleware.cors import CORSMiddleware
import os 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InitConditions(BaseModel):
    Planet: dict
    Satellite: dict

def generate_key(conditions):
    conditions_str = json.dumps(conditions, sort_keys=True)
    return hashlib.sha256(conditions_str.encode()).hexdigest()

@app.post("/simulate/")
async def simulate(conditions: Optional[InitConditions] = None):
    
    if conditions is None:
        conditions = InitConditions(
            Planet={'time': 0, 'timeStep': 0.01, 'x': 0, 'y': 0.1, 'z': 0, 'vx': 0.1, 'vy': 0, 'vz': 0},
            Satellite={'time': 0, 'timeStep': 0.01, 'x': 0, 'y': 1, 'z': 0, 'vx': 1, 'vy': 0, 'vz': 0.001}
        )

    conditions = conditions.dict() if isinstance(conditions, InitConditions) else conditions

    conditions_key = generate_key(conditions)
    filepath = f'./public/{conditions_key}.json'

    if os.path.exists(filepath):
        print("Loading simulation data for conditions: ", conditions)
        with open(filepath, 'r') as f:
            return json.load(f)
    else:
        position_statistics = sim.run_simulation(conditions)
        orbital_statistics = sim.calculate_orbital_statistics(position_statistics)

        results = {
            "position_statistics": position_statistics,
            "orbital_statistics": orbital_statistics,
            "initial_conditions": conditions
        }

        with open(filepath, 'w') as f:
            json.dump(results, f, indent=4)
            
        return results
