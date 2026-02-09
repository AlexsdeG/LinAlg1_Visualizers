# 🧠 Knowledge Base: Linear Algebra 1 Visualizer

## 1. Project Identity & Goal
*   **Name:** `lin-alg-interactive`
*   **Description:** An interactive educational tool for Linear Algebra 1, focusing on geometric intuition of matrices, eigenvalues, and basis changes. Inspired by "3Blue1Brown" animations but interactive.
*   **Tech Stack:** React (Vite), TypeScript, Mafs (Visualization), Math.js (Logic), Tailwind CSS.

---

## 2. Mathematical Concept Mapping (The "Physics")

### 🧮 A. Matrix as Transformation (2D)
A $2 \times 2$ matrix $A = \begin{pmatrix} a & c \\ b & d \end{pmatrix}$ transforms the standard basis vectors:
*   $\hat{i} = \begin{pmatrix} 1 \\ 0 \end{pmatrix} \to \begin{pmatrix} a \\ b \end{pmatrix}$ (First column is where $\hat{i}$ lands).
*   $\hat{j} = \begin{pmatrix} 0 \\ 1 \end{pmatrix} \to \begin{pmatrix} c \\ d \end{pmatrix}$ (Second column is where $\hat{j}$ lands).
*   **Determinant:** $\det(A) = ad - bc$. Geometrically, this is the **signed area** of the parallelogram formed by the transformed $\hat{i}$ and $\hat{j}$.
    *   $\det = 0$: The area is 0. The grid collapses to a line (1D) or point (0D). Not invertible.
    *   $\det < 0$: Orientation flips (like a mirror).

### 🎯 B. Eigenvalues & Eigenvectors
Equation: $A \vec{v} = \lambda \vec{v}$.
*   **Visual Intuition:** For most vectors $\vec{x}$, $A\vec{x}$ points in a different direction. For eigenvectors $\vec{v}$, $A\vec{v}$ points in the **same** (or exact opposite) direction.
*   **Lambda ($\lambda$):** The stretching factor.
*   **Power Iteration:** Repeatedly applying $A$ ($A^n \vec{v}$) pulls the vector towards the eigenvector with the largest $|\lambda|$.

### 🌐 C. Change of Basis
*   **Standard Basis:** $E = \{e_1, e_2\}$ (Black grid).
*   **New Basis:** $B = \{b_1, b_2\}$ (Red grid).
*   **Point P:** Stays physically in the same spot on the screen.
*   **Coordinates:**
    *   $[v]_E$: Coordinates in standard grid (what we usually see).
    *   $[v]_B$: Coordinates in the skewed grid.
    *   Relationship: $P = x_1 b_1 + x_2 b_2$.

---

## 3. Feature Specifications

### Tab 1: The Matrix Transformer
*   **Input:**
    *   Two draggable points representing $\hat{i}_{new}$ (Column 1) and $\hat{j}_{new}$ (Column 2).
    *   Text inputs for matrix values (synced with drag).
*   **Visuals:**
    *   **Base Grid:** Faint gray (Background).
    *   **Transformed Grid:** Blue lines, distorted by matrix $A$.
    *   **Unit Square:** A highlighted polygon $(0,0) \to (1,0) \to (1,1) \to (0,1)$ transformed. Its area is the determinant.
*   **Calculations:** Live update of `det(A)`. Warning if `det ≈ 0`.

### Tab 2: Eigenvalues (The "Fix-Arrow")
*   **Input:**
    *   Matrix $A$ (Slider or Text).
    *   Vector $\vec{v}$ (Draggable on a unit circle or arbitrary).
*   **Visuals:**
    *   Arrow $\vec{v}$ (Input, Blue).
    *   Arrow $A\vec{v}$ (Output, Red).
    *   **The Game:** User rotates $\vec{v}$ until Blue and Red align.
    *   **Trace:** Show the path of $A\vec{v}$ as $\vec{v}$ rotates (an Ellipse).

### Tab 3: Basis Change
*   **Input:**
    *   Basis vectors $b_1, b_2$ (Draggable).
    *   Target Point $P$ (Draggable).
*   **Visuals:**
    *   Two grids overlaying each other.
    *   **Decomposition:** Visual path from Origin $\to c_1 b_1 \to P$ (Vector addition parallelogram).
*   **Output:** Show coordinate vector $[v]_E$ vs $[v]_B$.

---

## 4. Technical Implementation Details

### A. Mafs Transformation Wrapper
Mafs uses SVG transforms. A generic `Transform` component is needed.
**Crucial:** SVG Matrix format is `matrix(a, b, c, d, tx, ty)`. Note that `b` and `c` are swapped relative to standard row-major notation if you aren't careful, but standard CSS matrix corresponds to column-major $\begin{pmatrix} a & c \\ b & d \end{pmatrix}$ mapping to `matrix(a, b, c, d, 0, 0)`.
*   Wait, CSS Matrix is `matrix(scaleX, skewY, skewX, scaleY, transX, transY)`.
*   Math Matrix $A = \begin{pmatrix} a & c \\ b & d \end{pmatrix}$ maps $x$ to $ax + cy$ and $y$ to $bx + dy$.
*   CSS logic: $x' = a x + c y$, $y' = b x + d y$.
*   **Implementation:** `<g transform={`matrix(${a}, ${b}, ${c}, ${d}, 0, 0)`}>`.

### B. Matrix State Management
Store matrices as simple arrays of numbers: `[[a, c], [b, d]]` (Math.js format) or flat objects `{ a, b, c, d }`.
*   **Recommendation:** Use flat object `{ i_x: 1, i_y: 0, j_x: 0, j_y: 1 }` for the state, as this maps directly to the two column vectors the user drags.

### C. Math Helpers (`math-utils.ts`)
```typescript
// Determinant
export const getDet = (m: Matrix2D) => m.i_x * m.j_y - m.i_y * m.j_x;

// Apply to vector
export const applyMatrix = (m: Matrix2D, v: Vector2) => ({
  x: m.i_x * v.x + m.j_x * v.y,
  y: m.i_y * v.x + m.j_y * v.y
});
```

---

## 5. ⚠️ Attention Points

1.  **Singular Matrices (The Black Hole):**
    *   **Risk:** If the user drags vectors so they are collinear ($\det = 0$), the grid collapses. If the "handles" (draggable points) are *part* of the transformed grid, they will disappear or become un-clickable.
    *   **Fix:** The **Draggable Control Points** must exist in the **Original Coordinate Space** (untouched), but they *control* the **Transformed Space**. Never put the controls inside the transformation group.

2.  **Coordinate Systems Confusion:**
    *   In Tab 3 (Basis Change), distinguishing between "The point on the screen" (absolute pixels/world coords) and "The numbers in the vector" (relative coords) is vital.
    *   Use distinct colors: Black for Standard Basis ($e_i$), Red for Custom Basis ($b_i$).

3.  **Performance:**
    *   Re-calculating eigenvalues symbolically in JS is hard.
    *   **Strategy:** For 2x2, use the closed-form quadratic formula to find eigenvalues for display. It's fast and exact. $\lambda^2 - \text{tr}(A)\lambda + \det(A) = 0$.
