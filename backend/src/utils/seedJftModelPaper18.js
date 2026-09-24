const path = require('path');
const db = require(path.resolve(__dirname, '../config/database'));

const p18Questions = [
  // --- 文字・語彙 (Q1-15) ---
  {
    order_num: 1, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。',
    option_a: 'さいがいボランティア', option_b: 'ゆきおろしボランティア', option_c: 'ほいくサポート', option_d: 'かんこうガイド',
    correct_option: 'A', marks: 1,
    explanation: '災害時に現地で救援活動を行うのは「災害ボランティア（さいがいボランティア - A）」です。',
    image_url: '/images/jft_paper18/p18_page_01_img_1.png', audio_url: null
  },
  {
    order_num: 2, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。',
    option_a: 'ほいくサポート', option_b: 'さいがいボランティア', option_c: 'ゆきおろしボランティア', option_d: 'かんこうガイド',
    correct_option: 'C', marks: 1,
    explanation: '屋根の雪を下ろす作業は「雪下ろしボランティア（ゆきおろしボランティア - C）」です。',
    image_url: '/images/jft_paper18/p18_page_01_img_2.png', audio_url: null
  },
  {
    order_num: 3, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。',
    option_a: 'ゆきおろしボランティア', option_b: 'ほいくサポート', option_c: 'かんこうガイド', option_d: 'さいがいボランティア',
    correct_option: 'B', marks: 1,
    explanation: '保育園などで子どもをお世話するのは「保育サポート（ほいくサポート - B）」です。',
    image_url: '/images/jft_paper18/p18_page_02_img_3.png', audio_url: null
  },
  {
    order_num: 4, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。',
    option_a: '病気', option_b: 'かんこうガイド', option_c: 'ほいくサポート', option_d: 'さいがいボランティア',
    correct_option: 'B', marks: 1,
    explanation: '観光地で旅行者を案内するのは「観光ガイド（かんこうガイド - B）」です。',
    image_url: '/images/jft_paper18/p18_page_02_img_4.png', audio_url: null
  },
  {
    order_num: 5, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。',
    option_a: '絵をかく', option_b: 'まんが', option_c: 'かるた', option_d: 'しょうぎ',
    correct_option: 'C', marks: 1,
    explanation: '読み札に合わせて札を取る日本の伝統的な遊びは「かるた（C）」です。',
    image_url: '/images/jft_paper18/p18_page_02_img_5.png', audio_url: null
  },
  {
    order_num: 6, section_name: '文字・語彙',
    question_text: '文を読んで、空欄(6)に最もあてはまるものを選びなさい。\n\n最近、日本 (6) ＿＿＿＿ 働く外国人が多くなっています。',
    option_a: 'が', option_b: 'と', option_c: 'で', option_d: 'に',
    correct_option: 'C', marks: 2,
    explanation: '場所で動作が行われることを表す助詞「で（日本で働く - C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 7, section_name: '文字・語彙',
    question_text: '文を読んで、空欄(7)に最もあてはまるものを選びなさい。\n\nしかし、外国人が日本の社会になれるの (7) ＿＿＿＿ 大変で、時間がかかります。',
    option_a: 'に', option_b: 'は', option_c: 'か', option_d: 'を',
    correct_option: 'B', marks: 2,
    explanation: '動詞の名詞化（〜の）を主題として取り立てる助詞「は（なれるのは - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 8, section_name: '文字・語彙',
    question_text: '文を読んで、空欄(8)に最もあてはまるものを選びなさい。\n\n時間がかかる (8) ＿＿＿＿ でしょうか。',
    option_a: 'に', option_b: 'から', option_c: 'まで', option_d: 'の',
    correct_option: 'B', marks: 2,
    explanation: '理由を表す「から（時間がかかるからでしょうか - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 9, section_name: '文字・語彙',
    question_text: '文を読んで、空欄(9)に最もあてはまるものを選びなさい。\n\n日本はまだ、外国人 (9) ＿＿＿＿ あまり働きやすい場所ではないそうです。',
    option_a: 'と', option_b: 'を', option_c: 'が', option_d: 'に',
    correct_option: 'D', marks: 2,
    explanation: '対象・基準を表す助詞「に（外国人に働きやすい - D）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 10, section_name: '文字・語彙',
    question_text: '文を読んで、空欄(10)に最もあてはまるものを選びなさい。\n\nそれに、日本人 (10) ＿＿＿＿、外国人と一緒に働くことに、まだなれていないかもしれません。',
    option_a: 'を', option_b: 'は', option_c: 'の', option_d: 'も',
    correct_option: 'D', marks: 2,
    explanation: '並列・追加を表す助詞「も（日本人も - D）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 11, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\n<u>食べ物</u>と飲み物を持って行きます。',
    option_a: 'かいもの', option_b: 'たべもの', option_c: 'のみもの', option_d: 'くだもの',
    correct_option: 'B', marks: 2,
    explanation: '「食べ物」の正しい読み方は「たべもの（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 12, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\nお酒を<u>お願いします</u>。',
    option_a: 'おぬがい', option_b: 'おながい', option_c: 'おねがい', option_d: 'おみがい',
    correct_option: 'C', marks: 2,
    explanation: '「お願いします」の正しい読み方は「おねがい（C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 13, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\n(13)<u>野菜</u>のカレーは魚のカレーと(14)味がちがいます。(15)色もちがいます。',
    option_a: 'やさい', option_b: 'やきゅう', option_c: 'やおや', option_d: 'やまみち',
    correct_option: 'A', marks: 2,
    explanation: '「野菜」の正しい読み方は「やさい（A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 14, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\n(13)野菜のカレーは魚のカレーと(14)<u>味</u>がちがいます。',
    option_a: 'みじ', option_b: 'あじ', option_c: 'きょうみ', option_d: 'いみ',
    correct_option: 'B', marks: 2,
    explanation: '「味」の正しい読み方は「あじ（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 15, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\n(15)<u>色</u>もちがいます。',
    option_a: 'みろ', option_b: 'いろ', option_c: 'きいろ', option_d: 'しろ',
    correct_option: 'B', marks: 2,
    explanation: '「色」の正しい読み方は「いろ（B）」です。',
    image_url: null, audio_url: null
  },

  // --- 会話・文法 (Q16-30) ---
  {
    order_num: 16, section_name: '会話・文法',
    question_text: '文と同じ意味の文を選びなさい。\n\nきっさてんで紅茶とケーキをちゅうもんしました。',
    option_a: 'きっさてんで紅茶とケーキを作りました。', option_b: 'きっさてんで紅茶とケーキを貸しました。', option_c: 'きっさてんで紅茶とケーキをたのみました。', option_d: 'きっさてんで紅茶とケーキを買いました。',
    correct_option: 'C', marks: 5,
    explanation: '注文する（ちゅうもんする）は「頼む（たのむ - C）」と同義です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 17, section_name: '会話・文法',
    question_text: '文と同じ意味の文を選びなさい。\n\nあたらしいスーパーは24時間やっています。',
    option_a: 'あたらしいスーパーは24時間作っています。', option_b: 'あたらしいスーパーは24時間開いています。', option_c: 'あたらしいスーパーは24時間立っています。', option_d: 'あたらしいスーパーは24時間休んでいます。',
    correct_option: 'B', marks: 5,
    explanation: '24時間営業していることは「24時間開いている（あいている - B）」と同義です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 18, section_name: '会話・文法',
    question_text: '文と同じ意味の文を選びなさい。\n\n弟は青いネクタイをしています。',
    option_a: '弟は青いネクタイを着ています。', option_b: '弟は青いネクタイをしめています。', option_c: '弟は青いネクタイをかけています。', option_d: '弟は青いネクタイを持っています。',
    correct_option: 'B', marks: 5,
    explanation: 'ネクタイをつける動作は「ネクタイをしめる（B）」と言います。',
    image_url: '/images/jft_paper18/p18_page_05_img_10.png', audio_url: null
  },
  {
    order_num: 19, section_name: '会話・文法',
    question_text: '文と同じ意味の文を選びなさい。\n\nいつも日曜日にせんたくをします。',
    option_a: 'いつも日曜日にようふくをあらいます。', option_b: 'いつも日曜日にへやをきれいにします。', option_c: 'いつも日曜日に車をあらいます。', option_d: 'いつも日曜日に皿をあらいます。',
    correct_option: 'A', marks: 5,
    explanation: '洗濯（せんたく）は「洋服を洗う（あらいます - A）」ことです。',
    image_url: null, audio_url: null
  },
  {
    order_num: 20, section_name: '会話・文法',
    question_text: '文と同じ意味の文を選びなさい。\n\n私は友達にわらわれて、はずかしかったです。',
    option_a: '私も友達もわらって、はずかしかったです。', option_b: '私はわらったので友達がはずかしかったです。', option_c: '友達がわらったので私ははずかしかったです。', option_d: '友達が怒ったので私ははずかしかったです。',
    correct_option: 'C', marks: 5,
    explanation: '受身「わらわれて」は「友達が笑ったので私が恥ずかしかった（C）」という意味です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 21, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(21)に最もあてはまるものを選びなさい。\n\nA：だいじょうぶですか。\nB：駅に(21)＿＿＿＿＿＿＿＿、道がよくわかりません。',
    option_a: '行きたいんです', option_b: '行きたいんですが', option_c: '行きたいんまで', option_d: '行きたいからです',
    correct_option: 'B', marks: 5,
    explanation: '前置きを表す接続「〜んですが（行きたいんですが - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 22, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(22)に最もあてはまるものを選びなさい。\n\nA：いっしょに(22)＿＿＿＿＿＿＿＿。\nB：すみません。ありがとうございます。',
    option_a: '行きましょうか', option_b: '行きましたか', option_c: '行きたい', option_d: '行くですか',
    correct_option: 'A', marks: 5,
    explanation: '相手に親切に申し出る表現「〜ましょうか（行きましょうか - A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 23, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(23)に最もあてはまるものを選びなさい。\n\nA：それ、(23)＿＿＿＿＿＿＿＿。おいしそうですね。\nB：日本のおすしです。',
    option_a: '何ですか', option_b: '誰ですか', option_c: 'どなたですか', option_d: 'どれですか',
    correct_option: 'A', marks: 5,
    explanation: '物を尋ねる疑問詞は「何ですか（A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 24, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(24)に最もあてはまるものを選びなさい。\n\nA：おすしですか。韓国のキンパとよく(24)＿＿＿＿＿＿＿＿ね。\nB：味はちょっと(25)＿＿＿＿＿＿＿＿よ。どうぞ。食べてみてください。',
    option_a: 'あっています', option_b: 'いています', option_c: 'にています', option_d: 'ちがっています',
    correct_option: 'C', marks: 5,
    explanation: '似ている様子を表す動詞は「似ています（にています - C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 25, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(25)に最もあてはまるものを選びなさい。\n\nB：味はちょっと(25)＿＿＿＿＿＿＿＿よ。どうぞ。食べてみてください。',
    option_a: '正しいです', option_b: 'おなじです', option_c: 'ちがいます', option_d: 'まずいです',
    correct_option: 'C', marks: 5,
    explanation: '異なることを表す表現は「ちがいます（C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 26, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(26)に最もあてはまるものを選びなさい。\n\nサリ：(26)＿＿＿＿＿＿＿＿。\nリン：ええ、(27)＿＿＿＿＿＿＿＿飲みます。食事の前に少しだけ飲みます。',
    option_a: 'お酒を飲みましょうか', option_b: 'お酒を飲みますか', option_c: '飲みます', option_d: 'お酒が好きですか',
    correct_option: 'B', marks: 5,
    explanation: '習慣を尋ねる疑問文「お酒を飲みますか（B）」です。',
    image_url: '/images/jft_paper18/p18_page_07_img_13.png', audio_url: null
  },
  {
    order_num: 27, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(27)に最もあてはまるものを選びなさい。\n\nリン：ええ、(27)＿＿＿＿＿＿＿＿飲みます。食事の前に少しだけ飲みます。',
    option_a: 'あまり', option_b: 'ぜんぜん', option_c: 'ときどき', option_d: 'いつも',
    correct_option: 'C', marks: 5,
    explanation: 'たまに飲む頻度を表す副詞は「ときどき（C）」です。',
    image_url: '/images/jft_paper18/p18_page_07_img_13.png', audio_url: null
  },
  {
    order_num: 28, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(28)に最もあてはまるものを選びなさい。\n\nサリ：そうですか。私は一人でさびしいですから、毎晩寝る前に少し飲みます。\nリン：(28)＿＿＿＿＿＿＿＿。',
    option_a: 'どうですか', option_b: 'そうですか', option_c: 'どうしてですか', option_d: 'いいですか',
    correct_option: 'B', marks: 5,
    explanation: '相手の話に相槌を打つ言葉は「そうですか（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 29, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(29)に最もあてはまるものを選びなさい。\n\nパク：リサさんはテニスができますか。\nリサ：(29)＿＿＿＿＿＿＿＿。\nパク：じゃ、今度の土曜日、いっしょにやりませんか。\nリサ：それはいいですね。(30)＿＿＿＿＿＿＿＿。',
    option_a: 'はい、できません', option_b: 'いいえ、できません', option_c: 'ええ、ちょっとできます', option_d: 'ぜんぜんできません',
    correct_option: 'C', marks: 5,
    explanation: '少しできる肯定の返答は「ええ、ちょっとできます（C）」です。',
    image_url: '/images/jft_paper18/p18_page_08_img_14.png', audio_url: null
  },
  {
    order_num: 30, section_name: '会話・文法',
    question_text: '対話を読んで、空欄(30)に最もあてはまるものを選びなさい。\n\nリサ：それはいいですね。(30)＿＿＿＿＿＿＿＿。',
    option_a: 'ぜひやりましょう', option_b: 'ぜひしません', option_c: 'ぜひしました', option_d: 'やりたくないです',
    correct_option: 'A', marks: 5,
    explanation: '誘いに対して強く賛同する表現は「ぜひやりましょう（A）」です。',
    image_url: '/images/jft_paper18/p18_page_08_img_14.png', audio_url: null
  },

  // --- 聴解 (Q31-45) ---
  {
    order_num: 31, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\nシンさんの趣味は何ですか。\n[ a: コイン集め, b: サッカー観戦, c: お菓子作り, d: 外国語学習 ]',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'B', marks: 5,
    explanation: 'シンさんの趣味は「サッカーの試合を見ること（b - B）」です。',
    image_url: '/images/jft_paper18/p18_page_09_img_16.png', audio_url: '/audio/jft_paper18/jft18_q31_q33.mp3'
  },
  {
    order_num: 32, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\nヤンさんの趣味は何ですか。\n[ a: コイン集め, b: サッカー観戦, c: お菓子作り, d: 外国語学習 ]',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'A', marks: 5,
    explanation: 'ヤンさんの趣味は「外国のコインを集めること（a - A）」です。',
    image_url: '/images/jft_paper18/p18_page_09_img_17.png', audio_url: '/audio/jft_paper18/jft18_q31_q33.mp3'
  },
  {
    order_num: 33, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\nよしださんのもっと好きな趣味は何ですか。\n[ a: コイン集め, b: サッカー観戦, c: お菓子作り, d: 外国語学習 ]',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'D', marks: 5,
    explanation: 'よしださんの趣味は「外国語を勉強すること（d - D）」です。',
    image_url: null, audio_url: '/audio/jft_paper18/jft18_q31_q33.mp3'
  },
  {
    order_num: 34, section_name: '聴解',
    question_text: '音声を聴いて、どの質問の答えか選びなさい。\n\n「料理を作ります。」',
    option_a: 'a : 暇なとき何をしますか', option_b: 'b : 得意な料理は何ですか', option_c: 'c : 忙しいとき残業しますか', option_d: 'd : どんな映画が好きですか',
    correct_option: 'A', marks: 5,
    explanation: '「暇なとき何をしますか」に対する答えなので「a（A）」です。',
    image_url: '/images/jft_paper18/p18_page_10_img_18.png', audio_url: '/audio/jft_paper18/jft18_q34_q38.mp3'
  },
  {
    order_num: 35, section_name: '聴解',
    question_text: '音声を聴いて、どの質問の答えか選びなさい。\n\n「ホラー映画が好きです。」',
    option_a: 'a : 暇なとき何をしますか', option_b: 'b : 得意な料理は何ですか', option_c: 'c : 忙しいとき残業しますか', option_d: 'd : どんな映画が好きですか',
    correct_option: 'D', marks: 5,
    explanation: '「どんな映画が好きですか」に対する答えなので「d（D）」です。',
    image_url: '/images/jft_paper18/p18_page_10_img_18.png', audio_url: '/audio/jft_paper18/jft18_q34_q38.mp3'
  },
  {
    order_num: 36, section_name: '聴解',
    question_text: '音声を聴いて、どの質問の答えか選びなさい。\n\n「カレーと焼きそばです。」',
    option_a: 'a : 暇なとき何をしますか', option_b: 'b : 得意な料理は何ですか', option_c: 'c : 忙しいとき残業しますか', option_d: 'd : どんな映画が好きですか',
    correct_option: 'B', marks: 5,
    explanation: '「得意な料理は何ですか」に対する答えなので「b（B）」です。',
    image_url: '/images/jft_paper18/p18_page_10_img_18.png', audio_url: '/audio/jft_paper18/jft18_q34_q38.mp3'
  },
  {
    order_num: 37, section_name: '聴解',
    question_text: '音声を聴いて、どの質問の答えか選びなさい。\n\n「はい、ときどきします。」',
    option_a: 'a : 暇なとき何をしますか', option_b: 'b : 得意な料理は何ですか', option_c: 'c : 忙しいとき残業しますか', option_d: 'd : どんな映画が好きですか',
    correct_option: 'C', marks: 5,
    explanation: '「忙しいとき残業をしますか」に対する答えなので「c（C）」です。',
    image_url: '/images/jft_paper18/p18_page_10_img_18.png', audio_url: '/audio/jft_paper18/jft18_q34_q38.mp3'
  },
  {
    order_num: 38, section_name: '聴解',
    question_text: '音声を聴いて、どの質問の答えか選びなさい。\n\n「いいえ、あまりしませんでした。」',
    option_a: 'a : 暇なとき何をしますか', option_b: 'b : 得意な料理は何ですか', option_c: 'c : 忙しいとき残業しますか', option_d: 'e : 学生のとき旅行をしましたか',
    correct_option: 'D', marks: 5,
    explanation: '「学生のときよく旅行をしましたか」に対する答えなので「e（D）」です。',
    image_url: '/images/jft_paper18/p18_page_10_img_18.png', audio_url: '/audio/jft_paper18/jft18_q34_q38.mp3'
  },
  {
    order_num: 39, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n①の人はどの季節が好きですか。',
    option_a: 'a : 春', option_b: 'b : 夏', option_c: 'c : 秋', option_d: 'd : 冬',
    correct_option: 'D', marks: 5,
    explanation: '冬が好きなので「d（D）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },
  {
    order_num: 40, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n①の人：どうしてですか。',
    option_a: 'e : スキーができるから', option_b: 'f : くだものがおいしいから', option_c: 'g : ながい休みがあるから', option_d: 'h : さむいのがにがてだから',
    correct_option: 'A', marks: 5,
    explanation: 'スキーができるからなので「e（A）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },
  {
    order_num: 41, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n②の人はどの季節が好きですか。',
    option_a: 'a : 春', option_b: 'b : 夏', option_c: 'c : 秋', option_d: 'd : 冬',
    correct_option: 'B', marks: 5,
    explanation: '夏が好きなので「b（B）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },
  {
    order_num: 42, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n②の人：どうしてですか。',
    option_a: 'e : スキーができるから', option_b: 'f : くだものがおいしいから', option_c: 'g : ながい休みがあるから', option_d: 'h : さむいのがにがてだから',
    correct_option: 'C', marks: 5,
    explanation: '長い休みがあるからなので「g（C）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },
  {
    order_num: 43, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n③の人はどの季節が好きですか。',
    option_a: 'a : 春', option_b: 'b : 夏', option_c: 'c : 秋', option_d: 'd : 冬',
    correct_option: 'C', marks: 5,
    explanation: '秋が好きなので「c（C）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },
  {
    order_num: 44, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n③の人：どうしてですか。',
    option_a: 'e : スキーができるから', option_b: 'f : くだものがおいしいから', option_c: 'g : ながい休みがあるから', option_d: 'h : さむいのがにがてだから',
    correct_option: 'B', marks: 5,
    explanation: 'くだものがおいしいからなので「f（B）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },
  {
    order_num: 45, section_name: '聴解',
    question_text: '音声を聴いて、質問に答えなさい。\n\n④の人はどの季節が好きですか。どうしてですか。',
    option_a: 'c・e', option_b: 'c・f', option_c: 'c・g', option_d: 'c・h',
    correct_option: 'D', marks: 5,
    explanation: '秋が好きで、寒いのが苦手だから「c・h（D）」です。',
    image_url: '/images/jft_paper18/p18_page_11_img_19.png', audio_url: '/audio/jft_paper18/jft18_q39_q45.mp3'
  },

  // --- 読解 (Q46-60) ---
  {
    order_num: 46, section_name: '読解',
    question_text: '結婚式の文章を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nけいこさんはウェディングドレスを着ました。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「はじめに、花嫁はウェディングドレスを着ました」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_13_img_20.png', audio_url: null
  },
  {
    order_num: 47, section_name: '読解',
    question_text: '結婚式の文章を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\n広い部屋で結婚式が30分ぐらいありました。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '結婚式が終わってから広い部屋でパーティーをしたので「×（B）」です。',
    image_url: '/images/jft_paper18/p18_page_13_img_20.png', audio_url: null
  },
  {
    order_num: 48, section_name: '読解',
    question_text: '結婚式の文章を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\n二人は新婚旅行にアメリカへ行きました。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「ハワイへ新婚旅行に行きました」とありハワイはアメリカなので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_13_img_20.png', audio_url: null
  },
  {
    order_num: 49, section_name: '読解',
    question_text: '結婚式の文章を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\n神主さんの前で結婚しました。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「神主さんの前で二人は結婚式をしました」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_13_img_20.png', audio_url: null
  },
  {
    order_num: 50, section_name: '読解',
    question_text: '結婚式の文章を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nフランス料理を食べました。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「みんなはフランス料理を食べながら」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_13_img_20.png', audio_url: null
  },
  {
    order_num: 51, section_name: '読解',
    question_text: '結婚式の文章を読んで、質問に答えなさい。\n\n神主さんはどうしてホテルに来ましたか。',
    option_a: 'いとうさんたちがパーティーにしょうたいしたからです。', option_b: 'ホテルには神主さんがいなかったからです。', option_c: 'けいこさんは神社で働いていたからです。', option_d: 'ホテルで泊まるため',
    correct_option: 'B', marks: 5,
    explanation: '神社から神主さんがホテルへ来て式を執り行ったため「B」が正解です。',
    image_url: '/images/jft_paper18/p18_page_13_img_20.png', audio_url: null
  },
  {
    order_num: 52, section_name: '読解',
    question_text: 'メールを読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nルパさんとあべさんはパーティーで会いました。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「このあいだパーティーに行って新しい友だちができました」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_14_img_21.png', audio_url: null
  },
  {
    order_num: 53, section_name: '読解',
    question_text: 'メールを読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nあべさんは新しい友達と韓国に旅行に行きたいです。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '韓国旅行ではなく韓国料理の食事に行こうと誘っているので「×（B）」です。',
    image_url: '/images/jft_paper18/p18_page_14_img_21.png', audio_url: null
  },
  {
    order_num: 54, section_name: '読解',
    question_text: 'メールを読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nキムさんの趣味はJポップです。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「ルパさんのしゅみはJポップで、キムさんとおなじです」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_14_img_21.png', audio_url: null
  },
  {
    order_num: 55, section_name: '読解',
    question_text: 'メールを読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nキムさんは中村さんに会ったことがあります。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '「中村さんはちょっとまじめそうですね。私も2人と話してみたいです」とあり未対面なので「×（B）」です。',
    image_url: '/images/jft_paper18/p18_page_14_img_21.png', audio_url: null
  },
  {
    order_num: 56, section_name: '読解',
    question_text: 'メールを読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nキムさんはあべさんたちと食事に行きたいです。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「安くておいしいレストランを知っていますよ」と前向きに応えているので「〇（A）」です。',
    image_url: '/images/jft_paper18/p18_page_14_img_21.png', audio_url: null
  },
  {
    order_num: 57, section_name: '読解',
    question_text: 'メールを読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\n中村さんは毎月旅行へ行きます。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '旅行会社で働いているのであって毎月旅行に行くとは書かれていないため「×（B）」です。',
    image_url: '/images/jft_paper18/p18_page_14_img_21.png', audio_url: null
  },
  {
    order_num: 58, section_name: '読解',
    question_text: 'メニューを見て、一番いい料理を選びなさい。\n\nかわいさん：アレルギーがあるのでえびとかにが食べられません。肉は何でもだいじょうぶです。一番好きなのは牛肉です。少し食べたいです。',
    option_a: 'a : かにと生野菜のサラダ', option_b: 'b : テリヤキチキン', option_c: 'c : エビフライ', option_d: 'e : ビーフステーキ(120g)',
    correct_option: 'D', marks: 5,
    explanation: '牛肉120gの「ビーフステーキ（e - D）」が最も合致します。',
    image_url: '/images/jft_paper18/p18_page_16_img_22.png', audio_url: null
  },
  {
    order_num: 59, section_name: '読解',
    question_text: 'メニューを見て、一番いい料理を選びなさい。\n\nキムさん：肉やフライはあまり食べたくないです。体にやさしくてあたたかいものがいいです。',
    option_a: 'c : エビフライ', option_b: 'd : ビーフステーキ(300g)', option_c: 'e : ビーフステーキ(120g)', option_d: 'f : 卵のスープ',
    correct_option: 'D', marks: 5,
    explanation: '温かいスープである「卵のスープ（f - D）」が最も合致します。',
    image_url: '/images/jft_paper18/p18_page_16_img_22.png', audio_url: null
  },
  {
    order_num: 60, section_name: '読解',
    question_text: 'メニューを見て、一番いい料理を選びなさい。\n\nさいとうさん：おなかがすいています。えびや魚が好きです。今日は昼にエビフライを食べたので、ほかのものが食べたいです。',
    option_a: 'a : かにと生野菜のサラダ', option_b: 'b : テリヤキチキン', option_c: 'c : エビフライ', option_d: 'e : ビーフステーキ(120g)',
    correct_option: 'A', marks: 5,
    explanation: 'エビフライ以外の魚介料理である「かにと生野菜のサラダ（a - A）」が最も合致します。',
    image_url: '/images/jft_paper18/p18_page_16_img_22.png', audio_url: null
  }
];

async function seedJftModelPaper18() {
  console.log('Seeding JFT-Basic Official Model Paper 18 (60 Questions, Pass 200/250)...');
  try {
    let exam = await db.query.get("SELECT * FROM exams WHERE (title LIKE '%Model Paper 18%' OR title LIKE '%Paper 18%') AND course_id = 1");
    let examId;
    if (exam) {
      examId = exam.id;
      const countRes = await db.query.get("SELECT COUNT(*) as count FROM questions WHERE exam_id = ?", [examId]);
      if (countRes && countRes.count >= 60) {
        await db.query.run('UPDATE exams SET duration_minutes = 60, passing_score = 200, is_active = 1 WHERE id = ?', [examId]);
        await db.query.run('UPDATE questions SET marks = 1 WHERE exam_id = ? AND order_num >= 1 AND order_num <= 5', [examId]);
        await db.query.run('UPDATE questions SET marks = 2 WHERE exam_id = ? AND order_num >= 6 AND order_num <= 15', [examId]);
        await db.query.run('UPDATE questions SET marks = 5 WHERE exam_id = ? AND order_num >= 16 AND order_num <= 60', [examId]);
        return;
      }
      await db.query.run('DELETE FROM questions WHERE exam_id = ?', [examId]);
      await db.query.run(`
        UPDATE exams 
        SET course_id = 1,
            title = '${title}',
            description = 'Official JFT-Basic Prometric Computer-Based Examination Paper 18 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Authentic Japanese Prometric Format)',
            duration_minutes = 60,
            passing_score = 200,
            is_active = 1
        WHERE id = ?
      `, [examId]);
    } else {
      const res = await db.query.run(`
        INSERT INTO exams (course_id, title, description, duration_minutes, passing_score, is_active)
        VALUES (
          1,
          '${title}',
          'Official JFT-Basic Prometric Computer-Based Examination Paper 18 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Authentic Japanese Prometric Format)',
          60,
          200,
          1
        )
      `);
      examId = res.id;
    }

    for (const q of p18Questions) {
      await db.query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text, question_type,
          image_url, audio_url,
          option_a, option_b, option_c, option_d,
          correct_option, marks, explanation, order_num
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        examId, q.section_name, q.question_text, 'multiple_choice',
        q.image_url, q.audio_url,
        q.option_a, q.option_b, q.option_c, q.option_d,
        q.correct_option, q.marks, q.explanation, q.order_num
      ]);
    }
    console.log(`Successfully seeded Model Paper 18!`);
  } catch (err) {
    console.error('Error seeding Model Paper 18:', err);
    throw err;
  }
}

if (require.main === module) {
  seedJftModelPaper18().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedJftModelPaper18;
