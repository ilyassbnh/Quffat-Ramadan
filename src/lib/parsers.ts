import Papa from 'papaparse';
import { extractText } from 'unpdf';

/**
 * Extracts raw text from a PDF buffer using unpdf.
 * unpdf is designed for serverless/Node.js environments.
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
    try {
        // Convert Buffer to Uint8Array
        const uint8Array = new Uint8Array(buffer);

        // Extract text using unpdf with mergePages to get a single string
        const { text } = await extractText(uint8Array, { mergePages: true });

        // Ensure we return a string (mergePages: true returns string, false returns string[])
        if (typeof text === 'string') {
            return text;
        }

        // Fallback: if it's still an array, join it
        if (Array.isArray(text)) {
            return text.join('\n\n');
        }

        return String(text || '');
    } catch (error) {
        console.error('Error parsing PDF with unpdf:', error);
        throw new Error(`Failed to parse PDF content: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Parses a CSV string into an array of typed objects.
 */
export function parseCSV<T>(csvContent: string): T[] {
    const result = Papa.parse<T>(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    if (result.errors.length > 0) {
        console.warn('CSV Parse Warnings/Errors:', result.errors);
    }

    return result.data;
}
