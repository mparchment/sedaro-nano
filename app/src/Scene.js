import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { useSimulationData } from './contexts/SimulationDataContext';
import earthTexture from './earth.png';

extend({ OrbitControls: ThreeOrbitControls });

const OrbitAnimation = ({ scale }) => {
    const { orbitalData } = useSimulationData();
    const satelliteRef = useRef();

    useFrame(({ clock }) => {
        if (orbitalData.length > 0) {
            const time = clock.getElapsedTime();
            const frameIndex = Math.floor(time / 0.01) % orbitalData.length;
            const posData = orbitalData[frameIndex].relative_position;
            satelliteRef.current.position.set(posData.x * scale, posData.y * scale, posData.z * scale);
        }
    });

    return (
        <mesh ref={satelliteRef}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color='red' />
        </mesh>
    );
};

const Controls = () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new ThreeOrbitControls(camera, gl.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 20;
        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    return null;
};

const Scene = () => {
    const texture = useLoader(TextureLoader, earthTexture);

    return (
        <Canvas>
            <ambientLight intensity={1} /> 
            <directionalLight position={[0, 10, 5]} intensity={1} /> 
            <OrbitAnimation scale={5} />
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={texture} />
                <axesHelper args={[2]} />  
            </mesh>
            <Controls />
        </Canvas>
    );
};

export default Scene;
