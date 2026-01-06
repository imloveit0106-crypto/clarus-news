'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// ニュースアイテムの型定義
interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
}

export default function Page() {
  // 状態管理
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ニュースデータの取得
  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://raw.githubusercontent.com/imloveit0106-crypto/news-curation-bot/master/docs/news.json');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // 再読み込み関数
  const handleReload = () => {
    setLoading(true);
    setError(null);
    fetch('https://raw.githubusercontent.com/imloveit0106-crypto/news-curation-bot/master/docs/news.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        return response.json();
      })
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // カテゴリ一覧の取得
  const categories = Array.from(new Set(news.map((item) => item.category)));

  // 選択されたカテゴリでフィルタリング
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter((item) => item.category === selectedCategory);

  // ローディング表示：実際のニュースカードと同じレイアウト
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        {/* タブのスケルトン */}
        <div className="mb-4">
          <Skeleton className="h-10 w-64" />
        </div>
        {/* ニュースカードのスケルトン */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-7 flex-1" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // エラー表示：再読み込みボタン付き
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleReload} variant="default">
              再読み込み
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // データが空の場合の表示：再読み込みボタン付き
  if (news.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>ニュースがありません</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>現在、表示できるニュースがありません。</p>
            <Button onClick={handleReload} variant="outline">
              再読み込み
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // メインコンテンツ表示
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">すべて</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredNews.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>該当するニュースがありません</CardTitle>
              </CardHeader>
              <CardContent>
                <p>選択したカテゴリに該当するニュースがありません。</p>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="flex-1">{item.title}</CardTitle>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{item.content}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <Button variant="outline" size="sm">詳細を見る</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
