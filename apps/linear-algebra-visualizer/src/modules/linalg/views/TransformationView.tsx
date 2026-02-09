import React from 'react';
import { Mafs, Coordinates, Polygon, Vector, MovablePoint, Text, Theme } from 'mafs';
import { useTranslation } from 'react-i18next';
import { Matrix2D, matrixToCss, getDeterminant } from '../utils';

interface TransformationViewProps {
  matrix: Matrix2D;
  setMatrix: (m: Matrix2D) => void;
}

export const TransformationView: React.FC<TransformationViewProps> = ({ matrix, setMatrix }) => {
  const { t } = useTranslation();
  const det = getDeterminant(matrix);
  
  // Handlers for moving basis vectors
  const handleIMove = ([x, y]: [number, number]) => {
    setMatrix({ ...matrix, ix: x, iy: y });
  };

  const handleJMove = ([x, y]: [number, number]) => {
    setMatrix({ ...matrix, jx: x, jy: y });
  };

  return (
    <div className="w-full h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-black relative">
      <Mafs
        zoom={{ min: 0.1, max: 5 }}
        pan={true}
        viewBox={{ x: [-3, 3], y: [-3, 3] }}
      >
        <g opacity={0.2}>
          <Coordinates.Cartesian
            subdivisions={2}
            xAxis={{ labels: (n) => (n % 1 === 0 ? n : "") }}
            yAxis={{ labels: (n) => (n % 1 === 0 ? n : "") }}
          />
        </g>

        {/* Transformed Space */}
        <g style={{ transform: matrixToCss(matrix), transition: 'transform 0.1s linear' }}>
          {/* Transformed Grid */}
          <g opacity={0.5}>
            <Coordinates.Cartesian
              subdivisions={2}
            />
          </g>
          
          {/* Unit Square transformed */}
          <Polygon
            points={[[0, 0], [1, 0], [1, 1], [0, 1]]}
            color={Theme.yellow}
            fillOpacity={0.3}
            strokeOpacity={0.8}
            strokeStyle="dashed"
          />
          
          <Text x={0.5} y={0.5} attach="n">
             Area: {det.toFixed(2)}
          </Text>
        </g>

        {/* Control Vectors (Basis Vectors in input space) */}
        
        {/* i_hat (Green) */}
        <Vector
          tail={[0, 0]}
          tip={[matrix.ix, matrix.iy]}
          color={Theme.green}
          weight={4}
        />
        <MovablePoint
          point={[matrix.ix, matrix.iy]}
          onMove={handleIMove}
          color={Theme.green}
        />
        <Text x={matrix.ix} y={matrix.iy} attach="ne" size={20} color={Theme.green}>
          î
        </Text>

        {/* j_hat (Red) */}
        <Vector
          tail={[0, 0]}
          tip={[matrix.jx, matrix.jy]}
          color={Theme.red}
          weight={4}
        />
        <MovablePoint
          point={[matrix.jx, matrix.jy]}
          onMove={handleJMove}
          color={Theme.red}
        />
        <Text x={matrix.jx} y={matrix.jy} attach="ne" size={20} color={Theme.red}>
          ĵ
        </Text>

      </Mafs>

      {/* Overlay Warning */}
      {Math.abs(det) < 0.1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-100 px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-pulse pointer-events-none">
          {t('matrix.singular')} (Det ≈ 0)
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-900/80 p-2 rounded text-xs text-gray-500 pointer-events-none">
         Drag the green (î) and red (ĵ) points to transform the grid.
      </div>
    </div>
  );
};