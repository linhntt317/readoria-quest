/**
 * Test comments API endpoint
 * Tests both GET and POST methods
 */

const API_URL =
  "https://ljmoqseafxhncpwzuwex.supabase.co/functions/v1/comments"; // Production Supabase function
const PROD_API_URL = "http://localhost:3000/api/comments"; // If we had Next.js API route

async function testGetComments() {
  console.log("\n========== Testing GET Comments ==========");

  const mangaId = "68dd8615-46bb-4e3c-b561-e7debfe1f0d2";

  try {
    const response = await fetch(`${API_URL}?mangaId=${mangaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    return response.status === 200;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

async function testPostComment() {
  console.log("\n========== Testing POST Comment ==========");

  const payload = {
    mangaId: "68dd8615-46bb-4e3c-b561-e7debfe1f0d2",
    nickname: "Test User",
    content: "This is a test comment from Node.js",
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    return response.status === 201;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("Starting Comments API Tests...\n");

  const getResult = await testGetComments();
  const postResult = await testPostComment();

  console.log("\n========== Test Results ==========");
  console.log("GET Comments:", getResult ? "✓ PASSED" : "✗ FAILED");
  console.log("POST Comment:", postResult ? "✓ PASSED" : "✗ FAILED");

  process.exit(postResult ? 0 : 1);
}

runTests();
