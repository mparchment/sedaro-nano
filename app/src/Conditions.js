import React, { useState, useEffect } from 'react';
import { useSimulationData } from './contexts/SimulationDataContext';

const Conditions = () => {
    const { initialConditions, updateConditions } = useSimulationData();
    const [localConditions, setLocalConditions] = useState(initialConditions);

    useEffect(() => {
        setLocalConditions(initialConditions);
    }, [initialConditions]);

    const handleChange = (agent, field) => (event) => {
        const value = parseFloat(event.target.value);
        setLocalConditions(prevConditions => ({
            ...prevConditions,
            [agent]: {
                ...prevConditions[agent],
                [field]: isNaN(value) ? '' : value 
            }
        }));
    };

    const handleSubmit = () => {
        updateConditions(localConditions);
    };

    const handleReset = () => {
        updateConditions({
            Planet: { time: 0, timeStep: 0.01, x: 0, y: 0.1, z: 0, vx: 0.1, vy: 0, vz: 0 },
            Satellite: { time: 0, timeStep: 0.01, x: 0, y: 1, z: 0, vx: 1, vy: 0, vz: 0.001 }
        });
    };  

    return (
        <div 
            style={{ alignItems: 'center' }}
            className="settings">
            {Object.keys(localConditions).map(agent => (
                <div 
                    style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center'}}
                    key={agent}>
                    <h4>{agent} Initial:</h4>
                    {localConditions[agent] && ['x', 'y', 'z', 'vx', 'vy', 'vz'].map((field) => (
                        <div key={`${agent}-${field}`}>
                            <label style={{ fontVariant: 'small-caps' }}>{field}: </label>
                            <input
                                style={{ width: '70px' }}
                                type="number"
                                step={0.0001}
                                value={localConditions[agent][field] !== undefined ? localConditions[agent][field] : ''}
                                onChange={handleChange(agent, field)}
                            />
                        </div>
                    ))}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                style={{
                    backgroundColor: '#666666', 
                    height: '40px',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontVariant: 'small-caps',
                    transition: 'background-color 0.3s',
                }}
                onMouseOver={({ target }) => target.style.backgroundColor = '#4d4d4d'} 
                onMouseOut={({ target }) => target.style.backgroundColor = '#666666'}
            >
                Generate
            </button>
            <button
                onClick={handleReset}
                style={{
                    backgroundColor: '#444', // Darker shade for reset button
                    height: '40px',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bolder',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontVariant: 'small-caps',
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={({ target }) => target.style.backgroundColor = '#333'} // Even darker on hover
                onMouseOut={({ target }) => target.style.backgroundColor = '#444'}
            >
                ↻
            </button>
        </div>
    );
};

export default Conditions;