# 📋 Implementation Plan: Linear Algebra 1 Visualizer

## 📂 Structure
We will add a new module folder `src/modules/linalg/` to the existing project structure.

```text
src/modules/linalg/
├── components/
│   ├── MatrixControl.tsx       # Inputs for a,b,c,d
│   ├── GridTransformer.tsx     # The visual wrapper
│   └── VectorDecomp.tsx        # For Basis Change visual
├── hooks/
│   └── useMatrix2D.ts          # Logic for determinats, inverse
├── views/
│   ├── TransformationView.tsx  # Tab 1
│   ├── EigenView.tsx           # Tab 2
│   └── BasisChangeView.tsx     # Tab 3
└── utils.ts                    # 2x2 specific math
```

---

## 🚀 Phase 1: Core Matrix Infrastructure
**Goal:** Create the reusable logic for handling 2x2 matrices.

### Step 1.1: Matrix Types & Utils
*   **Action:** Create `src/modules/linalg/utils.ts`.
*   **Details:**
    *   Define type `MatrixState = { ix: number, iy: number, jx: number, jy: number }`.
    *   Implement `getDeterminant(m)`.
    *   Implement `inverse2x2(m)` (Handle det=0 by returning null).
    *   Implement `matrixString(m)` -> returns CSS string `matrix(ix, iy, jx, jy, 0, 0)`.
*   **Test:** Unit test: Determinant of Identity is 1. Determinant of scale(2) is 4.

### Step 1.2: The Matrix Input Component
*   **Action:** Create `MatrixControl.tsx`.
*   **Details:**
    *   A clean UI panel with 4 number inputs arranged in a 2x2 grid.
    *   Optional: "Reset to Identity" button.
*   **Verification:** Updates update the parent state.

---

## 🟥 Phase 2: Tab 1 - Linear Maps (The "3B1B" Simulator)
**Goal:** Visualize grid distortion.

### Step 2.1: The Base Visualization
*   **Action:** Create `TransformationView.tsx`.
*   **Details:**
    *   State: `matrix` (initialized to Identity).
    *   Mafs Setup:
        *   Layer 1: `<Coordinates.Cartesian />` (Gray, opacity 0.3) - The "World".
        *   Layer 2: A Group `<g>` with `transform={matrixString(matrix)}`.
            *   Inside Group: `<Coordinates.Cartesian />` (Blue).
            *   Inside Group: A `<Polygon>` representing the unit square (Yellow, semi-transparent).
*   **UX Note:** This visually separates "Where we started" vs "Where we are".

### Step 2.2: Interactive Basis Vectors
*   **Action:** Add Draggable Points *outside* the transform group.
*   **Details:**
    *   Point 1 (Green): Controls `(ix, iy)`. Starts at $(1,0)$.
    *   Point 2 (Red): Controls `(jx, jy)`. Starts at $(0,1)$.
    *   Connect these points to origin with `<Vector>` to show them as arrows.
*   **Interaction:** Dragging Point 1 updates `matrix.ix/iy`. The blue grid warps instantly.

### Step 2.3: Educational Overlays
*   **Action:** Display Determinant.
*   **Details:**
    *   Calculate Det.
    *   If Det close to 0, show warning "Nicht Invertierbar / Singulär".
    *   Label the Unit Square Area.

---

## 🟦 Phase 3: Tab 2 - Eigenvalues
**Goal:** Visual "Fix-Pfeil" Game.

### Step 3.1: Setup View
*   **Action:** Create `EigenView.tsx`.
*   **Details:**
    *   Reuse `MatrixControl`.
    *   State: `angle` (number, 0 to $2\pi$).
    *   Derived State: `v_input = { x: cos(angle), y: sin(angle) }`.
    *   Derived State: `v_output = applyMatrix(matrix, v_input)`.

### Step 3.2: Visualization
*   **Action:** Render Vectors.
*   **Details:**
    *   Vector 1 (Input): Blue, length 1.
    *   Vector 2 (Output): Red, computed length.
    *   **Visual Aid:** Draw a faint "Unit Circle" so user knows where to drag the input.
    *   **The Game:** Slider or draggable handle on the unit circle to change `angle`.

### Step 3.3: Automatic Eigenvector Finding
*   **Action:** Add a "Show Eigenvectors" toggle.
*   **Details:**
    *   Analytically calculate Eigenvectors (if real).
    *   Render them as infinite lines (dashed) to show the "Span".
    *   Check if `v_output` is scalar multiple of `v_input` (Cross product approach: $x_1 y_2 - x_2 y_1 \approx 0$). If yes, highlight vectors "GOLD".

---

## 🟩 Phase 4: Tab 3 - Basis Change
**Goal:** One point, two addresses.

### Step 4.1: Dual Basis State
*   **Action:** Create `BasisChangeView.tsx`.
*   **Details:**
    *   State: `basisVectors` (Red basis).
    *   State: `targetPoint` (The point P in World Coordinates).
    *   Visuals:
        *   Standard Grid (Black).
        *   Red Grid (Transformed by `basisVectors`).

### Step 4.2: Decomposition Logic
*   **Action:** Calculate components.
*   **Math:** We need to solve $P = c_1 b_1 + c_2 b_2$.
    *   This is solving the linear system $B \vec{c} = P$.
    *   $\vec{c} = B^{-1} P$.
*   **Visuals:**
    *   Show vector summation path: Origin $\to c_1 b_1 \to P$.
    *   This is the "Parallelogram Rule".

### Step 4.3: Coordinates Display
*   **Action:** Show the numbers.
*   **UI:**
    *   Card 1: "Standard-Koordinaten" $(x, y)$.
    *   Card 2: "Basis-Koordinaten" $(c_1, c_2)$.
    *   Show how moving the Basis Vectors changes $(c_1, c_2)$ even if $P$ stands still.

---

## 🌍 Phase 5: Integration
*   **Action:** Register new tabs in `App.tsx`.
*   **Details:** Add translations for "Eigenwert", "Abbildung", etc. in `de.json`.
