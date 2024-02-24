# おせっかいマップ
<!-- プロダクト名に変更してください -->

![おせっかいマップ](https://drive.google.com/uc?export=view&id=1NB3f6G8UNk_R1fETPULDRatTl_59tzrv)
<!-- プロダクト名・イメージ画像を差し変えてください -->
<!--https://kc3.me/cms/wp-content/uploads/2023/11/2b1b6d9083182c0ce0aeb60000b4d7a7.png-->

## チーム名
チームD～永遠の1年生～
<!-- チームIDとチーム名を入力してください -->


## 背景・課題・解決されること

<!-- テーマ「関西をいい感じに」に対して、考案するプロダクトがどういった(Why)背景から思いついたのか、どのよう(What)な課題があり、どのよう(How)に解決するのかを入力してください -->
　関西には魅力的な飲食店や店舗等が多数存在しており、旅行客はもちろん地元民でも全ての場所を把握することは難しい。そんな埋もれてしまった店舗に再び目を向けてもらう事を目標としてアプリの開発を行う。

## プロダクト説明

<!-- 開発したプロダクトの説明を入力してください -->
　周辺の店舗をオススメしてくれるアプリを、聞いてもないのに色々教えてくれる「大阪のおばちゃん」をモチーフに作成した。  
　周辺の店舗の情報を一括取得してその中からランダムに選ばれた１店舗オススメする。
「食べたい」や「遊びたい」は検索の条件として入力できるが「中華」「洋食」などの細かい条件を設定させないことにより、よりランダムに様々な店舗と巡り合えるようにした。

## 操作説明・デモ動画
[おせっかいマップの動作](https://drive.google.com/file/d/1Xq1zaK_DMim4_aQpUrnCB21xdYYQcgTY/preview)
<!--[デモ動画はこちら](https://www.youtube.com/watch?v=_FAA15ARmas)-->
<!-- 開発したプロダクトの操作説明について入力してください。また、操作説明デモ動画があれば、埋め込みやリンクを記載してください -->
・基本操作  
「ほかのヒト」ボタン(他のおばちゃんに聞く)から周囲の店舗情報を取得する。取得済みの場合は別のおすすめを聞く。  
「GoogleMapで開く」から今見ている店舗をGoogleマップで開く。  
「おばちゃん」を押して設定を開く、距離や店舗の条件など検索条件を設定する。  
「周辺の店舗」フレームから周辺の店舗一覧を確認することも可能。  

・動画外の操作として  
「ブラウザバック」で1つ前に見ていた店舗を表示する。  
「周辺の店舗」から店舗名をクリックして、店舗の情報を開くことが可能。

※動作には、位置情報取得の許可が必要であり、また位置取得の為にHttps接続またはローカル環境での動作が必要になる。


## 注力したポイント

<!-- 開発したプロダクトの中で、特に注力して作成した箇所・ポイントについて入力してください -->
- 共通
  - 積極的にコミュニケーションを行いイメージのずれを減らした。特にjsonでのidや何を送るかや通信方法等
- Frontend
  - サーバと通信する回数を極力減らすことにより、ユーザが通信を待っている時間が短くなるよう注力した
  - 片手で操作できるデザインを目標として、操作ボタンの配置が右下に集中するように設計をした
  - 画面上に関西要素(おばちゃん、たこ焼き等)を配置し、つまらない画面を避けて作成した
- Backend
  - 使用APIの選定・調査活動
  - 初期案の要件を満たせるAPIを使用できるように注力しました
<!--バックエンドさんお願い-->

## 使用技術

<!-- 使用技術を入力してください -->
- Frontend
  - HTML
  - CSS
  - JavaScript
  
- Backend
  - Java 21
  - SpringBoot ○○○
- その他


<!--
markdownの記法はこちらを参照してください！
https://docs.github.com/ja/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
-->
