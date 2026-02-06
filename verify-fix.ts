import { parsePDF } from './src/lib/parsers';
import fs from 'fs';
import path from 'path';

async function verify() {
    console.log('Starting integration verification...');
    try {
        const filePath = path.resolve(process.cwd(), 'test_document.pdf');
        if (!fs.existsSync(filePath)) {
            console.error('Test file not found:', filePath);
            process.exit(1);
        }
        const buffer = fs.readFileSync(filePath);
        console.log('Calling parsePDF from src/lib/parsers...');

        const text = await parsePDF(buffer);

        if (text && text.includes('Hello World')) {
            console.log('VERIFICATION SUCCESS: Text extracted correctly.');
            console.log('Preview:', text.substring(0, 50).replace(/\n/g, ' '));
        } else {
            console.error('VERIFICATION FAILED: Unexpected text content.');
            console.log('Got:', text);
        }
    } catch (error) {
        console.error('VERIFICATION CRASHED:', error);
        process.exit(1);
    }
}

verify();
