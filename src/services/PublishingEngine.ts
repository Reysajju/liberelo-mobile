import * as fs from 'fs';

export interface BookDimensions {
  pageCount: number;
  spineWidthMm: number;
  totalWidthMm: number;
  totalHeightMm: number;
  bleedMm: number;
}

export interface ValidationReport {
  isValid: boolean;
  leakedPlaceholders: string[];
  detectedWordCount: number;
}

export class PublishingEngine {
  private static P_PAPER_THICKNESS_WHITE = 0.0572;
  private static P_BLEED_STANDARD = 3.175;

  public static async scanForPlaceholderLeaks(filePath: string): Promise<ValidationReport> {
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    const placeholderRegex = /(\[.*?\]|\{\{.*?\}\}|<Insert.*?>)/gi;
    const leakedPlaceholders: string[] = [];

    let match;
    while ((match = placeholderRegex.exec(rawContent)) !== null) {
      leakedPlaceholders.push(match[0]);
    }

    const cleanText = rawContent.trim().replace(/\s+/g, ' ');
    const detectedWordCount = cleanText === '' ? 0 : cleanText.split(' ').length;

    return {
      isValid: leakedPlaceholders.length === 0,
      leakedPlaceholders,
      detectedWordCount,
    };
  }

  public static calculatePrintLayout(
    pageCount: number,
    trimWidthMm: number,
    trimHeightMm: number
  ): BookDimensions {
    const bleedMm = this.P_BLEED_STANDARD;
    const spineWidthMm = pageCount * this.P_PAPER_THICKNESS_WHITE;
    const totalWidthMm = trimWidthMm * 2 + spineWidthMm + bleedMm * 2;
    const totalHeightMm = trimHeightMm + bleedMm * 2;

    return {
      pageCount,
      spineWidthMm: parseFloat(spineWidthMm.toFixed(4)),
      totalWidthMm: parseFloat(totalWidthMm.toFixed(4)),
      totalHeightMm: parseFloat(totalHeightMm.toFixed(4)),
      bleedMm,
    };
  }
}
