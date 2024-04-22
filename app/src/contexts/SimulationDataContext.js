import React, { createContext, useContext, useState, useEffect } from 'react';

const SimulationDataContext = createContext({
  positionData: [],
  orbitalData: [],
  initialConditions: {},
  updateConditions: () => {} 
});

export const useSimulationData = () => useContext(SimulationDataContext);

const formatDataForPlot = (data) => {
  const plotData = {
    Planet: { x: [], y: [], z: [], time: [], type: 'scatter3d', mode: 'lines+markers', name: 'Planet', marker: { size: 8, opacity: 0.9 }, line: { width: 0, opacity: 0.8 } },
    Satellite: { x: [], y: [], z: [], time: [], type: 'scatter3d', mode: 'lines+markers', name: 'Satellite', marker: { size: 2, opacity: 0.9 }, line: { width: 2, opacity: 0.8 } }
  };
  
  data.forEach(([_, __, frame]) => {
    for (let [agentId, { x, y, z }] of Object.entries(frame)) {
      if (plotData[agentId]) {
        plotData[agentId].x.push(x);
        plotData[agentId].y.push(y);
        plotData[agentId].z.push(z);
      }
    }
  });
  
  return [plotData.Planet, plotData.Satellite];
};

export const SimulationDataProvider = ({ children }) => {
  const [positionData, setPositionData] = useState([]);
  const [orbitalData, setOrbitalData] = useState([]);
  const [initialConditions, setInitialConditions] = useState({
    Planet: { time: 0, timeStep: 0.01, x: 0, y: 0.1, z: 0, vx: 0.1, vy: 0, vz: 0 },
    Satellite: { time: 0, timeStep: 0.01, x: 0, y: 1, z: 0, vx: 1, vy: 0, vz: 0.001 }
  });

  const fetchData = async (conditions = initialConditions) => {
    try {
      const response = await fetch('http://localhost:8000/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conditions)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPositionData(formatDataForPlot(data.position_statistics));
      setOrbitalData(data.orbital_statistics);
      setInitialConditions(data.initial_conditions);
    } catch (error) {
      console.error('Error fetching simulation data:', error);
    }
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []); 

  return (
    <SimulationDataContext.Provider value={{ positionData, orbitalData, initialConditions, updateConditions: fetchData }}>
      {children}
    </SimulationDataContext.Provider>
  );
};
