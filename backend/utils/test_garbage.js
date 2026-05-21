const fs = require('fs');

async function testGarbage() {
  const BASE = 'http://localhost:5000';
  
  console.log('Logging in to get authentication token...');
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testuser@example.com', password: 'SecretPassword123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;

  if (!token) {
    throw new Error('Login failed. Ensure test user exists.');
  }

  // TEST 1: Corrupted/Malformed PDF Structure
  console.log('\n--- TEST 1: Malformed PDF structure ---');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const malformedPdfContent = 'This is not a real PDF structure. Just some random text.';
  
  const body1 = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="file"; filename="corrupted.pdf"',
    'Content-Type: application/pdf',
    '',
    malformedPdfContent,
    `--${boundary}--`,
    ''
  ].join('\r\n');

  const res1 = await fetch(`${BASE}/api/itineraries/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: body1
  });

  const data1 = await res1.json();
  console.log('Status:', res1.status);
  console.log('Response:', JSON.stringify(data1, null, 2));

  if (res1.status === 400 && data1.error.message.includes('Invalid or corrupted PDF')) {
    console.log('SUCCESS: Malformed PDF successfully rejected with 400 Bad Request!');
  } else {
    console.error('FAILURE: Malformed PDF was not handled correctly.');
  }

  // TEST 2: Valid Image syntax but Garbage content (a 1x1 black pixel image)
  console.log('\n--- TEST 2: Unrelated Document Content (1x1 PNG Image) ---');
  const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const imageBuffer = Buffer.from(imageBase64, 'base64');

  // Convert buffer to multipart body
  const boundary2 = '----WebKitFormBoundary8MA4YWxkTrZu0gW';
  
  const header = [
    `--${boundary2}`,
    'Content-Disposition: form-data; name="file"; filename="garbage_image.png"',
    'Content-Type: image/png',
    '',
    ''
  ].join('\r\n');

  const footer = `\r\n--${boundary2}--\r\n`;
  const body2 = Buffer.concat([
    Buffer.from(header, 'utf-8'),
    imageBuffer,
    Buffer.from(footer, 'utf-8')
  ]);

  const res2 = await fetch(`${BASE}/api/itineraries/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary2}`
    },
    body: body2
  });

  const data2 = await res2.json();
  console.log('Status:', res2.status);
  console.log('Response:', JSON.stringify(data2, null, 2));

  if (res2.status === 400 && data2.error.message.includes('Invalid Travel Document')) {
    console.log('SUCCESS: Unrelated/garbage image document correctly rejected with 400 Bad Request!');
  } else {
    console.error('FAILURE: Garbage image document was not rejected correctly.');
  }
}

testGarbage().catch(console.error);
