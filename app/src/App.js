import React from 'react';
import Plot from 'react-plotly.js';
import { useSimulationData } from './contexts/SimulationDataContext';
import Conditions from './Conditions';
import Scene from './Scene';
import './App.css';

const App = () => {
  const { positionData } = useSimulationData();

  return (
    <div className="app">
      <div className="top">Sedaro Nano</div>
      <div className="middle">
        <div className="plot">
            <Plot
                data={positionData}
                layout={{
                    title: 'Earth and Satellite Motion',
                    autosize: true,
                    scene: { 
                    xaxis: { title: 'X' },
                    yaxis: { title: 'Y' },
                    zaxis: { title: 'Z' }
                    }
                }}
                style={{ width: '100%', height: '100%' }} 
                useResizeHandler={true} 
            />
        </div>
        <div className="animation">
            <Scene />
        </div>
      </div>
      <div className="bottom">
        <Conditions />
      </div>
    </div>
  );
};

export default App;
