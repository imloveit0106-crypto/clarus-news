import { render, screen, waitFor } from '@testing-library/react';
import Page from '@/app/page';

describe('Home Page', () => {
  // 各テストの前にfetchをリセット
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('ローディング中にスケルトンが表示される', async () => {
    // fetchをモック化して遅延させる
    (global.fetch as jest.Mock).mockImplementationOnce(
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
    await waitFor(() => {
      const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
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
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNews,
    });

    render(<Page />);

    // データが読み込まれるまで待機
    await waitFor(
      () => {
        expect(screen.getByText('テストニュース1')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // カテゴリが表示されているか確認（バッジ内のテキストを確認）
    const categoryBadge = screen.getByText('テクノロジー', { selector: 'div' });
    expect(categoryBadge).toBeInTheDocument();
  });

  it('エラー時にエラーメッセージが表示される', async () => {
    // fetchをモック化してエラーを返す
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ネットワークエラー'));

    render(<Page />);

    // エラーメッセージが表示されるまで待機
    await waitFor(
      () => {
        expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // 再読み込みボタンが表示されているか確認
    expect(screen.getByText('再読み込み')).toBeInTheDocument();
  });

  it('データが空の場合に適切なメッセージが表示される', async () => {
    // fetchをモック化して空の配列を返す
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Page />);

    // データが空の場合のメッセージが表示されるまで待機
    await waitFor(
      () => {
        expect(screen.getByText('ニュースがありません')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('「すべて」タブが表示される', async () => {
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
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNews,
    });

    render(<Page />);

    // 「すべて」タブが表示されるまで待機
    await waitFor(
      () => {
        expect(screen.getByText('すべて')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
