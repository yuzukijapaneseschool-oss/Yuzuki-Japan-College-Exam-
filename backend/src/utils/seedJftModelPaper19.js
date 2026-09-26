const path = require('path');
const db = require(path.resolve(__dirname, '../config/database'));

const p19Questions = [
  // --- 文字・語彙 (Q1-15) ---
  {
    order_num: 1, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。\n\nとうふにしょうゆを＿＿＿＿＿＿＿＿。',
    option_a: 'かけます', option_b: 'いれます', option_c: 'つけます', option_d: 'ぬります',
    correct_option: 'A', marks: 1,
    explanation: '調味料を上からかける動作は「かけます（A）」です。',
    image_url: '/images/jft_paper19/p19_page_01_img_1.png', audio_url: null
  },
  {
    order_num: 2, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。\n\n野菜にマヨネーズを＿＿＿＿＿＿＿＿。',
    option_a: 'かけます', option_b: 'いれます', option_c: 'つけます', option_d: 'やきます',
    correct_option: 'A', marks: 1,
    explanation: 'マヨネーズを野菜にかける動作は「かけます（A）」です。',
    image_url: '/images/jft_paper19/p19_page_01_img_2.png', audio_url: null
  },
  {
    order_num: 3, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。\n\nコーヒーにミルクを＿＿＿＿＿＿＿＿。',
    option_a: 'かけます', option_b: 'いれます', option_c: 'ぬります', option_d: 'やきます',
    correct_option: 'B', marks: 1,
    explanation: '液体の中に注ぎ入れる動作は「いれます（入れます - B）」です。',
    image_url: '/images/jft_paper19/p19_page_02_img_3.png', audio_url: null
  },
  {
    order_num: 4, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。\n\nパンにバターを＿＿＿＿＿＿＿＿。',
    option_a: 'やけます', option_b: 'ぬります', option_c: 'かけます', option_d: 'いれます',
    correct_option: 'B', marks: 1,
    explanation: 'パンの表面にバターを広げる動作は「ぬります（塗ります - B）」です。',
    image_url: '/images/jft_paper19/p19_page_02_img_4.png', audio_url: null
  },
  {
    order_num: 5, section_name: '文字・語彙',
    question_text: '絵を見て正しい言葉をえらびなさい。\n\n魚を＿＿＿＿＿＿＿＿。',
    option_a: 'やきます', option_b: 'かけます', option_c: 'ぬります', option_d: 'いれます',
    correct_option: 'A', marks: 1,
    explanation: '魚を加熱調理する動作は「焼きます（やきます - A）」です。',
    image_url: '/images/jft_paper19/p19_page_02_img_5.png', audio_url: null
  },
  {
    order_num: 6, section_name: '文字・語彙',
    question_text: '関係がある言葉を選びなさい。\n\nからい',
    option_a: 'とうがらし', option_b: 'しお', option_c: 'さとう', option_d: 'す',
    correct_option: 'A', marks: 2,
    explanation: '辛い味の調味料は「とうがらし（唐辛子 - A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 7, section_name: '文字・語彙',
    question_text: '関係がある言葉を選びなさい。\n\nあまい',
    option_a: 'しお', option_b: 'さとう', option_c: 'レモン', option_d: 'しょうゆ',
    correct_option: 'B', marks: 2,
    explanation: '甘い味の調味料は「さとう（砂糖 - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 8, section_name: '文字・語彙',
    question_text: '関係がある言葉を選びなさい。\n\nすっぱい',
    option_a: 'しお', option_b: 'さとう', option_c: 'レモン', option_d: 'みず',
    correct_option: 'C', marks: 2,
    explanation: '酸っぱい味の果物は「レモン（C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 9, section_name: '文字・語彙',
    question_text: '関係がある言葉を選びなさい。\n\nしょっぱい',
    option_a: 'とうがらし', option_b: 'しお', option_c: 'くすり', option_d: 'さとう',
    correct_option: 'B', marks: 2,
    explanation: '塩辛い味の調味料は「しお（塩 - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 10, section_name: '文字・語彙',
    question_text: '関係がある言葉を選びなさい。\n\nにがい',
    option_a: 'とうがらし', option_b: 'くすり', option_c: 'さとう', option_d: 'レモン',
    correct_option: 'B', marks: 2,
    explanation: '苦い味のものは「くすり（薬 - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 11, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\n私はコンピューターの<u>会社</u>ではたらいています。',
    option_a: 'かうしゃ', option_b: 'かいしゃ', option_c: 'かあいしゃ', option_d: 'かいじゃ',
    correct_option: 'B', marks: 2,
    explanation: '「会社」の正しい読み方は「かいしゃ（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 12, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\nらいしゅう、東京の<u>本社</u>からシドニー支社に出張します。',
    option_a: 'ぼんしゃかい', option_b: 'ほんしゃかい', option_c: 'ほんしゃ', option_d: 'ほんじゃ',
    correct_option: 'C', marks: 2,
    explanation: '「本社」の正しい読み方は「ほんしゃ（C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 13, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\nらいしゅう、東京の本社からシドニー<u>支社</u>に出張します。',
    option_a: 'しいしゃ', option_b: 'ししゃ', option_c: 'じしゃ', option_d: 'しじゃ',
    correct_option: 'B', marks: 2,
    explanation: '「支社」の正しい読み方は「ししゃ（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 14, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\nらいしゅう、東京の本社からシドニー支社に<u>出張</u>します。',
    option_a: 'しゅっちょう', option_b: 'しゅうちょう', option_c: 'しゅちょう', option_d: 'すっちょう',
    correct_option: 'A', marks: 2,
    explanation: '「出張」の正しい読み方は「しゅっちょう（A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 15, section_name: '文字・語彙',
    question_text: '下線の漢字はどう読みますか。正しいものを選びなさい。\n\nシドニー支社の人が<u>空港</u>にむかえに来ます。',
    option_a: 'えき', option_b: 'くうこう', option_c: 'そらみなと', option_d: 'こうくう',
    correct_option: 'B', marks: 2,
    explanation: '「空港」の正しい読み方は「くうこう（B）」です。',
    image_url: null, audio_url: null
  },

  // --- 会話・文法 (Q16-30) ---
  {
    order_num: 16, section_name: '会話・文法',
    question_text: '文を読んで、空欄(16)に最もあてはまるものを選びなさい。\n\n私は日本に来て、5年 (16) ＿＿＿＿ なります。日本での生活はとても楽しいです。だんだん生活になれてきました。はじめはいろいろな大変なこともありましたが、今は大丈夫です。',
    option_a: 'を', option_b: 'に', option_c: 'が', option_d: 'で',
    correct_option: 'B', marks: 5,
    explanation: '時間の経過を表す表現は「〜になります（5年になります - B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 17, section_name: '会話・文法',
    question_text: '文を読んで、空欄(17)に最もあてはまるものを選びなさい。\n\n日本 (17) ＿＿＿＿ の生活はとても楽しいです。',
    option_a: 'を', option_b: 'は', option_c: 'で', option_d: 'に',
    correct_option: 'C', marks: 5,
    explanation: '場所における生活を表す助詞は「で（日本での生活 - C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 18, section_name: '会話・文法',
    question_text: '文を読んで、空欄(18)に最もあてはまるものを選びなさい。\n\nだんだん生活 (18) ＿＿＿＿ なれてきました。',
    option_a: 'に', option_b: 'を', option_c: 'で', option_d: 'へ',
    correct_option: 'A', marks: 5,
    explanation: '慣れる対象を表す助詞は「に（生活になれてきました - A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 19, section_name: '会話・文法',
    question_text: '文を読んで、空欄(19)に最もあてはまるものを選びなさい。\n\nはじめ (19) ＿＿＿＿ いろいろな大変なことがありましたが、今は大丈夫です。',
    option_a: 'は', option_b: 'に', option_c: 'で', option_d: 'を',
    correct_option: 'B', marks: 5,
    explanation: '時・時点を表す表現は「はじめに（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 20, section_name: '会話・文法',
    question_text: '文を読んで、空欄(20)に最もあてはまるものを選びなさい。\n\nはじめはいろいろな大変なこと (20) ＿＿＿＿ ありましたが、今は大丈夫です。',
    option_a: 'も', option_b: 'で', option_c: 'が', option_d: 'に',
    correct_option: 'C', marks: 5,
    explanation: '存在（あります）の主語を表す助詞は「が（大変なことがありました - C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 21, section_name: '会話・文法',
    question_text: '会話を読んで、空欄(21)に最もあてはまるものを選びなさい。\n\nジョイ：よしださんは (21) ＿＿＿＿。\nよしだ：東京です。\nジョイ：そうですか。いいところですね。\nよしだ：ええ。',
    option_a: 'どこに住んでいますか', option_b: 'どこで働いていますか', option_c: 'どこで生んでいますか', option_d: 'どこに行きますか',
    correct_option: 'A', marks: 5,
    explanation: '居住地を尋ねる質問は「どこに住んでいますか（A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 22, section_name: '会話・文法',
    question_text: '会話を読んで、空欄(22)に最もあてはまるものを選びなさい。\n\nジョイ：(22) ＿＿＿＿。\nよしだ：会社員です。電車の会社で働いています。\nジョイ：そうですか。',
    option_a: 'お国はなんですか', option_b: 'おいくつですか', option_c: 'お仕事は何ですか', option_d: 'お名前は何ですか',
    correct_option: 'C', marks: 5,
    explanation: '職業を尋ねる表現は「お仕事は何ですか（C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 23, section_name: '会話・文法',
    question_text: '会話を読んで、空欄に最もあてはまるものを選びなさい。\n\nＡ：今日はさむかったですね。\nＢ：ええ、＿＿＿＿。',
    option_a: '雪がよくふらなかったね', option_b: '雪がよくふりましたね', option_c: '雪がよくふらないそうね', option_d: '雪があまりふりませんでしたね',
    correct_option: 'B', marks: 5,
    explanation: '寒かったことに同意し、過去の事実を述べる「雪がよくふりましたね（B）」が適切です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 24, section_name: '会話・文法',
    question_text: '会話を読んで、空欄に最もあてはまるものを選びなさい。\n\nＡ：今週は毎日天気がいいですね。\nＢ：ええ、＿＿＿＿ね。',
    option_a: 'あたたかくなかったです', option_b: 'あたたかかったです', option_c: 'あたたかいです', option_d: 'さむかったです',
    correct_option: 'B', marks: 5,
    explanation: '今週の好天を受けて同意する過去形の表現「あたたかかったです（B）」が適切です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 25, section_name: '会話・文法',
    question_text: '会話を読んで、空欄に最もあてはまるものを選びなさい。\n\nＡ：昨日たいふうは＿＿＿＿ね。\nＢ：ええ、雨と風がつよかったね。',
    option_a: '大変くかった', option_b: '大変だった', option_c: '大変なだった', option_d: '大変でしたくない',
    correct_option: 'B', marks: 5,
    explanation: 'ナ形容詞の過去普通形は「大変だった（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 26, section_name: '会話・文法',
    question_text: '会話を読んで、空欄(26)に最もあてはまるものを選びなさい。\n\nＡ：明日午前は雨ですか。(26) ＿＿＿＿ か。\nＢ：いいえ、午前は雨ではないよ。でも午後は (27) ＿＿＿＿。',
    option_a: '雨です', option_b: '雨じゃない', option_c: '雨だった', option_d: '雨でした',
    correct_option: 'A', marks: 5,
    explanation: '丁寧な疑問文を作る「雨ですか（雨です - A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 27, section_name: '会話・文法',
    question_text: '会話を読んで、空欄(27)に最もあてはまるものを選びなさい。\n\nＢ：いいえ、午前は雨ではないよ。でも午後は (27) ＿＿＿＿。',
    option_a: 'ふります', option_b: 'ふりたいです', option_c: 'ふらないそうです', option_d: 'ふりませんでした',
    correct_option: 'A', marks: 5,
    explanation: '午後に雨が降るという未来の事実を述べる「ふります（A）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 28, section_name: '会話・文法',
    question_text: '会話を読んで、空欄に最もあてはまるものを選びなさい。\n\nＡ：見てください。今日はほしがたくさん＿＿＿＿よ。\nＢ：はい、きれいですね。',
    option_a: '出ていない', option_b: '出ていません', option_c: '出ています', option_d: '出ませんでした',
    correct_option: 'C', marks: 5,
    explanation: '現在星が見えている状態を表す「出ています（C）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 29, section_name: '会話・文法',
    question_text: '会話を読んで、空欄(29)に最もあてはまるものを選びなさい。\n\nＡ：今日は空が (29) ＿＿＿＿ ね。\nＢ：はい。でも、明日はたぶん (30) ＿＿＿＿ よ。',
    option_a: 'いそぐ', option_b: 'くもっています', option_c: 'いそがない', option_d: 'あれています',
    correct_option: 'B', marks: 5,
    explanation: '空の様子を表す表現は「くもっています（B）」です。',
    image_url: null, audio_url: null
  },
  {
    order_num: 30, section_name: '会話・文法',
    question_text: '会話を読んで、空欄(30)に最もあてはまるものを選びなさい。\n\nＢ：はい。でも、明日はたぶん (30) ＿＿＿＿ よ。',
    option_a: '晴れました', option_b: '晴れます', option_c: '晴れています', option_d: '晴れないでした',
    correct_option: 'B', marks: 5,
    explanation: '明日の天気を予想する表現は「晴れます（B）」です。',
    image_url: null, audio_url: null
  },

  // --- 聴解 (Q31-45) ---
  {
    order_num: 31, section_name: '聴解',
    question_text: 'カールさんから絵はがきが届きました。天気を見て日付を選びなさい。\n\n①「あさ、新幹線で京都に来ました。雨がふっていました。でも、あまりさむくなかったです。私はまちをゆっくり散歩しました。」',
    option_a: 'a: 5月11日 (木)', option_b: 'b: 5月12日 (金)', option_c: 'c: 5月13日 (土)', option_d: 'd: 5月14日 (日)',
    correct_option: 'A', marks: 5,
    explanation: '朝から雨が降っていた日は「5月11日（木 - A）」です。',
    image_url: '/images/jft_paper19/p19_page_10_img_13.png',
    audio_url: '/audio/jft_paper19/jft19_q31_q33.mp3'
  },
  {
    order_num: 32, section_name: '聴解',
    question_text: 'カールさんから絵はがきが届きました。天気を見て日付を選びなさい。\n\n②「今日は午前中くもりでした。でも、午後いい天気になりました。そして、あたたかくなりました。私はお寺を見に行きました。きれいでした！」',
    option_a: 'a: 5月11日 (木)', option_b: 'b: 5月12日 (金)', option_c: 'c: 5月13日 (土)', option_d: 'd: 5月14日 (日)',
    correct_option: 'C', marks: 5,
    explanation: '午前が曇りで午後から晴れて暖かくなった日は「5月13日（土 - C）」です。',
    image_url: '/images/jft_paper19/p19_page_10_img_14.png',
    audio_url: '/audio/jft_paper19/jft19_q31_q33.mp3'
  },
  {
    order_num: 33, section_name: '聴解',
    question_text: 'カールさんから絵はがきが届きました。天気を見て日付を選びなさい。\n\n③「今日はくもっていました。ときどき雨もふりました。私は博物館に行きました。とてもおもしろかったです。」',
    option_a: 'a: 5月11日 (木)', option_b: 'b: 5月12日 (金)', option_c: 'c: 5月13日 (土)', option_d: 'd: 5月14日 (日)',
    correct_option: 'B', marks: 5,
    explanation: '曇りのち雨（ときどき雨）の日は「5月12日（金 - B）」です。',
    image_url: '/images/jft_paper19/p19_page_11_img_15.png',
    audio_url: '/audio/jft_paper19/jft19_q31_q33.mp3'
  },
  {
    order_num: 34, section_name: '聴解',
    question_text: 'ワンさんは二人の友達とうえのについて話しています。音声を聞いて、場所の説明にあてはまるものを選びなさい。\n\n① 上野公園',
    option_a: 'a: おおきいです', option_b: 'b: おもしろいです', option_c: 'c: ひろいです', option_d: 'd: ふるいまちです',
    correct_option: 'C', marks: 5,
    explanation: '上野公園についての説明は「ひろいです（c - C）」です。',
    image_url: '/images/jft_paper19/p19_page_12_img_17.png',
    audio_url: '/audio/jft_paper19/jft19_q34_q37.mp3'
  },
  {
    order_num: 35, section_name: '聴解',
    question_text: 'ワンさんは二人の友達とうえのについて話しています。音声を聞いて、場所の説明にあてはまるものを選びなさい。\n\n② アメ横',
    option_a: 'a・e (おおきいです・べんりです)', option_b: 'b・e (おもしろいです・べんりです)', option_c: 'e・f (べんりです・安いです)', option_d: 'd・f (ふるいまちです・安いです)',
    correct_option: 'C', marks: 5,
    explanation: 'アメ横についての説明は「べんりです・安いです（e・f - C）」です。',
    image_url: '/images/jft_paper19/p19_page_12_img_18.png',
    audio_url: '/audio/jft_paper19/jft19_q34_q37.mp3'
  },
  {
    order_num: 36, section_name: '聴解',
    question_text: 'ワンさんは二人の友達とうえのについて話しています。音声を聞いて、場所の説明にあてはまるものを選びなさい。\n\n③ 上野駅',
    option_a: 'a: おおきいです', option_b: 'b: おもしろいです', option_c: 'c: ひろいです', option_d: 'd: ふるいまちです',
    correct_option: 'A', marks: 5,
    explanation: '上野駅についての説明は「おおきいです（a - A）」です。',
    image_url: '/images/jft_paper19/p19_page_13_img_19.png',
    audio_url: '/audio/jft_paper19/jft19_q34_q37.mp3'
  },
  {
    order_num: 37, section_name: '聴解',
    question_text: 'ワンさんは二人の友達とうえのについて話しています。音声を聞いて、場所の説明にあてはまるものを選びなさい。\n\n④ 下町・古い町並み',
    option_a: 'a・b (おおきいです・おもしろいです)', option_b: 'b・c (おもしろいです・ひろいです)', option_c: 'c・f (ひろいです・安いです)', option_d: 'd・b (ふるいまちです・おもしろいです)',
    correct_option: 'D', marks: 5,
    explanation: '古い町並みについての説明は「ふるいまちです・おもしろいです（d・b - D）」です。',
    image_url: '/images/jft_paper19/p19_page_13_img_20.png',
    audio_url: '/audio/jft_paper19/jft19_q34_q37.mp3'
  },
  {
    order_num: 38, section_name: '聴解',
    question_text: '音声を聞いて、感想にあてはまるものを選びなさい。\n\n① 富士山',
    option_a: 'a: おもしろいです', option_b: 'b: さむいです', option_c: 'c: たのしいです', option_d: 'd: とおいです',
    correct_option: 'B', marks: 5,
    explanation: '富士山についての感想は「さむいです（b - B）」です。',
    image_url: '/images/jft_paper19/p19_page_14_img_22.png',
    audio_url: '/audio/jft_paper19/jft19_q38_q41.mp3'
  },
  {
    order_num: 39, section_name: '聴解',
    question_text: '音声を聞いて、感想にあてはまるものを選びなさい。\n\n② 賑やかな街',
    option_a: 'a: おもしろいです', option_b: 'b: さむいです', option_c: 'c: たのしいです', option_d: 'd: とおいです',
    correct_option: 'C', marks: 5,
    explanation: '賑やかな街についての感想は「たのしいです（c - C）」です。',
    image_url: '/images/jft_paper19/p19_page_14_img_23.png',
    audio_url: '/audio/jft_paper19/jft19_q38_q41.mp3'
  },
  {
    order_num: 40, section_name: '聴解',
    question_text: '音声を聞いて、感想にあてはまるものを選びなさい。\n\n③ お台場・夜景',
    option_a: 'a: おもしろいです', option_b: 'b: さむいです', option_c: 'c: たのしいです', option_d: 'd: とおいです',
    correct_option: 'A', marks: 5,
    explanation: 'お台場の夜景についての感想は「おもしろいです（a - A）」です。',
    image_url: '/images/jft_paper19/p19_page_15_img_24.png',
    audio_url: '/audio/jft_paper19/jft19_q38_q41.mp3'
  },
  {
    order_num: 41, section_name: '聴解',
    question_text: '音声を聞いて、感想にあてはまるものを選びなさい。\n\n④ 古い町並み',
    option_a: 'a: おもしろいです', option_b: 'b: さむいです', option_c: 'c: たのしいです', option_d: 'd: とおいです',
    correct_option: 'D', marks: 5,
    explanation: '古い町並みについての感想は「とおいです（d - D）」です。',
    image_url: '/images/jft_paper19/p19_page_15_img_25.png',
    audio_url: '/audio/jft_paper19/jft19_q38_q41.mp3'
  },
  {
    order_num: 42, section_name: '聴解',
    question_text: '音声を聞いて、地図の場所を選びなさい。\n\nぎんこうはどこですか。',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'B', marks: 5,
    explanation: '道案内によると銀行は「b（B）」の位置にあります。',
    image_url: '/images/jft_paper19/p19_page_16_img_26.png',
    audio_url: '/audio/jft_paper19/jft19_q42.mp3'
  },
  {
    order_num: 43, section_name: '聴解',
    question_text: '音声を聞いて、地図の場所を選びなさい。\n\nびじゅつかんはどこですか。',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'C', marks: 5,
    explanation: '道案内によると美術館は「c（C）」の位置にあります。',
    image_url: '/images/jft_paper19/p19_page_16_img_26.png',
    audio_url: '/audio/jft_paper19/jft19_q43.mp3'
  },
  {
    order_num: 44, section_name: '聴解',
    question_text: '音声を聞いて、地図の場所を選びなさい。\n\n駅はどこですか。',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'D', marks: 5,
    explanation: '道案内によると駅は「d（D）」の位置にあります。',
    image_url: '/images/jft_paper19/p19_page_16_img_26.png',
    audio_url: '/audio/jft_paper19/jft19_q44.mp3'
  },
  {
    order_num: 45, section_name: '聴解',
    question_text: '音声を聞いて、地図の場所を選びなさい。\n\nデパートはどこですか。',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'A', marks: 5,
    explanation: '道案内によるとデパートは「a（A）」の位置にあります。',
    image_url: '/images/jft_paper19/p19_page_16_img_26.png',
    audio_url: '/audio/jft_paper19/jft19_q45.mp3'
  },

  // --- 読解 (Q46-60) ---
  {
    order_num: 46, section_name: '読解',
    question_text: 'ネットショッピングのサイトを見て答えなさい。\n\nこのサイトで探している商品はどれですか。',
    option_a: 'でんししょうひん', option_b: 'でんしゃしょうしん', option_c: 'てんきしょうひん', option_d: 'しょくりょうひん',
    correct_option: 'A', marks: 5,
    explanation: '掲載されている家電製品はすべて「でんししょうひん（電子商品 - A）」です。',
    image_url: '/images/jft_paper19/p19_page_20_img_27.png', audio_url: null
  },
  {
    order_num: 47, section_name: '読解',
    question_text: 'ネットショッピングのサイトを見て答えなさい。\n\nすいはんきとせんぷうきを買うためにいくらかかりますか。',
    option_a: '29,270円', option_b: '28,270円', option_c: '27,270円', option_d: '26,270円',
    correct_option: 'B', marks: 5,
    explanation: '炊飯器（23,500円）＋扇風機（4,770円）＝「28,270円（B）」です。',
    image_url: '/images/jft_paper19/p19_page_20_img_27.png', audio_url: null
  },
  {
    order_num: 48, section_name: '読解',
    question_text: '有名な場所のノートを読んで答えなさい。\n\n大阪から来た人はどの人といっしょに来ましたか。',
    option_a: '外国人の両親と', option_b: '外国人の友人たちと', option_c: '外国人のりょこうしゃと', option_d: '一人で',
    correct_option: 'B', marks: 5,
    explanation: '小川さんのノートに「外国人の友だちと来ました」とあるので「外国人の友人たちと（B）」です。',
    image_url: '/images/jft_paper19/p19_page_21_img_28.png', audio_url: null
  },
  {
    order_num: 49, section_name: '読解',
    question_text: '有名な場所のノートを読んで答えなさい。\n\n二千十二年十一月に来た人は誰ですか。',
    option_a: 'カタリーナさん', option_b: 'ケルシさん', option_c: '小川さん', option_d: '田中さん',
    correct_option: 'A', marks: 5,
    explanation: '2012年11月3日のノートを書いたのは「カタリーナさん（A）」です。',
    image_url: '/images/jft_paper19/p19_page_21_img_28.png', audio_url: null
  },
  {
    order_num: 50, section_name: '読解',
    question_text: '有名な場所のノートを読んで答えなさい。\n\nカタリーナさんはどう書きましたか。',
    option_a: 'しずかなところだったのできもちがよかった',
    option_b: '日本のもみじがとてもきれいだったから友達にメールで写真をおくりました',
    option_c: 'このところにまた春に来たいです',
    option_d: '外国人の友達と散歩しました',
    correct_option: 'B', marks: 5,
    explanation: 'カタリーナさんのコメント「日本のもみじはとてもきれいです。国のともだちにメールでしゃしんをおくりました」より「B」です。',
    image_url: '/images/jft_paper19/p19_page_21_img_28.png', audio_url: null
  },
  {
    order_num: 51, section_name: '読解',
    question_text: '「マヨラーのへや」を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nマヨトーストの作り方はやいてからマヨネーズをぬります。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '「まず、パンにマヨネーズをぬります。それから、オーブントースターでやきます」とあり、焼く前に塗るので「×（B）」です。',
    image_url: '/images/jft_paper19/p19_page_22_img_29.png', audio_url: null
  },
  {
    order_num: 52, section_name: '読解',
    question_text: '「マヨラーのへや」を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\n日本のマヨネーズはあまいです。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '「日本のマヨネーズはあまりあまくなくておいしいです」とあるので「×（B）」です。',
    image_url: '/images/jft_paper19/p19_page_22_img_29.png', audio_url: null
  },
  {
    order_num: 53, section_name: '読解',
    question_text: '「マヨラーのへや」を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nマヨラーは何でもマヨネーズをかけてたべます。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「何にでもマヨネーズをかけて食べています」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper19/p19_page_22_img_29.png', audio_url: null
  },
  {
    order_num: 54, section_name: '読解',
    question_text: '「マヨラーのへや」を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nアメリカのmayosukiさんはインターネットでマヨネーズを買います。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「いつもインターネットで買って」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper19/p19_page_22_img_29.png', audio_url: null
  },
  {
    order_num: 55, section_name: '読解',
    question_text: '「マヨラーのへや」を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nアメリカのマヨネーズはしおがはいっているのでおいしいです。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'B', marks: 5,
    explanation: '「アメリカのマヨネーズは、さとうが入っているので苦手です」とあるので「×（B）」です。',
    image_url: '/images/jft_paper19/p19_page_22_img_29.png', audio_url: null
  },
  {
    order_num: 56, section_name: '読解',
    question_text: '「マヨラーのへや」を読んで、内容に合っているものに○、ちがっているものに×を選びなさい。\n\nマヨトーストにチーズをのせてやくともっとおいしくなります。',
    option_a: '〇', option_b: '×', option_c: 'どちらでもない', option_d: '書いていない',
    correct_option: 'A', marks: 5,
    explanation: '「チーズをのせてやくと、もっとおいしくなります」とあるので「〇（A）」です。',
    image_url: '/images/jft_paper19/p19_page_22_img_29.png', audio_url: null
  },
  {
    order_num: 57, section_name: '読解',
    question_text: '質問にあうアドバイスを [ a, b, c, d ] から選びなさい。\n\n①「この夏、友だちといっしょに沖縄にダイビングに行きます。どうぐは買ったほうがいいですか。」',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'B', marks: 5,
    explanation: '「借りたほうがいいと思います。買わないほうがいいです」のアドバイス「b（B）」が合致します。',
    image_url: '/images/jft_paper19/p19_page_23_img_30.png', audio_url: null
  },
  {
    order_num: 58, section_name: '読解',
    question_text: '質問にあうアドバイスを [ a, b, c, d ] から選びなさい。\n\n②「沖縄の海でシュノーケリングをしてみたいです。泳ぐのは苦手ですが、しないほうがいいですか。」',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'C', marks: 5,
    explanation: '「もんだいありません。インストラクターがいますから」のアドバイス「c（C）」が合致します。',
    image_url: '/images/jft_paper19/p19_page_23_img_30.png', audio_url: null
  },
  {
    order_num: 59, section_name: '読解',
    question_text: '質問にあうアドバイスを [ a, b, c, d ] から選びなさい。\n\n③「夏休みに沖縄に行きます。ドライブをしたいんですが、車は空港で借りたほうがいいですか。おしえてください。」',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'D', marks: 5,
    explanation: '「それがいいと思います。車をかえすときもらくです」のアドバイス「d（D）」が合致します。',
    image_url: '/images/jft_paper19/p19_page_23_img_30.png', audio_url: null
  },
  {
    order_num: 60, section_name: '読解',
    question_text: '質問にあうアドバイスを [ a, b, c, d ] から選びなさい。\n\n④「ふだんあまり車を運転しません。レンタカーは運転しないほうがいいですか。あぶないですか。」',
    option_a: 'a', option_b: 'b', option_c: 'c', option_d: 'd',
    correct_option: 'A', marks: 5,
    explanation: '「だいじょうぶだと思います。かいがんの近くの道はすいています」のアドバイス「a（A）」が合致します。',
    image_url: '/images/jft_paper19/p19_page_23_img_30.png', audio_url: null
  }
];

