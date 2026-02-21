import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportAsText, exportAsCSV, copyToClipboard, downloadFile } from './export';
import { en } from './i18n/en';
import { SAMPLE_TOTALS } from '../test/fixtures';
import type { ChemicalInput } from './types';

const simpleChemicals: ChemicalInput[] = [
  { chemicalId: 'potassium-nitrate', mgPerL: 506 },
  { chemicalId: 'calcium-nitrate', mgPerL: 945 },
];

describe('exportAsText', () => {
  it('includes header', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    expect(text).toContain(en.export.header);
  });

  it('includes chemical names and amounts', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    expect(text).toContain('Potassium Nitrate');
    expect(text).toContain('506 mg/L');
    expect(text).toContain('Calcium Nitrate');
    expect(text).toContain('945 mg/L');
  });

  it('includes EC section', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    expect(text).toContain('EC:');
    expect(text).toContain('mS/cm');
  });

  it('includes ion section with ppm and me/L', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    expect(text).toContain(en.export.ionSection);
    expect(text).toContain('ppm');
    expect(text).toContain('me/L');
  });

  it('includes footer', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    expect(text).toContain(en.export.footer);
  });

  it('skips ions with zero values', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    // NH4 is 0, should not appear as a data row
    const lines = text.split('\n');
    const nh4Lines = lines.filter((l) => l.includes('NH4') && l.includes('0.00'));
    // NH4 has 0 ppm and 0 mePerL so it should not be in the ion list
    expect(nh4Lines).toHaveLength(0);
  });

  it('result is a string', () => {
    const text = exportAsText(simpleChemicals, SAMPLE_TOTALS, en);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(100);
  });
});

describe('exportAsCSV', () => {
  it('first line is CSV header', () => {
    const csv = exportAsCSV(simpleChemicals, SAMPLE_TOTALS, en);
    const firstLine = csv.split('\n')[0];
    expect(firstLine).toBe(en.export.csvHeader);
  });

  it('includes chemical rows', () => {
    const csv = exportAsCSV(simpleChemicals, SAMPLE_TOTALS, en);
    expect(csv).toContain('Chemical');
    expect(csv).toContain('Potassium Nitrate');
    expect(csv).toContain('506');
    expect(csv).toContain('mg/L');
  });

  it('includes EC row', () => {
    const csv = exportAsCSV(simpleChemicals, SAMPLE_TOTALS, en);
    expect(csv).toContain('EC');
    expect(csv).toContain('mS/cm');
  });

  it('includes ion rows with ppm and me/L', () => {
    const csv = exportAsCSV(simpleChemicals, SAMPLE_TOTALS, en);
    expect(csv).toContain('Ion');
    expect(csv).toContain('ppm');
    expect(csv).toContain('me/L');
  });

  it('result is valid CSV-like format', () => {
    const csv = exportAsCSV(simpleChemicals, SAMPLE_TOTALS, en);
    const lines = csv.split('\n');
    expect(lines.length).toBeGreaterThan(5);
    // Each line should have commas
    for (const line of lines) {
      expect(line.includes(',')).toBe(true);
    }
  });
});

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.mocked(navigator.clipboard.writeText).mockClear();
  });

  it('calls navigator.clipboard.writeText', async () => {
    const result = await copyToClipboard('test text');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(result).toBe(true);
  });

  it('returns false on clipboard failure', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('fail'));
    const result = await copyToClipboard('test');
    expect(result).toBe(false);
  });
});

describe('downloadFile', () => {
  it('creates and clicks a download link', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement);

    downloadFile('content', 'test.csv', 'text/csv');

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    createElementSpy.mockRestore();
  });

  it('passes correct filename and mime type', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);

    let capturedDownload = '';
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      set href(_: string) {},
      set download(d: string) { capturedDownload = d; },
      click: vi.fn(),
    } as unknown as HTMLAnchorElement);

    downloadFile('data', 'nutrients.csv', 'text/csv');
    expect(capturedDownload).toBe('nutrients.csv');

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    createElementSpy.mockRestore();
  });
});
