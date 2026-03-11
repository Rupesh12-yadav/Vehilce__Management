const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// Test 1: Health Check
async function testHealthCheck() {
  try {
    log.info('Testing health check endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.success) {
      log.success('Health check passed');
      return true;
    }
  } catch (error) {
    log.error(`Health check failed: ${error.message}`);
    return false;
  }
}

// Test 2: Login
async function testLogin() {
  try {
    log.info('Testing login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@vehiclerental.com',
      password: 'password123'
    });
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      log.success('Login successful');
      log.info(`Token: ${authToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    log.error(`Login failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 3: Get User Stats
async function testGetUserStats() {
  try {
    log.info('Testing get user stats...');
    const response = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      log.success('User stats retrieved successfully');
      console.log('Stats:', JSON.stringify(response.data.data, null, 2));
      return true;
    }
  } catch (error) {
    log.error(`Get stats failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 4: Get All Users
async function testGetAllUsers() {
  try {
    log.info('Testing get all users...');
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      log.success(`Retrieved ${response.data.data.length} users`);
      return true;
    }
  } catch (error) {
    log.error(`Get users failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 5: Get Users by Role
async function testGetUsersByRole() {
  try {
    log.info('Testing get users by role (driver)...');
    const response = await axios.get(`${BASE_URL}/users?role=driver`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      log.success(`Retrieved ${response.data.data.length} drivers`);
      return true;
    }
  } catch (error) {
    log.error(`Get users by role failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 6: Get Profile
async function testGetProfile() {
  try {
    log.info('Testing get profile...');
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      log.success(`Profile retrieved: ${response.data.data.name}`);
      return true;
    }
  } catch (error) {
    log.error(`Get profile failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 7: Unauthorized Access
async function testUnauthorizedAccess() {
  try {
    log.info('Testing unauthorized access...');
    await axios.get(`${BASE_URL}/users/stats`);
    log.error('Unauthorized access should have failed!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Unauthorized access properly blocked');
      return true;
    }
    log.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 Super Admin API Integration Tests');
  console.log('='.repeat(50) + '\n');

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Login', fn: testLogin },
    { name: 'Get User Stats', fn: testGetUserStats },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Get Users by Role', fn: testGetUsersByRole },
    { name: 'Get Profile', fn: testGetProfile },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results');
  console.log('='.repeat(50));
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);
  console.log('='.repeat(50) + '\n');

  if (failed === 0) {
    log.success('All tests passed! 🎉');
    log.info('Super Admin API is fully integrated and working!');
  } else {
    log.warning(`${failed} test(s) failed. Please check the errors above.`);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    log.error('Backend server is not running!');
    log.info('Please start the backend server first:');
    console.log('  cd backend');
    console.log('  npm start');
    return false;
  }
}

// Main execution
(async () => {
  const isBackendRunning = await checkBackend();
  if (isBackendRunning) {
    await runAllTests();
  }
  process.exit(0);
})();
