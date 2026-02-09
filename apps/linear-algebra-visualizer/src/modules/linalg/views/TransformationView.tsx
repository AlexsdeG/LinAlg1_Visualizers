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
  const isSingular = Math.abs(det) < 1e-6;
  
  // Handlers for moving basis vectors
  const handleIMove = ([x, y]: [number, number]) => {
    setMatrix({ ...matrix, ix: x, iy: y });
  };

  const handleJMove = ([x, y]: [number, number]) => {
    setMatrix({ ...matrix, jx: x, jy: y });
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Visualization */}
      <div className="w-full h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-black relative shadow-inner">
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
          <Text x={matrix.ix} y={matrix.iy} attach="ne" size={20} color={Theme.green} svgTextProps={{fontWeight: 'bold'}}>
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
          <Text x={matrix.jx} y={matrix.jy} attach="ne" size={20} color={Theme.red} svgTextProps={{fontWeight: 'bold'}}>
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

      {/* Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Analysis Card */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase text-xs tracking-wider">
            {t('education.titles.analysis')}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isSingular 
              ? t('transform.analysis.singular') 
              : t('transform.analysis.regular', { 
                  det: Math.abs(det).toFixed(2), 
                  orientation: det >= 0 ? t('transform.orientation.preserved') : t('transform.orientation.flipped') 
                })
            }
          </p>
        </div>

        {/* Calculation Card */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase text-xs tracking-wider">
            {t('education.titles.calculation')}
          </h4>
          <p className="text-xs text-gray-500 mb-1">{t('transform.calc.title')}</p>
          <div className="font-mono text-sm bg-white dark:bg-black p-2 rounded border border-gray-100 dark:border-gray-800 overflow-x-auto">
            <div className="whitespace-nowrap">
              det(A) = <span className="text-green-600 font-bold">({matrix.ix.toFixed(1)})</span>
              <span className="text-red-600 font-bold">({matrix.jy.toFixed(1)})</span> - 
              <span className="text-green-600 font-bold">({matrix.iy.toFixed(1)})</span>
              <span className="text-red-600 font-bold">({matrix.jx.toFixed(1)})</span>
            </div>
            <div className="mt-1 font-bold">
               = {det.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Definition Card */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4">
          <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase text-xs tracking-wider">
            {t('education.titles.definition')}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('transform.def')}
          </p>
        </div>
      </div>
    </div>
  );
};
