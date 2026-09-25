const { query } = require('../config/database');

async function seedJftModelPaper13() {
  console.log('Seeding JFT-Basic Official Model Paper 13 (60 Questions, Pass 200/250)...');
  const title = 'JFT-Basic Official Model Paper 13 (60 Minutes)';

  try {
    let exam = await query.get("SELECT id FROM exams WHERE title = ? OR title LIKE '%Paper 13%'", [title]);
    let examId;

    if (exam) {
      examId = exam.id;
      console.log(`Found existing Exam ID: ${examId}, resetting questions...`);
      await query.run('DELETE FROM questions WHERE exam_id = ?', [examId]);
      await query.run(`
        UPDATE exams 
        SET course_id = 1,
            title = ?,
            description = 'Official JFT-Basic Prometric Computer-Based Examination Paper 13 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
            duration_minutes = 60,
            passing_score = 200,
            is_active = 1
        WHERE id = ?
      `, [title, examId]);
    } else {
      const res = await query.run(`
        INSERT INTO exams (course_id, title, description, duration_minutes, passing_score, is_active)
        VALUES (
          1,
          ?,
          'Official JFT-Basic Prometric Computer-Based Examination Paper 13 (Full 60 Questions, 250 Total Marks, 200 Passing Marks, Complete Listening Audio Tracks and Sinhala Explanations)',
          60,
          200,
          1
        )
      `, [title]);
      examId = res.id;
      console.log(`Created new Exam ID: ${examId}`);
    }

    const questions = [
      // ================= SECTION 1: Script & Vocabulary (文字・語彙 - Q01 to Q15) =================
      {
        order_num: 1,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q01.png',
        audio_url: null,
        option_a: 'すいぞくかん',
        option_b: 'はくぶつかん',
        option_c: 'さかなや',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'すいぞくかん (水族館) = මත්ස්‍යාගාරය / Aquarium. はくぶつかん = කෞතුකාගාරය. さかなや = මාළු කඩය.'
      },
      {
        order_num: 2,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q02.png',
        audio_url: null,
        option_a: 'スーパー',
        option_b: 'すいぞくかん',
        option_c: 'うおいちば',
        option_d: '',
        correct_option: 'C',
        marks: 1,
        explanation: 'うおいちば (魚市場) = මාළු වෙළඳපොළ / Fish market. スーパー = සුපිරි වෙළඳසැල.'
      },
      {
        order_num: 3,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q03.png',
        audio_url: null,
        option_a: 'でんきてん',
        option_b: 'でんき',
        option_c: 'てんきでん',
        option_d: '',
        correct_option: 'A',
        marks: 1,
        explanation: 'でんきてん (電気店) = විදුලි උපකරණ සාප්පුව / Electronics store. でんき = විදුලිය.'
      },
      {
        order_num: 4,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q04.png',
        audio_url: null,
        option_a: 'おばけへや',
        option_b: 'おばけ',
        option_c: 'おばけやしき',
        option_d: '',
        correct_option: 'C',
        marks: 1,
        explanation: 'おばけやしき (お化け屋敷) = හොල්මන් මන්දිරය / Haunted house amusement attraction.'
      },
      {
        order_num: 5,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q05.png',
        audio_url: null,
        option_a: 'ふきん',
        option_b: 'ふうりん',
        option_c: 'かぜ',
        option_d: '',
        correct_option: 'B',
        marks: 1,
        explanation: 'ふうりん (風鈴) = සුළං සීනුව (ජපන් සාම්ප්‍රදායික සීනුව) / Wind chime. かぜ = සුළඟ.'
      },
      {
        order_num: 6,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q06.png',
        audio_url: null,
        option_a: 'きんぎょばち',
        option_b: 'きんぎょはち',
        option_c: 'きんぎょぱち',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'きんぎょばち (金魚鉢) = රන් මත්ස්‍ය භාජනය / Goldfish bowl.'
      },
      {
        order_num: 7,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q07.png',
        audio_url: null,
        option_a: 'やだい',
        option_b: 'やたい',
        option_c: 'よたい',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'やたい (屋台) = වීදි ආහාර කුටිය / Street food stall.'
      },
      {
        order_num: 8,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q08.png',
        audio_url: null,
        option_a: 'おんがくをうたいます',
        option_b: 'おんがくを使います',
        option_c: 'おんがくを聞きます',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: 'おんがくを聞きます (おんがくをききます) = සංගීතයට සවන් දෙනවා / Listen to music.'
      },
      {
        order_num: 9,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q09.png',
        audio_url: null,
        option_a: 'そば',
        option_b: 'おにぎり',
        option_c: 'やきそば',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: 'おにぎり = බත් ගුලි / Japanese rice balls (Onigiri).'
      },
      {
        order_num: 10,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'イラストを見て正しい言葉を選んでください。\n(Look at the illustration and choose the correct word.)',
        image_url: '/uploads/images/jft13_q10.png',
        audio_url: null,
        option_a: 'からあげ',
        option_b: 'やき魚',
        option_c: 'サラダ',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: 'からあげ (唐揚げ) = බැදපු කුකුල් මස් / Japanese fried chicken.'
      },
      {
        order_num: 11,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'How do you write the underlined hiragana word in kanji? Choose the correct one.\n私の趣味は<ins>どくしょ</ins>です。(わたしのしゅみは どくしょ です。)',
        image_url: null,
        audio_url: null,
        option_a: '飲書',
        option_b: '食書',
        option_c: '読書',
        option_d: '',
        correct_option: 'C',
        marks: 2,
        explanation: '読書 (どくしょ) = පොත් කියවීම / Reading books. 読 (කියවීම) + 書 (පොත්).'
      },
      {
        order_num: 12,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: 'How do you write the underlined hiragana word in kanji? Choose the correct one.\n休みにいろいろな<ins>くに</ins>に行きました。(やすみに いろいろな くに に いきました。)',
        image_url: null,
        audio_url: null,
        option_a: '困',
        option_b: '国',
        option_c: '園',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: '国 (くに) = රට / Country. 困 = අපහසුතාවය. 園 = උද්‍යානය.'
      },
      {
        order_num: 13,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: '下線部の漢字の読み方を選んでください。(Choose the correct reading for the underlined kanji.)\n今年の夏は山と<ins>海</ins>であそびます。(ことしのなつはやまと うみ であそびます。)',
        image_url: null,
        audio_url: null,
        option_a: 'かわ',
        option_b: 'うみ',
        option_c: 'みなと',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: '海 = うみ (මුහුද / Sea/Ocean). かわ = ගඟ. みなと = වරාය.'
      },
      {
        order_num: 14,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: '下線部の漢字の読み方を選んでください。(Choose the correct reading for the underlined kanji.)\n明日の天気は<ins>晴れ</ins>です。(あすのてんきは はれ です。)',
        image_url: null,
        audio_url: null,
        option_a: 'はれ',
        option_b: 'あれ',
        option_c: 'われ',
        option_d: '',
        correct_option: 'A',
        marks: 2,
        explanation: '晴れ = はれ (පැහැදිලි අව්ව සහිත කාලගුණය / Sunny/Fine weather).'
      },
      {
        order_num: 15,
        section_name: 'Section 1: Script & Vocabulary (文字・語彙)',
        question_text: '下線部の漢字の読み方を選んでください。(Choose the correct reading for the underlined kanji.)\n東京は今日くもりです。<ins>空</ins>は<ins>雲</ins>が多いです。(とうきょうは きょう くもりです。そらは くもが おおいです。)',
        image_url: null,
        audio_url: null,
        option_a: 'そら・日',
        option_b: 'そら・くも',
        option_c: 'そら・ほし',
        option_d: '',
        correct_option: 'B',
        marks: 2,
        explanation: '空 (そら = අහස) සහ 雲 (くも = වළාකුළු).'
      },

      // ================= SECTION 2: Conversation & Grammar (会話・文法 - Q16 to Q30) =================
      {
        order_num: 16,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '（16）に入る最もよいものを選んでください。\n\n私の趣味は外国のコインを(16)________。兄といっしょに(17)________。',
        image_url: null,
        audio_url: null,
        option_a: 'あつめています',
        option_b: 'あつめます',
        option_c: 'あつめることです',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: '「私の趣味は〜ことです」ආකෘතිය: මගේ විනෝදාංශය කාසි එකතු කිරීමයි (あつめることです).'
      },
      {
        order_num: 17,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '（17）に入る最もよいものを選んでください。\n\n私の趣味は外国のコインを(16)________。兄といっしょに(17)________。',
        image_url: null,
        audio_url: null,
        option_a: 'あつめています',
        option_b: 'あつめます',
        option_c: 'あつめることです',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'අයියා සමඟ එක්ව එකතු කරමින් සිටියි / කරමින් පවතී -> あつめています.'
      },
      {
        order_num: 18,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '（18）に入る最もよいものを選んでください。\nインドネシアは________あついです。',
        image_url: null,
        audio_url: null,
        option_a: '一か月',
        option_b: '一年中',
        option_c: '一か年',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: '一年中（いちねんじゅう）= වසර පුරාම / All year round. ඉන්දුනීසියාව වසර පුරාම උණුසුම්ය.'
      },
      {
        order_num: 19,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '（19）に入る最もよいものを選んでください。\n東京は３月ごろ、冬から________。',
        image_url: null,
        audio_url: null,
        option_a: '春です',
        option_b: '春があります',
        option_c: '春になります',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: '〜から〜になります (ශීත ඍතුවේ සිට වසන්ත ඍතුව බවට පත්වේ) -> 春になります.'
      },
      {
        order_num: 20,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '（20）に入る最もよいものを選んでください。\n私は花見のパーティーがにがてです。________は好きじゃないです。',
        image_url: null,
        audio_url: null,
        option_a: 'にぎやか',
        option_b: 'にぎやかなの',
        option_c: 'にぎやかが',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'Na-adjective + なの (නාමපදයක් බවට පත්කිරීම): にぎやかなの (ඝෝෂාකාරී/සෙනඟ පිරි දේ) は好きじゃないです.'
      },
      {
        order_num: 21,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（21）に入る最もよいものを選んでください。\n\nジョイ：これはむすめです。むすめは家族とひろしまに(21)________。\nよしだ：むすめさんは英語をおしえていますか。\nジョイ：いいえ、(22)________。\nよしだ：そうですか。むすめさんのご主人はどなたですか。\nジョイ：スミスさんです。オーストラリア人です。',
        image_url: null,
        audio_url: null,
        option_a: '住んでいます',
        option_b: '住んでいません',
        option_c: '住んだほうがいいです',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'පවුලේ අය සමඟ හිරෝෂිමා හි ජීවත් වේ -> 住んでいます (すんでいます).'
      },
      {
        order_num: 22,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（22）に入る最もよいものを選んでください。\n\nジョイ：これはむすめです。むすめは家族とひろしまに(21)________。\nよしだ：むすめさんは英語をおしえていますか。\nジョイ：いいえ、(22)________。\nよしだ：そうですか。むすめさんのご主人はどなたですか。\nジョイ：スミスさんです。オーストラリア人です。',
        image_url: null,
        audio_url: null,
        option_a: 'おしえません',
        option_b: 'おしえています',
        option_c: 'おしえました',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'いいえ (නැත) කියූ නිසා උගන්වන්නේ නැත -> おしえません.'
      },
      {
        order_num: 23,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（23）に入る最もよいものを選んでください。\n\nよしだ：タローさん、好きなきせつはいつですか。\nタロー：夏休みがありますから、夏がいちばん好きです。\nよしだ：私は夏はあまり(23)________です。\nタロー：(24)________。\nよしだ：暑い(25)________にがてですから。',
        image_url: '/uploads/images/jft13_q23_25.png',
        audio_url: null,
        option_a: '好きじゃないです',
        option_b: '好き',
        option_c: '好きでしょう',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'あまり (වැඩිය) + ඍණාත්මක -> あまり好きじゃないです (වැඩිය කැමති නෑ).'
      },
      {
        order_num: 24,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（24）に入る最もよいものを選んでください。\n\nよしだ：タローさん、好きなきせつはいつですか。\nタロー：夏休みがありますから、夏がいちばん好きです。\nよしだ：私は夏はあまり(23)________です。\nタロー：(24)________。\nよしだ：暑い(25)________にがてですから。',
        image_url: '/uploads/images/jft13_q23_25.png',
        audio_url: null,
        option_a: 'どうしますか',
        option_b: 'どうしてですか',
        option_c: 'だいじょうぶですか',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'හේතුව විමසීම: どうしてですか (ඇයි ඒ? / Why is that?).'
      },
      {
        order_num: 25,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（25）に入る最もよいものを選んでください。\n\nよしだ：タローさん、好きなきせつはいつですか。\nタロー：夏休みがありますから、夏がいちばん好きです。\nよしだ：私は夏はあまり(23)________です。\nタロー：(24)________。\nよしだ：暑い(25)________にがてですから。',
        image_url: '/uploads/images/jft13_q23_25.png',
        audio_url: null,
        option_a: 'のが',
        option_b: 'が',
        option_c: 'のも',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'ක්‍රියාපදය/විශේෂණය නාමපදයක් කිරීමට -> 暑いのがにがて (රස්නය අගුණයි/අකමැතියි).'
      },
      {
        order_num: 26,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（26）に入る最もよいものを選んでください。\n\nA：昨日はすごい雨でしたね。\nB：はい、よくふりましたね。そして、(26)________でした。私は一日中うちにいました。\nA：そうですか。でも今日は(27)________ね。\nB：ええ、今日は晴れですね。',
        image_url: '/uploads/images/jft13_q26_27.png',
        audio_url: null,
        option_a: 'あたたかかった',
        option_b: 'さむくなかった',
        option_c: 'さむかった',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ඊයේ වැස්ස නිසා සීතල විය -> さむかった (සීතලයි).'
      },
      {
        order_num: 27,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（27）に入る最もよいものを選んでください。\n\nA：昨日はすごい雨でしたね。\nB：はい、よくふりましたね。そして、(26)________でした。私は一日中うちにいました。\nA：そうですか。でも今日は(27)________ね。\nB：ええ、今日は晴れですね。',
        image_url: '/uploads/images/jft13_q26_27.png',
        audio_url: null,
        option_a: 'いい天気になりましたね',
        option_b: 'いい天気でしたね',
        option_c: 'いい天気じゃないね',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'අද කාලගුණය හොඳ අතට පත් විය -> いい天気になりましたね.'
      },
      {
        order_num: 28,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（28）に入る最もよいものを選んでください。\n\nアベ：ワンさん、このあたりはうえの公園です。\nワン：うえの公園。(28)________ですか。\nアベ：この公園は(29)________、きれいです。公園の中にどうぶつえんやコーヒーショップもあります。\nワン：いいですね。(30)________。',
        image_url: '/uploads/images/jft13_q28_30.png',
        audio_url: null,
        option_a: 'どこところ',
        option_b: 'どんなところ',
        option_c: 'どれところ',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ස්වභාවය විමසීම: どんなところですか (කෙබඳු තැනක්ද?).'
      },
      {
        order_num: 29,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（29）に入る最もよいものを選んでください。\n\nアベ：ワンさん、このあたりはうえの公園です。\nワン：うえの公園。(28)________ですか。\nアベ：この公園は(29)________、きれいです。公園の中にどうぶつえんやコーヒーショップもあります。\nワン：いいですね。(30)________。',
        image_url: '/uploads/images/jft13_q28_30.png',
        audio_url: null,
        option_a: '広いで',
        option_b: '広いに',
        option_c: '広くて',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'I-adjective සම්බන්ධ කිරීම: 広い -> 広くて、きれいです (විශාලයි සහ ලස්සනයි).'
      },
      {
        order_num: 30,
        section_name: 'Section 2: Conversation & Grammar (会話・文法)',
        question_text: '対話を読んで（30）に入る最もよいものを選んでください。\n\nアベ：ワンさん、このあたりはうえの公園です。\nワン：うえの公園。(28)________ですか。\nアベ：この公園は(29)________、きれいです。公園の中にどうぶつえんやコーヒーショップもあります。\nワン：いいですね。(30)________。',
        image_url: '/uploads/images/jft13_q28_30.png',
        audio_url: null,
        option_a: '行ってらっしゃい',
        option_b: '行ってきます',
        option_c: '行って見ます',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ගොස් බලන්නම් (Let\'s go and see) -> 行ってみます (行って見ます).'
      },

      // ================= SECTION 3: Listening Comprehension (聴解 - Q31 to Q45) =================
      {
        order_num: 31,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n4人はピクニックのそうだんをします。\nあべさんは何を持ってきますか。',
        image_url: '/uploads/images/jft13_q31.png',
        audio_url: '/uploads/audio/jft13_q31_34.mp3',
        option_a: 'サンドイッチ',
        option_b: '飲み物・ケーキ',
        option_c: 'おにぎり・ケーキ',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'Audio එක අනුව අබේ-සං ගෙන එන්නේ බීම සහ කේක් (飲み物・ケーキ) වේ.'
      },
      {
        order_num: 32,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n4人はピクニックのそうだんをします。\nカーラさんは何を持ってきますか。',
        image_url: '/uploads/images/jft13_q31.png',
        audio_url: '/uploads/audio/jft13_q31_34.mp3',
        option_a: '飲み物・食べ物',
        option_b: 'ワイン・くだもの',
        option_c: 'ワイン・食べ物',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'කාර්ලා-සං ගෙන එන්නේ වයින් සහ පළතුරු (ワイン・くだもの) වේ.'
      },
      {
        order_num: 33,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n4人はピクニックのそうだんをします。\nパクさんは何を持ってきますか。',
        image_url: '/uploads/images/jft13_q31.png',
        audio_url: '/uploads/audio/jft13_q31_34.mp3',
        option_a: '飲み物・韓国の食べ物',
        option_b: '飲み物・日本の食べ物',
        option_c: '飲み物・中国の食べ物',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'පාක්-සං කොරියානු කෑම වර්ග සහ බීම (飲み物・韓国の食べ物) රැගෙන එයි.'
      },
      {
        order_num: 34,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n4人はピクニックのそうだんをします。\nやぎさんは何を持ってきますか。',
        image_url: '/uploads/images/jft13_q31.png',
        audio_url: '/uploads/audio/jft13_q31_34.mp3',
        option_a: 'おにぎり',
        option_b: 'パン',
        option_c: 'サンドイッチ',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'යාගි-සං සැන්ඩ්විච් (サンドイッチ) රැගෙන එයි.'
      },
      {
        order_num: 35,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\nピクニックにどんな食べ物と飲み物を持って行きますか。\nケーキは何がいいですか。',
        image_url: '/uploads/images/jft13_q35_38.png',
        audio_url: '/uploads/audio/jft13_q35_38.mp3',
        option_a: 'a (チョコレートのケーキ)',
        option_b: 'b (イチゴのケーキ)',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'Audio එක අනුව තෝරාගන්නේ චොකලට් කේක් (a) වේ.'
      },
      {
        order_num: 36,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\nピクニックにどんな食べ物と飲み物を持って行きますか。\nくだものが何がいいですか。',
        image_url: '/uploads/images/jft13_q35_38.png',
        audio_url: '/uploads/audio/jft13_q35_38.mp3',
        option_a: 'a (バナナとオレンジ)',
        option_b: 'b (イチゴとブドウ)',
        option_c: 'c (リンゴ)',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'පළතුරු සඳහා b තෝරාගනී.'
      },
      {
        order_num: 37,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\nピクニックにどんな食べ物と飲み物を持って行きますか。\nワインはどっちがいいですか。',
        image_url: '/uploads/images/jft13_q35_38.png',
        audio_url: '/uploads/audio/jft13_q35_38.mp3',
        option_a: 'a (赤ワイン)',
        option_b: 'b (白ワイン)',
        option_c: 'aとb (赤ワインと白ワイン両方)',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'රතු සහ සුදු වයින් වර්ග දෙකම (aとb) රැගෙන යාමට තීරණය කරයි.'
      },
      {
        order_num: 38,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\nピクニックにどんな食べ物と飲み物を持って行きますか。\n飲み物は何がいいですか。',
        image_url: '/uploads/images/jft13_q35_38.png',
        audio_url: '/uploads/audio/jft13_q35_38.mp3',
        option_a: 'a (お茶とジュース)',
        option_b: 'b (コーヒー)',
        option_c: 'c (コーラ)',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'තේ සහ ජූස් (a) තෝරාගනී.'
      },
      {
        order_num: 39,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n田中さんはいつ何時にきますか。',
        image_url: '/uploads/images/jft13_q39.png',
        audio_url: '/uploads/audio/jft13_q39.mp3',
        option_a: '22日、夜9時',
        option_b: '20日、朝9時',
        option_c: '20日、夜9時',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'තනකා-සං පැමිණෙන්නේ 20 වන දින රාත්‍රී 9ට (20日、夜9時) වේ.'
      },
      {
        order_num: 40,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\nさいとうさんはいつ何時にきますか。',
        image_url: '/uploads/images/jft13_q40.png',
        audio_url: '/uploads/audio/jft13_q40.mp3',
        option_a: '26日、夜3時',
        option_b: '16日、昼3時',
        option_c: '19日、昼3時',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'සයිතෝ-සං පැමිණෙන්නේ 16 වන දින දහවල් 3ට (16日、昼3時) වේ.'
      },
      {
        order_num: 41,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\nさいとうさんのフライトはいかがでしたか。正しいえを選んでください。',
        image_url: '/uploads/images/jft13_q41_b.png',
        audio_url: '/uploads/audio/jft13_q41.mp3',
        option_a: 'a (広い席で快適だった)',
        option_b: 'b (せまくて疲れた)',
        option_c: '',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'සයිතෝ-සංගේ ගුවන් ගමන ගැන පැහැදිලි කිරීම (b) වේ.'
      },
      {
        order_num: 42,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n田中さんのフライトはいかがでしたか。正しいえを選んでください。',
        image_url: '/uploads/images/jft13_q42_a.png',
        audio_url: '/uploads/audio/jft13_q42.mp3',
        option_a: 'a (テレビを見たり楽しんだ)',
        option_b: 'b (よく寝た)',
        option_c: 'c (ヘッドホンで映画を楽しんだ)',
        option_d: 'd (疲れて寝られなかった)',
        correct_option: 'C',
        marks: 5,
        explanation: 'තනකා-සං හෙඩ්ෆෝන් දමා ටීවී නැරඹීම (c) වේ.'
      },
      {
        order_num: 43,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n正しいえを選んでください。(Choose the correct picture according to the audio.)',
        image_url: '/uploads/images/jft13_p17_1.png',
        audio_url: '/uploads/audio/jft13_q43.mp3',
        option_a: 'a (電気のスイッチを消す)',
        option_b: 'b (ガスの元栓を閉める)',
        option_c: 'c (電話をかける)',
        option_d: 'd (鍵をかける)',
        correct_option: 'A',
        marks: 5,
        explanation: 'කාමරයෙන් පිටවීමේදී ලයිට් නිවා දැමීම (a) වේ.'
      },
      {
        order_num: 44,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n正しいえを選んでください。(Choose the correct picture according to the audio.)',
        image_url: '/uploads/images/jft13_p17_2.png',
        audio_url: '/uploads/audio/jft13_q44.mp3',
        option_a: 'a (電気のスイッチを消す)',
        option_b: 'b (ガスの元栓を閉める)',
        option_c: 'c (電話をかける)',
        option_d: 'd (鍵をかける)',
        correct_option: 'B',
        marks: 5,
        explanation: 'ගෑස් වෑල්වය වසා දැමීම (b) වේ.'
      },
      {
        order_num: 45,
        section_name: 'Section 3: Listening Comprehension (聴解)',
        question_text: '音声を再生して質問に答えてください。\n正しいえを選んでください。(Choose the correct picture according to the audio.)',
        image_url: '/uploads/images/jft13_p17_4.png',
        audio_url: '/uploads/audio/jft13_q45.mp3',
        option_a: 'a (電気のスイッチを消す)',
        option_b: 'b (ガスの元栓を閉める)',
        option_c: 'c (電話をかける)',
        option_d: 'd (鍵をかける)',
        correct_option: 'D',
        marks: 5,
        explanation: 'දොර අගුළු දැමීම (d) වේ.'
      },

      // ================= SECTION 4: Reading Comprehension (読解 - Q46 to Q60) =================
      {
        order_num: 46,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'カーラさんは3人の友達にメールを書きました。3人が送った返事です。\n46. 1のへんじはどれですか。',
        image_url: '/uploads/images/jft13_q46_48.png',
        audio_url: null,
        option_a: 'a (京都の博物館の返事)',
        option_b: 'b (日本料理の本の返事)',
        option_c: 'c (木曜日6時の返事)',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: '1 වන ඊමේල් එකේ කාර්ලා ජපන් කෑම හදන්න පොතක් ඉල්ලූ බැවින් පිළිතුර b (කෑම පොත් 2ක් තියෙනවා) වේ.'
      },
      {
        order_num: 47,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'カーラさんは3人の友達にメールを書きました。3人が送った返事です。\n47. 2のへんじはどれですか。',
        image_url: '/uploads/images/jft13_q46_48.png',
        audio_url: null,
        option_a: 'a (京都の博物館の返事)',
        option_b: 'b (日本料理の本の返事)',
        option_c: 'c (木曜日6時の返事)',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: '2 වන ඊමේල් එකේ කථිකා පරීක්ෂාව ඉල්ලූ බැවින් පිළිතුර c (බ්‍රහස්පතින්දා 6ට හමුවෙමු) වේ.'
      },
      {
        order_num: 48,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'カーラさんは3人の友達にメールを書きました。3人が送った返事です。\n48. 3のへんじはどれですか。',
        image_url: '/uploads/images/jft13_q46_48.png',
        audio_url: null,
        option_a: 'a (京都の博物館の返事)',
        option_b: 'b (日本料理の本の返事)',
        option_c: 'c (木曜日6時の返事)',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: '3 වන ඊමේල් එකේ කියෝතෝ කෞතුකාගාර විමසූ බැවින් පිළිතුර a වේ.'
      },
      {
        order_num: 49,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '説明にあう絵を選びなさい。(Choose the picture that matches the description.)\n\nおがわさん：私の町にフランス文化センターがあります。私はセンターで週に2回フランス語を勉強しています。それから、年に4、5回フランスのえいがを見に行きます。とても楽しいです。',
        image_url: '/uploads/images/jft13_q49_card.png',
        audio_url: null,
        option_a: 'a (フランスの映画を見に行く)',
        option_b: 'b (レストランで食事をする)',
        option_c: 'c (バス停で待つ)',
        option_d: 'd (グループで話す)',
        correct_option: 'A',
        marks: 5,
        explanation: 'ඔගාවා-සං ප්‍රංශ චිත්‍රපට නැරඹීමට යන බැවින් සිනමාශාලා රූපය (a) නිවැරදිය.'
      },
      {
        order_num: 50,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '説明にあう絵を選びなさい。(Choose the picture that matches the description.)\n\nやまださん：私の町においしいベトナムりょうりのレストランがあります。私はベトナムりょうりが好きですから、月に3、4回食べに行きます。いつかつくりかたをならいたいです。',
        image_url: '/uploads/images/jft13_q50_card.png',
        audio_url: null,
        option_a: 'a (映画を見る)',
        option_b: 'b (ベトナム料理を食べる)',
        option_c: 'c (バス停)',
        option_d: 'd (会話)',
        correct_option: 'B',
        marks: 5,
        explanation: 'යමදා-සං වියට්නාම අවන්හලක ආහාර ගන්නා රූපය (b) නිවැරදිය.'
      },
      {
        order_num: 51,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '説明にあう絵を選びなさい。(Choose the picture that matches the description.)\n\nさかいさん：私の町にはロシア人のかんこうきゃくがたくさん来ます。私はロシア語がすこしできますから、ときどきバスの乗りかたをおしえます。私もいつかロシアに旅行に行きたいです。',
        image_url: '/uploads/images/jft13_q51_card.png',
        audio_url: null,
        option_a: 'a (映画)',
        option_b: 'b (料理)',
        option_c: 'c (バスの乗り方を教える)',
        option_d: 'd (話し合い)',
        correct_option: 'C',
        marks: 5,
        explanation: 'සකායි-සං බස් නැවතුමේදී රුසියානු සංචාරකයින්ට මඟ පෙන්වන රූපය (c) නිවැරදිය.'
      },
      {
        order_num: 52,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '会話を読んで質問に答えてください。\n\nキム：ピクニックのくだものは何がいいですか。\nすずき：りんごはどうですか。あ、今のきせつはいちごもおいしいですよ。\nエド：私は何でもいいです。くだものは何でも好きですから。\nエド：飲み物はお茶とジュースとどちらがいいですか。\nすずき：私はお茶がいいです。ジュースはあまり飲みませんから。\nキム：私はどっちでもいいですよ。\nエド：じゃあ、お茶とジュースを持っていきます。\n\n52. エドさんの好きなくだものはどれか。',
        image_url: '/uploads/images/jft13_q52_53.png',
        audio_url: null,
        option_a: 'りんご',
        option_b: 'みかん',
        option_c: '何でも食べます (何でも好きです)',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'එඩ් පවසන්නේ තමන් ඕනෑම පළතුරකට කැමති බවයි (何でも好きですから).'
      },
      {
        order_num: 53,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '会話を読んで質問に答えてください。\n\nキム：ピクニックのくだものは何がいいですか。\nすずき：りんごはどうですか。あ、今のきせつはいちごもおいしいですよ。\nエド：私は何でもいいです。くだものは何でも好きですから。\nエド：飲み物はお茶とジュースとどちらがいいですか。\nすずき：私はお茶がいいです。ジュースはあまり飲みませんから。\nキム：私はどっちでもいいですよ。\nエド：じゃあ、お茶とジュースを持っていきます。\n\n53. ジュースはあまり飲まない人はどれか。',
        image_url: '/uploads/images/jft13_q52_53.png',
        audio_url: null,
        option_a: 'キム',
        option_b: 'すずき',
        option_c: 'エド',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'සුසුකි පවසන්නේ "ジュースはあまり飲みませんから" (ජූස් වැඩිය බොන්නේ නෑ) යනුවෙනි.'
      },
      {
        order_num: 54,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'メールを読んで質問に答えてください。\n\n件名：らいしゅうのピクニックについて\nさいとうさん\nらいしゅうのピクニック、楽しみですね。３つれんらくします。\n1. 食べ物は すずきさんと私が 買って行きます。お金は1人1000円です。ピクニックのとき、私にください。\n2. ケーキは チョコレートのケーキと バナナのケーキと どちらがいいですか。へんじをお願いします。\n3. 飲み物は じぶんで持っていってください。それから、コップやおさらも じぶんで持っていってください。\nよろしくお願いします。じゃあ、またらいしゅう！\nキム\n\n54. 食べ物を買って行く人は誰ですか。',
        image_url: '/uploads/images/jft13_q54_56.png',
        audio_url: null,
        option_a: 'キムとさいとう',
        option_b: 'すずきとキム',
        option_c: 'さいとうとすずき',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'කෑම මිලදී ගෙන එන්නේ සුසුකි සහ කිම් (すずきさんと私 / すずきとキム) වේ.'
      },
      {
        order_num: 55,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'メールを読んで質問に答えてください。\n\n件名：らいしゅうのピクニックについて\nさいとうさん\nらいしゅうのピクニック、楽しみですね。３つれんらくします。\n1. 食べ物は すずきさんと私が 買って行きます。お金は1人1000円です。ピクニックのとき、私にください。\n2. ケーキは チョコレートのケーキと バナナのケーキと どちらがいいですか。へんじをお願いします。\n3. 飲み物は じぶんで持っていってください。それから、コップやおさらも じぶんで持っていってください。\nよろしくお願いします。じゃあ、またらいしゅう！\nキム\n\n55. 食べ物を買うためにさいとうさんはいくら払わなければなりませんか。',
        image_url: '/uploads/images/jft13_q54_56.png',
        audio_url: null,
        option_a: '3000円',
        option_b: '2000円',
        option_c: '1000円',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'ඊමේල් එකේ "お金は1人1000円です" සඳහන් වන පරිදි එක් අයෙකුට යෙන් 1000කි.'
      },
      {
        order_num: 56,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'メールを読んで質問に答えてください。\n\n件名：らいしゅうのピクニックについて\nさいとうさん\nらいしゅうのピクニック、楽しみですね。３つれんらくします。\n1. 食べ物は すずきさんと私が 買って行きます。お金は1人1000円です。ピクニックのとき、私にください。\n2. ケーキは チョコレートのケーキと バナナのケーキと どちらがいいですか。へんじをお願いします。\n3. 飲み物は じぶんで持っていってください。それから、コップやおさらも じぶんで持っていってください。\nよろしくお願いします。じゃあ、またらいしゅう！\nキム\n\n56. 正しいものはどれか。',
        image_url: '/uploads/images/jft13_q54_56.png',
        audio_url: null,
        option_a: 'ピクニックのために飲み物、カップ、お皿などを自分で持って行かなくてもいいです',
        option_b: 'ピクニックのために飲み物、カップ、お皿などを自分で持って行くのはだめです',
        option_c: 'ピクニックのために飲み物、カップ、お皿などを自分で持って行かなければならない',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: '3 වන කරුණේ "飲み物、コップやおさらも じぶんで持っていってください" (තමාම ගෙන ආ යුතුය) සඳහන් වේ.'
      },
      {
        order_num: 57,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: 'メールを読んで質問に答えてください。\n\n件名：らいしゅうのバーベキュー\nきやまさん\nらいしゅうのバーベキュー、楽しみですね。私はワインを持っていきます。\nきやまさんは赤と白、どちらがいいですか。おしえてください。\nジョイ\n\n57. ここにあっているものはどれか。',
        image_url: '/uploads/images/jft13_q57.png',
        audio_url: null,
        option_a: 'このメールはきやまさんはジョイさんに書いたものです',
        option_b: '来週バーベキューパーティーがあります',
        option_c: 'きやまさんはこの日ワインを持って行きます',
        option_d: '',
        correct_option: 'B',
        marks: 5,
        explanation: 'ලබන සතියේ BBQ සාදයක් පැවැත්වේ (来週バーベキューパーティーがあります).'
      },
      {
        order_num: 58,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '電話メモを読んで質問に答えてください。\n\n<< 電話メモ >>\nたなかさん\nABCモーターズの やまださんから 電話がありました。\n[✓] メッセージがありました。\nあしたは かいぎを 11時に はじめても いいですか。\n4時ごろ もういちど お電話します。\n3月13日（月）午後2時30分　キャシー\n\n58. この電話メモはいつ書いたものですか。',
        image_url: '/uploads/images/jft13_q58_60.png',
        audio_url: null,
        option_a: '十三月十三日（月）午後',
        option_b: '二十三月十三日（月）午後',
        option_c: '三月十三日（月）午後',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'සටහනේ දිනය: 3月13日（月）午後 (මාර්තු 13 සඳුදා ප.ව.) වේ.'
      },
      {
        order_num: 59,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '電話メモを読んで質問に答えてください。\n\n<< 電話メモ >>\nたなかさん\nABCモーターズの やまださんから 電話がありました。\n[✓] メッセージがありました。\nあしたは かいぎを 11時に はじめても いいですか。\n4時ごろ もういちど お電話します。\n3月13日（月）午後2時30分　キャシー\n\n59. ここにあるちがうもの（間違っているもの）はどれか。',
        image_url: '/uploads/images/jft13_q58_60.png',
        audio_url: null,
        option_a: '明日かいぎはありません',
        option_b: '山田さんは田中さんに電話をしました',
        option_c: 'キャシーさんは山田さんと電話で話しました',
        option_d: '',
        correct_option: 'A',
        marks: 5,
        explanation: 'සටහනට අනුව හෙට රැස්වීමක් ඇත. එබැවින් "හෙට රැස්වීමක් නැත" (明日かいぎはありません) යන්න වැරදි ප්‍රකාශයයි.'
      },
      {
        order_num: 60,
        section_name: 'Section 4: Reading Comprehension (読解)',
        question_text: '電話メモを読んで質問に答えてください。\n\n<< 電話メモ >>\nたなかさん\nABCモーターズの やまださんから 電話がありました。\n[✓] メッセージがありました。\nあしたは かいぎを 11時に はじめても いいですか。\n4時ごろ もういちど お電話します。\n3月13日（月）午後2時30分　キャシー\n\n60. でんごんは何ですか。',
        image_url: '/uploads/images/jft13_q58_60.png',
        audio_url: null,
        option_a: 'ABCモーターズに食事に来てください',
        option_b: 'かいぎは明日だめですからあさっての11時はどうですか',
        option_c: 'かいぎを始まる時間11時はよろしいでしょうか',
        option_d: '',
        correct_option: 'C',
        marks: 5,
        explanation: 'පණිවිඩය: "あしたは かいぎを 11時に はじめても いいですか" -> රැස්වීම පෙ.ව. 11ට ආරම්භ කළ හැකිද යන්නයි.'
      }
    ];

    for (const q of questions) {
      await query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text, question_type, 
          image_url, audio_url, option_a, option_b, option_c, option_d, 
          correct_option, marks, explanation, order_num
        )
        VALUES (?, ?, ?, 'multiple_choice', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    console.log(`Successfully seeded all ${questions.length} questions for JFT Model Paper 13 (Exam ID: ${examId})!`);
  } catch (err) {
    console.error('Error seeding JFT Model Paper 13:', err);
    throw err;
  }
}

module.exports = { seedJftModelPaper13 };

if (require.main === module) {
  seedJftModelPaper13().then(() => {
    console.log('Finished seeding.');
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
