#!/usr/bin/env node
/**
 * Test script to verify API endpoints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

const API_URL = 'http://localhost:5000/api';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Get all documents
    console.log('1️⃣  Testing GET /api/documents');
    const getResponse = await fetch(`${API_URL}/documents`);
    const getResult = await getResponse.json();
    console.log('✅ Response:', getResult);
    console.log('');

    // Test 2: Upload a test PDF
    console.log('2️⃣  Testing POST /api/documents/upload');
    
    // Create a minimal PDF for testing
    const testPdfPath = path.join(__dirname, 'test.pdf');
    // Create a minimal valid PDF
    const pdfContent = '%PDF-1.0\n%test pdf\n';
    fs.writeFileSync(testPdfPath, pdfContent);

    // Using fetch with FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testPdfPath));

    const uploadResponse = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploadResult = await uploadResponse.json();
    console.log('✅ Upload Response:', uploadResult);
    
    // Cleanup test file
    fs.unlinkSync(testPdfPath);
    console.log('');

    if (uploadResult.data?.id) {
      const docId = uploadResult.data.id;

      // Test 3: Get single document
      console.log(`3️⃣  Testing GET /api/documents/${docId}`);
      const getOneResponse = await fetch(`${API_URL}/documents/${docId}`);
      const getOneResult = await getOneResponse.json();
      console.log('✅ Response:', getOneResult);
      console.log('');

      // Test 4: Delete document
      console.log(`4️⃣  Testing DELETE /api/documents/${docId}`);
      const deleteResponse = await fetch(`${API_URL}/documents/${docId}`, {
        method: 'DELETE',
      });
      const deleteResult = await deleteResponse.json();
      console.log('✅ Response:', deleteResult);
      console.log('');
    }

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
