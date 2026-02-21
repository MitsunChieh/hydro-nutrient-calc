import type { IonId } from './types';
import { ION_ELEMENT_MAP, ION_VALENCE } from './constants';

/** Round a number to the specified number of decimal places */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Convert ppm (mg/L of element) to me/L for a given ion */
export function ppmToMePerL(ionId: IonId, ppm: number): number {
  const { atomicWeight } = ION_ELEMENT_MAP[ionId];
  const valence = ION_VALENCE[ionId];
  // ppm → mmol/L of element → mmol/L of ion (1:1) → me/L
  const mmolPerL = ppm / atomicWeight;
  return mmolPerL * valence;
}

/** Convert me/L to ppm (mg/L of element) for a given ion */
export function mePerLToPpm(ionId: IonId, mePerL: number): number {
  const { atomicWeight } = ION_ELEMENT_MAP[ionId];
  const valence = ION_VALENCE[ionId];
  if (valence === 0) return 0; // Uncharged species (e.g., Si)
  // me/L → mmol/L → ppm
  const mmolPerL = mePerL / valence;
  return mmolPerL * atomicWeight;
}
