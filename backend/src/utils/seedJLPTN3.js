const { query } = require('../config/database');

const jlptN3Data = [
  // ==========================================
  // 1. VOCABULARY - KANJI READING (漢字読み)
  // ==========================================
  {
    title: 'Kanji Reading',
    category: 'Vocabulary',
    totalOfficial: 120,
    description: '[Vocabulary] Kanji Reading - Official JLPT N3 Practice',
    questions: [
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\nこの映画は　世界中で　（絶賛）されて　いる。',
        optA: 'ぜっさん', optB: 'ぜつさん', optC: 'ぜんさん', optD: 'ぜっしょう',
        ans: 'A',
        exp: '絶賛（ぜっさん）= ඉහළින්ම පැසසීම (high praise).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n会議の　（日程）を　確認してください。',
        optA: 'にってい', optB: 'にちてい', optC: 'にちじょう', optD: 'にちじ',
        ans: 'A',
        exp: '日程（にってい）= කාලසටහන / න්‍යාය පත්‍රය (schedule / itinerary).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n（複雑）な　問題が　発生した。',
        optA: 'ふくざつ', optB: 'ふくさい', optC: 'ふくそう', optD: 'ふくさつ',
        ans: 'A',
        exp: '複雑（ふくざつ）= සංකීර්ණ (complex / complicated).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n道路の　（拡張）工事が　行われて　いる。',
        optA: 'かくちょう', optB: 'かっちょう', optC: 'かくじょう', optD: 'こうちょう',
        ans: 'A',
        exp: '拡張（かくちょう）= පුළුල් කිරීම / විශාල කිරීම (expansion).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・4から　一つ　えらんでください。\n部屋の　（湿度）が　高い。',
        optA: 'しつど', optB: 'しつとう', optC: 'しゅつど', optD: 'じつど',
        ans: 'A',
        exp: '湿度（しつど）= ආර්ද්‍රතාවය (humidity).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n彼は　（責任）感が　強い。',
        optA: 'せきにん', optB: 'せきじん', optC: 'せぎにん', optD: 'せっきん',
        ans: 'A',
        exp: '責任（せきにん）= වගකීම (responsibility).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n自然を　（保護）する　活動に　参加する。',
        optA: 'ほご', optB: 'ほごう', optC: 'ぼご', optD: 'ほうご',
        ans: 'A',
        exp: '保護（ほご）= ආරක්ෂා කිරීම / රැකවරණය (protection / conservation).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n彼は　（冷静）に　判断した。',
        optA: 'れいせい', optB: 'れいしょう', optC: 'りょうせい', optD: 'れんせい',
        ans: 'A',
        exp: '冷静（れいせい）= සන්සුන් / විචාරශීලී (calm / composed).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n（傾向）と　対策を　分析する。',
        optA: 'けいこう', optB: 'けいきょう', optC: 'けんこう', optD: 'けいごう',
        ans: 'A',
        exp: '傾向（けいこう）= ප්‍රවණතාවය (trend / tendency).'
      },
      {
        text: '（）の　言葉の　読み方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n法律を　（遵守）する。',
        optA: 'じゅんしゅ', optB: 'じゅんしゅう', optC: 'そんしゅ', optD: 'しょんしゅ',
        ans: 'A',
        exp: '遵守（じゅんしゅ）= පිළිපැදීම (compliance / adherence).'
      }
    ]
  },

  // ==========================================
  // 2. VOCABULARY - NOTATION (表記)
  // ==========================================
  {
    title: 'Notation',
    category: 'Vocabulary',
    totalOfficial: 100,
    description: '[Vocabulary] Notation - Official JLPT N3 Practice',
    questions: [
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\nこの　川は　とても　（あさい）です。',
        optA: '浅い', optB: '深い', optC: '細い', optD: '薄い',
        ans: 'A',
        exp: 'あさい = 浅い (ගැඹුරු නොවන / නොගැඹුරු).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\n友人を　パーティーに　（まねいた）。',
        optA: '招いた', optB: '拾いた', optC: '指いた', optD: '抱いた',
        ans: 'A',
        exp: 'まねく = 招く (ආරාධනා කිරීම / invite).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\n資料を　（はいふ）して　ください。',
        optA: '配布', optB: '配付', optC: '配不', optD: '敗布',
        ans: 'A',
        exp: 'はいふ = 配布 (බෙදා හැරීම / distribution).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\n旅行の　ひようを　（けいさん）する。',
        optA: '計算', optB: '計産', optC: '経算', optD: '決算',
        ans: 'A',
        exp: 'けいさん = 計算 (ගණනය කිරීම / calculation).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\n駅で　定期券を　（こうしん）した。',
        optA: '更新', optB: '更進', optC: '向新', optD: '好進',
        ans: 'A',
        exp: 'こうしん = 更新 (අලුත් කිරීම / renewal).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\nこの　薬は　（こうか）が　ある。',
        optA: '効果', optB: '効力', optC: '功課', optD: '好果',
        ans: 'A',
        exp: 'こうか = 効果 (ප්‍රතිඵලය / effect).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\n新しい　技術を　（かいはつ）する。',
        optA: '開発', optB: '開初', optC: '開伐', optD: '開抜',
        ans: 'A',
        exp: 'かいはつ = 開発 (සංවර්ධනය කිරීම / development).'
      },
      {
        text: '（）の　言葉を　漢字で　書くとき、最もよいものを　一つ　えらんでください。\n荷物を　車に　（つむ）。',
        optA: '積む', optB: '詰む', optC: '摘む', optD: '畳む',
        ans: 'A',
        exp: 'つむ = 積む (පටවනවා / load/pile up).'
      }
    ]
  },

  // ==========================================
  // 3. VOCABULARY - CONTEXT-BASED EXPRESSIONS (文脈規定)
  // ==========================================
  {
    title: 'Context-based Expressions',
    category: 'Vocabulary',
    totalOfficial: 75,
    description: '[Vocabulary] Context-based Expressions - Official JLPT N3 Practice',
    questions: [
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n長時間の　運転で　体が　すっかり　（　）しまった。',
        optA: '疲れて', optB: 'あきて', optC: 'なれて', optD: 'こわれて',
        ans: 'A',
        exp: '疲れてしまう = දැඩි ලෙස වෙහෙසට පත්වීම (completely exhausted).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n新しい　プロジェクトが　（　）に　進んでいます。',
        optA: '順調', optB: '正確', optC: '単純', optD: '気軽',
        ans: 'A',
        exp: '順調（じゅんちょう）に = කිසිදු බාධාවකින් තොරව සාර්ථකව (smoothly / favorably).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n風邪を　ひいて　（　）が　出ない。',
        optA: '食欲', optB: '意欲', optC: '食事', optD: '気分',
        ans: 'A',
        exp: '食欲（しょくよく）が出ない = කෑම රුචිය නැතිවීම (loss of appetite).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n彼の　意見には　大いに　（　）できる。',
        optA: '納得', optB: '感心', optC: '承知', optD: '満足',
        ans: 'A',
        exp: '納得（なっとく）する = එකඟ වීම / පිළිගැනීම (consent / be convinced).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\nこの　機械は　（　）が　簡単で　誰でも　使えます。',
        optA: '操作', optB: '作業', optC: '動作', optD: '工事',
        ans: 'A',
        exp: '操作（そうさ）= ක්‍රියාත්මක කිරීම / හැසිරවීම (operation).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n今回の　失敗を　（　）にして　次回は　成功させよう。',
        optA: '教訓', optB: '経験', optC: '見本', optD: '練習',
        ans: 'A',
        exp: '教訓（きょうくん）にする = පාඩමක් කරගන්නවා (learn a lesson).'
      }
    ]
  },

  // ==========================================
  // 4. VOCABULARY - PARAPHRASE (言い換え類義)
  // ==========================================
  {
    title: 'Paraphrase',
    category: 'Vocabulary',
    totalOfficial: 65,
    description: '[Vocabulary] Paraphrase - Official JLPT N3 Practice',
    questions: [
      {
        text: '（）の　言葉と　だいたい　同じ意味の　ものを、１・２・３・４から　一つ　えらんでください。\n田中さんは　いつも　（のんびりして）いる。',
        optA: 'ゆっくり落ち着いて', optB: 'いそがしそうにして', optC: '怒って', optD: '真面目に',
        ans: 'A',
        exp: 'のんびりする = කලබල නොවී නිදහසේ සන්සුන්ව සිටීම (carefree / relaxed).'
      },
      {
        text: '（）の　言葉と　だいたい　同じ意味の　ものを、１・２・３・４から　一つ　えらんでください。\nその　計画は　（あいにく）中止に　なった。',
        optA: '残念ながら', optB: '幸いにも', optC: '急に', optD: '当然',
        ans: 'A',
        exp: 'あいにく = අවාසනාවන්ත ලෙස / කනගාටුවට කරුණක් ලෙස (unfortunately).'
      },
      {
        text: '（）の　言葉と　だいたい　同じ意味の　ものを、１・２・３・４から　一つ　えらんでください。\nあの　人は　（ユーモア）が　ある。',
        optA: 'おもしろさ', optB: 'やさしさ', optC: '厳しさ', optD: '勇気',
        ans: 'A',
        exp: 'ユーモア = හාස්‍යය / විනෝදජනක බව (humor / sense of fun).'
      },
      {
        text: '（）の　言葉と　だいたい　同じ意味の　ものを、１・２・３・４から　一つ　えらんでください。\n彼女は　（みごと）な　演奏を　披露した。',
        optA: 'すばらしい', optB: 'めずらしい', optC: 'おかしな', optD: '普通な',
        ans: 'A',
        exp: 'みごと（見事）= විශිෂ්ට / අලංකාර (splendid / wonderful).'
      },
      {
        text: '（）の　言葉と　だいたい　同じ意味の　ものを、１・２・３・４から　一つ　えらんでください。\nこの　小説は　（くだらない）。',
        optA: 'おもしろくない', optB: '長すぎる', optC: 'むずかしい', optD: '高すぎる',
        ans: 'A',
        exp: 'くだらない = වැඩකට නැති / අරුතක් නැති (worthless / trivial).'
      }
    ]
  },

  // ==========================================
  // 5. VOCABULARY - USAGE (用法)
  // ==========================================
  {
    title: 'Usage',
    category: 'Vocabulary',
    totalOfficial: 50,
    description: '[Vocabulary] Usage - Official JLPT N3 Practice',
    questions: [
      {
        text: '次の　言葉の　使い方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n【回収】',
        optA: '町内で　古紙の　回収が　行われた。',
        optB: '新しい　服を　店で　回収した。',
        optC: '友達に　本を　回収してもらった。',
        optD: 'バスの　切符を　機械で　回収して買った。',
        ans: 'A',
        exp: '回収（かいしゅう）= එක්රැස් කිරීම / නැවත එකතු කිරීම (collection / retrieval).'
      },
      {
        text: '次の　言葉の　使い方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n【支給】',
        optA: '会社から　通勤手当が　支給される。',
        optB: '先生に　宿題を　支給した。',
        optC: '銀行で　お金を　支給した。',
        optD: 'スーパーで　野菜を　支給した。',
        ans: 'A',
        exp: '支給（しきゅう）= දීමනා / වැටුප් ගෙවීම (provision / allowance payment).'
      },
      {
        text: '次の　言葉の　使い方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n【延長】',
        optA: 'レポートの　提出期限を　一週間　延長してもらった。',
        optB: '鉛筆を　削って　長さを　延長した。',
        optC: '背が　高くなって　身長を　延長した。',
        optD: 'テレビの　音量を　大きく　延長した。',
        ans: 'A',
        exp: '延長（えんちょう）= කාලය හෝ දුර දීර්ඝ කිරීම (extension).'
      },
      {
        text: '次の　言葉の　使い方として　最もよいものを、１・２・３・４から　一つ　えらんでください。\n【深刻】',
        optA: '地球温暖化は　深刻な　環境問題だ。',
        optB: 'この　料理は　深刻に　おいしい。',
        optC: '彼は　深刻な　笑顔で　挨拶した。',
        optD: '部屋が　深刻に　汚れている。',
        ans: 'A',
        exp: '深刻（しんこく）= බරපතල (serious / grave).'
      }
    ]
  },

  // ==========================================
  // 6. GRAMMAR - GRAMMAR FORMS (文法形式の判断)
  // ==========================================
  {
    title: 'Grammar Forms',
    category: 'Grammar',
    totalOfficial: 70,
    description: '[Grammar] Grammar Forms - Official JLPT N3 Practice',
    questions: [
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n雨が　降らない（　）、試合を　続けます。',
        optA: 'かぎり', optB: 'ばかりに', optC: 'せいで', optD: 'うえに',
        ans: 'A',
        exp: '〜かぎり = ...තාක් කල් / තාක් දුරට (as long as / unless).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\nこの　料理は　見た目が　悪い（　）、味は　最高だ。',
        optA: 'わりに', optB: 'とおりに', optC: 'ついでに', optD: 'かわりに',
        ans: 'A',
        exp: '〜わりに（は）= ...සලකා බලන විට / සාපේක්ෂව (considering that / despite).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n彼女は　歌が　上手な（　）、ピアノも　プロ並みだ。',
        optA: 'ばかりか', optB: 'からといって', optC: 'くせに', optD: 'わりに',
        ans: 'A',
        exp: '〜ばかりか = ...පමණක් නොව (not only... but also).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n健康のために、野菜を　食べる（　）して　います。',
        optA: 'ように', optB: 'そうに', optC: 'ために', optD: 'らしく',
        ans: 'A',
        exp: '〜ようにしている = පුරුද්දක් ලෙස යමක් කිරීමට උත්සාහ කිරීම (make an effort to).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n試験の　結果を　見ない（　）は、合格したか　わからない。',
        optA: 'ことには', optB: 'わけには', optC: 'ものには', optD: 'はずには',
        ans: 'A',
        exp: '〜ないことには = ...නොකර / නැතිව (unless... is done).'
      },
      {
        text: '（　）に　入れるのに　最もよいものを、１・２・３・４から　一つ　えらんでください。\n彼が　そんな　ひどい　嘘を　つく（　）がない。',
        optA: 'はず', optB: 'つもり', optC: 'わけ', optD: 'こと',
        ans: 'A',
        exp: '〜はずがない = ...වෙන්නට කිසිසේත් ඉඩක් නැත (cannot be possible).'
      }
    ]
  },

  // ==========================================
  // 7. GRAMMAR - SENTENCE CONSTRUCTION (文の組み立て)
  // ==========================================
  {
    title: 'Sentence Construction',
    category: 'Grammar',
    totalOfficial: 50,
    description: '[Grammar] Sentence Construction - Official JLPT N3 Practice',
    questions: [
      {
        text: '次の　文の　★に　入る　最もよいものを、１・２・３・４から　一つ　えらんでください。\n\n子供の　ころ、祖母に　____　____　_★_　____　よく　覚えている。\n1: を　2: 絵本　3: 読んで　4: もらったこと\n(Correct order: 2-1-3-4 -> 絵本を読んでもらったこと)',
        optA: '読んでもらったこと (3)',
        optB: '絵本 (2)',
        optC: 'を (1)',
        optD: 'もらったこと (4)',
        ans: 'A',
        exp: 'පිළිවෙල: 絵本(2) + を(1) + 読んでもらったこと(3,4). ★ පිහිටන්නේ 3 ස්ථානයයි.'
      },
      {
        text: '次の　文の　★に　入る　最もよいものを、１・２・３・４から　一つ　えらんでください。\n\nいくら　____　____　_★_　____　あきらめては　いけない。\n1: でも　2: 困難　3: 夢を　4: だからといって\n(Correct order: 2-1-4-3 -> 困難だからといって夢を)',
        optA: 'だからといって (4)',
        optB: '困難 (2)',
        optC: 'でも (1)',
        optD: '夢を (3)',
        ans: 'A',
        exp: 'පිළිවෙල: 困難(2) + でも(1) + だからといって(4) + 夢を(3). ★ පිහිටන්නේ 4 ස්ථානයයි.'
      },
      {
        text: '次の　文の　★に　入る　最もよいものを、１・２・３・４から　一つ　えらんでください。\n\n忙しい　____　____　_★_　____　感謝して　います。\n1: にも　2: かかわらず　3: 来て　4: くださり\n(Correct order: 1-2-3-4 -> にもかかわらず来てくださり)',
        optA: '来て (3)',
        optB: 'にも (1)',
        optC: 'かかわらず (2)',
        optD: 'くださり (4)',
        ans: 'A',
        exp: 'පිළිවෙල: にも(1) + かかわらず(2) + 来て(3) + くださり(4). ★ පිහිටන්නේ 3 ස්ථානයයි.'
      },
      {
        text: '次の　文の　★に　入る　最もよいものを、１・２・３・４から　一つ　えらんでください。\n\n彼は　____　____　_★_　____　信頼されて　いる。\n1: 仕事が　2: 人柄の　3: だけでなく　4: よさでも\n(Correct order: 1-3-2-4 -> 仕事がだけでなく人柄のよさでも)',
        optA: '人柄の (2)',
        optB: '仕事が (1)',
        optC: 'だけでなく (3)',
        optD: 'よさでも (4)',
        ans: 'A',
        exp: 'පිළිවෙල: 仕事ができる(1) + だけでなく(3) + 人柄の(2) + よさでも(4). ★ පිහිටන්නේ 2 ස්ථානයයි.'
      }
    ]
  }
];

