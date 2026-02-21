/**
 * Target → Recipe solver using Non-Negative Least Squares (NNLS).
 *
 * Given target ion concentrations (ppm) and a set of available chemicals,
 * find the optimal mg/L of each chemical that best matches the targets.
 *
 * Algorithm: Lawson-Hanson active-set NNLS.
 */

import type { IonId, Chemical, ChemicalInput, IonConcentration } from './types';
import { ION_ELEMENT_MAP, ALL_IONS } from './constants';
import { calcSolution } from './engine';

export interface SolverTarget {
  ion: IonId;
  ppm: number;
}

export interface SolverResult {
  /** Recommended chemical amounts */
  chemicals: ChemicalInput[];
  /** Achieved ion concentrations from the recommended amounts */
  achieved: IonConcentration[];
  /** Residual: sum of squared relative errors */
  residual: number;
}

/**
 * Build the coefficient matrix A where A[i][j] = ppm of ion i per 1 mg/L of chemical j.
 */
function buildMatrix(ions: IonId[], chemicals: Chemical[]): number[][] {
  return ions.map((ionId) => {
    return chemicals.map((chem) => {
      const ionEntry = chem.ions.find((ic) => ic.ion === ionId);
      if (!ionEntry) return 0;
      const { atomicWeight } = ION_ELEMENT_MAP[ionId];
      // 1 mg/L of chemical → (1/MW) mmol/L → coefficient * (1/MW) mmol/L of ion → * atomicWeight = ppm
      return (ionEntry.coefficient / chem.molecularWeight) * atomicWeight;
    });
  });
}

/**
 * Solve NNLS: minimize ||Ax - b||² subject to x >= 0
 * using the Lawson-Hanson active set algorithm.
 *
 * A: m×n matrix (m ions, n chemicals)
 * b: m-vector (target ppm)
 * Returns: n-vector x (mg/L of each chemical)
 */
function solveNNLS(A: number[][], b: number[], maxIter = 500): number[] {
  const m = A.length;
  const n = A[0].length;

  const x = new Float64Array(n); // solution, starts at 0

  // Precompute A^T A and A^T b
  const AtA = Array.from({ length: n }, () => new Float64Array(n));
  const Atb = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += A[k][i] * A[k][j];
      }
      AtA[i][j] = sum;
    }
    let sum = 0;
    for (let k = 0; k < m; k++) {
      sum += A[k][i] * b[k];
    }
    Atb[i] = sum;
  }

  // Compute gradient: w = A^T(b - Ax) = Atb - AtA*x
  const computeGradient = (): Float64Array => {
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let val = Atb[i];
      for (let j = 0; j < n; j++) {
        val -= AtA[i][j] * x[j];
      }
      w[i] = val;
    }
    return w;
  };

  // passive set: indices free to be nonzero
  const passive = new Set<number>();

  for (let iter = 0; iter < maxIter; iter++) {
    const w = computeGradient();

    // Find the index in the zero set with the largest gradient
    let maxW = 0;
    let t = -1;
    for (let i = 0; i < n; i++) {
      if (!passive.has(i) && w[i] > maxW) {
        maxW = w[i];
        t = i;
      }
    }

    // If no positive gradient in zero set, we're done
    if (t === -1 || maxW < 1e-10) break;

    passive.add(t);

    // Inner loop: solve unconstrained LS on passive set, enforce nonnegativity
    for (let innerIter = 0; innerIter < maxIter; innerIter++) {
      const pIndices = Array.from(passive);
      const pn = pIndices.length;

      // Solve the sub-system: (A^T A)_PP * s_P = (A^T b)_P
      const subAtA = Array.from({ length: pn }, (_, i) =>
        pIndices.map((_, j) => AtA[pIndices[i]][pIndices[j]])
      );
      const subAtb = pIndices.map((i) => Atb[i]);

      const s = solveLinearSystem(subAtA, subAtb);
      if (!s) break;

      // Check if all components in passive set are positive
      let allPositive = true;
      for (let i = 0; i < pn; i++) {
        if (s[i] <= 1e-10) {
          allPositive = false;
          break;
        }
      }

      if (allPositive) {
        // Accept the solution
        for (let i = 0; i < pn; i++) {
          x[pIndices[i]] = s[i];
        }
        break;
      }

      // Find alpha: the largest step we can take toward s while staying >= 0
      let alpha = Infinity;
      for (let i = 0; i < pn; i++) {
        if (s[i] <= 1e-10) {
          const xi = x[pIndices[i]];
          const ratio = xi / (xi - s[i]);
          if (ratio < alpha) {
            alpha = ratio;
          }
        }
      }

      // Update x = x + alpha * (s - x) for passive indices
      for (let i = 0; i < pn; i++) {
        x[pIndices[i]] += alpha * (s[i] - x[pIndices[i]]);
      }

      // Move near-zero variables back to zero set
      for (let i = pn - 1; i >= 0; i--) {
        if (x[pIndices[i]] < 1e-10) {
          x[pIndices[i]] = 0;
          passive.delete(pIndices[i]);
        }
      }
    }
  }

  return Array.from(x);
}

