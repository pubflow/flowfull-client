/**
 * Basic Usage Example
 * 
 * This example demonstrates basic usage of @pubflow/flowfull-client
 */

import { createFlowfull, eq, gte, between, inOp } from '../src';

// Create client
const api = createFlowfull('https://api.example.com');

// Example 1: Simple GET request
async function example1() {
  console.log('Example 1: Simple GET request');
  
  const result = await api.get('/users');
  
  if (result.success) {
    console.log('Users:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}

// Example 2: Query builder with filters
async function example2() {
  console.log('\nExample 2: Query builder with filters');
  
  const result = await api
    .query('/products')
    .where('status', 'active')
    .where('price', gte(50))
    .sort('price', 'asc')
    .page(1)
    .limit(20)
    .get();
  
  if (result.success) {
    console.log('Products:', result.data);
    console.log('Pagination:', result.meta);
  }
}

// Example 3: Complex query with multiple filters
async function example3() {
  console.log('\nExample 3: Complex query');
  
  const result = await api
    .query('/products')
    .search('laptop')
    .where('status', inOp(['active', 'featured']))
    .where('price', between(500, 2000))
    .where('stock', gte(1))
    .sort('price', 'asc')
    .page(1)
    .limit(20)
    .get();
  
  if (result.success) {
    console.log('Found products:', result.data);
  }
}

// Example 4: POST request
async function example4() {
  console.log('\nExample 4: POST request');
  
  const result = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });
  
  if (result.success) {
    console.log('Created user:', result.data);
  }
}

// Example 5: Multiple instances
async function example5() {
  console.log('\nExample 5: Multiple instances');
  
  const mainApi = createFlowfull('https://api.example.com');
  const analyticsApi = createFlowfull('https://analytics.example.com');
  
  const [users, stats] = await Promise.all([
    mainApi.get('/users'),
    analyticsApi.get('/stats/daily')
  ]);
  
  console.log('Users:', users.data);
  console.log('Stats:', stats.data);
}

// Run examples
async function runExamples() {
  try {
    await example1();
    await example2();
    await example3();
    await example4();
    await example5();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Uncomment to run
// runExamples();

export { example1, example2, example3, example4, example5 };

