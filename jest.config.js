const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.jsアプリのパスを指定
  dir: './',
});

// Jestのカスタム設定を追加
const config = {
  // テスト環境をjsdomに設定（DOM APIを使用するため）
  testEnvironment: 'jest-environment-jsdom',
  // セットアップファイルのパス
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // モジュールのパスエイリアスを解決
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // テストファイルのパターン
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  // カバレッジの収集対象から除外するパス
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

// Next.jsのJest設定とマージ
module.exports = createJestConfig(config);

