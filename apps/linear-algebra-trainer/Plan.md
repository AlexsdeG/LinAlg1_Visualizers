# 📋 Implementation Plan: Linear Algebra Trainer

## 📂 Structure
Add a new standalone folder or route within the monorepo structure.

```text
src/modules/trainer/
├── components/
│   ├── FractionDisplay.tsx     # Renders 1/2 nicely
│   ├── GaussControls.tsx       # The operation inputs
│   └── ModuloGrid.tsx          # The Z_p table
├── hooks/
│   ├── useGaussGame.ts         # State machine for the matrix
│   └── useFiniteField.ts       # Logic for Z_p operations
├── lib/
│   ├── fraction-utils.ts       # fraction.js wrappers
│   └── matrix-generator.ts     # The "Nice Numbers" generator
├── views/
│   ├── GaussTrainer.tsx        # View 1
│   └── FiniteFieldView.tsx     # View 2
```

---

## 🏗️ Phase 1: Core Logic Utilities
**Goal:** Reliable math engine (Fractions & Modulo).

### Step 1.1: Fraction Integration
*   **Action:** Install `fraction.js`. Create `src/modules/trainer/lib/fraction-utils.ts`.
*   **Details:**
    *   Export a helper `toFraction(input: string | number)` that handles errors safely.
    *   Export `formatFraction(f)` for display (e.g., return LaTeX string `\frac{a}{b}`).
*   **Test:** Unit test: `toFraction("0.5")` equals `1/2`. `toFraction("1/3")` works.

### Step 1.2: Matrix Logic
*   **Action:** Create `matrix-generator.ts`.
*   **Details:**
    *   Function `generateSolvableSystem(size: 3)`:
        1.  Start with `Identity(3)`.
        2.  Apply 10 random valid row ops (add/scale/swap).
        3.  Return the scrambled matrix.
    *   Function `applyRowOp(matrix, operation)`: Returns a NEW matrix.
*   **Verification:** Generate a matrix, log it. Ensure it looks random but consists of clean fractions.

---

## 🟥 Phase 2: The Gauss Trainer (Web Interface)
**Goal:** A "Game" where users clear the matrix.

### Step 2.1: Matrix Grid UI
*   **Action:** Create `GaussTrainer.tsx`.
*   **UI:**
    *   Render the matrix using CSS Grid.
    *   Each cell uses `FractionDisplay` component.
    *   If a number is `0`, dim it (visual aid).
    *   If a number is `1` (Pivot candidate), highlight it slightly.

### Step 2.2: Operation Controls
*   **Action:** Build `GaussControls.tsx`.
*   **Details:**
    *   Dropdown: Operation (Add, Scale, Swap).
    *   Inputs: Source Row, Target Row, Scalar ($k$).
    *   "Apply" Button.
    *   Validation: Disable button if scalar is 0 or invalid.

### Step 2.3: State & History
*   **Action:** Implement `useGaussGame`.
*   **Logic:**
    *   `history`: Array of Matrix states.
    *   `pointer`: Current index in history.
    *   `undo()`: `pointer--`.
    *   `applyOp()`: Slice history at pointer, push new state, `pointer++`.
*   **Visuals:** Add Undo/Redo buttons in the UI.

---

## 🟦 Phase 3: Finite Field Calculator ($\mathbb{Z}/p\mathbb{Z}$)
**Goal:** Understanding modular inverses.

### Step 3.1: The Modulo Logic Hook
*   **Action:** `useFiniteField.ts`.
*   **Functions:**
    *   `add(a, b, p)`, `sub(...)`, `mul(...)`.
    *   `inverse(a, p)` using Extended Euclidean Algo.
    *   `div(a, b, p)` -> `mul(a, inverse(b, p))`.
    *   Handle errors (e.g., "Inverse does not exist for non-prime modulus").

### Step 3.2: Calculator UI
*   **Action:** `FiniteFieldView.tsx`.
*   **UI:**
    *   Top Bar: Input for Modulus $p$ (Input type number).
    *   Calc Area: Inputs $A, B$. Buttons for operations. Result Display.
    *   **Explanation Box:** "Step-by-step: To solve $3/4 \pmod 7$, we first find $4^{-1} \dots$".

### Step 3.3: Cayley Table (Multiplication Grid)
*   **Action:** `ModuloGrid.tsx`.
*   **Details:**
    *   Render a table of size $p \times p$.
    *   Cell $(r, c)$ contains $(r \cdot c) \% p$.
    *   **Interactive:** Hovering a cell highlights the calculation ($3 \times 4 = 12 \equiv 5$).
    *   **Insight:** Highlight cells containing `1` (The Inverses!).

---

## 🌍 Phase 4: Integration
*   **Action:** Add these views to the main App routing (or create a landing page to choose between "Visualizer" and "Trainer" in the menu header).
*   **Details:** Ensure strict typing for the math inputs.