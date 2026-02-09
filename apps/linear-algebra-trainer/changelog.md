# Changelog

All notable changes to this project will be documented in this file.

## [0.0.6] - 2026-02-09
### Added
- **Component Refactor**: Refactored "Analysis", "Calculation", and "Definition" cards into reusable components.
- **New Feature**: Added "How It Works" card to Finite Field and Gauss Trainer views.
- **Internationalization**: Complete German (de) and English (en) translations for all new card content.

## [0.0.5] - 2024-05-23
### Added
- **Learning Resources**: Added "Analysis", "Calculation", and "Definition" cards to both Trainer modules.
  - **Gauss Trainer**: Added real-time pivot analysis and row operation formulas.
  - **Finite Field**: Added Modulus analysis (Prime vs Composite identification) and dynamic formula previews.
- **Library Updates**: Added `isPrime` utility to finite-field logic.

## [0.0.4] - 2024-05-23
### Added
- **Phase 4 Implementation**: Integration and Navigation.
  - Added `HomeView` landing page with overview cards.
  - Updated `App` routing to support Home, Gauss Trainer, and Finite Field Calculator views.
  - Added navigation buttons to the main header.
  - Updated translations with landing page content.

## [0.0.3] - 2024-05-23
### Added
- **Phase 3 Implementation**: Finite Field Calculator ($\mathbb{Z}/p\mathbb{Z}$).
  - Added `FiniteFieldTrainer` view.
  - Implemented `ModuloGrid` component (Cayley Table) for visualising field operations.
  - Added `finite-field.ts` library for modular arithmetic (Euclidean Algorithm, Inverse, etc.).
  - Added interactive calculator with step-by-step explanations for modular division/inverses.
  - Added navigation to switch between Gauss Trainer and Finite Field Trainer.

## [0.0.2] - 2024-05-23
### Added
- **Phase 2 Implementation**: Gauss Trainer Web Interface.
  - Added `GaussTrainer` view with matrix visualization.
  - Added `GaussControls` for interactive row operations (Swap, Scale, Add).
  - Added `FractionDisplay` component for proper mathematical rendering.
  - Added `useGaussGame` hook for game state management (history, undo/redo).
  - Updated translations (EN/DE) for the trainer interface.

## [0.0.1] - 2024-05-23
### Added
- **Phase 1 Implementation**: Core mathematical engine for the Linear Algebra Trainer.
  - Added `fraction.js` wrapper utilities for safe type handling and formatting.
  - Implemented Matrix generation logic ("Nice Numbers" strategy).
  - Implemented Matrix Row Operation logic (Swap, Scale, Add) with immutability.
- **Project Structure**:
  - Added `src/modules/trainer/` directory structure.
  - Added `src/locales/` for English and German translations.
  - Added unit tests for fraction utils and matrix generator.
- **Documentation**:
  - Added `Knowledge.md` and `Plan.md` to root.