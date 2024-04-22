from functools import reduce
from operator import __or__
import math

class QRangeStore:
    def __init__(self):
        self.store = []
    def __setitem__(self, rng, value):
        low, high = rng
        if not low < high:
            raise IndexError("Invalid Range.")
        self.store.append((low, high, value))
    def __getitem__(self, key):
        ret = [v for (l, h, v) in self.store if l <= key < h]
        if not ret:
            raise IndexError("Not found.")
        return ret

def propagate(agentId, universe):
    state = universe[agentId]
    time, timeStep, x, y, z, vx, vy, vz = state['time'], state['timeStep'], state['x'], state['y'], state['z'], state['vx'], state['vy'], state['vz']

    if agentId == 'Planet':
        x += vx * timeStep
        y += vy * timeStep
        z += vz * timeStep
    elif agentId == 'Satellite':
        px, py, pz = universe['Planet']['x'], universe['Planet']['y'], universe['Planet']['z']
        dx = px - x
        dy = py - y
        dz = pz - z
        dist = math.sqrt(dx**2 + dy**2 + dz**2)
        fx = dx / dist**3
        fy = dy / dist**3
        fz = dz / dist**3
        vx += fx * timeStep
        vy += fy * timeStep
        vz += fz * timeStep
        x += vx * timeStep
        y += vy * timeStep
        z += vz * timeStep

    return {'time': time + timeStep, 'timeStep': timeStep, 'x': x, 'y': y, 'z': z, 'vx': vx, 'vy': vy, 'vz': vz}


def run_simulation(initial_conditions):
    store = QRangeStore()
    store[-999999999, 0] = initial_conditions
    times = {agentId: state['time'] for agentId, state in initial_conditions.items()}
    for _ in range(1000):
        for agentId in initial_conditions:
            t = times[agentId]
            universe = read(t-0.001, store)
            if set(universe) == set(initial_conditions):
                newState = propagate(agentId, universe)
                store[t, newState['time']] = {agentId: newState}
                times[agentId] = newState['time']
    return store.store

def read(t, store):
    try:
        data = store[t]
    except IndexError:
        data = []
    return reduce(__or__, data, {})

def calculate_orbital_statistics(data):
    results = []
    planet_data = {}
    satellite_data = {}

    for entry in data:
        start_time, end_time, obj_state = entry
        if 'Planet' in obj_state:
            planet_data[end_time] = obj_state['Planet']
        if 'Satellite' in obj_state:
            satellite_data[end_time] = obj_state['Satellite']

    for time in satellite_data:
        if time in planet_data:
            px, py, pz = planet_data[time]['x'], planet_data[time]['y'], planet_data[time]['z']
            sx, sy, sz = satellite_data[time]['x'], satellite_data[time]['y'], satellite_data[time]['z']
            pvx, pvy, pvz = planet_data[time]['vx'], planet_data[time]['vy'], planet_data[time]['vz']
            svx, svy, svz = satellite_data[time]['vx'], satellite_data[time]['vy'], satellite_data[time]['vz']

            relative_x = sx - px
            relative_y = sy - py
            relative_z = sz - pz
            relative_vx = svx - pvx
            relative_vy = svy - pvy
            relative_vz = svz - pvz
            distance = math.sqrt(relative_x**2 + relative_y**2 + relative_z**2)

            results.append({
                'time': time,
                'relative_position': {'x': relative_x, 'y': relative_y, 'z': relative_z},
                'relative_velocity': {'vx': relative_vx, 'vy': relative_vy, 'vz': relative_vz},
                'distance': distance
            })

    return results
