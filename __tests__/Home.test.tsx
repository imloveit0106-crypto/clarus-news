import { render, screen, waitFor } from '@testing-library/react';
import Page from '@/app/page';

// fetchをモック化
global.fetch = jest.fn();

describe('Home Page', () => {
  // 各テストの前にfetchをリセット
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('ヘッダーに "Clarus" という文字が表示されている', () => {
    // fetchをモック化して空の配列を返す
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Page />);
    
    // "Clarus"というテキストが表示されているか確認
    expect(screen.getByText('Clarus')).toBeInTheDocument();
  });

  it('ローディング中にスケルトンが表示される', async () => {
    // fetchをモック化して遅延させる
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => [],
              }),
            100
          )
        )
    );

    render(<Page />);
    
    // ローディング中はスケルトンが表示される
    // スケルトンコンポーネントが存在することを確認
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('データ取得後にニュースが表示される', async () => {
    // モックデータを準備
    const mockNews = [
      {
        id: '1',
        title: 'テストニュース1',
        content: 'これはテストニュースです',
        category: 'テクノロジー',
        date: '2024-01-01',
      },
    ];

    // fetchをモック化してモックデータを返す
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNews,
    });

    render(<Page />);

    // データが読み込まれるまで待機
    await waitFor(() => {
      expect(screen.getByText('テストニュース1')).toBeInTheDocument();
    });

    // カテゴリが表示されているか確認
    expect(screen.getByText('テクノロジー')).toBeInTheDocument();
  });

  it('エラー時にエラーメッセージが表示される', async () => {
    // fetchをモック化してエラーを返す
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('ネットワークエラー'));

    render(<Page />);

    // エラーメッセージが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });

    // 再読み込みボタンが表示されているか確認
    expect(screen.getByText('再読み込み')).toBeInTheDocument();
  });
});

