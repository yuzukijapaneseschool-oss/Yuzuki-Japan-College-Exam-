const { db, query } = require('../config/database');

async function seedJftModelPaper11() {
  console.log('Seeding JFT-Basic Official Model Paper 11 (60 Questions, Pass 200/250)...');

  try {
    // 1. Check or insert exam
    let exam = await query.get("SELECT * FROM exams WHERE title LIKE '%Model Paper 11%' OR title LIKE '%Paper 11%'");
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
            title = 'JFT-Basic Official Model Paper 11 (60 Minutes)',
            description = 'Official JFT-Basic Prometric Computer-Based Examination Paper 11 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
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
          'JFT-Basic Official Model Paper 11 (60 Minutes)',
          'Official JFT-Basic Prometric Computer-Based Examination Paper 11 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
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
        question_text: '【イラストを見て正しい言葉を選びなさい】\n男の子がやっていることは何ですか。',
        image_url: '/images/jft_paper11/jft11_img_01.jpg',
        audio_url: null,
        option_a: '本を書く',
        option_b: 'きっぷをあつめる',
        option_c: 'きってをあつめる',
        option_d: '',
        correct_option: 'C',
        marks: 1,
        explanation: 'මුද්දර එකතු කිරීම ජපන් බසින් "きってをあつめる (Kitte o atsumeru / 切手を集める)" වේ.'
      },
      {
        order_num: 2,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n二人がしている日本のボードゲームは何ですか。',
        image_url: '/images/jft_paper11/jft11_img_02.jpg',
        audio_url: null,
        option_a: 'チェス',
        option_b: 'しょうぎ',
        option_c: 'じょうば',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'ජපන් සාම්ප්‍රදායික චෙස් ක්‍රීඩාව "しょうぎ (Shougi / 将棋)" වේ.'
      },
      {
        order_num: 3,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n男の子が空にあげているものは何ですか。',
        image_url: '/images/jft_paper11/jft11_img_03.jpg',
        audio_url: null,
        option_a: 'たこあげ',
        option_b: 'じょうば',
        option_c: 'チェス',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'සරුංගල් යැවීම ජපන් බසින් "たこあげ (Takoage / 凧揚げ)" වේ.'
      },
      {
        order_num: 4,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n馬に乗るスポーツは何ですか。',
        image_url: '/images/jft_paper11/jft11_img_04.jpg',
        audio_url: null,
        option_a: 'じょうぎ',
        option_b: 'じょうば',
        option_c: 'じょぎ',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'අශ්වාරෝහක පැදීම ජපන් බසින් "じょうば (Jouba / 乗馬)" වේ.'
      },
      {
        order_num: 5,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n女の子がしていることは何ですか。',
        image_url: '/images/jft_paper11/jft11_img_05.jpg',
        audio_url: null,
        option_a: 'としょかん',
        option_b: 'どくしょ',
        option_c: 'としょしつ',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'පොත් කියවීම ජපන් බසින් "どくしょ (Dokusho / 読書)" වේ.'
      },
      {
        order_num: 6,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n毛糸でセーターなどを編むことは何ですか。',
        image_url: '/images/jft_paper11/jft11_img_06.jpg',
        audio_url: null,
        option_a: 'あみもの',
        option_b: 'あまいもの',
        option_c: 'のみもの',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'ගෙතුම් වැඩ ජපන් බසින් "あみもの (Amimono / 編み物)" වේ.'
      },
      {
        order_num: 7,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n大晦日の夜にお寺でつく鐘は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_07.jpg',
        audio_url: null,
        option_a: 'ベル',
        option_b: 'お寺',
        option_c: 'じょやのかね',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'අලුත් අවුරුදු උදාවේ විහාරස්ථානවල නාද කරන සීනුව "じょやのかね (Joya no kane / 除夜の鐘)" වේ.'
      },
      {
        order_num: 8,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n冬によく食べるこの料理は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_08.jpg',
        audio_url: null,
        option_a: 'なべりょうり',
        option_b: 'たべりょうり',
        option_c: 'のみりょうり',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'ජපන් හොට් පොට් ආහාරය "なべりょうり (Nabe ryouri / 鍋料理)" වේ.'
      },
      {
        order_num: 9,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n雨がたくさん降る季節は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_09.jpg',
        audio_url: null,
        option_a: 'うえ',
        option_b: 'おき',
        option_c: 'うき',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'වැසි සමය "うき (Uki / 雨期)" වේ.'
      },
      {
        order_num: 10,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '【イラストを見て正しい言葉を選びなさい】\n雨があまり降らない乾燥した季節は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_10.jpg',
        audio_url: null,
        option_a: 'かんき',
        option_b: 'かんが',
        option_c: 'まんが',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'වියළි සමය "かんき (Kanki / 乾期)" වේ.'
      },
      {
        order_num: 11,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '来週、おとうとのクリケットの【試合】があります。',
        image_url: null,
        audio_url: null,
        option_a: 'しけん',
        option_b: 'しあい',
        option_c: 'じかん',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'තරඟය හෙවත් "試合" කන්ජිය හිරගනාවෙන් "しあい (Shiai)" වේ.'
      },
      {
        order_num: 12,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'この町では、ふゆでも【雪】がふりません。',
        image_url: null,
        audio_url: null,
        option_a: 'あめ',
        option_b: 'でん',
        option_c: 'ゆき',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'හිම හෙවත් "雪" කන්ජිය හිරගනාවෙන් "ゆき (Yuki)" වේ.'
      },
      {
        order_num: 13,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'てがみをおくる【方法】を説明してください。',
        image_url: null,
        audio_url: null,
        option_a: 'ぼうぼう',
        option_b: 'ぽうぽう',
        option_c: 'ほうほう',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'ක්‍රමය හෙවත් "方法" කන්ජිය හිරගනාවෙන් "ほうほう (Houhou)" වේ.'
      },
      {
        order_num: 14,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: 'おかねを持っていなかったので、【困り】ました。',
        image_url: null,
        audio_url: null,
        option_a: 'こまりました',
        option_b: 'とまりました',
        option_c: 'しんぱいしました',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'අපහසුතාවට පත්වුණා හෙවත් "困りました" කන්ජිය හිරගනාවෙන් "こまりました (Komarimashita)" වේ.'
      },
      {
        order_num: 15,
        section_name: 'Section 1: Script and Vocabulary (文字・語彙 - Moji & Goi)',
        question_text: '写真を見ると、むかしの【生活】がよくわかります。',
        image_url: null,
        audio_url: null,
        option_a: 'かつどう',
        option_b: 'せいかつ',
        option_c: 'せいどう',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'ජීවන රටාව හෙවත් "生活" කන්ජිය හිරගනාවෙන් "せいかつ (Seikatsu)" වේ.'
      },

      // ================= SECTION 2: Conversation and Grammar (Kaiwa & Bunpou) [Q16 - Q30] =================
      {
        order_num: 16,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: 'ヤンさんは______よく料理をつくります。',
        image_url: null,
        audio_url: null,
        option_a: 'ひまとき',
        option_b: 'ひまなとき',
        option_c: 'ひまなでとき',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'Na-adjective (ひまな) + とき -> "ひまなとき (හිස් වේලාවට)" නිවැරදි වේ.'
      },
      {
        order_num: 17,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '歩き______食べてはいけません。すわって食べなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'ながら',
        option_b: 'まま',
        option_c: 'ばかり',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'ක්‍රියාපද Stem + ながら (ඇවිදින අතරතුර / එකවර කරන ක්‍රියා) -> "歩きながら (ඇවිදින ගමන්)" වේ.'
      },
      {
        order_num: 18,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '冬休みにはスキーをしに______と思っています。',
        image_url: null,
        audio_url: null,
        option_a: '行って',
        option_b: '行こう',
        option_c: '行き',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අදහස ප්‍රකාශ කිරීමේදී Volitional form (行こう) + と思っています -> "行こうと思っています" වේ.'
      },
      {
        order_num: 19,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: 'かぜをひいたんでしょう。今晩は早く______ほうがいいですよ。',
        image_url: null,
        audio_url: null,
        option_a: 'ねた',
        option_b: 'ねよう',
        option_c: 'ねて',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'උපදෙස් දීමේදී Ta-form + ほうがいい -> "ねたほうがいい (නිදාගත්තොත් හොඳයි)" වේ.'
      },
      {
        order_num: 20,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: 'さっきおかしを______すぎたので、ごはんが食べられません。',
        image_url: null,
        audio_url: null,
        option_a: '食べて',
        option_b: '食べる',
        option_c: '食べ',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'Verb stem + すぎる (අධිකව කිරීම) -> "食べすぎた (වැඩියෙන් කාපු නිසා)" වේ.'
      },
      {
        order_num: 21,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: 趣味は何ですか。\nB: クラシックを______です。\nA: そうですか。\nB: とくに、バッハが好きです。',
        image_url: '/images/jft_paper11/jft11_img_16.jpg',
        audio_url: null,
        option_a: '聞く',
        option_b: '聞いたり',
        option_c: '聞くこと',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'නාම පදයක් බවට පත් කිරීමේදී Dictionary form + ことです -> "聞くことです (අසන එක)" වේ.'
      },
      {
        order_num: 22,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【対話】\nA: 好きなきせつはいつですか。\nB: あきがいちばん好きです。\nA: ______。\nB: 食べ物がおいしいですから。',
        image_url: null,
        audio_url: null,
        option_a: 'どうしたんですか',
        option_b: 'どうしてですか',
        option_c: 'どれですか',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'හේතුව විමසීමේදී "どうしてですか (ඇයි ඒ?)" නිවැරදි වේ.'
      },
      {
        order_num: 23,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【電話の会話】\n田中: もしもし、ジョンさんですか。田中です。\nジョン: おひさしぶりです。田中さん、お元気ですか。\n田中: はい、元気です。こっちは今雨がふっています。\nジョン: (23)______。\n田中: (24)______。\nジョン: いい天気です。\n田中: そうですか。\n\n(23)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper11/jft11_img_17.jpg',
        audio_url: null,
        option_a: 'だいじょうぶですか',
        option_b: 'いいです',
        option_c: 'たいへんですね',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'වැස්ස නිසා ඇතිවන අපහසුවට සංවේදීව "たいへんですね (අපොයි කරදරයක් නේ)" යෙදීම ගැලපේ.'
      },
      {
        order_num: 24,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【電話の会話】\n(24)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper11/jft11_img_17.jpg',
        audio_url: null,
        option_a: 'どうしましたか',
        option_b: 'そっちはどうですか',
        option_c: 'あれはどうですか',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අනෙක් පාර්ශ්වයේ කාලගුණය ඇසීමට "そっちはどうですか (ඔයාගේ පැත්තේ කොහොමද?)" ගැලපේ.'
      },
      {
        order_num: 25,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【街案内】\nA: ここはぎんざタウンです。\nB: ぎんざタウン。\nA: (25)______にいろいろな店があります。\nB: そうですか。\nA: にぎやか(26)______たのしいですよ。\nB: いいですね。\nA: ぜひ行ってください。\nB: 行ってみます。\n\n(25)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper11/jft11_img_18.jpg',
        audio_url: null,
        option_a: 'このあいだ',
        option_b: 'このあたり',
        option_c: 'それから',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'මෙම ප්‍රදේශය අවට යන්න "このあたり (Kono atari)" වේ.'
      },
      {
        order_num: 26,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【街案内】\n(26)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper11/jft11_img_18.jpg',
        audio_url: null,
        option_a: 'の',
        option_b: 'に',
        option_c: 'ですが',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: '"にぎやかですが (ජනාකීර්ණ වුවත්) たのしいですよ" යන්න අර්ථවත් වේ.'
      },
      {
        order_num: 27,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【道案内】\nA: (27)______。はくぶつかんはどこですか。\nB: ふたつめのかどをみぎに(28)______。\nA: ひとつめのかどのみぎですね。\nB: いいえ、ひとつめじゃなくて、ふたつめですよ。\nA: ああ、ふたつめですね。ありがとうございました。\n\n(27)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper11/jft11_img_19.jpg',
        audio_url: null,
        option_a: 'しつれいします',
        option_b: 'すみません',
        option_c: 'どうですか',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'මගියෙකුගෙන් කරුණක් විමසීමට පෙර "すみません (සමාවෙන්න)" යොදයි.'
      },
      {
        order_num: 28,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【道案内】\n(28)に入る言葉を選びなさい。',
        image_url: '/images/jft_paper11/jft11_img_19.jpg',
        audio_url: null,
        option_a: 'まがってください',
        option_b: 'まがってくださいませんか',
        option_c: 'まがってはいけない',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'මග පෙන්වීමේදී "みぎにまがってください (දකුණට හැරෙන්න)" යොදයි.'
      },
      {
        order_num: 29,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【約束】\nA: 日曜日、まちあわせ。(29)______。\nB: そうですね。10時にさくらホテルのロビーはどうですか。\nA: 10時にさくらのロビーですね。(30)______。\nB: じゃまた。\nA: たのしみにまっています。\n\n(29)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'どうですか',
        option_b: 'どうしてですか',
        option_c: 'どうしますか',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'හමුවීමේ වේලාව හා ස්ථානය පිළිබඳ සැලසුම ඇසීමට "どうしますか (කොහොම කරමුද?)" යොදයි.'
      },
      {
        order_num: 30,
        section_name: 'Section 2: Conversation and Grammar (会話・文法 - Kaiwa & Bunpou)',
        question_text: '【約束】\n(30)に入る言葉を選びなさい。',
        image_url: null,
        audio_url: null,
        option_a: 'わかりました',
        option_b: 'わかりません',
        option_c: 'かしこまりました',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'මිතුරන් අතර එකඟතාව ප්‍රකාශ කිරීමේදී "わかりました (තේරුණා / හරි)" යොදයි.'
      },

      // ================= SECTION 3: Listening Comprehension (Choukai) [Q31 - Q45] =================
      {
        order_num: 31,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'What season is Japan now? (音声を聞いて正しい季節を選びなさい。)',
        image_url: '/images/jft_paper11/jft11_img_20.jpg',
        audio_url: '/audio/jft_paper11/jft11_q31_q32.mp3',
        option_a: 'a (はる)',
        option_b: 'b (なつ)',
        option_c: 'c (あき)',
        option_d: 'd (ふゆ)',
        correct_option: 'D',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ජපානයේ දැනට පවතින සෘතුව ශීත සෘතුව (d: ふゆ / winter) වේ.'
      },
      {
        order_num: 32,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'When will it get warmer? (音声を聞いて暖かくなる月を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q31_q32.mp3',
        option_a: '1月',
        option_b: '2月',
        option_c: '3月',
        option_d: '4月',
        correct_option: 'C',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව මාර්තු මාසයේදී (3月) කාලගුණය උණුසුම් වීමට පටන් ගනී.'
      },
      {
        order_num: 33,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'Which months are spring in Japan? (音声を聞いて日本の春の月を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q33_q34_q35.mp3',
        option_a: '3月,4月,5月',
        option_b: '4月,5月,6月',
        option_c: '5月,6月,7月',
        option_d: '4月,6月,7月',
        correct_option: 'A',
        marks: 5,
        explanation: 'ජපානයේ වසන්ත කාලය (Spring) වන්නේ මාර්තු, අප්‍රේල් සහ මැයි මාසයි (3月,4月,5月).'
      },
      {
        order_num: 34,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'Which month is「つゆ」(Rainy season)? (音声を聞いて「つゆ」の月を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q33_q34_q35.mp3',
        option_a: '2月',
        option_b: '3月',
        option_c: '6月',
        option_d: '9月',
        correct_option: 'C',
        marks: 5,
        explanation: 'ජපානයේ වැසි සෘතුව හෙවත් "つゆ (Tsuyu)" පැමිණෙන්නේ ජුනි මාසයේදී (6月) ය.'
      },
      {
        order_num: 35,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'Which months are winter in Japan? (音声を聞いて日本の冬の月を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q33_q34_q35.mp3',
        option_a: '11月,12月,01月',
        option_b: '12月,01月,02月',
        option_c: '01月,02月,03月',
        option_d: '09月,10月,11月',
        correct_option: 'B',
        marks: 5,
        explanation: 'ජපානයේ ශීත කාලය (Winter) වන්නේ දෙසැම්බර්, ජනවාරි සහ පෙබරවාරි මාසයි (12月,01月,02月).'
      },
      {
        order_num: 36,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'When will Tokyo get colder? (音声を聞いて東京が寒くなる月を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q36.mp3',
        option_a: '9月',
        option_b: '10月',
        option_c: '11月',
        option_d: '12月',
        correct_option: 'C',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ටෝකියෝව නොවැම්බර් මාසයේදී (11月) ශීතල වේ.'
      },
      {
        order_num: 37,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: "How many people are there in Mari's family? (音声を聞いてまりさんの家族の人数を選びなさい。)",
        image_url: '/images/jft_paper11/jft11_img_21.jpg',
        audio_url: '/audio/jft_paper11/jft11_q37_q38.mp3',
        option_a: '1人',
        option_b: '2人',
        option_c: '3人',
        option_d: '4人',
        correct_option: 'C',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව මාරිගේ පවුලේ සාමාජිකයින් 3 දෙනෙකි (3人).'
      },
      {
        order_num: 38,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: "What is Mari's job? Where does she work? (音声を聞いてまりさんの仕事・職場を選びなさい。)",
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q37_q38.mp3',
        option_a: '病院',
        option_b: 'ホテル',
        option_c: 'しゅふ',
        option_d: '学生',
        correct_option: 'B',
        marks: 5,
        explanation: 'මාරි හෝටලයක (ホテル / Hotel) සේවය කරයි.'
      },
      {
        order_num: 39,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: "How many family members does this person's sister have? (お姉さんの家族の人数を選びなさい。)",
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q39_q40.mp3',
        option_a: '1人',
        option_b: '2人',
        option_c: '3人',
        option_d: '4人',
        correct_option: 'C',
        marks: 5,
        explanation: 'ශ්‍රව්‍ය පටය අනුව ඇයගේ සොහොයුරියගේ පවුලේ සාමාජිකයින් 3 දෙනෙකි (3人).'
      },
      {
        order_num: 40,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: "What does this person's sister do? (お姉さんはどこで何をしていますか。)",
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q39_q40.mp3',
        option_a: 'イタリアに住んでいます。学生です。オペラを習っています',
        option_b: 'イタリアに住んでいます。きょうしです。オペラをおしえています',
        option_c: '日本に住んでいます。きょうしです。おぺらをおしえています',
        option_d: '日本に住んでいます。学生です。オペラを習っています',
        correct_option: 'A',
        marks: 5,
        explanation: 'ඇය ඉතාලියේ ජීවත් වන අතර ශිෂ්‍යාවකි. ඔපෙරා සංගීතය ඉගෙන ගනියි.'
      },
      {
        order_num: 41,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'Which one is right here? (音声を聞いて正しい文を選びなさい。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q41.mp3',
        option_a: 'おばはポルトガル語と英語ができますけどかんこく語はできません',
        option_b: 'おばはおっととポルトガル語で話します',
        option_c: 'おばはかんこく語と英語ができますけどポルトガル語はできません',
        option_d: 'おばはおっとと韓国語で話します',
        correct_option: 'A',
        marks: 5,
        explanation: 'නැන්දා පෘතුගීසි සහ ඉංග්‍රීසි කතා කළ හැකි වුවද කොරියානු බස කතා කළ නොහැකිය.'
      },
      {
        order_num: 42,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: "What is Joe's hobby? (音声を聞いてジョーさんの趣味を選びなさい。)",
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q42.mp3',
        option_a: '電車の写真をあつめること',
        option_b: '電車で行くこと',
        option_c: '電車の写真をとること',
        option_d: '電車のきっぷをあつめること',
        correct_option: 'C',
        marks: 5,
        explanation: 'ජෝගේ විනෝදාංශය වන්නේ දුම්රියවල ඡායාරූප ගැනීමයි (電車の写真をとること).'
      },
      {
        order_num: 43,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'Where is the place that these two are talking about? (二人が話している場所はどこですか。)',
        image_url: '/images/jft_paper11/jft11_img_22.jpg',
        audio_url: '/audio/jft_paper11/jft11_q43.mp3',
        option_a: 'a (Fish Market)',
        option_b: 'b (Ramen & Entertainment street)',
        option_c: 'c (Brand Shop)',
        option_d: 'd (Mount Fuji)',
        correct_option: 'B',
        marks: 5,
        explanation: 'ඔවුන් කතා කරන්නේ රාමන් සහ කඩසාප්පු පිරි සජීවී වීදියක් (b) ගැනය.'
      },
      {
        order_num: 44,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: "What's at the west exit of Shinjuku? (新宿の西口には何がありますか。)",
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q44_q45.mp3',
        option_a: '短いビル',
        option_b: 'おしゃれなビル',
        option_c: '高いビル',
        option_d: '駅',
        correct_option: 'C',
        marks: 5,
        explanation: 'ෂින්ජුකු බටහිර දොරටුවේ උස් ගොඩනැගිලි (高いビル / Tall buildings) පිහිටා ඇත.'
      },
      {
        order_num: 45,
        section_name: 'Section 3: Listening Comprehension (聴解 - Choukai)',
        question_text: 'What kind of place is Shinjuku? (新宿はどんな場所ですか。)',
        image_url: null,
        audio_url: '/audio/jft_paper11/jft11_q44_q45.mp3',
        option_a: '夜はふかいです',
        option_b: '夜はあぶないです',
        option_c: '夜はうるさいです',
        option_d: '夜はにぎやかです',
        correct_option: 'D',
        marks: 5,
        explanation: 'රාත්‍රියට ෂින්ජුකු ඉතා සජීවී හා ජනාකීර්ණ ස්ථානයකි (夜はにぎやかです).'
      },

      // ================= SECTION 4: Reading Comprehension (Dokkai) [Q46 - Q60] =================
      {
        order_num: 46,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【動画コメントについての問題】\nL2thePzと言う人は何がとくいですか。',
        image_url: '/images/jft_paper11/jft11_img_27.jpg',
        audio_url: null,
        option_a: 'フルーツケーキ',
        option_b: 'プル―シケーキ',
        option_c: 'フルーシケーキ',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'L2thePz පවසන්නේ තමාට පලතුරු කේක් (フルーツケーキ / Fruit cake) සෑදීම දක්ෂ බවයි.'
      },
      {
        order_num: 47,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【動画コメントについての問題】\nMyfishと言う人はよく作るのはどれか。',
        image_url: '/images/jft_paper11/jft11_img_27.jpg',
        audio_url: null,
        option_a: '魚カレー',
        option_b: 'とり肉カレー',
        option_c: 'ぶた肉カレー',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'Myfish පවසන්නේ තමා නිතර චිකන් කරි (とり肉カレー / Chicken curry) හදන බවයි.'
      },
      {
        order_num: 48,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージについての問題】\nなぜ彼女は遅れるのですか。',
        image_url: '/images/jft_paper11/jft11_img_28.jpg',
        audio_url: null,
        option_a: '電車が早くいかないから',
        option_b: '電車がうごかないから',
        option_c: '電車がないから',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'පණිවිඩයේ "でんしゃがとまりました (දුම්රිය නැවතුණා)" යනුවෙන් ඇති බැවින් දුම්රිය ධාවනය නොවීම (電車がうごかないから) නිවැරදි වේ.'
      },
      {
        order_num: 49,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージを読んで正しいものに〇、ちがうものに×を選びなさい】\nりょうくんは、ジョイさんのまごです。',
        image_url: '/images/jft_paper11/jft11_img_30.jpg',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'රියෝ කුන් "おばあちゃん (ආච්චි)" ලෙස අමතන බැවින් ඔහු ඇයගේ මුණුබුරා (まご) වේ.'
      },
      {
        order_num: 50,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージを読んで正しいものに〇、ちがうものに×を選びなさい】\nりょうくんは今ひろしまに住んでいます。',
        image_url: '/images/jft_paper11/jft11_img_30.jpg',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'ආච්චි "らいしゅう、広島に行きますよ (ලබන සතියේ හිරෝෂිමාවට එන්නම්)" යයි පවසන බැවින් රියෝ හිරෝෂිමාවේ ජීවත් වේ.'
      },
      {
        order_num: 51,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージを読んで正しいものに〇、ちがうものに×を選びなさい】\nりょうくんとおばあちゃんはいっしょに住んでいます。',
        image_url: '/images/jft_paper11/jft11_img_30.jpg',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ආච්චි ටෝකියෝවේ ද රියෝ හිරෝෂිමාවේ ද ජීවත් වන බැවින් ඔවුන් එකට ජීවත් නොවේ.'
      },
      {
        order_num: 52,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージを読んで正しいものに〇、ちがうものに×を選びなさい】\n来週おじいちゃんはひろしまに行きます。',
        image_url: '/images/jft_paper11/jft11_img_30.jpg',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'ආච්චි "おじいちゃんもいっしょです (සීයත් මා සමග එනවා)" යැයි පවසන බැවින් නිවැරදිය.'
      },
      {
        order_num: 53,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メッセージを読んで正しいものに〇、ちがうものに×を選びなさい】\nおじいちゃんは日本語を勉強しています。',
        image_url: '/images/jft_paper11/jft11_img_30.jpg',
        audio_url: null,
        option_a: '〇 (正しい)',
        option_b: '× (正しくない)',
        option_c: '',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'පණිවිඩයේ "おじいちゃんは日本語をべんきょうしていません (සීයා ජපන් බස ඉගෙන ගන්නේ නැත)" ලෙස පැහැදිලිව සඳහන් වේ.'
      },
      {
        order_num: 54,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【4人の趣味についての文章】\n1ばんの人の趣味は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_31.jpg',
        audio_url: null,
        option_a: 'a (モネの絵を見る)',
        option_b: 'b (料理をつくる)',
        option_c: 'c (公園で絵を描く)',
        option_d: 'd (焼きそばを食べる)',
        correct_option: 'A',
        marks: 5,
        explanation: '1 වැනි පුද්ගලයාගේ විනෝදාංශය වන්නේ කෞතුකාගාරයට ගොස් මොනේගේ චිත්‍ර නැරඹීමයි (a).'
      },
      {
        order_num: 55,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【4人の趣味についての文章】\n2ばんの人の趣味は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_31.jpg',
        audio_url: null,
        option_a: 'a (モネの絵を見る)',
        option_b: 'b (料理をつくる)',
        option_c: 'c (公園で絵を描く)',
        option_d: 'd (焼きそばを食べる)',
        correct_option: 'C',
        marks: 5,
        explanation: '2 වැනි පුද්ගලයාගේ විනෝදාංශය වන්නේ නිවාඩු වේලාවට උද්‍යානයේදී මල්වල චිත්‍ර ඇඳීමයි (c).'
      },
      {
        order_num: 56,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【4人の趣味についての文章】\n3ばんの人の趣味は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_31.jpg',
        audio_url: null,
        option_a: 'a (モネの絵を見る)',
        option_b: 'b (料理をつくる)',
        option_c: 'c (公園で絵を描く)',
        option_d: 'd (焼きそばを食べる)',
        correct_option: 'D',
        marks: 5,
        explanation: '3 වැනි පුද්ගලයාගේ විනෝදාංශය වන්නේ යකිසෝබා වැනි ආහාර අනුභවයයි (d).'
      },
      {
        order_num: 57,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【4人の趣味についての文章】\n4ばんの人の趣味は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_31.jpg',
        audio_url: null,
        option_a: 'a (モネの絵を見る)',
        option_b: 'b (料理をつくる)',
        option_c: 'c (公園で絵を描く)',
        option_d: 'd (焼きそばを食べる)',
        correct_option: 'B',
        marks: 5,
        explanation: '4 වැනි පුද්ගලයාගේ විනෝදාංශය වන්නේ ගියූදොන් වැනි ආහාර පිසීමයි (b).'
      },
      {
        order_num: 58,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【メールについての問題】\nあかりさんの質問は何ですか。',
        image_url: '/images/jft_paper11/jft11_img_33.jpg',
        audio_url: null,
        option_a: '日本の今のきせつと暑い時のいい服',
        option_b: 'メルボルンの今のきせつと今のきせつのためにいい服',
        option_c: 'メルボンの今のきせつと寒い時のいい服',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'අකාරි විමසන්නේ මෙල්බර්න්වල වත්මන් සෘතුව සහ ඊට සුදුසු ඇඳුම් මොනවාද යන්නයි.'
      },
      {
        order_num: 59,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【ケイトさんの返信メール】\nメルボルンは今どんなきせつですか。',
        image_url: '/images/jft_paper11/jft11_img_34.jpg',
        audio_url: null,
        option_a: '冬',
        option_b: '夏',
        option_c: '春',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'කේට් පවසන්නේ මෙල්බර්න්වල දැන් ගිම්හාන කාලය (夏 / Summer) බවයි.'
      },
      {
        order_num: 60,
        section_name: 'Section 4: Reading Comprehension (読解 - Dokkai)',
        question_text: '【ケイトさんの返信メール】\nメルボルンの今の昼と夜はどうですか。',
        image_url: '/images/jft_paper11/jft11_img_34.jpg',
        audio_url: null,
        option_a: '昼は暖かい、夜は寒い',
        option_b: '昼は寒い、夜は暑い',
        option_c: '昼は暑い、夜は寒い',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ලිපියේ "ひるはあついです... よるはさむくなります" ලෙස ඇති බැවින් දවල්ට රස්නෙයි, රෑට ශීතලයි (昼は暑い、夜は寒い) නිවැරදි වේ.'
      }
    ];

    console.log(`Inserting ${questions.length} questions for JFT Model Paper 11...`);
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

    console.log(`Successfully seeded JFT Model Paper 11 with ${questions.length} questions!`);
  } catch (err) {
    console.error('Error seeding JFT Model Paper 11:', err);
    throw err;
  }
}

if (require.main === module) {
  seedJftModelPaper11()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedJftModelPaper11 };
