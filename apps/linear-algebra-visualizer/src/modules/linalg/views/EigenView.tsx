import React, { useState, useMemo } from 'react';
import { Mafs, Coordinates, Vector, MovablePoint, Line, Text, Theme, Polygon } from 'mafs';
import { useTranslation } from 'react-i18next';
import { Matrix2D, applyMatrix, getEigenSystem, Vector2 } from '../utils';

interface EigenViewProps {
  matrix: Matrix2D;
  setMatrix: (m: Matrix2D) => void;
}

export const EigenView: React.FC<EigenViewProps> = ({ matrix }) => {
  const { t } = useTranslation();
  const [angle, setAngle] = useState(Math.PI / 4);
  const [showEigenvectors, setShowEigenvectors] = useState(false);
  const [showTrace, setShowTrace] = useState(true);

  // Derived input vector v (Blue)
  const inputVector: Vector2 = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };

  // Derived output vector Av (Red)
  const outputVector = useMemo(() => applyMatrix(matrix, inputVector), [matrix, inputVector]);

  // Eigen calculations
  const eigenSystem = useMemo(() => getEigenSystem(matrix), [matrix]);

  // Trace Points (Image of Unit Circle)
  // This shows the ellipse that the unit circle transforms into.
  const tracePoints = useMemo(() => {
    const points: [number, number][] = [];
    const steps = 72;
    for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * 2 * Math.PI;
        const v = { x: Math.cos(theta), y: Math.sin(theta) };
        const av = applyMatrix(matrix, v);
        points.push([av.x, av.y]);
    }
    return points;
  }, [matrix]);

  // Check alignment (Collinearity)
  // Cross product (z-component) of v and Av in 2D is x1*y2 - x2*y1.
  const crossProduct = inputVector.x * outputVector.y - inputVector.y * outputVector.x;
  // If vectors are parallel, cross product is 0.
  const isAligned = Math.abs(crossProduct) < 0.05; // Tolerance for "game" feel

  // Lambda (Stretching factor) calculation if aligned
  const currentLambda = (inputVector.x * outputVector.x + inputVector.y * outputVector.y);
  
  const handlePointMove = (point: [number, number]) => {
    // Calculate angle from origin to point
    const newAngle = Math.atan2(point[1], point[0]);
    setAngle(newAngle);
    // Return point on circle for visual constraint (though state update drives the point render)
    return [Math.cos(newAngle), Math.sin(newAngle)] as [number, number];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex flex-wrap items-center gap-4 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
          <input 
            type="checkbox" 
            checked={showEigenvectors} 
            onChange={(e) => setShowEigenvectors(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>{t('eigen.showVectors')}</span>
        </label>

        <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
          <input 
            type="checkbox" 
            checked={showTrace} 
            onChange={(e) => setShowTrace(e.target.checked)}
            className="rounded text-red-600 focus:ring-red-500"
          />
          <span>{t('eigen.showTrace')}</span>
        </label>
        
        {isAligned && (
          <div className="ml-auto flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full animate-pulse">
            <span className="text-xs font-bold uppercase tracking-wider">Eigenvector!</span>
            <span className="font-mono text-sm">λ ≈ {currentLambda.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="w-full h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-black relative">
        <Mafs
          zoom={{ min: 0.1, max: 5 }}
          pan={true}
          viewBox={{ x: [-3, 3], y: [-3, 3] }}
        >
          <g opacity={0.3}>
            <Coordinates.Cartesian subdivisions={2} />
          </g>

          {/* Unit Circle Guide (Input Space) */}
          <g opacity={0.2}>
             <ellipse cx={0} cy={0} rx={1} ry={1} fill="none" stroke="currentColor" strokeDasharray="4,4" />
          </g>

          {/* Trace (Output Space - Image of Unit Circle) */}
          {showTrace && (
            <Polygon 
              points={tracePoints} 
              color={Theme.red} 
              fillOpacity={0.05} 
              strokeOpacity={0.4} 
              strokeStyle="dashed" 
            />
          )}

          {/* Eigenvectors (Span Lines) */}
          {showEigenvectors && eigenSystem.eigenvectors.map((v, i) => (
             <Line.ThroughPoints
               key={i}
               point1={[0, 0]}
               point2={[v.x, v.y]}
               style="dashed"
               color={Theme.yellow}
               opacity={0.6}
             />
          ))}

          {/* Input Vector (Blue) */}
          <Vector
            tail={[0, 0]}
            tip={[inputVector.x, inputVector.y]}
            color={isAligned ? Theme.yellow : Theme.blue}
            weight={3}
          />
          <Text x={inputVector.x * 1.1} y={inputVector.y * 1.1} attach="n" color={Theme.blue}>
            v
          </Text>

          {/* Draggable Handle on Unit Circle */}
          <MovablePoint
            point={[inputVector.x, inputVector.y]}
            onMove={handlePointMove}
            color={Theme.blue}
          />

          {/* Output Vector (Red) */}
          <Vector
            tail={[0, 0]}
            tip={[outputVector.x, outputVector.y]}
            color={isAligned ? Theme.yellow : Theme.red}
            weight={3}
          />
          <Text x={outputVector.x} y={outputVector.y} attach="s" color={Theme.red}>
            Av
          </Text>

        </Mafs>

        <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-900/80 p-3 rounded-lg text-xs text-gray-500 pointer-events-none border border-gray-200 dark:border-gray-800">
           <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Instructions:</p>
           <ul className="list-disc pl-4 space-y-1">
             <li>Drag the <span className="text-blue-500 font-bold">Blue Point</span> around the circle.</li>
             <li>Watch the <span className="text-red-500 font-bold">Red Arrow (Av)</span>.</li>
             <li>Align them to find Eigenvectors!</li>
           </ul>
        </div>
      </div>
    </div>
  );
};