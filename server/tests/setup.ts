import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env['NODE_ENV'] = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as typeof console;

// Increase timeout for database operations
jest.setTimeout(30000);

// Extend global types for Jest
declare global {
  const jest: typeof import('@jest/globals')['jest'];
} 