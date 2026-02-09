# Changelog

All notable changes to this project will be documented in this file.

## [0.0.5] - 2024-05-23
### Added
- Phase 5 Implementation: Integration and Polish.
- Added "Transformation Trace" (Ellipse) in Eigenvalues tab to visualize the image of the unit circle.
- Added toggle for Trace visibility in EigenView.
- Added app footer with version info.
- Updated translations for new features.

## [0.0.4] - 2024-05-23
### Added
- Phase 4 Implementation: Change of Basis Tab.
- Added `BasisChangeView.tsx` component.
- Visualizes "Standard Coordinates" vs "Basis Coordinates".
- Implemented decomposition logic using matrix inverse.
- Shows vector addition path (Parallelogram rule) for the new basis.
- Interactive Basis Vectors and Target Point P.

## [0.0.3] - 2024-05-23
### Added
- Phase 3 Implementation: Eigenvalues & Eigenvectors Tab.
- Added `EigenView.tsx` with "Fix-Arrow" interactive game.
- Implemented `getEigenSystem` in utils for 2x2 matrices.
- Added Tab navigation in `App.tsx` to switch between Transform and Eigen views.
- Added visual highlighting for discovered eigenvectors.

## [0.0.2] - 2024-05-23
### Added
- Phase 2 Implementation: Linear Map Visualization.
- Added `TransformationView.tsx` using `Mafs`.
- Interactive grid transformation visualization.
- Draggable basis vectors (î and ĵ) controlling the matrix.
- Real-time determinant calculation and singularity warning overlay.
- Added `mafs` dependency to import map.

## [0.0.1] - 2024-05-23
### Added
- Initial project structure.
- Core Linear Algebra module (Phase 1).
- Matrix math utilities (`utils.ts`).
- Matrix Control UI component (`MatrixControl.tsx`).
- Basic Internationalization (i18n) setup.
- Testing infrastructure for math utilities.
- Knowledge base and Implementation Plan.
