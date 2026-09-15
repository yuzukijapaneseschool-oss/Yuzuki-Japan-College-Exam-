const { db, query } = require('../config/database');

async function seedJftModelPaper12() {
  console.log('Seeding JFT-Basic Official Model Paper 12 (60 Questions, Pass 200/250)...');

  try {
    let exam = await query.get("SELECT * FROM exams WHERE title LIKE '%Model Paper 12%' OR title LIKE '%Paper 12%'");
    let examId;

    if (exam) {
      examId = exam.id;
      const countRes = await query.get("SELECT COUNT(*) as count FROM questions WHERE exam_id = ?", [examId]);
      if (countRes && countRes.count >= 60) {
        await query.run('UPDATE exams SET duration_minutes = 60, passing_score = 200, is_active = 1 WHERE id = ?', [examId]);
        await query.run('UPDATE questions SET marks = 1 WHERE exam_id = ? AND order_num >= 1 AND order_num <= 5', [examId]);
        await query.run('UPDATE questions SET marks = 2 WHERE exam_id = ? AND order_num >= 6 AND order_num <= 15', [examId]);
        await query.run('UPDATE questions SET marks = 5 WHERE exam_id = ? AND order_num >= 16 AND order_num <= 60', [examId]);
        return;
      }
      console.log(`Found existing Exam ID: ${examId}, resetting questions...`);
      await query.run('DELETE FROM questions WHERE exam_id = ?', [examId]);
      await query.run(`
        UPDATE exams 
        SET course_id = 1,
            title = 'JFT-Basic Official Model Paper 12 (60 Minutes)',
            description = 'Official JFT-Basic Prometric Computer-Based Examination Paper 12 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
            duration_minutes = 60,
            passing_score = 200,
            is_active = 1
        WHERE id = ?
      `, [examId]);
    } else {
      const res = await query.run(`
        INSERT INTO exams (course_id, title, description, duration_minutes, passing_score, is_active)
        VALUES (
          1,
          'JFT-Basic Official Model Paper 12 (60 Minutes)',
          'Official JFT-Basic Prometric Computer-Based Examination Paper 12 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
          60,
          200,
          1
        )
      `);
      examId = res.id;
      console.log(`Created new Exam ID: ${examId}`);
    }

    const questions = [
      // ================= SECTION 1: Script and Vocabulary (Moji & Goi) [Q01 - Q15] =================
      {
        order_num: 1,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n夜空に打ち上げられる光と音のショーは何ですか。',
        image_url: '/images/jft_paper12/jft12_img_01.jpg',
        audio_url: null,
        option_a: 'はなみ',
        option_b: 'はなび',
        option_c: 'はな',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'ගිනිකෙළි සංදර්ශනය ජපන් බසින් "はなび (Hanabi / 花火)" වේ.'
      },
      {
        order_num: 2,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n夏祭りでやぐらの周りをみんなで踊る踊りは何ですか。',
        image_url: '/images/jft_paper12/jft12_img_02.jpg',
        audio_url: null,
        option_a: 'ぼんおどり',
        option_b: 'ぼんよどり',
        option_c: 'ほんぼどり',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'ජපන් සාම්ප්‍රදායික බොන් නැටුම "ぼんおどり (Bon odori / 盆踊り)" වේ.'
      },
      {
        order_num: 3,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\nこいのぼりを飾って子どもの成長を祝う日本の祝日は何ですか。',
        image_url: '/images/jft_paper12/jft12_img_03.jpg',
        audio_url: null,
        option_a: 'たこあげ日',
        option_b: 'ほんぼどり',
        option_c: '子供の日',
        option_d: '',
        correct_option: 'C',
        marks: 1,
        explanation: 'ජපානයේ ළමා දිනය "子供の日 (Kodomo no hi / こどものひ)" වේ.'
      },
      {
        order_num: 4,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n目隠しをして棒ですいかを割るゲームは何ですか。',
        image_url: '/images/jft_paper12/jft12_img_04.jpg',
        audio_url: null,
        option_a: 'すいかわり',
        option_b: 'すいかがり',
        option_c: 'すいか',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'කොමඩු පැලීමේ සාම්ප්‍රදායික ක්‍රීඩාව "すいかわり (Suikawari / 西瓜割り)" වේ.'
      },
      {
        order_num: 5,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n3月3日に女の子の成長を祈る伝統的なお祭りは何ですか。',
        image_url: '/images/jft_paper12/jft12_img_05.jpg',
        audio_url: null,
        option_a: 'すいかわり',
        option_b: 'ぼんおどり',
        option_c: 'ひなまつり',
        option_d: '',
        correct_option: 'C',
        marks: 1,
        explanation: 'බාලිකා බෝනික්කන් උත්සවය "ひなまつり (Hinamatsuri / 雛祭り)" වේ.'
      },
      {
        order_num: 6,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'マリアさんは目____________大きくて、かわいいです。',
        image_url: null,
        audio_url: null,
        option_a: 'の',
        option_b: 'が',
        option_c: 'に',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'ශරීර අංගයක ලක්ෂණයක් විස්තර කිරීමේදී "[අවයවය] + が + විශේෂණය" -> "目が大きくて (ඇස් ලොකුයි)" වේ.'
      },
      {
        order_num: 7,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'タンさんはアメリカ人ですから英語が____________ますよ。',
        image_url: null,
        audio_url: null,
        option_a: 'はなす',
        option_b: 'はなします',
        option_c: 'はなし',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'ක්‍රියාපද Stem "はなし" + ますよ -> "はなしますよ" වේ.'
      },
      {
        order_num: 8,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'あまいもの____________食べていると体によくないですよ。',
        image_url: null,
        audio_url: null,
        option_a: 'ぐらい',
        option_b: 'しか',
        option_c: 'ばかり',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'යමක් පමණක්ම නිතර කිරීම හඟවන "ばかり (Bakari)" යෙදේ -> "あまいものばかり (පැණිරස දේවල්ම)".'
      },
      {
        order_num: 9,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'すみませんが、____________そのまどをしめてください。',
        image_url: null,
        audio_url: null,
        option_a: 'さむくて',
        option_b: 'さむいから',
        option_c: 'さむい',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'හේතුව දක්වා ඉල්ලීමක් කිරීමේදී Plain form + から -> "さむいから (ශීතල නිසා)" නිවැරදි වේ.'
      },
      {
        order_num: 10,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '昨日私はしっぱいをしてせんぱいに____________ました。',
        image_url: null,
        audio_url: null,
        option_a: 'しかられ',
        option_b: 'しからせ',
        option_c: 'しからせられ',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'Passive form (受身形): しかる -> しかられる -> "しかられました (බැනුම් ඇසුවා)" වේ.'
      },
      {
        order_num: 11,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【がっこう】は あした やすみです。',
        image_url: null,
        audio_url: null,
        option_a: '字校',
        option_b: '高校',
        option_c: '学校',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'පාසල හෙවත් "がっこう" සඳහා නිවැරදි කන්ජිය "学校" වේ.'
      },
      {
        order_num: 12,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'がっこうは【あした】やすみです。',
        image_url: null,
        audio_url: null,
        option_a: '昨日',
        option_b: '明日',
        option_c: '今日',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'හෙට හෙවත් "あした" සඳහා නිවැරදි කන්ජිය "明日" වේ.'
      },
      {
        order_num: 13,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'あなたの【ぼご】は何ですか。',
        image_url: null,
        audio_url: null,
        option_a: '母語',
        option_b: '祖母',
        option_c: '祖語',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'මව්භාෂාව හෙවත් "ぼご" සඳහා කන්ජිය "母語" වේ.'
      },
      {
        order_num: 14,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'そふは最近すこし【め】が わるくなりました。',
        image_url: null,
        audio_url: null,
        option_a: '口',
        option_b: '日',
        option_c: '目',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'ඇස හෙවත් "め" සඳහා කන්ජිය "目" වේ.'
      },
      {
        order_num: 15,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'そふは最近すこし 目が【わる】くなりました。',
        image_url: null,
        audio_url: null,
        option_a: '悪く',
        option_b: '電く',
        option_c: '雪く',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'නරක / දුර්වල හෙවත් "わるく" සඳහා කන්ජිය "悪く" වේ.'
      },

      // ================= SECTION 2: Conversation and Grammar (Kaiwa & Bunpou) [Q16 - Q30] =================
      {
        order_num: 16,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【同じ意味の文を選びなさい】\n晩ご飯の前に、くすりを飲んでください。',
        image_url: null,
        audio_url: null,
        option_a: '晩ご飯を食べて、くすりをのみます',
        option_b: '晩ご飯を食べてから、くすりをのみます',
        option_c: 'くすりをのんでから、晩ご飯を食べます',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'රාත්‍රී කෑමට පෙර බෙහෙත් බොන්න යනු බෙහෙත් බී රාත්‍රී කෑම ගැනීමයි (くすりをのんでから、晩ご飯を食べます).'
      },
      {
        order_num: 17,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【同じ意味の文を選びなさい】\n明日もはれるでしょう。',
        image_url: null,
        audio_url: null,
        option_a: '今日ははれています',
        option_b: '明日は雨がふりません',
        option_c: '明日は雨がふります',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: '"明日も (හෙටත්)" යනු අදත් පායලා ඇති බව හඟවයි (今日ははれています).'
      },
      {
        order_num: 18,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【同じ意味の文を選びなさい】\nこの本はおもしろいですが、むずかしいです。',
        image_url: null,
        audio_url: null,
        option_a: 'この本はやさしくないですが、おもしろいです。',
        option_b: 'この本はむずかしくないですが、おもしろいです',
        option_c: 'この本はおもしろくないですが、やさしくないです',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: '"むずかしい (අමාරුයි)" යනු "やさしくない (පහසු නැත)" වේ.'
      },
      {
        order_num: 19,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【同じ意味の文を選びなさい】\nちょっと、手をあらって来ます。',
        image_url: null,
        audio_url: null,
        option_a: 'ちょとおだけ手をあらいます',
        option_b: 'そとで手をあらって、またここに来ます',
        option_c: 'ちょと、あらって行きます。',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: '"〜て来ます" යනු ගොස් යමක් කර නැවත පැමිණීමයි (手をあらって、またここに来ます).'
      },
      {
        order_num: 20,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【同じ意味の文を選びなさい】\n田中さんは私の友達です。',
        image_url: null,
        audio_url: null,
        option_a: '私の友人は田中です',
        option_b: '私の主人は田中です',
        option_c: '田中は私の先生です',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: '"友達 (මිතුරා)" සහ "友人 (යහළුවා)" සමාන අර්ථ දෙයි.'
      },
      {
        order_num: 21,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: (21)______。たいしかんへ行きたいんですが。\nB: たいしかん。あそこに(22)______大きいたてものが見えますね。\nA: はい。\nB: たいしかんはあれです。まっすぐ行ってください。\nA: どうもありがとうございます。\n\n(21)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'すみません',
        option_b: 'しつれいします',
        option_c: 'おかえりなさい',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'මගියෙකුගෙන් පාර විමසීමට පෙර "すみません (සමාවෙන්න)" යොදයි.'
      },
      {
        order_num: 22,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\n(22)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'しろいで',
        option_b: 'しろいに',
        option_c: 'しろくて',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'විශේෂණ පද සම්බන්ධ කිරීම: 白い -> しろくて (සුදු වූත් විශාල වූත්).'
      },
      {
        order_num: 23,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: もうタワーに(23)______か。\nB: いいえ、(24)______。\nA: じゃ、見に行きませんか。夜やけいがきれいですよ。\nB: いいですね。いきましょう。\n\n(23)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'いきませんか',
        option_b: 'いきます',
        option_c: 'いきました',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: '"もう (දැනටමත්)" සමග අතීත කාලය යෙදේ -> "いきましたか (ගියාද?)".'
      },
      {
        order_num: 24,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\n(24)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'まだです',
        option_b: 'もうです',
        option_c: 'あまりです',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'තවම නැත යන්නට "いいえ、まだです" යොදයි.'
      },
      {
        order_num: 25,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: あのう、ちょっとみずを買いたいんですが。\nB: じゃ、食事のあとで店に______。\nA: すみません。\nB: いいえ。',
        image_url: null,
        audio_url: null,
        option_a: 'いきません',
        option_b: 'いきましょう',
        option_c: 'いかない',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'යෝජනා කිරීමේදී "いきましょう (යමු)" යොදයි.'
      },
      {
        order_num: 26,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: 今まで、どんな外国語を勉強しましたか。\nB: 高校の(26)______、スペイン語を勉強しました。\nA: そうですか。スペイン語はどうですか。\nB: スペイン語はぶんぽうはかんたんです。\nA: 今もできますか。\nB: ええ、少しできます。\nA: (27)______。\n\n(26)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'とき',
        option_b: 'へ',
        option_c: 'も',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'කාලය දැක්වීමට "高校のとき (උසස් පාසල් කාලයේදී)" වේ.'
      },
      {
        order_num: 27,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\n(27)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'たいへんですね',
        option_b: 'すごいですね',
        option_c: 'わるいですね',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'පැසසීමේදී "すごいですね (නියමයිනේ / විශිෂ්ටයිනේ)" යොදයි.'
      },
      {
        order_num: 28,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: 'A: あのう。ちょっと。このじしょかして______か。\nB: 今使っているんですよ。',
        image_url: null,
        audio_url: null,
        option_a: 'ください',
        option_b: 'くださいません',
        option_c: 'あげたい',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'කාරුණිකව ඉල්ලීමේදී "かしてくだいませんか (ණයට දිය හැකිද?)" යොදයි.'
      },
      {
        order_num: 29,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: どんな国に(29)______。\nB: 日本です。\nA: そうですか。日本語の勉強はどうですか。\nB: 私は週に１回日本語を勉強しています。日本語の友達でときどき話します。しょうらい、日本に留学したいです。\nA: 私も(30)______日本へ行きたいです。\n\n(29)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper12/jft12_img_06.jpg',
        audio_url: null,
        option_a: 'きょうみですか',
        option_b: 'きょうみがいますか',
        option_c: 'きょうみがありますか',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'උනන්දුව / කැමැත්ත ඇසීමට "きょうみがありますか (කැමැත්තක් / උනන්දුවක් තියෙනවද?)" යොදයි.'
      },
      {
        order_num: 30,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\n(30)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper12/jft12_img_06.jpg',
        audio_url: null,
        option_a: 'いつか',
        option_b: 'いつで',
        option_c: 'いつまで',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'කවදා හෝ දවසක යන්නට "いつか (Itsuka)" යොදයි.'
      },

      // ================= SECTION 3: Listening Comprehension (Choukai) [Q31 - Q45] =================
      {
        order_num: 31,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'ふじホテルはどこですか。(音声を聞いてふじホテルの場所をA〜Dから選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_07.jpg',
        audio_url: '/audio/jft_paper12/jft12_q31.mp3',
        option_a: 'A',
        option_b: 'B',
        option_c: 'C',
        option_d: 'D',
        correct_option: 'A',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ෆුජි හෝටලය පිහිටා ඇත්තේ A ස්ථානයේය.'
      },
      {
        order_num: 32,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'たいしかんはどこですか。(音声を聞いて大使館の場所をA〜Dから選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_07.jpg',
        audio_url: '/audio/jft_paper12/jft12_q32.mp3',
        option_a: 'A',
        option_b: 'B',
        option_c: 'C',
        option_d: 'D',
        correct_option: 'D',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව තානාපති කාර්යාලය (たいしかん) පිහිටා ඇත්තේ D ස්ථානයේය.'
      },
      {
        order_num: 33,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'どこにあいますか。(音声を聞いて待ち合わせ場所を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper12/jft12_q33.mp3',
        option_a: 'ふじデパート北口',
        option_b: 'ふじデパートのそと',
        option_c: 'ふじデパートの入り口',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ඔවුන් හමුවන්නේ ෆුජි ඩිපාර්ට්මන්ට් ස්ටෝරුවේ උතුරු දොරටුව අසලදීය (ふじデパート北口).'
      },
      {
        order_num: 34,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '何時にあいますか。(音声を聞いて待ち合わせ時間を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper12/jft12_q34.mp3',
        option_a: '4時',
        option_b: '4時半',
        option_c: '5時',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව හමුවන වේලාව සවස 4:30 (4時半) වේ.'
      },
      {
        order_num: 35,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'どうしておそくなったんですか。(音声を聞いて遅れた理由の絵を選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_08.jpg',
        audio_url: '/audio/jft_paper12/jft12_q35.mp3',
        option_a: 'a (寝坊)',
        option_b: 'b (電車遅延)',
        option_c: 'c (時計の見間違い)',
        option_d: 'd (道路渋滞)',
        correct_option: 'D',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ප්‍රමාද වූයේ රථවාහන තදබදය (Traffic jam - d) නිසාය.'
      },
      {
        order_num: 36,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'けいとさんは何のとき何語を勉強しましたか。',
        image_url: null,
        audio_url: '/audio/jft_paper12/jft12_q36_q37.mp3',
        option_a: '中学校の時中国語',
        option_b: '小学校の時韓国語',
        option_c: '小学校の時中国語',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව කේට් ප්‍රාථමික පාසල් කාලයේදී චීන භාෂාව (小学校の時中国語) ඉගෙන ගත්තේය.'
      },
      {
        order_num: 37,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '中国語の字はどうでしたか。',
        image_url: null,
        audio_url: '/audio/jft_paper12/jft12_q36_q37.mp3',
        option_a: '字がむずかしくて書くのがおもしろい',
        option_b: '字がおもしろいですが書くのがむずかしい',
        option_c: '字はおもしろくて書くのがべんりです',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අකුරු රසවත් වුවත් ලිවීමට අපහසුයි (字がおもしろいですが書くのがむずかしい).'
      },
      {
        order_num: 38,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '正しい絵を選びなさい。(音声を聞いて合っている絵を選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_09.jpg',
        audio_url: '/audio/jft_paper12/jft12_q38.mp3',
        option_a: 'a (プレゼントを渡す)',
        option_b: 'b (店が休み)',
        option_c: 'c (明日と言う)',
        option_d: 'd (タブレットを見る)',
        correct_option: 'A',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව නිවැරදි රූපය තෑග්ගක් ලබා දීම (a) වේ.'
      },
      {
        order_num: 39,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '正しい絵を選びなさい。(音声を聞いて合っている絵を選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_09.jpg',
        audio_url: '/audio/jft_paper12/jft12_q39.mp3',
        option_a: 'a',
        option_b: 'b',
        option_c: 'c',
        option_d: 'd',
        correct_option: 'B',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව නිවැරදි රූපය කඩය වසා තිබීම (b: 本日休業) වේ.'
      },
      {
        order_num: 40,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '正しい絵を選びなさい。(音声を聞いて合っている絵を選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_19.jpg',
        audio_url: '/audio/jft_paper12/jft12_q40.mp3',
        option_a: 'a (電車)',
        option_b: 'b (地図の案内板)',
        option_c: 'c (券売機)',
        option_d: 'd (電話)',
        correct_option: 'B',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව සිතියම් පුවරුව (b) නිවැරදි වේ.'
      },
      {
        order_num: 41,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '正しい絵を選びなさい。(音声を聞いて合っている絵を選びなさい。)',
        image_url: '/images/jft_paper12/jft12_img_19.jpg',
        audio_url: '/audio/jft_paper12/jft12_q41.mp3',
        option_a: 'a',
        option_b: 'b',
        option_c: 'c',
        option_d: 'd',
        correct_option: 'C',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ප්‍රවේශපත්‍ර යන්ත්‍රය (c: 券売機) නිවැරදි වේ.'
      },
      {
        order_num: 42,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '正しいものはどれか。(音声を聞いて正しい文を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper12/jft12_q42.mp3',
        option_a: 'おがわさんは韓国語がじょうずに話しています',
        option_b: 'おがわさんは中学生のときから韓国語のドラマを見ていました',
        option_c: 'おがわさんは韓国がすきで、韓国へいつか行きたいです',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ඔගාවා මධ්‍යම පාසල් වියේ සිටම කොරියානු නාට්‍ය නැරඹීය.'
      },
      {
        order_num: 43,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '正しいのはどれか。(音声を聞いて正しい文を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper12/jft12_q43.mp3',
        option_a: 'かわいさんはタイが好きで、タイダンスもじょうずです',
        option_b: 'かわいさんは年に一回ぐらいタイへいきます',
        option_c: 'かわいさんはタイ人です',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'කවායි තායිලන්තයට ප්‍රිය කරන අතර තායි නැටුම්ද දක්ෂ ලෙස ඉදිරිපත් කරයි.'
      },
      {
        order_num: 44,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'しょうがっこうのとき何を勉強しましたか。',
        image_url: '/images/jft_paper12/jft12_img_20.jpg',
        audio_url: '/audio/jft_paper12/jft12_q44_q45.mp3',
        option_a: '英語',
        option_b: 'フランス語',
        option_c: '韓国語',
        option_d: 'ドイツ語',
        correct_option: 'A',
        marks: 5,
        explanation: 'ප්‍රාථමික පාසලේදී ඉංග්‍රීසි භාෂාව (英語) ඉගෙන ගත්තේය.'
      },
      {
        order_num: 45,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '大学のとき何を勉強しましたか。',
        image_url: '/images/jft_paper12/jft12_img_21.jpg',
        audio_url: '/audio/jft_paper12/jft12_q44_q45.mp3',
        option_a: '英語',
        option_b: 'フランス語',
        option_c: '韓国語',
        option_d: 'ドイツ語',
        correct_option: 'B',
        marks: 5,
        explanation: 'විශ්වවිද්‍යාලයේදී ප්‍රංශ භාෂාව (フランス語) ඉගෙන ගත්තේය.'
      },

      // ================= SECTION 4: Reading Comprehension (Dokkai) [Q46 - Q60] =================
      {
        order_num: 46,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージについての問題】\nなぜ彼女は遅れるのですか。',
        image_url: '/images/jft_paper12/jft12_img_22.jpg',
        audio_url: null,
        option_a: '道にまっすぐ行ったから',
        option_b: '道に車がないから',
        option_c: '道にまよったから',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'පණිවිඩයේ "みちにまよいました (පාර අතරමං වුණා)" යනුවෙන් ඇති බැවින් "道にまよったから" නිවැරදි වේ.'
      },
      {
        order_num: 47,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【会話文についての問題】\nよしださんは会社にどうやって行きますか。何分かかりますか。',
        image_url: '/images/jft_paper12/jft12_img_23.jpg',
        audio_url: null,
        option_a: '電車で行きます。三百分かかります',
        option_b: '車で行きます。三百分かかります',
        option_c: '電車で行きます。三十分かかります',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'යොෂිඩා දුම්රියෙන් ගමන් කරන අතර විනාඩි 30 ක් ගතවේ (電車で行きます。三十分かかります).'
      },
      {
        order_num: 48,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メールを読んで正しいものに〇、ちがうものに×を選びなさい】\n「アネモネ」は駅のちかくにあります。',
        image_url: '/images/jft_paper12/jft12_q48_51_email.png',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'ලිපියේ "えきのちかくに すてきなくつの店があります" ලෙස ඇති බැවින් නිවැරදිය.'
      },
      {
        order_num: 49,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メールを読んで正しいものに〇、ちがうものに×を選びなさい】\n「アネモネ」はくつの店です。',
        image_url: '/images/jft_paper12/jft12_q48_51_email.png',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: '"アネモネ" යනු පාවහන් සාප්පුවකි (くつの店).'
      },
      {
        order_num: 50,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メールを読んで正しいものに〇、ちがうものに×を選びなさい】\n「アネモネ」は ななえさんの店です。',
        image_url: '/images/jft_paper12/jft12_q48_51_email.png',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'එය නනාඒගේ අක්කාගේ සාප්පුවයි (私のあねの店).'
      },
      {
        order_num: 51,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メールを読んで正しいものに〇、ちがうものに×を選びなさい】\n明日ななえさんは「アネモネ」にいます。',
        image_url: '/images/jft_paper12/jft12_q48_51_email.png',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'නනාඒ සෑම දිනකම එහි අර්ධකාලීනව සේවය කරයි (私もまいにち アルバイトをしています).'
      },
      {
        order_num: 52,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【地図を見て答えなさい】\n「アネモネ」はどこにありますか。',
        image_url: '/images/jft_paper12/jft12_q52_map.png',
        audio_url: null,
        option_a: 'a',
        option_b: 'b',
        option_c: 'c',
        option_d: 'd',
        correct_option: 'D',
        marks: 5,
        explanation: 'උතුරු දොරටුවෙන් කෙළින් ගොස් හන්දියෙන් දකුණට හැරුණු පසු ඇති ස්ථානය "d" වේ.'
      },
      {
        order_num: 53,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【ブログについての問題】\nまちあわせのためにやくそくした時間は何時ですか。',
        image_url: '/images/jft_paper12/jft12_q53_55_blog.png',
        audio_url: null,
        option_a: '1時50分',
        option_b: '2時',
        option_c: '2時20分',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'නියමිත හමුවීමේ වේලාව සවස 2:00 (2時) විය.'
      },
      {
        order_num: 54,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【ブログについての問題】\n二人はどこへ行きましたか。',
        image_url: '/images/jft_paper12/jft12_q53_55_blog.png',
        audio_url: null,
        option_a: 'たいしかん',
        option_b: 'はくぶつかん',
        option_c: 'びじゅつかん',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ඔවුන් දෙදෙනා කලාගාරයට (びじゅつかん / 美術館) ගියහ.'
      },
      {
        order_num: 55,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【ブログについての問題】\nYさんはどうして遅れましたか。',
        image_url: '/images/jft_paper12/jft12_q53_55_blog.png',
        audio_url: null,
        option_a: 'やくそく時間がわすれていたから',
        option_b: '道をまちがえたから',
        option_c: 'びじゅつかんがきらいだから',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'Y පවසන්නේ "ちょっと道をまちがえました (පාර වැරදුණා)" යනුවෙනි.'
      },
      {
        order_num: 56,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【スケジュールについての問題】\n買い物に行くのは何時ですか。',
        image_url: '/images/jft_paper12/jft12_q56_57_schedule.png',
        audio_url: null,
        option_a: '3時',
        option_b: '朝8時のまえ',
        option_c: 'しょうご12時とゆうがたの6時の間',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'දවල් 12 න් පසු සහ සවස 6 න් පෙර (しょうご12時とゆうがたの6時の間) සාප්පු සවාරියේ යෙදේ.'
      },
      {
        order_num: 57,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【スケジュールについての問題】\nこの人はどうしてタワーへ行きますか。',
        image_url: '/images/jft_paper12/jft12_q56_57_schedule.png',
        audio_url: null,
        option_a: 'ラーメンを食べるために',
        option_b: 'やけいをあげるために',
        option_c: 'やけいを見るために',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'රාත්‍රී දර්ශන නැරඹීමට (やけいを見るために / 夜景を見るために) ටවර් එකට යයි.'
      },
      {
        order_num: 58,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【短文についての問題】\nこの人は行かなかったところはどこですか。',
        image_url: '/images/jft_paper12/jft12_q58_59_diary.png',
        audio_url: null,
        option_a: 'はくぶつかん、どうぶつえん',
        option_b: 'びじゅつかん、はくぶつかん',
        option_c: 'びじゅつかん、どうぶつえん',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'කෞතුකාගාරය සහ සත්වෝද්‍යානය (はくぶつかん、どうぶつえん) වෙත තවම ගොස් නැත.'
      },
      {
        order_num: 59,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【短文についての問題】\nここにあるのはどれか。',
        image_url: '/images/jft_paper12/jft12_q58_59_diary.png',
        audio_url: null,
        option_a: 'すしとてんぷらはまだ食べていません',
        option_b: 'やけいを見たことがありません',
        option_c: 'お酒は一日に9ほんも飲みます',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: '"やけいは まだです" ඇති බැවින් රාත්‍රී දර්ශන තවම නරඹා නැත (やけいを見たことがありません).'
      },
      {
        order_num: 60,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【会話文についての問題】\nエドさんは何を持ってきますか。',
        image_url: '/images/jft_paper12/jft12_q60_party.png',
        audio_url: null,
        option_a: 'くだもの',
        option_b: 'ケーキ',
        option_c: 'すし',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'එඩ් පවසන්නේ තමා සුෂි සාදාගෙන එන බවයි (私は おすしを作っていきます).'
      }
    ];

    console.log(`Inserting ${questions.length} questions for JFT Model Paper 12...`);
    for (const q of questions) {
      await query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text, question_type,
          image_url, audio_url,
          option_a, option_b, option_c, option_d,
          correct_option, marks, order_num, explanation
        ) VALUES (?, ?, ?, 'mcq', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        examId,
        q.section_name,
        q.question_text,
        q.image_url,
        q.audio_url,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.marks,
        q.order_num,
        q.explanation
      ]);
    }

    console.log(`Successfully seeded JFT Model Paper 12 with ${questions.length} questions!`);
  } catch (err) {
    console.error('Error seeding JFT Model Paper 12:', err);
    throw err;
  }
}

if (require.main === module) {
  seedJftModelPaper12()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedJftModelPaper12;
