const path = require('path');
const db = require(path.resolve('c:/Users/tharu/OneDrive/Documents/Yuzuki Japan College exam/backend/src/config/database'));

async function seedJftModelPaper20() {
  console.log('Seeding JFT-Basic Official Model Paper 20 (60 Questions, Pass 200/250)...');

  try {
    let exam = await db.query.get("SELECT * FROM exams WHERE (title LIKE '%Model Paper 20%' OR title LIKE '%Paper 20%') AND course_id = 1");
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
      console.log(`Found existing Exam ID: ${examId}, resetting questions...`);
      await db.query.run('DELETE FROM questions WHERE exam_id = ?', [examId]);
      await db.query.run(`
        UPDATE exams 
        SET course_id = 1,
            title = 'JFT-Basic Official Model Paper 20 (60 Minutes)',
            description = 'Official JFT-Basic Prometric Computer-Based Examination Paper 20 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
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
          'JFT-Basic Official Model Paper 20 (60 Minutes)',
          'Official JFT-Basic Prometric Computer-Based Examination Paper 20 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
          60,
          200,
          1
        )
      `);
      examId = res.id;
      console.log(`Created new Exam ID: ${examId}`);
    }

    const questions = [
      // ================= SECTION 1: Script and Vocabulary (文字・語彙) [Q01 - Q15] =================
      {
        order_num: 1,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>言葉<rt>ことば</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\nマーカーで<ruby>文字<rt>もじ</rt></ruby>を<ruby>書<rt>か</rt></ruby>く<ruby>白<rt>しろ</rt></ruby>いボードは何ですか。',
        image_url: null,
        audio_url: null,
        option_a: 'ホワイトボード',
        option_b: 'こくばん',
        option_c: 'ごみばこ',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'සුදු පැහැති පුවරුව "ホワイトボード (Whiteboard)" වේ.'
      },
      {
        order_num: 2,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>言葉<rt>ことば</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\nチョークで<ruby>文字<rt>もじ</rt></ruby>を<ruby>書<rt>か</rt></ruby>く<ruby>黒<rt>くろ</rt></ruby>い/緑のボードは何ですか。',
        image_url: null,
        audio_url: null,
        option_a: 'ホワイトボード',
        option_b: 'こくばん',
        option_c: 'ごみばこ',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'හුණු කූරු වලින් ලියන කළු ලෑල්ල "こくばん (Blackboard / 黒板)" වේ.'
      },
      {
        order_num: 3,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>動詞<rt>どうし</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n<ruby>口<rt>くち</rt></ruby>に<ruby>手<rt>て</rt></ruby>をあてて<ruby>大<rt>おお</rt></ruby>きい<ruby>声<rt>こえ</rt></ruby>で<ruby>話<rt>はな</rt></ruby>す<ruby>動作<rt>どうさ</rt></ruby>は何ですか。',
        image_url: null,
        audio_url: null,
        option_a: '聞きます',
        option_b: '言います',
        option_c: '読みます',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'කට අසල දෑත් තබා කථා කිරීම/පැවසීම "言います (කියනවා/පවසනවා)" වේ.'
      },
      {
        order_num: 4,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>動詞<rt>どうし</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n<ruby>目<rt>め</rt></ruby>の<ruby>近<rt>ちか</rt></ruby>くに<ruby>手<rt>て</rt></ruby>をあててよく<ruby>観察<rt>かんさつ</rt></ruby>する<ruby>動作<rt>どうさ</rt></ruby>は何ですか。',
        image_url: null,
        audio_url: null,
        option_a: '聞きます',
        option_b: '飲みます',
        option_c: '見ます',
        option_d: '',
        correct_option: 'C',
        marks: 1,
        explanation: 'ඇස් අසලින් දෑත් තබා නිරීක්ෂණය කිරීම "見ます (බලනවා)" වේ.'
      },
      {
        order_num: 5,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>動詞<rt>どうし</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n<ruby>耳<rt>みみ</rt></ruby>に<ruby>手<rt>て</rt></ruby>をあてて<ruby>音<rt>おと</rt></ruby>をよくキャッチする<ruby>動作<rt>どうさ</rt></ruby>は何ですか。',
        image_url: null,
        audio_url: null,
        option_a: '聞きます',
        option_b: '読みます',
        option_c: '飲みます',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'කන අසලට අත තබා ශ්‍රවණය කිරීම "聞きます (අහනවා)" වේ.'
      },
      {
        order_num: 6,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n「<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>は、ピアノを（ 06 ）............り、<ruby>本<rt>ほん</rt></ruby>を（ 07 ）............たりして、すごしています。」\n\n(06) に入る言葉：',
        image_url: null,
        audio_url: null,
        option_a: 'ひく',
        option_b: 'ひきます',
        option_c: 'ひいたり',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'ක්‍රියාකාරකම් කිහිපයක් ලැයිස්තුගත කිරීමට "...〜たり〜たりする" ව්‍යාකරණය යෙදේ: ピアノをひいたり (පියානෝ වාදනය කිරීමත්).'
      },
      {
        order_num: 7,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '(07) に入る言葉：\n「本を（ 07 ）............たりして、すごしています。」',
        image_url: null,
        audio_url: null,
        option_a: '書く',
        option_b: '書いたり',
        option_c: '書きます',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: '〜たり ආකෘතියට අනුව "書いたり (ලිවීමත් / කියවීමත්)" යෙදේ.'
      },
      {
        order_num: 8,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n<ruby>手<rt>て</rt></ruby>にけがを............ しまいました。',
        image_url: null,
        audio_url: null,
        option_a: 'しに',
        option_b: 'して',
        option_c: 'した',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'නොසිතූ ලෙස සිදුවූ අවාසනාවන්ත ක්‍රියාවක් ප්‍රකාශ කිරීමට "〜てしまう" යෙදේ: けがをしてしまいました (අත තුවාල විය).'
      },
      {
        order_num: 9,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n<ruby>田中<rt>たなか</rt></ruby>さんはまだ............ います。<ruby>待<rt>ま</rt></ruby>ちましょう。',
        image_url: null,
        audio_url: null,
        option_a: 'きがえて',
        option_b: 'きがえます',
        option_c: 'きがえる',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'සිදුවෙමින් පවතින ක්‍රියාවක් දැක්වීමට "〜ています" යෙදේ: きがえています (ඇඳුම් මාරු කරමින් සිටියි).'
      },
      {
        order_num: 10,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n<ruby>雨<rt>あめ</rt></ruby>がやんだら、<ruby>母<rt>はは</rt></ruby>と............ と<ruby>思<rt>おも</rt></ruby>っています。',
        image_url: null,
        audio_url: null,
        option_a: '出かけた',
        option_b: '出かけない',
        option_c: '出かけよう',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'තමන්ගේ අධිෂ්ඨානය/අදහස දැක්වීමට Volitional form (〜よう) + と思っています යෙදේ: 出かけようと思っています (එළියට යාමට සිතාගෙන සිටිමි).'
      },
      {
        order_num: 11,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>下線<rt>かせん</rt></ruby>の<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>として<ruby>正<rt>ただ</rt></ruby>しいものを<ruby>選<rt>えら</rt></ruby>んでください】\n(11)<u><ruby>妹<rt>いもうと</rt></ruby></u>といっしょに(12)<ruby>海<rt>うみ</rt></ruby>まで(13)<ruby>走<rt>はし</rt></ruby>って<ruby>行<rt>い</rt></ruby>きました。',
        image_url: null,
        audio_url: null,
        option_a: 'いもとう',
        option_b: 'いもうと',
        option_c: 'いもうとう',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: '「妹」හී හිරගන කියවීම "いもうと (නංගී)" වේ.'
      },
      {
        order_num: 12,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>下線<rt>かせん</rt></ruby>の<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>として<ruby>正<rt>ただ</rt></ruby>しいものを<ruby>選<rt>えら</rt></ruby>んでください】\n(11)<ruby>妹<rt>いもうと</rt></ruby>といっしょに(12)<u><ruby>海<rt>うみ</rt></ruby></u>まで(13)<ruby>走<rt>はし</rt></ruby>って<ruby>行<rt>い</rt></ruby>きました。',
        image_url: null,
        audio_url: null,
        option_a: 'かい',
        option_b: 'かわ',
        option_c: 'うみ',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: '「海」හී හිරගන කියවීම "うみ (මුහුද)" වේ.'
      },
      {
        order_num: 13,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>下線<rt>かせん</rt></ruby>の<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>として<ruby>正<rt>ただ</rt></ruby>しいものを<ruby>選<rt>えら</rt></ruby>んでください】\n(11)<ruby>妹<rt>いもうと</rt></ruby>といっしょに(12)<ruby>海<rt>うみ</rt></ruby>まで(13)<u><ruby>走<rt>はし</rt></ruby>って</u><ruby>行<rt>い</rt></ruby>きました。',
        image_url: null,
        audio_url: null,
        option_a: 'はしって',
        option_b: 'あるいて',
        option_c: 'はらって',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: '「走って」හී හිරගන කියවීම "はしって (Hashitte - දිවගෙන)" වේ.'
      },
      {
        order_num: 14,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>下線<rt>かせん</rt></ruby>の<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>として<ruby>正<rt>ただ</rt></ruby>しいものを<ruby>選<rt>えら</rt></ruby>んでください】\nこのしまには<ruby>電気<rt>でんき</rt></ruby>も(14)<u><ruby>水道<rt>すいどう</rt></ruby></u>もなくて、<ruby>生活<rt>せいかつ</rt></ruby>はとても(15)<ruby>不便<rt>ふべん</rt></ruby>です。',
        image_url: null,
        audio_url: null,
        option_a: 'みずみち',
        option_b: 'すいどう',
        option_c: 'すいみち',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: '「水道」හී හිරගන කියවීම "すいどう (Suidou - ජල සැපයුම/නළ ජලය)" වේ.'
      },
      {
        order_num: 15,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【<ruby>下線<rt>かせん</rt></ruby>の<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>として<ruby>正<rt>ただ</rt></ruby>しいものを<ruby>選<rt>えら</rt></ruby>んでください】\nこのしまには<ruby>電気<rt>でんき</rt></ruby>も(14)<ruby>水道<rt>すいどう</rt></ruby>もなくて、<ruby>生活<rt>せいかつ</rt></ruby>はとても(15)<u><ruby>不便<rt>ふべん</rt></ruby></u>です。',
        image_url: null,
        audio_url: null,
        option_a: 'べんり',
        option_b: 'かんたん',
        option_c: 'ふべん',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: '「不便」හී හිරගන කියවීම "ふべん (Fuben - අපහසු)" වේ.'
      },

      // ================= SECTION 2: Conversation and Grammar (会話・文法) [Q16 - Q30] =================
      {
        order_num: 16,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n<ruby>明日<rt>あした</rt></ruby>までにレポートを............たいと<ruby>思<rt>おも</rt></ruby>っています。',
        image_url: null,
        audio_url: null,
        option_a: 'まとめる',
        option_b: 'まとめて',
        option_c: 'まとめ',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ක්‍රියාපදයේ Masu-stem + たい ආකෘතිය අනුව "まとめたい (සාරාංශ කිරීමට/සකස් කිරීමට අවශ්‍යයි)" වේ.'
      },
      {
        order_num: 17,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n<ruby>田中<rt>たなか</rt></ruby>さんにもう<ruby>一度<rt>いちど</rt></ruby>きちんと............ほうがいいです。',
        image_url: null,
        audio_url: null,
        option_a: 'たしかめる',
        option_b: 'たしかめた',
        option_c: 'たしかめて',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'උපදෙස් දීමට "〜たほうがいい" (Ta-form) යෙදේ: たしかめたほうがいい (තහවුරු කරගැනීම වඩා හොඳය).'
      },
      {
        order_num: 18,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n「きんえん」はたばこを............という<ruby>意味<rt>いみ</rt></ruby>です。',
        image_url: null,
        audio_url: null,
        option_a: 'すいますか',
        option_b: 'すってもいいです',
        option_c: 'すってはいけない',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'දුම්පානය තහනම් බව ප්‍රකාශ කරන තහනම් අර්ථය "すってはいけない (දුම්පානය නොකළ යුතුය)" වේ.'
      },
      {
        order_num: 19,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\n<ruby>木村<rt>きむら</rt></ruby>さんから............とおりに、<ruby>書<rt>か</rt></ruby>いてください。',
        image_url: null,
        audio_url: null,
        option_a: '聞いた',
        option_b: '聞く',
        option_c: '聞きます',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'අතීතයේ ඇසූ ආකාරයටම ලිවීමට "聞いたとおりに (ඇසූ පරිද්දෙන්ම)" යෙදේ.'
      },
      {
        order_num: 20,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>文<rt>ぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nミーティングが............あとで、おがわさんとテニスをします。',
        image_url: null,
        audio_url: null,
        option_a: '終わって',
        option_b: '終わります',
        option_c: '終わった',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'යම් ක්‍රියාවක් නිමවූ පසුව යන්න දැක්වීමට "〜たあとで" යෙදේ: 終わったあとで (අවසන් වූ පසු).'
      },
      {
        order_num: 21,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：このまんが、おもしろいそうですね。\nＢ：ああ、うちの<ruby>子供<rt>こども</rt></ruby>も............。',
        image_url: null,
        audio_url: null,
        option_a: '読みたいです',
        option_b: '読みたがっています',
        option_c: '読みたがります',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'තෙවන පාර්ශ්වයක (දරුවාගේ) ආශාව ප්‍රකාශ කිරීමට "〜たがっている" යෙදේ: 読みたがっています (කියවීමට කැමැත්තෙන් සිටී).'
      },
      {
        order_num: 22,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：<ruby>毎日<rt>まいにち</rt></ruby><ruby>朝<rt>あさ</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べますか。\nＢ：ええ、どんなに............、きちんと<ruby>食<rt>た</rt></ruby>べます。',
        image_url: null,
        audio_url: null,
        option_a: 'いそがしくても',
        option_b: 'いそがしいのに',
        option_c: 'いそがしいと',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'කෙතරම් කාර්යබහුල වුවත් යන අර්ථයට "どんなに〜ても" යෙදේ: どんなにいそがしくても (කෙසේ කාර්යබහුල වුවද).'
      },
      {
        order_num: 23,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：<ruby>山川<rt>やまかわ</rt></ruby>さんの<ruby>誕生日<rt>たんじょうび</rt></ruby>にこのさいふをあげる（ 23 ）............。\nＢ：そうですか。きっとよろこんで<ruby>使<rt>つか</rt></ruby>って（ 24 ）............でしょう。\n\n(23) に入る言葉：',
        image_url: null,
        audio_url: null,
        option_a: 'ほしいです',
        option_b: 'たいです',
        option_c: 'つもりです',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ක්‍රියාපදයේ Dictionary form + つもりです (දීමට අදහස් කරගෙන සිටිමි) යෙදේ.'
      },
      {
        order_num: 24,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '(24) に入る言葉：\n「きっとよろこんで使って（ 24 ）............でしょう。」',
        image_url: null,
        audio_url: null,
        option_a: 'あげる',
        option_b: 'くれる',
        option_c: 'つくる',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අනෙකා තමන් වෙනුවෙන් සතුටින් භාවිතා කරනු ඇති බව දැක්වීමට "〜てくれる" යෙදේ: 使ってくれるでしょう.'
      },
      {
        order_num: 25,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：<ruby>先生<rt>せんせい</rt></ruby>は<ruby>今<rt>いま</rt></ruby>どちらですか。\nＢ：<ruby>先生<rt>せんせい</rt></ruby>は<ruby>図書館<rt>としょかん</rt></ruby>に............。',
        image_url: null,
        audio_url: null,
        option_a: 'ございます',
        option_b: 'おっしゃいます',
        option_c: 'いらっしゃいます',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ගුරුවරයා සිටින ස්ථානය දැක්වීමේ ගෞරවාර්ථ (Sonkeigo) වචනය "いらっしゃいます (සිටිති)" වේ.'
      },
      {
        order_num: 26,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：<ruby>昨日<rt>きのう</rt></ruby>から<ruby>少<rt>すこ</rt></ruby>しねつがあってあたまがいたいです。\nＢ：それは............。',
        image_url: null,
        audio_url: null,
        option_a: 'おげんきで',
        option_b: 'いけませんね',
        option_c: 'しつれいします',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අසනීපයක් ගැන කී විට කනගාටුව/අනුකම්පාව පළ කිරීමට "それは いけませんね (අයියෝ ඒක හොඳ නෑනේ)" යෙදේ.'
      },
      {
        order_num: 27,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：<ruby>昨日<rt>きのう</rt></ruby>どこかへ<ruby>行<rt>い</rt></ruby>きましたか。\nＢ：いいえ、............うちにいました。',
        image_url: null,
        audio_url: null,
        option_a: '一年中',
        option_b: '一日',
        option_c: '一日中',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'දවස මුළුල්ලේම නිවසේ සිටි බව දැක්වීමට "一日中 (දවස පුරාම)" යෙදේ.'
      },
      {
        order_num: 28,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：あなたはもう............か。\nＢ：いいえ、まだどくしんです。',
        image_url: null,
        audio_url: null,
        option_a: '結婚する',
        option_b: '結婚しました',
        option_c: '結婚したい',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'දැනටමත් විවාහ වී ඇත්දැයි අසන ප්‍රශ්නය "もう結婚しましたか" වේ.'
      },
      {
        order_num: 29,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>に<ruby>最<rt>もっと</rt></ruby>もあてはまるものを<ruby>選<rt>えら</rt></ruby>んでください】\n\nＡ：すみません。（ 29 ）............。\nＢ：<ruby>銀行<rt>ぎんこう</rt></ruby>ですか。（ 30 ）............。\nＡ：<ruby>左<rt>ひだり</rt></ruby>ですね。わかりました。\n\n(29) に入る言葉：',
        image_url: null,
        audio_url: null,
        option_a: '銀行は',
        option_b: '銀行はどうですか',
        option_c: '銀行はどこですか',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ස්ථානය විමසීමට "銀行はどこですか (බැංකුව කොහෙද තිබෙන්නේ?)" යෙදේ.'
      },
      {
        order_num: 30,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '(30) に入る言葉：\n「銀行ですか。（ 30 ）............。」\n「Ａ：左ですね。わかりました。」',
        image_url: null,
        audio_url: null,
        option_a: 'まっすぐ行ってみなみにまがってください',
        option_b: 'まっすぐ行って、ひだりにまがってください',
        option_c: 'まっすぐ行って、みぎにまがってください',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'සිතියමේ බැංකුව පිහිටා ඇත්තේ කෙළින් ගොස් වමට හැරෙන ස්ථානයේ බැවින් "まっすぐ行って、ひだりにまがってください" නිවැරදිය.'
      },

      // ================= SECTION 3: Listening Comprehension (聴解) [Q31 - Q45] =================
      {
        order_num: 31,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>正<rt>ただ</rt></ruby>しい<ruby>答<rt>こた</rt></ruby>えを<ruby>選<rt>えら</rt></ruby>んでください】\nこの人の兄について正しい答えを選びなさい。\n\n31. 住んでいるところ',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1LmLkcpZvnWwSLFSWnuPo5nQTY6DGkfGV/view?usp=sharing',
        option_a: '中国',
        option_b: 'アメリカ',
        option_c: '韓国',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය ඛණ්ඩය අනුව ඔහුගේ සහෝදරයා ජීවත් වන්නේ ඇමරිකාවේ (アメリカ) ය.'
      },
      {
        order_num: 32,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>正<rt>ただ</rt></ruby>しい<ruby>答<rt>こた</rt></ruby>えを<ruby>選<rt>えら</rt></ruby>んでください】\n32. 家族の人数',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1LmLkcpZvnWwSLFSWnuPo5nQTY6DGkfGV/view?usp=sharing',
        option_a: '2人',
        option_b: '3人',
        option_c: '4人',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'පවුලේ සාමාජිකයින් 4 දෙනෙකු (4人) සිටී.'
      },
      {
        order_num: 33,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>正<rt>ただ</rt></ruby>しい<ruby>答<rt>こた</rt></ruby>えを<ruby>選<rt>えら</rt></ruby>んでください】\n33. 仕事',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1LmLkcpZvnWwSLFSWnuPo5nQTY6DGkfGV/view?usp=sharing',
        option_a: 'うんてんしゅ',
        option_b: '車の会社',
        option_c: 'しゅふ',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ඔහු සේවය කරන්නේ මෝටර් රථ සමාගමක (車の会社) ය.'
      },
      {
        order_num: 34,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>何語<rt>なにご</rt></ruby>で<ruby>話<rt>はな</rt></ruby>すか<ruby>選<rt>えら</rt></ruby>んでください】\n\n[言語の選択肢]\na: 日本語\nb: えいご\nc: かんこくご\nd: イタリアご\ne: ちゅうごくご\n\n34. まりさん',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/17JREvlGtKrgnHR7wGyR3rdTJUP7YnpXA/view?usp=sharing',
        option_a: 'a・b (日本語・英語)',
        option_b: 'b・d',
        option_c: 'c・a',
        option_d: 'd・e',
        correct_option: 'A',
        marks: 5,
        explanation: 'මාරි මහත්මිය කථා කරන්නේ ජපන් සහ ඉංග්‍රීසි (a・b: 日本語・英語) භාෂා වේ.'
      },
      {
        order_num: 35,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>何語<rt>なにご</rt></ruby>で<ruby>話<rt>はな</rt></ruby>すか<ruby>選<rt>えら</rt></ruby>んでください】\n35. まりさんのおねえさん',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/17JREvlGtKrgnHR7wGyR3rdTJUP7YnpXA/view?usp=sharing',
        option_a: 'a・b',
        option_b: 'b・d (英語・イタリア語)',
        option_c: 'c・a',
        option_d: 'd・e',
        correct_option: 'B',
        marks: 5,
        explanation: 'ඇයගේ අක්කා කථා කරන්නේ ඉංග්‍රීසි සහ ඉතාලි (b・d: 英語・イタリア語) භාෂා වේ.'
      },
      {
        order_num: 36,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>何語<rt>なにご</rt></ruby>で<ruby>話<rt>はな</rt></ruby>すか<ruby>選<rt>えら</rt></ruby>んでください】\n36. まりさんのおにいさん',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/17JREvlGtKrgnHR7wGyR3rdTJUP7YnpXA/view?usp=sharing',
        option_a: 'a・b',
        option_b: 'b・d',
        option_c: 'c・a',
        option_d: 'd・e (イタリア語・中国語)',
        correct_option: 'D',
        marks: 5,
        explanation: 'ඇයගේ අයියා කථා කරන්නේ ඉතාලි සහ චීන (d・e: イタリア語・中国語) භාෂා වේ.'
      },
      {
        order_num: 37,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>何語<rt>なにご</rt></ruby>で<ruby>話<rt>はな</rt></ruby>すか<ruby>選<rt>えら</rt></ruby>んでください】\n37. まりさんのおばさん',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/17JREvlGtKrgnHR7wGyR3rdTJUP7YnpXA/view?usp=sharing',
        option_a: 'a: 日本語',
        option_b: 'b: えいご',
        option_c: 'c: かんこくご',
        option_d: 'd: イタリアご',
        option_e: 'e: ちゅうごくご',
        correct_option: 'A',
        marks: 5,
        explanation: 'නැන්දා කථා කරන්නේ ජපන් භාෂාව (a: 日本語) පමණි.'
      },
      {
        order_num: 38,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>正<rt>ただ</rt></ruby>しい<ruby>答<rt>こた</rt></ruby>えを<ruby>選<rt>えら</rt></ruby>んでください】\n\n[選択肢]\na: ひまなとき\nb: わかいとき\nc: こどものとき\n\n38. ヤンさんは（　　）、よくサッカーをしました。',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1nXnrLm1kF6yp7P_Yj5t9MbNwqxL0OsSH/view?usp=sharing',
        option_a: 'a: ひまなとき',
        option_b: 'b: わかいとき',
        option_c: 'c: こどものとき',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'යෑන් මහතා ළමා කාලයේදී (c: こどものとき) නිතර පාපන්දු ක්‍රීඩා කළේය.'
      },
      {
        order_num: 39,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>正<rt>ただ</rt></ruby>しい<ruby>答<rt>こた</rt></ruby>えを<ruby>選<rt>えら</rt></ruby>んでください】\n39. たなかさんは（　　）、よくりょうりをつくります。',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1nXnrLm1kF6yp7P_Yj5t9MbNwqxL0OsSH/view?usp=sharing',
        option_a: 'a: ひまなとき',
        option_b: 'b: わかいとき',
        option_c: 'c: こどものとき',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'තනකා මහතා නිදහස් වේලාවට (a: ひまなとき) ආහාර පිසීමට කැමතිය.'
      },
      {
        order_num: 40,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【<ruby>音声<rt>おんせい</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いて<ruby>正<rt>ただ</rt></ruby>しい<ruby>答<rt>こた</rt></ruby>えを<ruby>選<rt>えら</rt></ruby>んでください】\n40. ジョイさんは（　　）、よくりょこうしました。',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1nXnrLm1kF6yp7P_Yj5t9MbNwqxL0OsSH/view?usp=sharing',
        option_a: 'a: ひまなとき',
        option_b: 'b: わかいとき',
        option_c: 'c: こどものとき',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ජෝයි මහතා තරුණ කාලයේදී (b: わかいとき) නිතර සංචාරය කළේය.'
      },
      {
        order_num: 41,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【テレビの<ruby>天気<rt>てんき</rt></ruby>レポートを<ruby>聞<rt>き</rt></ruby>いて<ruby>天気<rt>てんき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n\n[天気の選択肢]\na: はれ\nb: くもり\nc: あめ\nd: ゆき\ne: かぜ\n\n41. さっぽろ',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1mnMcL0lKqXAGa_Fb6ltMHoCZZjsGfHMv/view?usp=sharing',
        option_a: 'a: はれ',
        option_b: 'b: くもり',
        option_c: 'c: あめ',
        option_d: 'd: ゆき',
        correct_option: 'D',
        marks: 5,
        explanation: 'සැපෝරෝ හි කාලගුණය හිම (d: ゆき) වේ.'
      },
      {
        order_num: 42,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【テレビの<ruby>天気<rt>てんき</rt></ruby>レポートを<ruby>聞<rt>き</rt></ruby>いて<ruby>天気<rt>てんき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n42. とやま',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1mnMcL0lKqXAGa_Fb6ltMHoCZZjsGfHMv/view?usp=sharing',
        option_a: 'a: はれ',
        option_b: 'b: くもり',
        option_c: 'c: あめ',
        option_d: 'd: ゆき',
        correct_option: 'C',
        marks: 5,
        explanation: 'තොයාමා හි කාලගුණය වැසි (c: あめ) වේ.'
      },
      {
        order_num: 43,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【テレビの<ruby>天気<rt>てんき</rt></ruby>レポートを<ruby>聞<rt>き</rt></ruby>いて<ruby>天気<rt>てんき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n43. 東京',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1mnMcL0lKqXAGa_Fb6ltMHoCZZjsGfHMv/view?usp=sharing',
        option_a: 'a: はれ',
        option_b: 'b: くもり',
        option_c: 'c: あめ',
        option_d: 'd: ゆき',
        correct_option: 'A',
        marks: 5,
        explanation: 'ටෝකියෝ හි කාලගුණය හිරු පායා ඇත (a: はれ).'
      },
      {
        order_num: 44,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【テレビの<ruby>天気<rt>てんき</rt></ruby>レポートを<ruby>聞<rt>き</rt></ruby>いて<ruby>天気<rt>てんき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n44. ふくおか (昼・午前)',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1mnMcL0lKqXAGa_Fb6ltMHoCZZjsGfHMv/view?usp=sharing',
        option_a: 'a: はれ',
        option_b: 'b: くもり',
        option_c: 'c: あめ',
        option_d: 'd: ゆき',
        correct_option: 'B',
        marks: 5,
        explanation: 'ෆුකුඕකා හි දහවල් කාලය වළාකුළු පිරි ඇත (b: くもり).'
      },
      {
        order_num: 45,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: '【テレビの<ruby>天気<rt>てんき</rt></ruby>レポートを<ruby>聞<rt>き</rt></ruby>いて<ruby>天気<rt>てんき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n45. ふくおか (夜・午後)',
        image_url: null,
        audio_url: 'https://drive.google.com/file/d/1mnMcL0lKqXAGa_Fb6ltMHoCZZjsGfHMv/view?usp=sharing',
        option_a: 'a: はれ',
        option_b: 'b: くもり',
        option_c: 'c: あめ',
        option_d: 'e: かぜ',
        correct_option: 'C',
        marks: 5,
        explanation: 'ෆුකුඕකා හි රාත්‍රී කාලයේදී වැසි අපේක්ෂා කෙරේ (c: あめ).'
      },

      // ================= SECTION 4: Reading Comprehension (読解) [Q46 - Q60] =================
      {
        order_num: 46,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>空欄<rt>くうらん</rt></ruby>にあてはまるものを<ruby>選<rt>えら</rt></ruby>びなさい】\n\n山川：「田中さん、新しい家を買ったそうですね」\n田中：「ええ、（ A ）。前はバスと電車を使って１時間半かかりましたが、今は電車で40分です。」\n山川：「そうですか。買い物にも便利ですか。」\n田中：「いえのまわりにはあまり店がないんですよ。駅まで10分ぐらいですが、そこまで行けばいろいろな店があるんです。」\n山川：「そうですか。でもあのへんには大きい公園がありますよね。あの公園にはスポーツをするところもありますよね。」\n田中：「ええ、公園の中にはテニスコートやプールもあるんです。」\n山川：「いいんでね。（ B ） 私は公園の近くがいいと思いますよ。」\n田中：「今度ぜひうちへ（ C ）。」\n\n46. ( A ) に入るのはどれですか。',
        image_url: null,
        audio_url: null,
        option_a: '前の家ほど会社に近くなりました。',
        option_b: '前の家より会社からとおくなりました。',
        option_c: '前の家より会社に近くなりました。',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'කලින් නිවසේ සිට ගමනට පැය එකහමාරක් ගතවූ අතර දැන් විනාඩි 40 ක් වන බැවින් කලින්ට වඩා සමාගමට සමීප විය (前の家より会社に近くなりました).'
      },
      {
        order_num: 47,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '47. ( B ) に入るのはどれですか。',
        image_url: null,
        audio_url: null,
        option_a: '買い物に便利でも',
        option_b: '買い物にふべんでも',
        option_c: 'テニスコートがあっても',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'සාප්පු සවාරි වලට අපහසු වුවද උද්‍යානය සමීපව තිබීම හොඳ බව පැවසීමට "買い物にふべんでも (සාප්පු සවාරි අපහසු වුවත්)" යෙදේ.'
      },
      {
        order_num: 48,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '48. ( C ) に入るのはどれですか。',
        image_url: null,
        audio_url: null,
        option_a: 'あそんできましょう。',
        option_b: 'あそびに来てください。',
        option_c: 'あそんで行きましょう。',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'තමන්ගේ නිවසට ආරාධනා කිරීමට "あそびに来てください (විනෝදයට එන්න/පැමිණෙන්න)" යෙදේ.'
      },
      {
        order_num: 49,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【せかいのてんきの<ruby>地図<rt>ちず</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>答<rt>こた</rt></ruby>えなさい】\n\n49. 晴れている町はどれですか。',
        image_url: null,
        audio_url: null,
        option_a: 'カイロ',
        option_b: 'モスクワ',
        option_c: 'ロサンゼルス',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'සිතියම අනුව කයිරෝ (カイロ) හි කාලගුණය අව්ව සහිතව පායා ඇත (晴れ ☀️).'
      },
      {
        order_num: 50,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '50. くもっている町はどれですか。',
        image_url: null,
        audio_url: null,
        option_a: 'ロンドン',
        option_b: 'ジャカルタ',
        option_c: 'シドニー',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'සිතියම අනුව ලන්ඩන් (ロンドン) හි කාලගුණය වළාකුළු පිරි ඇත (くもり ☁️).'
      },
      {
        order_num: 51,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '51. 雨がふっている町はどれですか。',
        image_url: null,
        audio_url: null,
        option_a: 'サンパウロ',
        option_b: 'ジャカルタ',
        option_c: 'ロンドン',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'සිතියම අනුව ජකර්තා (ジャカルタ) හි වැසි වසියි (雨 ☂️).'
      },
      {
        order_num: 52,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '52. 雪がふっている町はどれですか。',
        image_url: null,
        audio_url: null,
        option_a: 'ソウル',
        option_b: 'ニューヨーク',
        option_c: 'モスクワ',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'සිතියම අනුව මොස්කව් (モスクワ) හි හිම පතනය වේ (雪 ⛄).'
      },
      {
        order_num: 53,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>にあう<ruby>絵<rt>え</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください】\n\n[絵の選択肢]\na: 太陽・快晴\nb: 雨傘・雨\nc: 汗をかいて暑がる人\nd: 寒がる人\n\n53. 「きのおは あつかったですね。」「そうですね。あつかったですね。」「たいへんでしたね。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: 太陽',
        option_b: 'b: 雨傘',
        option_c: 'c: 暑がる人',
        option_d: 'd: 寒がる人',
        correct_option: 'C',
        marks: 5,
        explanation: 'රස්නය නිසා දහඩිය දමමින් සිටින පුද්ගලයා (c) ගැලපේ.'
      },
      {
        order_num: 54,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '54. 「いい てんきですね。」「そうですね。いい てんきですね。」「きもちが いいですね。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: 太陽・快晴',
        option_b: 'b: 雨傘',
        option_c: 'c: 暑がる人',
        option_d: 'd: 寒がる人',
        correct_option: 'A',
        marks: 5,
        explanation: 'හොඳින් පායා ඇති ප්‍රියජනක හිරු (a: 太陽) ගැලපේ.'
      },
      {
        order_num: 55,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '55. 「きのうは よく ふりましたね。」「ええ、すごい あめでしたね。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: 太陽',
        option_b: 'b: 雨傘・雨',
        option_c: 'c: 暑がる人',
        option_d: 'd: 寒がる人',
        correct_option: 'B',
        marks: 5,
        explanation: 'තද වැස්ස දැක්වෙන කුඩය (b: 雨傘) ගැලපේ.'
      },
      {
        order_num: 56,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '56. 「さむいですね。」「ええ、さむいですね。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: 太陽',
        option_b: 'b: 雨傘',
        option_c: 'c: 暑がる人',
        option_d: 'd: 寒がる人',
        correct_option: 'D',
        marks: 5,
        explanation: 'සීතලෙන් වෙව්ලන පුද්ගලයා (d: 寒がる人) ගැලපේ.'
      },
      {
        order_num: 57,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【<ruby>会話<rt>かいわ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、ここにあっているものを<ruby>選<rt>えら</rt></ruby>びなさい】\n\nワン：「たなかさん、サクラゆうえんちは どの あたりですか。」\nたなか：「この あたりです。ワンさん、サクラゆうえんちは たのしいけど、ちょっと 高いですよ。」\nワン：「え、そうですか。」\nたなか：「でも、とても 人気があります。ゆうえんちだけど、おとなも 多いです。」\nワン：「そうですか。わかりました。」\n\n57. ここにあっているものはどれですか。',
        image_url: null,
        audio_url: null,
        option_a: 'サクラゆうえんちは人気があるけど安いです',
        option_b: 'サクラゆうえんちはおとなにはいることができません',
        option_c: 'サクラゆうえんちはたのしいです。でもねだんが高いです',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'තනකා මහතා සඳහන් කරන්නේ සකුරා විනෝද උද්‍යානය විනෝදජනක වුවත් මිල අධික බවයි ("たのしいけど、ちょっと高いですよ").'
      },
      {
        order_num: 58,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>言<rt>い</rt></ruby>い<ruby>方<rt>かた</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びなさい】\n\n男の人が重い荷物を持つ人に声をかけています：\n「たいへんですね。（ 58 ）」\n相手：「すみません。ありがとう ございます。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: てつだいましょうか。',
        option_b: 'b: てつだって くださいませんか。',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'තමන්ගෙන් උදව්වක් පිරිනැමීමට "てつだいましょうか (උදව් කරන්නද?)" යෙදේ.'
      },
      {
        order_num: 59,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>言<rt>い</rt></ruby>い<ruby>方<rt>かた</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びなさい】\n\n女性が書類を指して尋ねています：\n「これ、よく わかりません。ちょっと（ 59 ）」\n相手：「いいですよ。どれですか。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: せつめいしましょうか。',
        option_b: 'b: せつめいして くださいませんか。',
        option_c: '',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අනෙකාගෙන් පැහැදිලි කිරීමක් ඉල්ලා සිටීමට "せつめいして くださいませんか (පැහැදිලි කර දිය හැකිද?)" යෙදේ.'
      },
      {
        order_num: 60,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【<ruby>絵<rt>え</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>正<rt>ただ</rt></ruby>しい<ruby>言<rt>い</rt></ruby>い<ruby>方<rt>かた</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びなさい】\n\nエプロン姿の男性が困っている同僚に声をかけています：\n「あのう、かわりに（ 60 ）」\n相手：「いいですか。おねがいします。」',
        image_url: null,
        audio_url: null,
        option_a: 'a: 話しましょうか。',
        option_b: 'b: 話して くださいませんか。',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'වෙනුවට තමන් කථා කර දෙන්නදැයි ඉදිරිපත්ව ඇසීමට "話しましょうか (මම කථා කරන්නද?)" යෙදේ.'
      }
    ];

    for (const q of questions) {
      await db.query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text, image_url, audio_url,
          option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        q.explanation,
        q.order_num
      ]);
    }

    console.log(`✅ Successfully seeded JFT-Basic Official Model Paper 20 (${questions.length} questions, Exam ID: ${examId})!`);
    return { success: true, examId, totalQuestions: questions.length };
  } catch (err) {
    console.error('Error seeding Model Paper 20:', err);
    throw err;
  }
}

if (require.main === module) {
  seedJftModelPaper20().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedJftModelPaper20;
