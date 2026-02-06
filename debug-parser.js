const fs = require('fs');
const path = require('path');

// Polyfill DOMMatrix for Next.js server side (required by pdf-parse dependencies)
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
        constructor() { }
        setMatrixValue() { return this; }
        translate() { return this; }
        scale() { return this; }
        multiply() { return this; }
        transformPoint(p) { return p; }
        toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    };
}

// Robust import for pdf-parse handling CommonJS/ESM interop
let pdfLib = require('pdf-parse');
const { PDFParse } = pdfLib;

async function testParse() {
    try {
        const filePath = path.resolve(__dirname, 'test_document.pdf');
        console.log(`Reading file from: ${filePath}`);
        const buffer = fs.readFileSync(filePath);

        console.log('File read successfully. Starting parse...');
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        await parser.destroy();

        console.log('SUCCESS: PDF Parsed');
        console.log('Text content preview:', data.text.substring(0, 100));
    } catch (error) {
        console.error('FAILURE: Parsing failed');
        console.error(error);
    }
}

testParse();
