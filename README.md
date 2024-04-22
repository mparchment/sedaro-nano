# Setup

1. Clone this repository.
2. To compile and run the server, execute the following command
   - ```docker compose up app```
3. To compile and run the client, execute the following commands
   - ```cd app```
   - ```npm i```
   - ```npm start```

## Note - Generating Simulations

A simulation must be generated twice to get the correct results. This is due to a bug in the backend that causes an additional POST request to be made. The first simulation generates the results, while the second simulation fetches the results from the cache.

# Backend Architecture and Implementation

The backend is structured around a FastAPI application, serving as a REST API.

1. **API Configuration**: The server is configured with CORS to allow cross-origin requests from a specified frontend, facilitating seamless interaction between the backend and the React and ThreeJS frontend.
2. **Simulation Endpoint**:
   - **Data Handling**: The `/simulate/` endpoint accepts initial conditions for the simulation; if none are provided, default conditions are used.
   - **Caching**: Results are cached using a unique SHA256 hash of the input conditions to avoid redundant computations. This hash serves as the filename for saving and retrieving simulation results, making the retrieval process efficient.
3. **Preprocessing Results**: Results are processed to add additional information before being sent to the frontend, including relative positions and velocities.

## Challenges and Solutions

1. **Data Structure Optimization**: I attempted to optimize the QRangeStore data structure, which originally performed lookups in O(n) time. By redesigning it into an interval tree and later a binary tree, the goal was to decrease lookup times significantly. However, the practical implementation showed that the original linear structure was faster after endpoint tests.
2. **Ghost POST Request Bug**: A notable issue in the backend involved an unexpected ghost POST request during the generation of a new simulation. This bug seems to trigger an additional, unintended API call, which could affect performance and result in erroneous data processing. Due to time constraints, I could not solve this issue. Addressing this would involve looking into the request lifecycle and the front-end interactions.

## New Features

- **Caching using Hashes**: I used SHA256 for generating unique identifiers for simulation conditions to implement caching, ensuring quick data retrieval and avoiding repetitive calculations. If the scope of this project were scaled up, then this could serve as the foundation of a central database to store previously requested simulations.
- **Adaptability in Input Conditions**: The system's design to accept and validate dynamic input conditions allows for flexibility, making the simulation tool more versatile.
- **Additional Simulation Scope**: The simulation incorporates a third-dimension coordinate and velocity, allowing for 3D visualization of the data on the frontend.

## Future Enhancements

- **Data Storage**: The current system for storing simulation data is suboptimal. Ideally a database system should be used instead of JSON files for storing and retrieving database results. MongoDB would serve as a good candidate for this purpose due to its flexibility with JSON-like data. This would eventually be complemented by a caching system to retrieve previously computed simulations based on the initial conditions.

# Frontend Architecture and Implementation

The frontend of the project is designed to provide an interactive visualization of simulations.

1. **Data Management and Context**: A context provider fetches simulation data from the backend and updates the context. This ensures that all components have access to the latest data without prop-drilling.
2. **Visualization Components**:
   - **Plotly and ThreeJS Animation**: A 3D visual plot created with react-plotly.js displays the trajectory and movement. The frontend also utilizes ThreeJS for real-time rendering of the simulation orbit. The animation is synchronized with the simulation data, showing the relative movement of the satellite around the planet.

## Challenges and Solutions

1. **Integration with Backend**: Initial challenges included setting up an efficient communication pathway between the frontend and backend, which was addressed by implementing a React context that fetches and stores data from the backend. However, more seamless integration for real-time data updates and error handling could enhance the robustness.
2. **Enhancing Visualizations**: Integrating Plotly and ThreeJS posed initial challenges due to their complex APIs and the need to synchronize React's reactivity with these libraries.

## New Features

- **Dual Visualization Approach**: Combining Plotly for detailed static analysis and ThreeJS for dynamic, real-time animations provides a comprehensive view of the simulation, catering to both detailed examination and educational demonstration purposes.
- **Context-Based State Management**: Using React context to manage and propagate simulation data across components reduces coupling and enhances maintainability.

## Future Enhancements

1. **Improved Backend-Frontend Integration**: Further enhance the data flow between the backend and frontend to support features like live updates and more interactive control over simulation parameters.
2. **Responsive Design Optimization**: Improve the responsiveness of the plot and animation, ensuring that the application is fully functional and visually appealing on a wide range of devices.
3. **Simulation History Feature**: Implement a feature to view historical simulation data, leveraging the cached results from the backend. This would allow users to compare different simulations and track changes over time.
