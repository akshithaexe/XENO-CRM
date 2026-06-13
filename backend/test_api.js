const axios = require('axios');

async function testApp() {
  console.log('--- Testing Xeno CRM APIs ---');
  
  try {
    // 1. Check AI Assistant
    console.log('\n[1] Testing AI Assistant...');
    const aiRes = await axios.post('http://localhost:5000/api/ai/chat', {
      message: 'Hello, what can you do?',
      history: []
    });
    console.log('AI Response:', aiRes.data.data.reply.substring(0, 100) + '...');
    console.log('✅ AI working');

    // 2. Check Customers API
    console.log('\n[2] Testing Customers API...');
    const customersRes = await axios.get('http://localhost:5000/api/customers?limit=5');
    console.log(`Fetched ${customersRes.data.data.length} customers. Total in DB: ${customersRes.data.total}`);
    console.log('✅ Customers API working');

    // 3. Check Analytics Overview
    console.log('\n[3] Testing Analytics API...');
    const analyticsRes = await axios.get('http://localhost:5000/api/analytics/overview');
    console.log('Stats:', {
      totalCustomers: analyticsRes.data.totalCustomers,
      totalCampaigns: analyticsRes.data.totalCampaigns,
      totalMessages: analyticsRes.data.totalMessages
    });
    console.log('✅ Analytics API working');

    console.log('\n✨ All critical APIs are fully functional!');

  } catch (error) {
    console.error('❌ API Test Failed!');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testApp();
