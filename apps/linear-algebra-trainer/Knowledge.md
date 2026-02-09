# 🧠 Knowledge Base: Linear Algebra Trainer

## 1. Project Identity & Goal
*   **Name:** `lin-alg-trainer`
*   **Description:** A drill-and-practice web application for Linear Algebra algorithmic skills. Unlike the visualizer, this focuses on *procedural fluency* in Gaussian Elimination and Finite Field Arithmetic.
*   **Tech Stack:** React (Vite), TypeScript, Tailwind CSS, **fraction.js** (Crucial for exact math).

---

## 2. Mathematical Logic (The "Engine")

### 📐 A. Gaussian Elimination (The "Row-Op Game")
*   **Goal:** Transform a Matrix $A$ into Row Echelon Form (REF) or Reduced Row Echelon Form (RREF).
*   **Allowed Operations:**
    1.  **Swap:** $R_i \leftrightarrow R_j$
    2.  **Scale:** $R_i \leftarrow k \cdot R_i$ ($k \neq 0$)
    3.  **Add:** $R_i \leftarrow R_i + k \cdot R_j$ (Target Row + Factor $\times$ Source Row)
*   **Generation Strategy (The "Nice Numbers" Trick):**
    *   Do NOT generate random numbers.
    *   Start with a solved state (e.g., Identity Matrix or Upper Triangular with integers).
    *   Apply 5-10 random "inverse" row operations to scramble it.
    *   This guarantees the solution is clean integers, making the practice about logic, not ugly arithmetic.

### 🔢 B. Finite Fields ($\mathbb{Z}/p\mathbb{Z}$)
*   **Definition:** Calculation modulo $p$ (usually a prime). The set is $\{0, 1, \dots, p-1\}$.
*   **Operations:**
    *   $a + b$: $(a + b) \% p$.
    *   $a - b$: $(a - b + p) \% p$ (Ensure positive result).
    *   $a \cdot b$: $(a \cdot b) \% p$.
*   **Division ($a / b$):** This is the tricky part. It means $a \cdot b^{-1}$.
    *   **Modular Inverse ($b^{-1}$):** Find $x$ such that $b \cdot x \equiv 1 \pmod p$.
    *   **Algorithm:** Extended Euclidean Algorithm ($ggT(b, p) = s \cdot b + t \cdot p$). Since $p$ is prime, $ggT=1$, and $s$ is the inverse.
    *   **Edge Case:** Division by 0 is undefined. In $\mathbb{Z}/n\mathbb{Z}$ (where $n$ not prime), division by a divisor of $n$ is also impossible.

---

## 3. Feature Specifications

### Module 1: The Gauss-Step-Checker
*   **UI Layout:**
    *   **The Matrix:** Grid of numbers (display fractions like $\frac{3}{2}$ nicely using KaTeX or simple CSS fraction layout).
    *   **The Controls:**
        *   "Operation Mode": Select [Add, Scale, Swap].
        *   "Target": Row index.
        *   "Source": Row index (for Add/Swap).
        *   "Factor": Input field (accepts fractions like "1/3" or "-2").
    *   **History:** Undo/Redo buttons. Crucial for "oops" moments.
*   **Feedback:**
    *   Check for "Zero Rows" or "Pivot Positions".
    *   "Solved" animation when matrix is Identity.

### Module 2: Finite Field Calculator ($\mathbb{Z}_p$)
*   **Settings:** Input field for Modulus $p$ (default 5, 7, 11).
*   **Calculator Interface:**
    *   Inputs A and B.
    *   Buttons: `+`, `-`, `*`, `/`, `Inverse (A^-1)`.
    *   **Live Result:** Shows step-by-step logic (e.g., "Finding inverse of 3 mod 7... $3 \cdot 5 = 15 \equiv 1$. Inverse is 5.").
*   **Visual Aid: The Table:**
    *   A multiplication table grid $(p \times p)$.
    *   Highlights the row/column of the current calculation.
    *   Shows distribution of inverses (where is the '1'?).

---

## 4. Technical Implementation Details

### A. Fraction Math Wrapper
We must wrap `fraction.js` to ensure typesafety and easy rendering.
```typescript
import Fraction from 'fraction.js';

export type MatrixRow = Fraction[];
export type Matrix = MatrixRow[];

// Helper to render fraction in UI
export const renderFrac = (f: Fraction) => {
  if (f.d === 1) return f.s * f.n; // Integer
  return `${f.s * f.n}/${f.d}`;   // Fraction string
};
```

### B. Extended Euclidean Algorithm (EEA)
Implementation for the Inverse calculator:
```typescript
function extendedGCD(a, b) {
    if (b === 0) return { gcd: a, x: 1, y: 0 };
    const { gcd, x, y } = extendedGCD(b, a % b);
    return { gcd, x: y, y: x - Math.floor(a / b) * y };
}

function modInverse(a, m) {
    const { gcd, x } = extendedGCD(a, m);
    if (gcd !== 1) throw new Error("Inverse does not exist");
    return ((x % m) + m) % m; // Ensure positive
}
```

---

## 5. ⚠️ Attention Points

1.  **User Input Parsing:**
    *   In the Gauss trainer, users might type "0.5" or "1/2". The input parser must convert strings to `Fraction` objects immediately.
    *   Prevent "Division by Zero" inside the matrix operations (scaling by 0).

2.  **State Immutability:**
    *   Matrix operations must *never* mutate the existing state array. Always `.map()` or deep clone before applying a row operation to support the Undo history.

3.  **Complexity Limit:**
    *   For the Finite Field table: Don't let users set $p > 50$. A $50 \times 50$ grid will lag the DOM. Keep defaults small (2, 3, 5, 7, 11, 13).