/**
 * Solve a small dense linear system Ax = b using Gaussian elimination with partial pivoting.
 */
function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = A.length;
  // Augmented matrix
  const aug = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxVal = Math.abs(aug[col][col]);
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > maxVal) {
        maxVal = Math.abs(aug[row][col]);
        maxRow = row;
      }
    }
    if (maxVal < 1e-12) return null; // singular

    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= aug[i][j] * x[j];
    }
    x[i] = sum / aug[i][i];
  }

  return x;
}

/**
 * High-level solver: given targets and available chemicals, find optimal amounts.
 *
 * Uses weighted NNLS where macro targets are weighted more heavily to prioritize
 * getting the major nutrients right.
 */
export function solveForTarget(
  targets: SolverTarget[],
  availableChemicals: Chemical[]
): SolverResult {
  if (targets.length === 0 || availableChemicals.length === 0) {
    return { chemicals: [], achieved: [], residual: 0 };
  }

  // Filter to ions that have nonzero targets
  const activeTargets = targets.filter((t) => t.ppm > 0);
  if (activeTargets.length === 0) {
    return { chemicals: [], achieved: [], residual: 0 };
  }

  const ionIds = activeTargets.map((t) => t.ion);
  const b = activeTargets.map((t) => t.ppm);

  // Weight: normalize by target value so each ion contributes proportionally
  // This prevents high-ppm ions (like NO3-N ~200ppm) from dominating over
  // low-ppm ions (like Mo ~0.05ppm)
  const weights = b.map((v) => 1 / Math.max(v, 0.001));

  const A = buildMatrix(ionIds, availableChemicals);

  // Apply weights to A and b
  const wA = A.map((row, i) => row.map((v) => v * weights[i]));
  const wb = b.map((v, i) => v * weights[i]);

  const x = solveNNLS(wA, wb);

  // Build result
  const chemicals: ChemicalInput[] = [];
  for (let j = 0; j < availableChemicals.length; j++) {
    if (x[j] > 0.001) {
      chemicals.push({
        chemicalId: availableChemicals[j].id,
        mgPerL: Math.round(x[j] * 100) / 100,
      });
    }
  }

  // Calculate achieved concentrations
  const calcResult = chemicals.length > 0
    ? calcSolution(chemicals)
    : { totals: ALL_IONS.map((ion) => ({ ion, mmolPerL: 0, ppm: 0, mePerL: 0 })), breakdowns: [] };

  // Compute residual (sum of squared relative errors)
  let residual = 0;
  for (const target of activeTargets) {
    const achieved = calcResult.totals.find((t) => t.ion === target.ion);
    const achievedPpm = achieved?.ppm ?? 0;
    const relError = (achievedPpm - target.ppm) / Math.max(target.ppm, 0.001);
    residual += relError * relError;
  }

  return {
    chemicals,
    achieved: calcResult.totals,
    residual,
  };
}
