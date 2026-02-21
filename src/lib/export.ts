import type { ChemicalInput, IonConcentration } from './types';
import { CHEMICAL_MAP } from './chemicals';
import { estimateEC } from './engine';
import type { Messages } from './i18n';

const ION_DISPLAY: Record<string, string> = {
  NO3: 'N (NO3-)',
  NH4: 'N (NH4+)',
  H2PO4: 'P',
  K: 'K',
  Ca: 'Ca',
  Mg: 'Mg',
  SO4: 'S (SO4 2-)',
  Fe: 'Fe',
  Mn: 'Mn',
  B: 'B',
  Zn: 'Zn',
  Cu: 'Cu',
  Mo: 'Mo',
  Na: 'Na',
  Cl: 'Cl',
  Si: 'Si',
};

export function exportAsText(
  chemicals: ChemicalInput[],
  totals: IonConcentration[],
  t: Messages
): string {
  const lines: string[] = [];
  lines.push(t.export.header);
  lines.push('');
  lines.push(t.export.chemicalsSection);

  for (const c of chemicals) {
    const chem = CHEMICAL_MAP.get(c.chemicalId);
    const name = t.chemicals[c.chemicalId] ?? chem?.name ?? c.chemicalId;
    lines.push(`  ${name}: ${c.mgPerL} mg/L`);
  }

  lines.push('');
  lines.push(t.export.ecSection(estimateEC(totals).toFixed(2)));
  lines.push('');
  lines.push(t.export.ionSection);
  lines.push(t.export.columnHeaders);

  for (const tt of totals) {
    if (tt.ppm > 0 || tt.mePerL > 0) {
      const label = (ION_DISPLAY[tt.ion] ?? tt.ion).padEnd(16);
      const ppm = tt.ppm.toFixed(2).padStart(10);
      const mePerL = tt.mePerL.toFixed(3).padStart(10);
      lines.push(`${label} ${ppm} ${mePerL}`);
    }
  }

  lines.push('');
  lines.push(t.export.footer);
  return lines.join('\n');
}

export function exportAsCSV(
  chemicals: ChemicalInput[],
  totals: IonConcentration[],
  t: Messages
): string {
  const lines: string[] = [];

  lines.push(t.export.csvHeader);

  for (const c of chemicals) {
    const chem = CHEMICAL_MAP.get(c.chemicalId);
    const name = chem?.name ?? c.chemicalId;
    lines.push(`${t.export.csvChemical},"${name}",${c.mgPerL},mg/L`);
  }

  lines.push(`${t.export.csvEc},${t.export.csvEstimatedEc},${estimateEC(totals).toFixed(2)},mS/cm`);

  for (const tt of totals) {
    if (tt.ppm > 0 || tt.mePerL > 0) {
      const label = ION_DISPLAY[tt.ion] ?? tt.ion;
      lines.push(`${t.export.csvIon},"${label}",${tt.ppm.toFixed(4)},ppm`);
      lines.push(`${t.export.csvIon},"${label}",${tt.mePerL.toFixed(4)},me/L`);
    }
  }

  return lines.join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