async function seedJLPTN3() {
  console.log('--- Seeding / Verifying JLPT N3 Modules ---');
  let course = await query.get("SELECT id FROM courses WHERE code = 'JLPT-N3'");
  if (!course) {
    const res = await query.run(`
      INSERT INTO courses (title, code, description, icon_name, is_active, category)
      VALUES ('JLPT N3 Examination Course', 'JLPT-N3', 'Intermediate Japanese mock exams and module practice.', 'GraduationCap', 1, 'JLPT Level')
    `);
    course = { id: res.id };
  } else {
    await query.run("UPDATE courses SET category = 'JLPT Level' WHERE id = ?", [course.id]);
  }

  for (const mod of jlptN3Data) {
    let exam = await query.get(`
      SELECT id FROM exams 
      WHERE course_id = ? AND LOWER(TRIM(title)) = LOWER(TRIM(?))
    `, [course.id, mod.title]);

    if (!exam) {
      const ins = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, 0, 60, ?, 1)
      `, [mod.title, course.id, mod.description]);
      exam = { id: ins.id };
      console.log(`Created JLPT N3 Module: "${mod.title}" (ID: ${exam.id})`);
    } else {
      await query.run(`
        UPDATE exams SET description = ? WHERE id = ?
      `, [mod.description, exam.id]);
    }

    const qCount = await query.get("SELECT count(*) as count FROM questions WHERE exam_id = ?", [exam.id]);
    if (!qCount || qCount.count < mod.questions.length) {
      await query.run("DELETE FROM questions WHERE exam_id = ?", [exam.id]);
      let orderNum = 1;
      for (const q of mod.questions) {
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `, [
          exam.id,
          mod.category,
          q.text,
          q.optA,
          q.optB,
          q.optC,
          q.optD,
          q.ans,
          q.exp,
          orderNum++
        ]);
      }
    }
  }
  console.log(`Successfully verified and seeded all 7 JLPT N3 modules under course ID ${course.id}`);
}

module.exports = { seedJLPTN3, jlptN3Data };

if (require.main === module) {
  seedJLPTN3().then(() => {
    console.log('Done.');
    process.exit(0);
  }).catch(err => {
    console.error('Error seeding JLPT N3:', err);
    process.exit(1);
  });
}