async function seedJftModelPaper19() {
  console.log('Seeding JFT-Basic Official Model Paper 19 (60 Questions, Pass 200/250)...');
  const title = 'JFT-Basic Official Model Paper 19 (60 Minutes)';

  try {
    let exam = await db.query.get("SELECT id FROM exams WHERE (title LIKE '%Model Paper 19%' OR title LIKE '%Paper 19%') AND course_id = 1");
    let examId;
    if (exam) {
      examId = exam.id;
      console.log(`Found existing Exam ID: ${examId}, resetting questions...`);
      await db.query.run('DELETE FROM questions WHERE exam_id = ?', [examId]);
      await db.query.run(`
        UPDATE exams 
        SET course_id = 1,
            title = ?,
            description = 'Official JFT-Basic Prometric Computer-Based Examination Paper 19 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
            duration_minutes = 60,
            passing_score = 200,
            is_active = 1
        WHERE id = ?
      `, [title, examId]);
    } else {
      const res = await db.query.run(`
        INSERT INTO exams (course_id, title, description, duration_minutes, passing_score, is_active)
        VALUES (
          1,
          ?,
          'Official JFT-Basic Prometric Computer-Based Examination Paper 19 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
          60,
          200,
          1
        )
      `, [title]);
      examId = res.id;
      console.log(`Created new Exam ID: ${examId}`);
    }

    for (const q of p19Questions) {
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
    console.log(`🎉 SUCCESS: Seeded ${p19Questions.length} questions for Model Paper 19!`);
    return { success: true, examId, count: p19Questions.length };
  } catch (err) {
    console.error('Error seeding Model Paper 19:', err);
    throw err;
  }
}

if (require.main === module) {
  seedJftModelPaper19().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedJftModelPaper19 };

