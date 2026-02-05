const pdf = require('pdf-parse');
import Papa from 'papaparse';

/**
 * Extracts raw text from a PDF buffer.
 * Note: This runs server-side (Node.js) only due to 'pdf-parse' dependencies.
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF content');
    }
}

/**
 * Parses a CSV string into an array of typed objects.
 * Uses 'header: true' to map columns to object keys.
 * 
 * @param csvContent The raw CSV string
 * @returns Array of objects of type T
 */
export function parseCSV<T>(csvContent: string): T[] {
    const result = Papa.parse<T>(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically converts numbers and booleans
    });

    if (result.errors.length > 0) {
        console.warn('CSV Parse Warnings/Errors:', result.errors);
    }

    return result.data;
}
