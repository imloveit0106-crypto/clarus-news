// Jestのセットアップファイル
// テスト実行前に実行される設定を記述

// @testing-library/jest-domのマッチャーをインポート
// これにより、toBeInTheDocument()などの便利なマッチャーが使用可能になる
import '@testing-library/jest-dom';

// fetchをグローバルにモック化
// デフォルトでは空の配列を返すように設定
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => [],
  } as Response)
) as jest.Mock;

