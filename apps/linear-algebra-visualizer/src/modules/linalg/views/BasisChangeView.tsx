import React, { useState, useMemo } from 'react';
import { Mafs, Coordinates, Vector, MovablePoint, Text, Theme, Line } from 'mafs';
import { useTranslation } from 'react-i18next';
import { Matrix2D, Vector2, inverse2x2, applyMatrix, matrixToCss } from '../utils';

interface BasisChangeViewProps {
  matrix: Matrix2D;
  setMatrix: (m: Matrix2D) => void;
}

export const BasisChangeView: React.FC<BasisChangeViewProps> = ({ matrix, setMatrix }) => {
  const { t } = useTranslation();
  
  // State for the Target Point P in World Coordinates (Standard Basis)
  const [point, setPoint] = useState<Vector2>({ x: 2, y: 1 });

  // Calculate coordinates in the new basis: c = B^-1 * P
  const inverse = useMemo(() => inverse2x2(matrix), [matrix]);
  const basisCoords = useMemo(() => {
    if (!inverse) return null;
    return applyMatrix(inverse, point);
  }, [inverse, point]);

  // Decomposition vectors for visualization (in World Space)
  // v1 = c1 * b1
  // v2 = c2 * b2
  // P = v1 + v2
  const v1 = basisCoords ? { x: matrix.ix * basisCoords.x, y: matrix.iy * basisCoords.x } : null;
  // v2 starts from tip of v1, so we don't strictly need its absolute vector for <Vector> tail/tip logic immediately, 
  // but let's calculate the endpoint.
  // The path is Origin -> v1 -> P.

  // Handlers for moving basis vectors (Same as other views)
  const handleIMove = ([x, y]: [number, number]) => {
    setMatrix({ ...matrix, ix: x, iy: y });
  };
  const handleJMove = ([x, y]: [number, number]) => {
    setMatrix({ ...matrix, jx: x, jy: y });
  };
  const handlePointMove = ([x, y]: [number, number]) => {
    setPoint({ x, y });
  };

  const isSingular = !inverse;

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Coordinate Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Coordinates Card */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            [{t('common.x')}, {t('common.y')}]_E ({t('basis.standardCoords')})
          </h4>
          <div className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
            [{point.x.toFixed(2)}, {point.y.toFixed(2)}]
          </div>
        </div>

        {/* Basis Coordinates Card */}
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800/50">
          <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
            [c_1, c_2]_B ({t('basis.basisCoords')})
          </h4>
          <div className="font-mono text-lg font-bold text-red-700 dark:text-red-300">
            {basisCoords ? (
              `[${basisCoords.x.toFixed(2)}, ${basisCoords.y.toFixed(2)}]`
            ) : (
              <span className="text-sm italic">{t('basis.singularError')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="w-full h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-black relative">
        <Mafs
          zoom={{ min: 0.1, max: 5 }}
          pan={true}
          viewBox={{ x: [-3, 3], y: [-3, 3] }}
        >
          {/* Layer 1: Standard Grid (Gray) */}
          <g opacity={0.2}>
            <Coordinates.Cartesian subdivisions={2} />
          </g>

          {/* Layer 2: Basis Grid (Red, Transformed) */}
          <g style={{ transform: matrixToCss(matrix), transition: 'transform 0.1s linear' }}>
            <g opacity={0.3} stroke={Theme.red}>
              <Coordinates.Cartesian
                subdivisions={2}
              />
            </g>
          </g>

          {/* Layer 3: Decomposition Path (Parallelogram) */}
          {v1 && basisCoords && !isSingular && (
            <>
              {/* Component 1: c1 * b1 (From Origin) */}
              <Vector
                tail={[0, 0]}
                tip={[v1.x, v1.y]}
                color={Theme.red}
                weight={2}
                opacity={0.6}
              />
              {/* Component 2: c2 * b2 (From tip of v1 to P) */}
              <Vector
                tail={[v1.x, v1.y]}
                tip={[point.x, point.y]}
                color={Theme.red}
                weight={2}
                opacity={0.6}
              />
              
              {/* Dashed lines to complete parallelogram visual (optional but helpful) */}
              <Line.Segment
                 point1={[v1.x, v1.y]}
                 point2={[point.x, point.y]}
                 style="dashed"
                 opacity={0.3}
                 color={Theme.red}
              />
              <Line.Segment
                 point1={[0,0]}
                 point2={[point.x - v1.x, point.y - v1.y]} 
                 style="dashed" 
                 opacity={0.3}
                 color={Theme.red}
              />
            </>
          )}

          {/* Layer 4: Interactive Elements */}

          {/* Basis Vector b1 (Control) */}
          <Vector tail={[0, 0]} tip={[matrix.ix, matrix.iy]} color={Theme.red} weight={3} />
          <MovablePoint point={[matrix.ix, matrix.iy]} onMove={handleIMove} color={Theme.red} />
          <Text x={matrix.ix} y={matrix.iy} attach="ne" color={Theme.red}>b₁</Text>

          {/* Basis Vector b2 (Control) */}
          <Vector tail={[0, 0]} tip={[matrix.jx, matrix.jy]} color={Theme.red} weight={3} />
          <MovablePoint point={[matrix.jx, matrix.jy]} onMove={handleJMove} color={Theme.red} />
          <Text x={matrix.jx} y={matrix.jy} attach="ne" color={Theme.red}>b₂</Text>

          {/* Target Point P (Black/White) */}
          <MovablePoint
            point={[point.x, point.y]}
            onMove={handlePointMove}
            color={Theme.indigo}
          />
          <Text 
            x={point.x} 
            y={point.y} 
            attach="s" 
            size={20} 
            color={Theme.indigo} 
            svgTextProps={{ fontWeight: 'bold' }}
          >
            P
          </Text>

        </Mafs>

        {isSingular && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-100 px-4 py-2 rounded-full shadow-lg text-sm font-bold">
            {t('matrix.singular')}
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-900/80 p-2 rounded text-xs text-gray-500 pointer-events-none">
           {t('basis.dragInstruction')}
        </div>
      </div>
    </div>
  );
};