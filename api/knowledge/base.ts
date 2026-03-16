export interface KnowledgeChunk {
  id: string;
  category: string;
  tags: string[];
  keywords: Record<string, string[]>;
  content: Record<string, string>;
  route?: string;
  priority: number;
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PLATFORM (5 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'platform_about',
    category: 'platform',
    tags: ['continuum', 'platform', 'about', 'legacy'],
    keywords: {
      en: ['what is continuum', 'about', 'platform'],
      de: ['was ist continuum', 'plattform', 'über'],
      ru: ['что такое continuum', 'платформа', 'о нас'],
      ua: ['що таке continuum', 'платформа', 'про нас']
    },
    content: {
      en: '**Ready Legacy** is a Swiss digital platform for estate planning, legacy creation, and bereavement support. It helps you organize legal documents, create personal messages for loved ones, and guides families through the process after loss. Available in English and German. GDPR and nDSG compliant.',
      de: '**Ready Legacy** ist eine Schweizer digitale Plattform für Nachlassplanung, Vermächtnisgestaltung und Trauerbegleitung. Sie hilft Ihnen, rechtliche Dokumente zu organisieren, persönliche Nachrichten für Ihre Lieben zu erstellen, und begleitet Familien durch den Prozess nach einem Verlust. Verfügbar auf Englisch und Deutsch. DSGVO- und nDSG-konform.',
      ru: '**Ready Legacy** — швейцарская цифровая платформа для планирования наследства, создания наследия и поддержки в период утраты. Помогает организовать юридические документы, создать личные послания для близких и сопровождает семьи через процесс после потери. Доступна на английском и немецком языках.',
      ua: '**Ready Legacy** — швейцарська цифрова платформа для планування спадщини, створення спадку та підтримки у період втрати. Допомагає організувати юридичні документи, створити особисті послання для близьких та супроводжує сім\'ї через процес після втрати. Доступна англійською та німецькою мовами.'
    },
    route: '/',
    priority: 10
  },
  {
    id: 'platform_mission',
    category: 'platform',
    tags: ['mission', 'vision', 'purpose', 'why'],
    keywords: {
      en: ['mission', 'vision', 'why', 'purpose'],
      de: ['mission', 'vision', 'warum', 'zweck'],
      ru: ['миссия', 'видение', 'зачем', 'цель'],
      ua: ['місія', 'бачення', 'навіщо', 'мета']
    },
    content: {
      en: 'Our **mission** is to redefine how we handle the most certain part of our existence. Innovation is not just about growth — it\'s about life. We believe preparation is not a niche topic — it\'s a responsibility we all share. Ready Legacy brings structure, dignity, and technology to estate planning and bereavement.',
      de: 'Unsere **Mission** ist es, den Umgang mit dem sichersten Teil unserer Existenz neu zu definieren. Innovation geht nicht nur um Wachstum — es geht um das Leben. Wir glauben, Vorsorge ist eine Verantwortung für uns alle. Ready Legacy bringt Struktur, Würde und Technologie in die Nachlassplanung und Trauerbegleitung.',
      ru: 'Наша **миссия** — переосмыслить подход к самому определённому аспекту нашего существования. Инновации — это не только рост, это сама жизнь. Мы верим, что подготовка — это ответственность каждого. Ready Legacy привносит структуру, достоинство и технологии в планирование наследства и поддержку в период утраты.',
      ua: 'Наша **місія** — переосмислити підхід до найбільш визначеного аспекту нашого існування. Інновації — це не лише зростання, це саме життя. Ми віримо, що підготовка — це відповідальність кожного. Ready Legacy привносить структуру, гідність та технології у планування спадщини та підтримку у період втрати.'
    },
    route: '/mission',
    priority: 9
  },
  {
    id: 'platform_pillars',
    category: 'platform',
    tags: ['pillars', 'ecosystem', 'three', 'stages'],
    keywords: {
      en: ['three pillars', 'ecosystem', 'stages', 'be ready', 'leave behind', 'be comforted'],
      de: ['drei säulen', 'ökosystem', 'phasen', 'bereit sein', 'hinterlassen', 'getröstet'],
      ru: ['три столпа', 'экосистема', 'этапы', 'будьте готовы', 'оставьте', 'будьте спокойны'],
      ua: ['три стовпи', 'екосистема', 'етапи', 'будьте готові', 'залиште', 'будьте спокійні']
    },
    content: {
      en: 'Ready Legacy is built on **3 pillars**: 1) **Be Ready** — organize your legal documents, assets, and final wishes. 2) **Leave Behind** — create personal messages, videos, and memories for your loved ones. 3) **Be Honored** — structured grief guidance, support networks, practical checklists for families, and digital remembrance spaces.',
      de: 'Ready Legacy basiert auf **3 Säulen**: 1) **Bereit sein** — organisieren Sie Ihre rechtlichen Dokumente, Vermögenswerte und letzten Wünsche. 2) **Hinterlassen** — erstellen Sie persönliche Nachrichten, Videos und Erinnerungen. 3) **Gedenken** — strukturierte Trauerbegleitung, Unterstützungsnetzwerke, praktische Checklisten für Familien und digitale Gedenkräume.',
      ru: 'Ready Legacy построен на **3 столпах**: 1) **Будьте готовы** — организуйте юридические документы, активы и последнюю волю. 2) **Оставьте после себя** — создайте личные послания, видео и воспоминания для близких. 3) **Be Honored** — поддержка оставшихся с помощью эмоциональных ресурсов, чек-листов и ваших подготовленных посланий.',
      ua: 'Ready Legacy побудований на **3 стовпах**: 1) **Будьте готові** — організуйте юридичні документи, активи та останню волю. 2) **Залиште після себе** — створіть особисті послання, відео та спогади для близьких. 3) **Be Honored** — підтримка тих, хто залишився, з допомогою емоційних ресурсів, чек-листів та ваших підготовлених послань.'
    },
    route: '/',
    priority: 9
  },
  {
    id: 'platform_technology',
    category: 'platform',
    tags: ['technology', 'security', 'ai', 'cloud'],
    keywords: {
      en: ['technology', 'security', 'ai', 'cloud', 'safe', 'encryption'],
      de: ['technologie', 'sicherheit', 'ki', 'cloud', 'verschlüsselung'],
      ru: ['технологии', 'безопасность', 'ии', 'облако', 'шифрование'],
      ua: ['технології', 'безпека', 'шi', 'хмара', 'шифрування']
    },
    content: {
      en: 'Ready Legacy uses **3 core technologies**: 1) **Secure Cloud Storage** — your data is encrypted and protected. 2) **AI-Powered Content** — voice, text, and personalization features. 3) **Immersive Web** — 3D environments for unique experiences. Privacy and data protection are our top priorities.',
      de: 'Ready Legacy nutzt **3 Kerntechnologien**: 1) **Sicherer Cloud-Speicher** — Ihre Daten sind verschlüsselt und geschützt. 2) **KI-gestützte Inhalte** — Sprache, Text und Personalisierung. 3) **Immersives Web** — 3D-Umgebungen für einzigartige Erlebnisse. Datenschutz hat höchste Priorität.',
      ru: 'Ready Legacy использует **3 ключевые технологии**: 1) **Безопасное облачное хранилище** — ваши данные зашифрованы и защищены. 2) **Контент на базе ИИ** — голос, текст и персонализация. 3) **Иммерсивный веб** — 3D-среда для уникальных впечатлений. Конфиденциальность и защита данных — наш главный приоритет.',
      ua: 'Ready Legacy використовує **3 ключові технології**: 1) **Безпечне хмарне сховище** — ваші дані зашифровані та захищені. 2) **Контент на базі ШІ** — голос, текст та персоналізація. 3) **Імерсивний веб** — 3D-середовище для унікальних вражень. Конфіденційність та захист даних — наш головний пріоритет.'
    },
    route: '/',
    priority: 7
  },
  {
    id: 'platform_data_storage',
    category: 'platform',
    tags: ['data', 'storage', 'privacy', 'local'],
    keywords: {
      en: ['data', 'storage', 'privacy', 'where stored', 'safe'],
      de: ['daten', 'speicherung', 'datenschutz', 'wo gespeichert', 'sicher'],
      ru: ['данные', 'хранение', 'конфиденциальность', 'где хранятся', 'безопасно'],
      ua: ['дані', 'зберігання', 'конфіденційність', 'де зберігаються', 'безпечно']
    },
    content: {
      en: 'Currently, all your data is **saved locally** in your browser\'s storage. Nothing is sent to external servers. In the future, Ready Legacy will offer encrypted cloud storage for premium users, ensuring your documents and messages are accessible from any device while remaining fully secure.',
      de: 'Aktuell werden alle Ihre Daten **lokal** in Ihrem Browser gespeichert. Nichts wird an externe Server gesendet. In Zukunft wird Ready Legacy verschlüsselten Cloud-Speicher für Premium-Nutzer anbieten, damit Ihre Dokumente und Nachrichten von jedem Gerät sicher zugänglich sind.',
      ru: 'В настоящее время все ваши данные **сохраняются локально** в хранилище вашего браузера. Ничего не отправляется на внешние серверы. В будущем Ready Legacy предложит зашифрованное облачное хранилище для премиум-пользователей, обеспечивая доступ к документам и сообщениям с любого устройства при полной безопасности.',
      ua: 'Наразі всі ваші дані **зберігаються локально** у сховищі вашого браузера. Нічого не надсилається на зовнішні сервери. У майбутньому Ready Legacy запропонує зашифроване хмарне сховище для преміум-користувачів, забезпечуючи доступ до документів та повідомлень з будь-якого пристрою при повній безпеці.'
    },
    route: '/profile',
    priority: 8
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS (10 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'tool_asset_overview',
    category: 'tool',
    tags: ['assets', 'overview', 'property', 'estate', 'wizard'],
    keywords: {
      en: ['assets', 'property', 'estate', 'bank', 'savings', 'insurance', 'mortgage'],
      de: ['vermögen', 'eigentum', 'nachlass', 'bank', 'sparen', 'versicherung', 'hypothek'],
      ru: ['активы', 'имущество', 'наследство', 'банк', 'сбережения', 'страховка', 'ипотека'],
      ua: ['активи', 'майно', 'спадщина', 'банк', 'заощадження', 'страховка', 'іпотека']
    },
    content: {
      en: 'The **Asset Overview Wizard** helps you list all your assets and liabilities to get a clear picture of your estate. Covers: personal property, bank & savings, securities, pension funds, insurance, mortgages, and other debts. Add notes about digital legacy wishes and funeral preferences.',
      de: 'Der **Vermögens-Checkliste Wizard** hilft Ihnen, alle Vermögenswerte und Verbindlichkeiten aufzulisten. Umfasst: Eigengut, Bank- und Sparguthaben, Wertschriften, Pensionskasse, Versicherungen, Hypotheken und weitere Schulden. Ergänzen Sie Notizen zu digitalem Nachlass und Bestattungswünschen.',
      ru: '**Помощник по имуществу** помогает составить список всех активов и обязательств для ясной картины наследства. Охватывает: личное имущество, банковские вклады, ценные бумаги, пенсионные фонды, страховки, ипотеку и другие долги. Добавьте заметки о цифровом наследии и пожеланиях по похоронам.',
      ua: '**Майстер майна** допомагає скласти перелік усіх активів та зобов\'язань для чіткої картини спадщини. Охоплює: особисте майно, банківські вклади, цінні папери, пенсійні фонди, страховки, іпотеку та інші борги. Додайте нотатки про цифрову спадщину та побажання щодо похорону.'
    },
    route: '/tools?tool=asset-overview',
    priority: 8
  },
  {
    id: 'tool_legal_docs',
    category: 'tool',
    tags: ['legal', 'documents', 'living will', 'advance directive'],
    keywords: {
      en: ['legal', 'documents', 'living will', 'advance directive', 'power of attorney'],
      de: ['rechtlich', 'dokumente', 'patientenverfügung', 'vorsorgeauftrag', 'vollmacht'],
      ru: ['юридические', 'документы', 'завещание', 'доверенность', 'директива'],
      ua: ['юридичні', 'документи', 'заповіт', 'довіреність', 'директива']
    },
    content: {
      en: 'The **Legal Documents** section covers essential legal paperwork: **Living Will** (Patientenverfügung) — specify your medical treatment wishes if you become unable to decide. **Advance Care Directive** — arrange for incapacity matters. Each document is explained step by step.',
      de: 'Der Bereich **Rechtliche Dokumente** umfasst wichtige rechtliche Unterlagen: **Patientenverfügung** — legen Sie Ihre medizinischen Wünsche fest. **Vorsorgeauftrag** — regeln Sie Angelegenheiten bei Urteilsunfähigkeit. Jedes Dokument wird Schritt für Schritt erklärt.',
      ru: 'Раздел **Юридические документы** охватывает основные правовые документы: **Завещание при жизни** (Patientenverfügung) — укажите ваши пожелания по медицинскому лечению. **Доверенность** — устройте дела на случай недееспособности. Каждый документ объясняется пошагово.',
      ua: 'Розділ **Юридичні документи** охоплює основні правові документи: **Заповіт за життя** (Patientenverfügung) — вкажіть ваші побажання щодо медичного лікування. **Довіреність** — вирішіть справи на випадок недієздатності. Кожен документ пояснюється покроково.'
    },
    route: '/tools?tool=legal-docs',
    priority: 8
  },
  {
    id: 'tool_will_builder',
    category: 'tool',
    tags: ['will', 'testament', 'builder', 'heirs', 'inheritance'],
    keywords: {
      en: ['will', 'testament', 'write', 'create', 'heirs', 'inheritance'],
      de: ['testament', 'erstellen', 'erben', 'erbschaft', 'handschriftlich'],
      ru: ['завещание', 'составить', 'наследники', 'наследство'],
      ua: ['заповіт', 'скласти', 'спадкоємці', 'спадщина']
    },
    content: {
      en: 'The **Will Builder** helps you outline your testament in 4 steps: 1) **Testator info** — your name and nationality. 2) **Heirs** — spouse/partner share, children\'s share, other heirs. 3) **Legacies** — specific items or amounts. 4) **Formalities** — reminder that in many jurisdictions, a valid will must be handwritten, dated, and signed.',
      de: 'Der **Testament-Planer** hilft Ihnen, Ihr Testament in 4 Schritten zu skizzieren: 1) **Erblasser-Info** — Name und Heimatort. 2) **Erben** — Anteil Ehepartner, Kinder, andere Erben. 3) **Vermächtnisse** — bestimmte Gegenstände oder Beträge. 4) **Formalitäten** — Erinnerung, dass ein Testament handschriftlich sein muss.',
      ru: '**Конструктор завещания** помогает составить завещание за 4 шага: 1) **Данные завещателя** — имя и гражданство. 2) **Наследники** — доля супруга, детей, других наследников. 3) **Завещательные отказы** — конкретные вещи или суммы. 4) **Формальности** — напоминание, что завещание должно быть написано от руки, датировано и подписано.',
      ua: '**Конструктор заповіту** допомагає скласти заповіт за 4 кроки: 1) **Дані заповідача** — ім\'я та громадянство. 2) **Спадкоємці** — частка подружжя, дітей, інших спадкоємців. 3) **Відкази** — конкретні речі або суми. 4) **Формальності** — нагадування, що заповіт має бути написаний від руки, датований та підписаний.'
    },
    route: '/tools?tool=will-builder',
    priority: 9
  },
  {
    id: 'tool_death_checklist',
    category: 'tool',
    tags: ['checklist', 'death', 'guide', 'after death', 'steps'],
    keywords: {
      en: ['checklist', 'after death', 'what to do', 'steps', 'guide', 'notify'],
      de: ['checkliste', 'todesfall', 'was tun', 'schritte', 'anleitung', 'melden'],
      ru: ['чек-лист', 'после смерти', 'что делать', 'шаги', 'инструкция', 'уведомить'],
      ua: ['чек-лист', 'після смерті', 'що робити', 'кроки', 'інструкція', 'повідомити']
    },
    content: {
      en: 'The **After Death Step-by-Step Guide** walks you through everything that needs to happen: **Phase 1 (Immediate)** — call a doctor, inform family. **Phase 2 (Formalities)** — registry office, banks, insurers, employer. Each task is a checkable item so you can track progress during a difficult time.',
      de: 'Die **Schritt-für-Schritt-Anleitung im Todesfall** führt durch alles Notwendige: **Phase 1 (Sofort)** — Arzt rufen, Angehörige informieren. **Phase 2 (Formalitäten)** — Zivilstandsamt, Banken, Versicherungen, Arbeitgeber. Jede Aufgabe ist abhakbar.',
      ru: '**Пошаговая инструкция после смерти** проведёт через всё необходимое: **Этап 1 (Срочно)** — вызвать врача, сообщить семье. **Этап 2 (Регистрация)** — ЗАГС, банки, страховые, работодатель. Каждая задача отмечается галочкой для отслеживания прогресса в трудное время.',
      ua: '**Покрокова інструкція після смерті** проведе через усе необхідне: **Етап 1 (Терміново)** — викликати лікаря, повідомити сім\'ю. **Етап 2 (Реєстрація)** — ЗАГС, банки, страхові, роботодавець. Кожне завдання відмічається галочкою для відстеження прогресу у складний час.'
    },
    route: '/tools?tool=death-checklist',
    priority: 8
  },
  {
    id: 'tool_executor',
    category: 'tool',
    tags: ['executor', 'tasks', 'certificate', 'authorities'],
    keywords: {
      en: ['executor', 'certificate', 'authorities', 'assets', 'estate administration'],
      de: ['willensvollstrecker', 'bescheinigung', 'behörden', 'nachlassverwaltung'],
      ru: ['исполнитель', 'справка', 'власти', 'управление наследством'],
      ua: ['виконавець', 'довідка', 'влада', 'управління спадщиною']
    },
    content: {
      en: 'The **Executor Tasks** section guides the executor through key responsibilities: obtain the death certificate, secure assets, notify authorities. It provides a structured checklist to ensure nothing is overlooked during estate administration.',
      de: 'Der Bereich **Willensvollstrecker** führt den Vollstrecker durch die wichtigsten Aufgaben: Sterbeurkunde einholen, Vermögen sichern, Behörden benachrichtigen. Eine strukturierte Checkliste stellt sicher, dass nichts vergessen wird.',
      ru: 'Раздел **Задачи исполнителя** помогает исполнителю завещания выполнить основные обязанности: получить свидетельство о смерти, обеспечить сохранность активов, уведомить власти. Структурированный чек-лист гарантирует, что ничего не будет упущено.',
      ua: 'Розділ **Завдання виконавця** допомагає виконавцю заповіту виконати основні обов\'язки: отримати свідоцтво про смерть, забезпечити збереження активів, повідомити владу. Структурований чек-лист гарантує, що нічого не буде пропущено.'
    },
    route: '/tools?tool=executor',
    priority: 7
  },
  {
    id: 'tool_leave_behind',
    category: 'tool',
    tags: ['legacy', 'messages', 'memories', 'video', 'photo'],
    keywords: {
      en: ['legacy', 'message', 'memories', 'video', 'photo', 'leave behind', 'personal'],
      de: ['vermächtnis', 'nachricht', 'erinnerungen', 'video', 'foto', 'hinterlassen'],
      ru: ['наследие', 'послание', 'воспоминания', 'видео', 'фото', 'оставить'],
      ua: ['спадщина', 'послання', 'спогади', 'відео', 'фото', 'залишити']
    },
    content: {
      en: '**Leave Behind** lets you create a personal digital legacy: write messages, record videos, and collect photo memories for your loved ones. Choose recipients, add tags and names. Your legacy vault stores everything securely for future delivery.',
      de: '**Hinterlassen** ermöglicht Ihnen, ein persönliches digitales Vermächtnis zu erstellen: Nachrichten schreiben, Videos aufnehmen und Fotoerinnerungen sammeln. Wählen Sie Empfänger, fügen Sie Tags und Namen hinzu. Ihr Vermächtnis-Tresor speichert alles sicher.',
      ru: '**Оставить после себя** позволяет создать личное цифровое наследие: написать сообщения, записать видео и собрать фотовоспоминания для близких. Выберите получателей, добавьте теги и имена. Ваше хранилище наследия надёжно сохранит всё для передачи в будущем.',
      ua: '**Залишити після себе** дозволяє створити особисту цифрову спадщину: написати повідомлення, записати відео та зібрати фотоспогади для близьких. Оберіть отримувачів, додайте теги та імена. Ваше сховище спадщини надійно зберігатиме все для передачі у майбутньому.'
    },
    route: '/tools?tool=leave-behind',
    priority: 8
  },
  {
    id: 'tool_templates',
    category: 'tool',
    tags: ['templates', 'documents', 'power of attorney', 'funeral', 'waiver'],
    keywords: {
      en: ['template', 'power of attorney', 'funeral directive', 'waiver', 'gift contract', 'advance directive'],
      de: ['vorlage', 'vollmacht', 'bestattungswunsch', 'erbausschlagung', 'schenkungsvertrag', 'vorsorgeauftrag'],
      ru: ['шаблон', 'доверенность', 'похороны', 'отказ от наследства', 'дарение', 'распоряжение'],
      ua: ['шаблон', 'довіреність', 'поховання', 'відмова від спадщини', 'дарування', 'розпорядження']
    },
    content: {
      en: 'The **Document Library** offers 5 ready-to-use templates: 1) **Power of Attorney** — authorize someone to act on your behalf. 2) **Funeral Directive** — document your funeral wishes. 3) **Legacy Waiver** — decline an inheritance. 4) **Gift Contract** — formalize gifts during your lifetime. 5) **Advance Directive** — medical care preferences. Request any template with one click.',
      de: 'Das **Dokumenten-Zentrum** bietet 5 einsatzbereite Vorlagen: 1) **Vollmacht** — jemanden bevollmächtigen. 2) **Bestattungswunsch** — Ihre Bestattungswünsche dokumentieren. 3) **Erbausschlagung** — eine Erbschaft ablehnen. 4) **Schenkungsvertrag** — Schenkungen formalisieren. 5) **Vorsorgeauftrag** — medizinische Präferenzen. Jede Vorlage mit einem Klick anfordern.',
      ru: '**Библиотека документов** предлагает 5 готовых шаблонов: 1) **Доверенность** — уполномочить кого-то действовать от вашего имени. 2) **Похоронная директива** — задокументировать пожелания по похоронам. 3) **Отказ от наследства** — отклонить наследство. 4) **Договор дарения** — оформить дарение при жизни. 5) **Распоряжение** — предпочтения по медицинскому уходу. Запросите любой шаблон одним кликом.',
      ua: '**Бібліотека документів** пропонує 5 готових шаблонів: 1) **Довіреність** — уповноважити когось діяти від вашого імені. 2) **Похоронна директива** — задокументувати побажання щодо похорону. 3) **Відмова від спадщини** — відхилити спадщину. 4) **Договір дарування** — оформити дарування за життя. 5) **Розпорядження** — уподобання щодо медичного догляду. Запитайте будь-який шаблон одним кліком.'
    },
    route: '/tools?tool=templates',
    priority: 8
  },
  {
    id: 'tool_bereavement',
    category: 'tool',
    tags: ['bereavement', 'grief', 'support', 'healing', 'emotional'],
    keywords: {
      en: ['grief', 'bereavement', 'support', 'healing', 'emotional', 'loss', 'cope'],
      de: ['trauer', 'trauerbegleitung', 'unterstützung', 'heilung', 'emotional', 'verlust'],
      ru: ['горе', 'утрата', 'поддержка', 'исцеление', 'эмоции', 'потеря', 'справиться'],
      ua: ['горе', 'втрата', 'підтримка', 'зцілення', 'емоції', 'втрата', 'впоратися']
    },
    content: {
      en: 'The **Bereavement Path** provides emotional support for grieving: **Anticipatory Grief** tools for when a loss is expected, **Emotional First Aid** checklists, **Self-Help** practices (journaling, meditation, memory books), and **Support Groups** (Verwaiste Eltern, Grief Share, The Compassionate Friends, Caritas, Online groups).',
      de: 'Der **Pfad der Heilung** bietet emotionale Unterstützung bei Trauer: **Vorausschauende Trauer** für erwartete Verluste, **Emotionale Erste Hilfe** Checklisten, **Selbsthilfe** (Tagebuch, Meditation, Erinnerungsbuch), und **Selbsthilfegruppen** (Verwaiste Eltern, Grief Share, The Compassionate Friends, Caritas).',
      ru: '**Путь исцеления** предоставляет эмоциональную поддержку в период горя: инструменты **предвосхищающего горя** когда потеря ожидаема, чек-листы **эмоциональной первой помощи**, практики **самопомощи** (ведение дневника, медитация, книга воспоминаний), и **группы поддержки** (Verwaiste Eltern, Grief Share, The Compassionate Friends, Caritas).',
      ua: '**Шлях зцілення** надає емоційну підтримку у період горя: інструменти **передчуттєвого горя** коли втрата очікувана, чек-листи **емоційної першої допомоги**, практики **самодопомоги** (ведення щоденника, медитація, книга спогадів), та **групи підтримки** (Verwaiste Eltern, Grief Share, The Compassionate Friends, Caritas).'
    },
    route: '/tools?tool=bereavement',
    priority: 8
  },
  {
    id: 'tool_ai_avatar',
    category: 'tool',
    tags: ['ai', 'avatar', 'digital twin', 'voice', 'personalization'],
    keywords: {
      en: ['ai avatar', 'digital twin', 'voice', 'personalization', 'avatar'],
      de: ['ki avatar', 'digitaler zwilling', 'stimme', 'personalisierung'],
      ru: ['ии аватар', 'цифровой двойник', 'голос', 'персонализация'],
      ua: ['шi аватар', 'цифровий двійник', 'голос', 'персоналізація']
    },
    content: {
      en: 'The **AI Avatar** feature lets you create a digital representation of yourself. Upload your photo, configure voice preferences, and personalize your avatar. This digital twin can deliver your prepared messages to loved ones in the future. Upgrade to Premium to unlock full avatar features.',
      de: 'Die **KI Avatar**-Funktion ermöglicht es Ihnen, eine digitale Repräsentation von sich zu erstellen. Laden Sie Ihr Foto hoch, konfigurieren Sie Stimme und personalisieren Sie Ihren Avatar. Dieser digitale Zwilling kann Ihre vorbereiteten Nachrichten übermitteln. Upgrade auf Premium für alle Avatar-Funktionen.',
      ru: '**ИИ Аватар** позволяет создать цифровое представление себя. Загрузите фото, настройте голос и персонализируйте аватар. Этот цифровой двойник сможет передавать ваши подготовленные послания близким в будущем. Обновитесь до Premium для полного доступа к функциям аватара.',
      ua: '**ШІ Аватар** дозволяє створити цифрове представлення себе. Завантажте фото, налаштуйте голос та персоналізуйте аватар. Цей цифровий двійник зможе передавати ваші підготовлені послання близьким у майбутньому. Оновіться до Premium для повного доступу до функцій аватара.'
    },
    route: '/tools?tool=ai-avatar',
    priority: 7
  },
  {
    id: 'tool_reminders',
    category: 'tool',
    tags: ['reminders', 'email', 'notifications', 'todo'],
    keywords: {
      en: ['reminders', 'email', 'notifications', 'todo', 'tasks'],
      de: ['erinnerungen', 'email', 'benachrichtigungen', 'aufgaben'],
      ru: ['напоминания', 'email', 'уведомления', 'задачи'],
      ua: ['нагадування', 'email', 'повідомлення', 'завдання']
    },
    content: {
      en: '**Email Reminders** help you stay on track with your estate planning. Set up periodic reminders to review and update your documents, check asset allocations, and ensure everything remains current. Never forget an important task.',
      de: '**E-Mail-Erinnerungen** helfen Ihnen, Ihre Nachlassplanung im Blick zu behalten. Richten Sie regelmäßige Erinnerungen ein, um Dokumente zu überprüfen und Vermögenswerte aktuell zu halten.',
      ru: '**Напоминания по email** помогают не забывать о планировании наследства. Настройте периодические напоминания для проверки и обновления документов, проверки распределения активов.',
      ua: '**Нагадування по email** допомагають не забувати про планування спадщини. Налаштуйте періодичні нагадування для перевірки та оновлення документів, перевірки розподілу активів.'
    },
    route: '/tools?tool=reminders',
    priority: 6
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGAL DOCUMENTS (8 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'legal_living_will',
    category: 'legal',
    tags: ['living will', 'patientenverfügung', 'medical', 'wishes'],
    keywords: {
      en: ['living will', 'medical treatment', 'wishes', 'incapacitated'],
      de: ['patientenverfügung', 'medizinische behandlung', 'wünsche'],
      ru: ['завещание при жизни', 'медицинское лечение', 'пожелания'],
      ua: ['заповіт за життя', 'медичне лікування', 'побажання']
    },
    content: {
      en: 'A **Living Will** (Patientenverfügung) is a legal document where you specify your wishes regarding medical treatment if you become unable to make decisions yourself. It covers life-sustaining measures, pain management, and organ donation preferences. In Switzerland, it\'s legally binding when properly executed.',
      de: 'Eine **Patientenverfügung** ist ein rechtliches Dokument, in dem Sie Ihre Wünsche bezüglich medizinischer Behandlung festlegen, falls Sie nicht mehr selbst entscheiden können. Sie umfasst lebenserhaltende Maßnahmen, Schmerzmanagement und Organspende-Präferenzen.',
      ru: '**Завещание при жизни** (Patientenverfügung) — это юридический документ, в котором вы указываете пожелания относительно медицинского лечения, если не сможете принимать решения самостоятельно. Охватывает поддержание жизни, управление болью и предпочтения по донорству органов.',
      ua: '**Заповіт за життя** (Patientenverfügung) — це юридичний документ, у якому ви вказуєте побажання щодо медичного лікування, якщо не зможете приймати рішення самостійно. Охоплює підтримку життя, управління болем та уподобання щодо донорства органів.'
    },
    route: '/tools?tool=legal-docs',
    priority: 8
  },
  {
    id: 'legal_poa',
    category: 'legal',
    tags: ['power of attorney', 'vollmacht', 'authorize', 'representative'],
    keywords: {
      en: ['power of attorney', 'authorize', 'representative', 'poa'],
      de: ['vollmacht', 'bevollmächtigen', 'vertreter'],
      ru: ['доверенность', 'уполномочить', 'представитель'],
      ua: ['довіреність', 'уповноважити', 'представник']
    },
    content: {
      en: 'A **Power of Attorney (POA)** authorizes someone you trust to make decisions and act on your behalf. This can cover financial matters, legal proceedings, or healthcare decisions. You can create a POA through our Templates section with step-by-step guidance.',
      de: 'Eine **Vollmacht** bevollmächtigt eine Vertrauensperson, Entscheidungen in Ihrem Namen zu treffen. Dies kann finanzielle Angelegenheiten, rechtliche Verfahren oder Gesundheitsentscheidungen umfassen. Erstellen Sie eine Vollmacht über unsere Vorlagen.',
      ru: '**Доверенность** уполномочивает человека, которому вы доверяете, принимать решения и действовать от вашего имени. Это может касаться финансовых вопросов, юридических процедур или решений о здоровье. Создайте доверенность через раздел Шаблоны.',
      ua: '**Довіреність** уповноважує людину, якій ви довіряєте, приймати рішення та діяти від вашого імені. Це може стосуватися фінансових питань, юридичних процедур або рішень щодо здоров\'я. Створіть довіреність через розділ Шаблони.'
    },
    route: '/tools?tool=templates',
    priority: 7
  },
  {
    id: 'legal_testament',
    category: 'legal',
    tags: ['testament', 'will', 'handwritten', 'inheritance law'],
    keywords: {
      en: ['testament', 'will', 'handwritten', 'valid', 'inheritance'],
      de: ['testament', 'handschriftlich', 'gültig', 'erbrecht'],
      ru: ['завещание', 'от руки', 'действительное', 'наследственное право'],
      ua: ['заповіт', 'від руки', 'дійсний', 'спадкове право']
    },
    content: {
      en: 'A **Testament** (Last Will) must be **handwritten, dated, and signed** in many jurisdictions (including Switzerland). It specifies who inherits what. Our Will Builder guides you through structuring your testament: testator info, heir allocation percentages, specific legacies, and formality reminders.',
      de: 'Ein **Testament** muss in vielen Rechtssystemen (inkl. Schweiz) **handschriftlich, datiert und unterschrieben** sein. Es legt fest, wer was erbt. Unser Testament-Planer führt Sie durch die Struktur: Erblasser-Informationen, Erbquoten, Vermächtnisse und Formalitäten.',
      ru: '**Завещание** должно быть **написано от руки, датировано и подписано** во многих юрисдикциях (включая Швейцарию). Оно определяет, кто что наследует. Наш Конструктор завещания проведёт вас через структуру: данные завещателя, процентные доли наследников, конкретные отказы и формальности.',
      ua: '**Заповіт** має бути **написаний від руки, датований та підписаний** у багатьох юрисдикціях (включаючи Швейцарію). Він визначає, хто що успадковує. Наш Конструктор заповіту проведе вас через структуру: дані заповідача, частки спадкоємців, конкретні відкази та формальності.'
    },
    route: '/tools?tool=will-builder',
    priority: 9
  },
  {
    id: 'legal_advance_directive',
    category: 'legal',
    tags: ['advance directive', 'vorsorgeauftrag', 'incapacity'],
    keywords: {
      en: ['advance directive', 'incapacity', 'care directive'],
      de: ['vorsorgeauftrag', 'urteilsunfähigkeit'],
      ru: ['распоряжение', 'недееспособность', 'предварительная директива'],
      ua: ['розпорядження', 'недієздатність', 'попередня директива']
    },
    content: {
      en: 'An **Advance Care Directive** (Vorsorgeauftrag) designates who will manage your affairs if you become incapacitated. Unlike a Living Will which covers medical wishes, this covers personal care, asset management, and legal representation. Available as a template in our document library.',
      de: 'Ein **Vorsorgeauftrag** bestimmt, wer Ihre Angelegenheiten verwaltet, wenn Sie urteilsunfähig werden. Im Gegensatz zur Patientenverfügung (medizinische Wünsche) umfasst er persönliche Betreuung, Vermögensverwaltung und rechtliche Vertretung.',
      ru: '**Предварительная директива** (Vorsorgeauftrag) назначает, кто будет управлять вашими делами в случае недееспособности. В отличие от завещания при жизни (медицинские пожелания), она охватывает личный уход, управление активами и юридическое представительство.',
      ua: '**Попередня директива** (Vorsorgeauftrag) визначає, хто буде керувати вашими справами у разі недієздатності. На відміну від заповіту за життя (медичні побажання), вона охоплює особистий догляд, управління активами та юридичне представництво.'
    },
    route: '/tools?tool=legal-docs',
    priority: 7
  },
  {
    id: 'legal_funeral_directive',
    category: 'legal',
    tags: ['funeral', 'directive', 'burial', 'cremation', 'wishes'],
    keywords: {
      en: ['funeral', 'burial', 'cremation', 'wishes', 'ceremony'],
      de: ['bestattung', 'beerdigung', 'einäscherung', 'wünsche', 'zeremonie'],
      ru: ['похороны', 'погребение', 'кремация', 'пожелания', 'церемония'],
      ua: ['похорон', 'поховання', 'кремація', 'побажання', 'церемонія']
    },
    content: {
      en: 'A **Funeral Directive** documents your wishes for your funeral: burial vs. cremation, cemetery location, music and ceremony preferences, people to invite, flowers vs. donations. Having these wishes documented relieves your family of difficult decisions during grief.',
      de: 'Eine **Bestattungsverfügung** dokumentiert Ihre Wünsche für die Beerdigung: Erdbestattung vs. Einäscherung, Friedhof, Musik und Zeremoniewünsche, Einladungen, Blumen vs. Spenden. So entlasten Sie Ihre Familie in der Trauerzeit.',
      ru: '**Похоронная директива** документирует ваши пожелания по похоронам: погребение или кремация, место на кладбище, музыка и церемония, кого пригласить, цветы или пожертвования. Документирование этих пожеланий освобождает семью от трудных решений в период горя.',
      ua: '**Похоронна директива** документує ваші побажання щодо похорону: поховання чи кремація, місце на кладовищі, музика та церемонія, кого запросити, квіти чи пожертвування. Документування цих побажань звільняє сім\'ю від складних рішень у період горя.'
    },
    route: '/tools?tool=templates',
    priority: 7
  },
  {
    id: 'legal_legacy_waiver',
    category: 'legal',
    tags: ['waiver', 'decline', 'inheritance', 'renounce'],
    keywords: {
      en: ['waiver', 'decline', 'renounce', 'refuse inheritance'],
      de: ['erbausschlagung', 'ablehnen', 'verzicht', 'erbe ablehnen'],
      ru: ['отказ', 'отклонить', 'отказаться от наследства'],
      ua: ['відмова', 'відхилити', 'відмовитися від спадщини']
    },
    content: {
      en: 'A **Legacy Waiver** (Erbausschlagung) allows you to formally decline an inheritance. This may be necessary when debts exceed assets, or for personal reasons. In Switzerland, you typically have 3 months from learning about the inheritance to file a waiver. Template available in our document library.',
      de: 'Eine **Erbausschlagung** ermöglicht es Ihnen, ein Erbe formell abzulehnen. Dies kann nötig sein, wenn Schulden das Vermögen übersteigen. In der Schweiz haben Sie in der Regel 3 Monate Zeit. Vorlage verfügbar im Dokumenten-Zentrum.',
      ru: '**Отказ от наследства** (Erbausschlagung) позволяет официально отклонить наследство. Это может быть необходимо, когда долги превышают активы. В Швейцарии обычно есть 3 месяца для подачи отказа. Шаблон доступен в библиотеке документов.',
      ua: '**Відмова від спадщини** (Erbausschlagung) дозволяє офіційно відхилити спадщину. Це може бути необхідно, коли борги перевищують активи. У Швейцарії зазвичай є 3 місяці для подання відмови. Шаблон доступний у бібліотеці документів.'
    },
    route: '/tools?tool=templates',
    priority: 6
  },
  {
    id: 'legal_gift_contract',
    category: 'legal',
    tags: ['gift', 'contract', 'donation', 'schenkung'],
    keywords: {
      en: ['gift', 'contract', 'donation', 'give away', 'transfer'],
      de: ['schenkung', 'schenkungsvertrag', 'übertragung'],
      ru: ['дарение', 'договор дарения', 'передача'],
      ua: ['дарування', 'договір дарування', 'передача']
    },
    content: {
      en: 'A **Gift Contract** (Schenkungsvertrag) formalizes the transfer of assets during your lifetime. This can be an effective estate planning tool to distribute wealth while you\'re alive and reduce potential inheritance disputes. Template available in our document library.',
      de: 'Ein **Schenkungsvertrag** formalisiert die Übertragung von Vermögenswerten zu Lebzeiten. Dies kann ein wirksames Nachlassplanungsinstrument sein. Vorlage verfügbar im Dokumenten-Zentrum.',
      ru: '**Договор дарения** (Schenkungsvertrag) формализует передачу активов при жизни. Это может быть эффективным инструментом планирования наследства для распределения богатства при жизни. Шаблон доступен в библиотеке документов.',
      ua: '**Договір дарування** (Schenkungsvertrag) формалізує передачу активів за життя. Це може бути ефективним інструментом планування спадщини для розподілу майна за життя. Шаблон доступний у бібліотеці документів.'
    },
    route: '/tools?tool=templates',
    priority: 6
  },
  {
    id: 'legal_medical_directive',
    category: 'legal',
    tags: ['medical', 'directive', 'advance', 'healthcare'],
    keywords: {
      en: ['medical directive', 'healthcare', 'advance', 'treatment'],
      de: ['medizinische direktive', 'gesundheitsvorsorge'],
      ru: ['медицинская директива', 'здравоохранение', 'лечение'],
      ua: ['медична директива', 'охорона здоров\'я', 'лікування']
    },
    content: {
      en: 'An **Advance Medical Directive** combines elements of a Living Will and healthcare proxy. It specifies both your treatment preferences AND designates a healthcare agent. This comprehensive document ensures your medical wishes are respected. Available as a template.',
      de: 'Eine **Medizinische Vorsorgeverfügung** kombiniert Patientenverfügung und Gesundheitsvertretung. Sie legt sowohl Behandlungswünsche als auch einen Gesundheitsbevollmächtigten fest. Als Vorlage verfügbar.',
      ru: '**Медицинская директива** сочетает элементы завещания при жизни и медицинского представителя. Она указывает как предпочтения по лечению, ТАК И назначает медицинского агента. Доступна как шаблон.',
      ua: '**Медична директива** поєднує елементи заповіту за життя та медичного представника. Вона вказує як уподобання щодо лікування, ТАК І призначає медичного агента. Доступна як шаблон.'
    },
    route: '/tools?tool=templates',
    priority: 6
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHECKLIST PHASES (4 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'checklist_phase1',
    category: 'checklist',
    tags: ['phase 1', 'immediate', 'doctor', 'family', 'urgent'],
    keywords: {
      en: ['first steps', 'immediately', 'doctor', 'family', 'death occurred'],
      de: ['erste schritte', 'sofort', 'arzt', 'familie', 'todesfall'],
      ru: ['первые шаги', 'немедленно', 'врач', 'семья', 'смерть произошла'],
      ua: ['перші кроки', 'негайно', 'лікар', 'сім\'я', 'смерть сталася']
    },
    content: {
      en: '**Phase 1 — Immediate (First 24-48 hours):** Call a doctor to confirm death and issue a death certificate. Inform close family members. Contact a funeral home. Secure the deceased\'s home and valuables. Begin gathering important documents (ID, insurance policies, bank details).',
      de: '**Phase 1 — Sofort (Erste 24-48 Stunden):** Arzt rufen für Totenschein. Nahe Angehörige informieren. Bestattungsunternehmen kontaktieren. Wohnung und Wertgegenstände sichern. Wichtige Dokumente sammeln.',
      ru: '**Этап 1 — Немедленно (Первые 24-48 часов):** Вызвать врача для констатации смерти и оформления свидетельства. Сообщить близким родственникам. Связаться с похоронным бюро. Обеспечить сохранность жилья и ценностей. Начать сбор важных документов.',
      ua: '**Етап 1 — Негайно (Перші 24-48 годин):** Викликати лікаря для констатації смерті та оформлення свідоцтва. Повідомити близьких родичів. Зв\'язатися з похоронним бюро. Забезпечити збереження житла та цінностей. Почати збір важливих документів.'
    },
    route: '/tools?tool=death-checklist',
    priority: 8
  },
  {
    id: 'checklist_phase2',
    category: 'checklist',
    tags: ['phase 2', 'formalities', 'registry', 'banks', 'insurance'],
    keywords: {
      en: ['formalities', 'registry', 'banks', 'insurance', 'employer', 'first week'],
      de: ['formalitäten', 'zivilstandsamt', 'banken', 'versicherungen', 'arbeitgeber'],
      ru: ['формальности', 'загс', 'банки', 'страховые', 'работодатель', 'первая неделя'],
      ua: ['формальності', 'загс', 'банки', 'страхові', 'роботодавець', 'перший тиждень']
    },
    content: {
      en: '**Phase 2 — Formalities (First week):** Visit the registry office (Zivilstandsamt) with death certificate. Notify banks and financial institutions. Contact insurance companies. Inform the employer/pension fund. Cancel subscriptions and memberships. Redirect mail.',
      de: '**Phase 2 — Formalitäten (Erste Woche):** Zivilstandsamt mit Sterbeurkunde besuchen. Banken und Finanzinstitute benachrichtigen. Versicherungen kontaktieren. Arbeitgeber/Pensionskasse informieren. Abonnements kündigen. Post umleiten.',
      ru: '**Этап 2 — Формальности (Первая неделя):** Посетить ЗАГС со свидетельством о смерти. Уведомить банки и финансовые организации. Связаться со страховыми компаниями. Сообщить работодателю/пенсионному фонду. Отменить подписки. Перенаправить почту.',
      ua: '**Етап 2 — Формальності (Перший тиждень):** Відвідати ЗАГС із свідоцтвом про смерть. Повідомити банки та фінансові установи. Зв\'язатися зі страховими компаніями. Повідомити роботодавця/пенсійний фонд. Скасувати підписки. Перенаправити пошту.'
    },
    route: '/tools?tool=death-checklist',
    priority: 7
  },
  {
    id: 'checklist_phase3',
    category: 'checklist',
    tags: ['phase 3', 'legal', 'probate', 'inheritance', 'estate'],
    keywords: {
      en: ['probate', 'inheritance', 'estate distribution', 'lawyer', 'weeks'],
      de: ['erbschaft', 'nachlassverteilung', 'anwalt', 'wochen'],
      ru: ['наследство', 'распределение', 'юрист', 'недели'],
      ua: ['спадщина', 'розподіл', 'юрист', 'тижні']
    },
    content: {
      en: '**Phase 3 — Legal (Weeks 2-4):** Locate and submit the will. Begin probate proceedings if needed. Consult an estate lawyer. Inventory all assets and liabilities. Address digital accounts and subscriptions. Begin estate distribution process.',
      de: '**Phase 3 — Rechtliches (Wochen 2-4):** Testament finden und einreichen. Erbschaftsverfahren einleiten. Anwalt für Erbrecht konsultieren. Alle Vermögenswerte und Verbindlichkeiten inventarisieren. Digitale Konten klären.',
      ru: '**Этап 3 — Юридический (Недели 2-4):** Найти и подать завещание. Начать наследственное производство. Проконсультироваться с юристом по наследству. Инвентаризировать все активы и обязательства. Разобраться с цифровыми аккаунтами.',
      ua: '**Етап 3 — Юридичний (Тижні 2-4):** Знайти та подати заповіт. Почати спадкове провадження. Проконсультуватися з юристом зі спадщини. Інвентаризувати всі активи та зобов\'язання. Розібратися з цифровими акаунтами.'
    },
    route: '/tools?tool=death-checklist',
    priority: 7
  },
  {
    id: 'checklist_phase4',
    category: 'checklist',
    tags: ['phase 4', 'long term', 'memorial', 'healing', 'months'],
    keywords: {
      en: ['long term', 'memorial', 'healing', 'months', 'anniversary'],
      de: ['langfristig', 'gedenken', 'heilung', 'monate', 'jahrestag'],
      ru: ['долгосрочный', 'мемориал', 'исцеление', 'месяцы', 'годовщина'],
      ua: ['довгостроковий', 'меморіал', 'зцілення', 'місяці', 'річниця']
    },
    content: {
      en: '**Phase 4 — Long Term (Months ahead):** Finalize estate distribution. Set up memorials or foundations. Continue grief support and self-care. Consider professional counseling. Review your own estate plans. Keep connected with the Ready Legacy support community.',
      de: '**Phase 4 — Langfristig (Monate):** Nachlassverteilung abschließen. Gedenkstätten einrichten. Trauerbegleitung fortsetzen. Professionelle Beratung in Betracht ziehen. Eigene Vorsorge überprüfen.',
      ru: '**Этап 4 — Долгосрочный (Месяцы вперёд):** Завершить распределение наследства. Создать мемориалы или фонды. Продолжить поддержку в горе и заботу о себе. Рассмотреть профессиональное консультирование. Пересмотреть собственные планы наследства.',
      ua: '**Етап 4 — Довгостроковий (Місяці вперед):** Завершити розподіл спадщини. Створити меморіали або фонди. Продовжити підтримку у горі та турботу про себе. Розглянути професійне консультування. Переглянути власні плани спадщини.'
    },
    route: '/tools?tool=death-checklist',
    priority: 6
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPLATES (5 chunks) — covered above in legal section, ref only
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // TEAM (4 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'team_overview',
    category: 'team',
    tags: ['team', 'founders', 'who', 'about us'],
    keywords: {
      en: ['team', 'founders', 'who', 'behind', 'people'],
      de: ['team', 'gründer', 'wer', 'dahinter', 'menschen'],
      ru: ['команда', 'основатели', 'кто', 'люди'],
      ua: ['команда', 'засновники', 'хто', 'люди']
    },
    content: {
      en: 'Ready Legacy was founded by **3 visionaries** based in Switzerland: **Dr. Inna Praxmarer** (CEO), **Viktor Ralchenko** (CTO), and **Olga Sushchinskaya** (COO). Together they combine expertise in spiritual care, software architecture, and financial operations to build a platform that bridges technology and human needs.',
      de: 'Ready Legacy wurde von **3 Visionären** aus der Schweiz gegründet: **Dr. Inna Praxmarer** (CEO), **Viktor Ralchenko** (CTO), und **Olga Sushchinskaya** (COO). Gemeinsam vereinen sie Expertise in Seelsorge, Software-Architektur und Finanzoperationen.',
      ru: 'Ready Legacy основан **3 визионерами** из Швейцарии: **Д-р Инна Праксмарер** (CEO), **Виктор Ральченко** (CTO), и **Ольга Сущинская** (COO). Вместе они объединяют экспертизу в духовном попечительстве, архитектуре ПО и финансовых операциях.',
      ua: 'Ready Legacy заснований **3 візіонерами** зі Швейцарії: **Д-р Інна Праксмарер** (CEO), **Віктор Ральченко** (CTO), та **Ольга Сущинська** (COO). Разом вони поєднують експертизу в духовній опіці, архітектурі ПЗ та фінансових операціях.'
    },
    route: '/team',
    priority: 7
  },
  {
    id: 'team_inna',
    category: 'team',
    tags: ['inna', 'ceo', 'founder', 'seelsorge'],
    keywords: {
      en: ['inna', 'ceo', 'spiritual', 'care', 'founder'],
      de: ['inna', 'ceo', 'seelsorge', 'gründerin'],
      ru: ['инна', 'сео', 'духовная', 'забота', 'основатель'],
      ua: ['інна', 'сео', 'духовна', 'турбота', 'засновниця']
    },
    content: {
      en: '**Dr. Inna Praxmarer** is the Co-Founder & CEO of Ready Legacy. A visionary Seelsorgerin (spiritual caregiver) based in Switzerland, HSLU alumna. She bridges emotional support and digital legacy, ensuring the journey of remembrance is handled with empathy, dignity, and conscious care.',
      de: '**Dr. Inna Praxmarer** ist Mitbegründerin & CEO von Ready Legacy. Eine visionäre Seelsorgerin aus der Schweiz, HSLU-Absolventin. Sie verbindet emotionale Unterstützung mit digitalem Erbe und sorgt dafür, dass der Weg des Gedenkens mit Empathie und Würde gestaltet wird.',
      ru: '**Д-р Инна Праксмарер** — соучредитель и CEO Ready Legacy. Визионер-Seelsorgerin (духовный попечитель) из Швейцарии, выпускница HSLU. Она объединяет эмоциональную поддержку с цифровым наследием, обеспечивая путь памяти с сочувствием и достоинством.',
      ua: '**Д-р Інна Праксмарер** — співзасновниця та CEO Ready Legacy. Візіонер-Seelsorgerin (духовний опікун) зі Швейцарії, випускниця HSLU. Вона поєднує емоційну підтримку з цифровою спадщиною, забезпечуючи шлях пам\'яті зі співчуттям та гідністю.'
    },
    route: '/team',
    priority: 5
  },
  {
    id: 'team_viktor',
    category: 'team',
    tags: ['viktor', 'cto', 'founder', 'software', 'architect'],
    keywords: {
      en: ['viktor', 'cto', 'software', 'architect', 'developer'],
      de: ['viktor', 'cto', 'software', 'architekt', 'entwickler'],
      ru: ['виктор', 'cto', 'программист', 'архитектор', 'разработчик'],
      ua: ['віктор', 'cto', 'програміст', 'архітектор', 'розробник']
    },
    content: {
      en: '**Viktor Ralchenko** is the Co-Founder & CTO of Ready Legacy. A Senior Software Architect with 20+ years of experience in enterprise systems, specializing in .NET, Cloud architectures, and AI integration. Based in Switzerland, he leads the technical vision of the platform.',
      de: '**Viktor Ralchenko** ist Mitbegründer & CTO von Ready Legacy. Ein Senior Software Architekt mit über 20 Jahren Erfahrung in Unternehmenssystemen, spezialisiert auf .NET, Cloud-Architekturen und KI-Integration. Er leitet die technische Vision der Plattform.',
      ru: '**Виктор Ральченко** — соучредитель и технический директор Ready Legacy. Ведущий архитектор ПО с 20+ годами опыта в корпоративных системах, специализирующийся на .NET, облачных архитектурах и интеграции ИИ. Он определяет техническое видение платформы.',
      ua: '**Віктор Ральченко** — співзасновник та технічний директор Ready Legacy. Провідний архітектор ПЗ з 20+ роками досвіду в корпоративних системах, що спеціалізується на .NET, хмарних архітектурах та інтеграції ШІ. Він визначає технічне бачення платформи.'
    },
    route: '/team',
    priority: 5
  },
  {
    id: 'team_olga',
    category: 'team',
    tags: ['olga', 'coo', 'founder', 'finance', 'operations'],
    keywords: {
      en: ['olga', 'coo', 'finance', 'operations', 'banking'],
      de: ['olga', 'coo', 'finanzen', 'operationen', 'banken'],
      ru: ['ольга', 'coo', 'финансы', 'операции', 'банки'],
      ua: ['ольга', 'coo', 'фінанси', 'операції', 'банки']
    },
    content: {
      en: '**Olga Sushchinskaya** is the Co-Founder & COO of Ready Legacy. A Senior financial executive with extensive experience as COO in global banking and markets. EMBA alumna of Stockholm School of Economics. She leads operational excellence and business strategy.',
      de: '**Olga Sushchinskaya** ist Mitbegründerin & COO von Ready Legacy. Eine erfahrene Finanzexpertin mit umfangreicher Erfahrung im globalen Banken- und Wertpapiergeschäft. EMBA-Absolventin der Stockholm School of Economics. Sie leitet die operative Exzellenz.',
      ru: '**Ольга Сущинская** — соучредитель и операционный директор Ready Legacy. Опытный финансовый руководитель с обширным опытом работы COO в глобальном банкинге и ценных бумагах. Выпускница EMBA Стокгольмской школы экономики. Она курирует операционную деятельность и бизнес-стратегию.',
      ua: '**Ольга Сущинська** — співзасновниця та операційний директор Ready Legacy. Досвідчений фінансовий керівник з великим досвідом роботи COO у глобальному банкінгу та цінних паперах. Випускниця EMBA Стокгольмської школи економіки. Вона курує операційну діяльність та бізнес-стратегію.'
    },
    route: '/team',
    priority: 5
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRICING / PLANS (3 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'plan_free',
    category: 'pricing',
    tags: ['free', 'plan', 'basic', 'starter'],
    keywords: {
      en: ['free', 'plan', 'price', 'cost', 'basic', 'starter'],
      de: ['kostenlos', 'plan', 'preis', 'kosten', 'basis'],
      ru: ['бесплатный', 'план', 'цена', 'стоимость', 'базовый'],
      ua: ['безкоштовний', 'план', 'ціна', 'вартість', 'базовий']
    },
    content: {
      en: 'The **Free Plan** includes: Asset Overview Wizard, basic legal document info, After Death Checklist, Executor Tasks overview, and this chat assistant. All data is stored locally in your browser. Perfect for getting started with estate planning.',
      de: 'Der **Kostenlose Plan** umfasst: Vermögens-Checkliste, grundlegende Rechtsinformationen, Todesfall-Checkliste, Willensvollstrecker-Übersicht, und diesen Chat-Assistenten. Alle Daten werden lokal gespeichert. Perfekt für den Einstieg.',
      ru: '**Бесплатный план** включает: Помощник по имуществу, базовую информацию о юридических документах, чек-лист после смерти, обзор задач исполнителя, и этот чат-ассистент. Все данные хранятся локально. Идеально для начала планирования.',
      ua: '**Безкоштовний план** включає: Майстер майна, базову інформацію про юридичні документи, чек-лист після смерті, огляд завдань виконавця, і цей чат-асистент. Всі дані зберігаються локально. Ідеально для початку планування.'
    },
    route: '/profile',
    priority: 7
  },
  {
    id: 'plan_premium',
    category: 'pricing',
    tags: ['premium', 'plan', 'paid', 'advanced'],
    keywords: {
      en: ['premium', 'plan', 'paid', 'upgrade', 'advanced', 'features'],
      de: ['premium', 'plan', 'bezahlt', 'upgrade', 'erweitert'],
      ru: ['премиум', 'план', 'платный', 'обновить', 'расширенный'],
      ua: ['преміум', 'план', 'платний', 'оновити', 'розширений']
    },
    content: {
      en: 'The **Premium Plan** adds: Will Builder wizard, Document Templates library, AI Avatar creation, Email Reminders, encrypted cloud storage, and Leave Behind digital legacy vault. Ideal for comprehensive estate planning with all tools unlocked.',
      de: 'Der **Premium-Plan** bietet zusätzlich: Testament-Planer, Vorlagen-Bibliothek, KI-Avatar, E-Mail-Erinnerungen, verschlüsselten Cloud-Speicher und digitales Vermächtnis-Tresor. Ideal für umfassende Nachlassplanung.',
      ru: '**Премиум-план** добавляет: Конструктор завещания, библиотеку шаблонов, создание ИИ-аватара, напоминания по email, зашифрованное облачное хранилище и цифровое хранилище наследия. Идеально для всестороннего планирования наследства.',
      ua: '**Преміум-план** додає: Конструктор заповіту, бібліотеку шаблонів, створення ШІ-аватара, нагадування по email, зашифроване хмарне сховище та цифрове сховище спадщини. Ідеально для всебічного планування спадщини.'
    },
    route: '/profile',
    priority: 7
  },
  {
    id: 'plan_family',
    category: 'pricing',
    tags: ['family', 'plan', 'shared', 'group'],
    keywords: {
      en: ['family', 'plan', 'shared', 'group', 'multiple', 'members'],
      de: ['familien', 'plan', 'gemeinsam', 'gruppe', 'mitglieder'],
      ru: ['семейный', 'план', 'совместный', 'группа', 'участники'],
      ua: ['сімейний', 'план', 'спільний', 'група', 'учасники']
    },
    content: {
      en: 'The **Family Plan** includes everything in Premium plus: shared family vault, multi-member access (up to 5 family members), collaborative estate planning, family emergency contacts, and priority support. Best for families planning together.',
      de: 'Der **Familien-Plan** enthält alles aus Premium plus: gemeinsamer Familien-Tresor, Zugang für bis zu 5 Familienmitglieder, gemeinsame Nachlassplanung, Familien-Notfallkontakte und Prioritäts-Support.',
      ru: '**Семейный план** включает всё из Премиум плюс: общее семейное хранилище, доступ для 5 членов семьи, совместное планирование наследства, семейные экстренные контакты и приоритетную поддержку.',
      ua: '**Сімейний план** включає все з Преміум плюс: спільне сімейне сховище, доступ для 5 членів сім\'ї, спільне планування спадщини, сімейні екстрені контакти та пріоритетну підтримку.'
    },
    route: '/profile',
    priority: 6
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCOUNT (4 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'account_register',
    category: 'account',
    tags: ['register', 'sign up', 'create account', 'login'],
    keywords: {
      en: ['register', 'sign up', 'create account', 'login', 'sign in'],
      de: ['registrieren', 'anmelden', 'konto erstellen', 'einloggen'],
      ru: ['регистрация', 'зарегистрироваться', 'создать аккаунт', 'войти'],
      ua: ['реєстрація', 'зареєструватися', 'створити акаунт', 'увійти']
    },
    content: {
      en: 'To get started, click **Sign In** in the top navigation bar. You can create a new account or log in if you already have one. Registration is free and gives you immediate access to basic estate planning tools.',
      de: 'Um zu beginnen, klicken Sie auf **Anmelden** in der oberen Navigation. Sie können ein neues Konto erstellen oder sich anmelden. Die Registrierung ist kostenlos und gibt Ihnen sofortigen Zugang zu grundlegenden Planungstools.',
      ru: 'Чтобы начать, нажмите **Войти** в верхней навигации. Вы можете создать новый аккаунт или войти в существующий. Регистрация бесплатна и даёт немедленный доступ к базовым инструментам планирования.',
      ua: 'Щоб почати, натисніть **Увійти** у верхній навігації. Ви можете створити новий акаунт або увійти в існуючий. Реєстрація безкоштовна і надає негайний доступ до базових інструментів планування.'
    },
    route: '/login',
    priority: 7
  },
  {
    id: 'account_profile',
    category: 'account',
    tags: ['profile', 'settings', 'account', 'preferences'],
    keywords: {
      en: ['profile', 'settings', 'account', 'preferences', 'personal info'],
      de: ['profil', 'einstellungen', 'konto', 'präferenzen'],
      ru: ['профиль', 'настройки', 'аккаунт', 'параметры'],
      ua: ['профіль', 'налаштування', 'акаунт', 'параметри']
    },
    content: {
      en: 'Your **Profile** page shows your account information, current plan, and settings. You can change your language, switch between dark and light themes, view your plan details, and manage your subscription from this page.',
      de: 'Ihre **Profil**-Seite zeigt Ihre Kontoinformationen, den aktuellen Plan und Einstellungen. Sie können die Sprache ändern, zwischen dunklem und hellem Design wechseln und Ihr Abonnement verwalten.',
      ru: 'Страница **Профиль** показывает информацию об аккаунте, текущий план и настройки. Здесь можно изменить язык, переключить тему (тёмная/светлая), просмотреть план и управлять подпиской.',
      ua: 'Сторінка **Профіль** показує інформацію про акаунт, поточний план та налаштування. Тут можна змінити мову, переключити тему (темна/світла), переглянути план та керувати підпискою.'
    },
    route: '/profile',
    priority: 6
  },
  {
    id: 'account_documents',
    category: 'account',
    tags: ['documents', 'archive', 'saved', 'files'],
    keywords: {
      en: ['documents', 'archive', 'saved', 'files', 'download', 'print'],
      de: ['dokumente', 'archiv', 'gespeichert', 'dateien', 'drucken'],
      ru: ['документы', 'архив', 'сохранённые', 'файлы', 'скачать', 'печать'],
      ua: ['документи', 'архів', 'збережені', 'файли', 'завантажити', 'друк']
    },
    content: {
      en: 'The **Documents** page is your personal archive. All completed templates, legal documents, and saved forms are stored here. You can filter by status (Draft, Ready, Filed), download, print, or update any document at any time.',
      de: 'Die **Dokumente**-Seite ist Ihr persönliches Archiv. Alle ausgefüllten Vorlagen und Rechtsdokumente werden hier gespeichert. Filtern nach Status (Entwurf, Bereit, Abgelegt), Herunterladen, Drucken oder jederzeit aktualisieren.',
      ru: 'Страница **Документы** — это ваш личный архив. Все заполненные шаблоны, юридические документы и сохранённые формы хранятся здесь. Фильтрация по статусу (Черновик, Готов, В архиве), скачивание, печать или обновление в любое время.',
      ua: 'Сторінка **Документи** — це ваш особистий архів. Всі заповнені шаблони, юридичні документи та збережені форми зберігаються тут. Фільтрація за статусом (Чернетка, Готовий, В архіві), завантаження, друк або оновлення у будь-який час.'
    },
    route: '/documents',
    priority: 6
  },
  {
    id: 'account_navigation',
    category: 'account',
    tags: ['navigation', 'menu', 'pages', 'how to use'],
    keywords: {
      en: ['navigate', 'menu', 'pages', 'how to use', 'find', 'where'],
      de: ['navigation', 'menü', 'seiten', 'wie benutzen', 'finden', 'wo'],
      ru: ['навигация', 'меню', 'страницы', 'как пользоваться', 'найти', 'где'],
      ua: ['навігація', 'меню', 'сторінки', 'як користуватися', 'знайти', 'де']
    },
    content: {
      en: 'Use the **top navigation bar** to access all sections: **Mission** (our vision), **Tools** (all planning tools with a sidebar), **Team** (founders), **Get in Touch** (contact us), **Documents** (your archive), and **Sign In** (account). The Tools page has a sidebar to switch between individual tools. You can also change language and theme from the header.',
      de: 'Nutzen Sie die **obere Navigation** für alle Bereiche: **Mission**, **Tools** (alle Planungstools mit Seitenleiste), **Team**, **Kontakt**, **Dokumente**, und **Anmelden**. Die Tools-Seite hat eine Seitenleiste zum Wechseln zwischen einzelnen Tools. Sprache und Thema können im Header geändert werden.',
      ru: 'Используйте **верхнюю навигацию** для доступа ко всем разделам: **Миссия**, **Инструменты** (все инструменты планирования с боковой панелью), **Команда**, **Связаться**, **Документы** и **Войти**. На странице Инструменты есть боковая панель для переключения между инструментами. Язык и тему можно изменить в шапке.',
      ua: 'Використовуйте **верхню навігацію** для доступу до всіх розділів: **Місія**, **Інструменти** (всі інструменти планування з бічною панеллю), **Команда**, **Зв\'язатися**, **Документи** та **Увійти**. На сторінці Інструменти є бічна панель для перемикання між інструментами. Мову та тему можна змінити у шапці.'
    },
    route: '/',
    priority: 7
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUPPORT (3 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'support_grief',
    category: 'support',
    tags: ['grief', 'help', 'cope', 'sad', 'emotional'],
    keywords: {
      en: ['grief', 'sad', 'help', 'cope', 'lost someone', 'struggling'],
      de: ['trauer', 'traurig', 'hilfe', 'verloren', 'kämpfe'],
      ru: ['горе', 'грустно', 'помощь', 'справиться', 'потерял', 'тяжело'],
      ua: ['горе', 'сумно', 'допомога', 'впоратися', 'втратив', 'важко']
    },
    content: {
      en: 'If you\'re grieving, you\'re not alone. Ready Legacy\'s **Bereavement Path** offers practical support: emotional checklists, self-help exercises (journaling, meditation, memory books), and links to professional support groups. Take it one step at a time — there\'s no right or wrong way to grieve.',
      de: 'Wenn Sie trauern, sind Sie nicht allein. Der **Pfad der Heilung** bietet praktische Unterstützung: emotionale Checklisten, Selbsthilfe-Übungen und Links zu professionellen Selbsthilfegruppen. Schritt für Schritt — es gibt keinen richtigen oder falschen Weg zu trauern.',
      ru: 'Если вы переживаете утрату, вы не одиноки. **Путь исцеления** предлагает практическую поддержку: эмоциональные чек-листы, упражнения для самопомощи (дневник, медитация, книга воспоминаний) и ссылки на профессиональные группы поддержки. Шаг за шагом — нет правильного или неправильного способа горевать.',
      ua: 'Якщо ви переживаєте втрату, ви не самотні. **Шлях зцілення** пропонує практичну підтримку: емоційні чек-листи, вправи для самодопомоги (щоденник, медитація, книга спогадів) та посилання на професійні групи підтримки. Крок за кроком — немає правильного чи неправильного способу горювати.'
    },
    route: '/tools?tool=bereavement',
    priority: 9
  },
  {
    id: 'support_groups',
    category: 'support',
    tags: ['support groups', 'community', 'online', 'help'],
    keywords: {
      en: ['support groups', 'community', 'online groups', 'counseling'],
      de: ['selbsthilfegruppen', 'gemeinschaft', 'online gruppen', 'beratung'],
      ru: ['группы поддержки', 'сообщество', 'онлайн группы', 'консультация'],
      ua: ['групи підтримки', 'спільнота', 'онлайн групи', 'консультація']
    },
    content: {
      en: 'We list verified **support groups**: **Verwaiste Eltern** (Germany/Austria/CH — for parents who lost a child), **Grief Share** (International, Online), **The Compassionate Friends** (International), **Caritas Grief Counseling** (Austria/Germany, In-Person), and **Online Grief Support** (Global, 24/7 forums). Find them in the Bereavement Path → Support Groups tab.',
      de: 'Wir listen verifizierte **Selbsthilfegruppen**: **Verwaiste Eltern**, **Grief Share** (International), **The Compassionate Friends**, **Caritas Trauerberatung**, und **Online Grief Support** (Global, 24/7). Im Pfad der Heilung → Selbsthilfegruppen Tab.',
      ru: 'Мы предлагаем проверенные **группы поддержки**: **Verwaiste Eltern** (Германия/Австрия/Швейцария), **Grief Share** (международная, онлайн), **The Compassionate Friends** (международная), **Caritas** (Австрия/Германия), и **Online Grief Support** (глобальная, 24/7). Найдите их в Путь исцеления → вкладка Группы поддержки.',
      ua: 'Ми пропонуємо перевірені **групи підтримки**: **Verwaiste Eltern** (Німеччина/Австрія/Швейцарія), **Grief Share** (міжнародна, онлайн), **The Compassionate Friends** (міжнародна), **Caritas** (Австрія/Німеччина), та **Online Grief Support** (глобальна, 24/7). Знайдіть їх у Шлях зцілення → вкладка Групи підтримки.'
    },
    route: '/tools?tool=bereavement',
    priority: 6
  },
  {
    id: 'support_chat',
    category: 'support',
    tags: ['chat', 'assistant', 'help', 'bot', 'ai'],
    keywords: {
      en: ['chat', 'assistant', 'help', 'bot', 'ai', 'ask'],
      de: ['chat', 'assistent', 'hilfe', 'bot', 'ki', 'fragen'],
      ru: ['чат', 'ассистент', 'помощь', 'бот', 'ии', 'спросить'],
      ua: ['чат', 'асистент', 'допомога', 'бот', 'шi', 'запитати']
    },
    content: {
      en: 'I\'m the **Ready Legacy Chat Assistant**! I can help you navigate the platform, explain tools and documents, answer questions about estate planning, and point you to the right sections. I support English, German, Russian, and Ukrainian. Try asking me about any tool or topic!',
      de: 'Ich bin der **Ready Legacy Chat-Assistent**! Ich kann Ihnen bei der Navigation helfen, Tools und Dokumente erklären, Fragen zur Nachlassplanung beantworten und Sie zu den richtigen Bereichen leiten. Ich unterstütze Deutsch, Englisch, Russisch und Ukrainisch.',
      ru: 'Я — **Чат-ассистент Ready Legacy**! Я помогу навигировать по платформе, объясню инструменты и документы, отвечу на вопросы о планировании наследства и направлю вас в нужный раздел. Я поддерживаю русский, английский, немецкий и украинский языки.',
      ua: 'Я — **Чат-асистент Ready Legacy**! Я допоможу навігувати платформою, поясню інструменти та документи, відповім на питання про планування спадщини та направлю вас у потрібний розділ. Я підтримую українську, англійську, німецьку та російську мови.'
    },
    priority: 5
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FAQ (12 chunks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'faq_getting_started',
    category: 'faq',
    tags: ['getting started', 'begin', 'start', 'how to'],
    keywords: {
      en: ['get started', 'begin', 'start', 'how to', 'first step'],
      de: ['anfangen', 'beginnen', 'starten', 'erster schritt'],
      ru: ['начать', 'как начать', 'первый шаг', 'с чего начать'],
      ua: ['почати', 'як почати', 'перший крок', 'з чого почати']
    },
    content: {
      en: '**How to get started:** 1) Explore the **Tools** section — start with the Asset Overview to list your assets. 2) Review the **Legal Documents** section for living wills and directives. 3) Use the **Will Builder** when you\'re ready to structure your testament. 4) Check the **After Death Guide** to understand what your family will need. 5) Create your personal **Leave Behind** messages.',
      de: '**So beginnen Sie:** 1) Erkunden Sie die **Tools** — starten Sie mit der Vermögensübersicht. 2) Prüfen Sie die **Rechtlichen Dokumente**. 3) Nutzen Sie den **Testament-Planer**. 4) Lesen Sie die **Todesfall-Anleitung**. 5) Erstellen Sie Ihre **Vermächtnis**-Nachrichten.',
      ru: '**Как начать:** 1) Изучите раздел **Инструменты** — начните с обзора активов. 2) Ознакомьтесь с разделом **Юридические документы**. 3) Используйте **Конструктор завещания** когда будете готовы. 4) Просмотрите **Инструкцию после смерти** чтобы понять, что понадобится вашей семье. 5) Создайте личные **послания наследия**.',
      ua: '**Як почати:** 1) Дослідіть розділ **Інструменти** — почніть з огляду активів. 2) Ознайомтеся з розділом **Юридичні документи**. 3) Використайте **Конструктор заповіту** коли будете готові. 4) Перегляньте **Інструкцію після смерті** щоб зрозуміти, що знадобиться вашій сім\'ї. 5) Створіть особисті **послання спадщини**.'
    },
    route: '/tools',
    priority: 9
  },
  {
    id: 'faq_data_security',
    category: 'faq',
    tags: ['security', 'data', 'privacy', 'safe'],
    keywords: {
      en: ['security', 'safe', 'privacy', 'data protected', 'hack'],
      de: ['sicherheit', 'sicher', 'datenschutz', 'geschützt'],
      ru: ['безопасность', 'защита', 'конфиденциальность', 'данные защищены'],
      ua: ['безпека', 'захист', 'конфіденційність', 'дані захищені']
    },
    content: {
      en: 'Your data security is our priority. Currently, **all data stays in your browser** (localStorage) — nothing is sent to any server. In the future, Premium users will get encrypted cloud storage with end-to-end encryption. We never sell or share your personal information.',
      de: 'Ihre Datensicherheit hat Priorität. Aktuell bleiben **alle Daten in Ihrem Browser** (localStorage). In Zukunft bieten wir verschlüsselten Cloud-Speicher für Premium-Nutzer. Wir verkaufen oder teilen niemals Ihre persönlichen Daten.',
      ru: 'Безопасность ваших данных — наш приоритет. В настоящее время **все данные остаются в вашем браузере** (localStorage) — ничего не отправляется на сервер. В будущем премиум-пользователи получат зашифрованное облачное хранилище. Мы никогда не продаём и не делимся вашими личными данными.',
      ua: 'Безпека ваших даних — наш пріоритет. Наразі **всі дані залишаються у вашому браузері** (localStorage) — нічого не надсилається на сервер. У майбутньому преміум-користувачі отримають зашифроване хмарне сховище. Ми ніколи не продаємо і не ділимося вашими особистими даними.'
    },
    priority: 8
  },
  {
    id: 'faq_languages',
    category: 'faq',
    tags: ['language', 'translation', 'multilingual'],
    keywords: {
      en: ['language', 'translation', 'english', 'german', 'russian', 'ukrainian', 'change language'],
      de: ['sprache', 'übersetzung', 'englisch', 'deutsch', 'russisch', 'ukrainisch', 'sprache wechseln'],
      ru: ['язык', 'перевод', 'английский', 'немецкий', 'русский', 'украинский', 'сменить язык'],
      ua: ['мова', 'переклад', 'англійська', 'німецька', 'російська', 'українська', 'змінити мову']
    },
    content: {
      en: 'Ready Legacy supports **4 languages**: English, German (Deutsch), Russian (Русский), and Ukrainian (Українська). Switch languages using the language selector in the top-right corner of the navigation bar. All tools, documents, and this chat assistant work in all 4 languages.',
      de: 'Ready Legacy unterstützt **4 Sprachen**: Englisch, Deutsch, Russisch und Ukrainisch. Wechseln Sie die Sprache über den Sprachschalter oben rechts in der Navigation. Alle Tools, Dokumente und dieser Chat-Assistent funktionieren in allen 4 Sprachen.',
      ru: 'Ready Legacy поддерживает **4 языка**: английский, немецкий, русский и украинский. Переключайте язык с помощью селектора в правом верхнем углу навигации. Все инструменты, документы и этот чат-ассистент работают на всех 4 языках.',
      ua: 'Ready Legacy підтримує **4 мови**: англійську, німецьку, російську та українську. Переключайте мову за допомогою селектора у правому верхньому куті навігації. Всі інструменти, документи та цей чат-асистент працюють усіма 4 мовами.'
    },
    priority: 7
  },
  {
    id: 'faq_contact',
    category: 'faq',
    tags: ['contact', 'reach', 'email', 'support'],
    keywords: {
      en: ['contact', 'reach', 'email', 'phone', 'support', 'feedback'],
      de: ['kontakt', 'erreichen', 'email', 'telefon', 'support', 'feedback'],
      ru: ['контакт', 'связаться', 'email', 'телефон', 'поддержка', 'отзыв'],
      ua: ['контакт', 'зв\'язатися', 'email', 'телефон', 'підтримка', 'відгук']
    },
    content: {
      en: 'You can reach us through the **Get in Touch** page in the navigation. We welcome feedback, partnership inquiries, and questions about the platform. We\'re a Switzerland-based team and respond as quickly as possible.',
      de: 'Sie erreichen uns über die **Kontakt**-Seite in der Navigation. Wir freuen uns über Feedback, Partnerschaftsanfragen und Fragen zur Plattform. Wir sind ein Schweizer Team und antworten so schnell wie möglich.',
      ru: 'Вы можете связаться с нами через страницу **Контакт** в навигации. Мы приветствуем отзывы, запросы о партнёрстве и вопросы о платформе. Мы — команда из Швейцарии и отвечаем как можно быстрее.',
      ua: 'Ви можете зв\'язатися з нами через сторінку **Контакт** у навігації. Ми вітаємо відгуки, запити про партнерство та питання про платформу. Ми — команда зі Швейцарії і відповідаємо якнайшвидше.'
    },
    route: '/contact',
    priority: 6
  },
  {
    id: 'faq_swiss_law',
    category: 'faq',
    tags: ['switzerland', 'law', 'legal', 'jurisdiction'],
    keywords: {
      en: ['switzerland', 'swiss law', 'legal', 'jurisdiction', 'country'],
      de: ['schweiz', 'schweizer recht', 'rechtlich', 'zuständigkeit'],
      ru: ['швейцария', 'швейцарское право', 'юрисдикция', 'страна'],
      ua: ['швейцарія', 'швейцарське право', 'юрисдикція', 'країна']
    },
    content: {
      en: 'Ready Legacy\'s legal templates are primarily based on **Swiss law** (e.g., handwritten wills requirement, 3-month inheritance waiver deadline). However, many estate planning principles are universal. Always consult a local lawyer for jurisdiction-specific legal advice.',
      de: 'Die Rechtsvorlagen von Ready Legacy basieren hauptsächlich auf **Schweizer Recht** (z.B. handschriftliche Testamente, 3-Monats-Frist für Erbausschlagung). Viele Nachlassplanungs-Prinzipien sind jedoch universell. Konsultieren Sie immer einen lokalen Anwalt.',
      ru: 'Юридические шаблоны Ready Legacy основаны главным образом на **швейцарском праве** (напр., требование рукописного завещания, 3-месячный срок отказа от наследства). Однако многие принципы планирования наследства универсальны. Всегда консультируйтесь с местным юристом.',
      ua: 'Юридичні шаблони Ready Legacy базуються головним чином на **швейцарському праві** (напр., вимога рукописного заповіту, 3-місячний термін відмови від спадщини). Однак багато принципів планування спадщини є універсальними. Завжди консультуйтеся з місцевим юристом.'
    },
    priority: 7
  },
  {
    id: 'faq_digital_legacy',
    category: 'faq',
    tags: ['digital', 'legacy', 'online accounts', 'crypto', 'social media'],
    keywords: {
      en: ['digital legacy', 'online accounts', 'crypto', 'social media', 'passwords', 'digital assets'],
      de: ['digitaler nachlass', 'online konten', 'krypto', 'soziale medien', 'passwörter'],
      ru: ['цифровое наследие', 'онлайн аккаунты', 'крипто', 'соцсети', 'пароли', 'цифровые активы'],
      ua: ['цифрова спадщина', 'онлайн акаунти', 'крипто', 'соцмережі', 'паролі', 'цифрові активи']
    },
    content: {
      en: 'Don\'t forget your **digital legacy**! In the Asset Overview, you can document: crypto wallets, crypto exchanges, hardware devices (Ledger, Trezor), online accounts (email, social media), online banking & fintech. It\'s crucial to leave access instructions securely for your heirs.',
      de: 'Vergessen Sie nicht Ihr **digitales Erbe**! In der Vermögensübersicht können Sie dokumentieren: Krypto-Wallets, Exchanges, Hardware-Devices, Online-Konten, Online-Banking. Es ist wichtig, sichere Zugangsinformationen für Ihre Erben zu hinterlassen.',
      ru: 'Не забудьте о **цифровом наследии**! В обзоре активов можно задокументировать: крипто-кошельки, криптобиржи, аппаратные устройства (Ledger, Trezor), онлайн-аккаунты (email, соцсети), онлайн-банкинг. Важно оставить безопасные инструкции доступа для наследников.',
      ua: 'Не забудьте про **цифрову спадщину**! В огляді активів можна задокументувати: крипто-гаманці, криптобіржі, апаратні пристрої (Ledger, Trezor), онлайн-акаунти (email, соцмережі), онлайн-банкінг. Важливо залишити безпечні інструкції доступу для спадкоємців.'
    },
    route: '/tools?tool=asset-overview',
    priority: 7
  },
  {
    id: 'faq_what_tool_to_use',
    category: 'faq',
    tags: ['which tool', 'recommend', 'best', 'start'],
    keywords: {
      en: ['which tool', 'recommend', 'best tool', 'what should i use'],
      de: ['welches tool', 'empfehlung', 'bestes tool', 'was soll ich nutzen'],
      ru: ['какой инструмент', 'рекомендация', 'лучший', 'что использовать'],
      ua: ['який інструмент', 'рекомендація', 'найкращий', 'що використати']
    },
    content: {
      en: 'Start with the **Asset Overview** to list everything you own and owe. Then check the **Legal Documents** for living wills and directives. When ready, use the **Will Builder** to structure your testament. The **Templates** section has ready-to-use document forms. Finally, **Leave Behind** lets you create personal messages for loved ones.',
      de: 'Beginnen Sie mit der **Vermögensübersicht**, um alles zu erfassen. Dann prüfen Sie die **Rechtlichen Dokumente**. Nutzen Sie den **Testament-Planer** wenn bereit. Die **Vorlagen** bieten fertige Dokumentformulare. **Hinterlassen** ermöglicht persönliche Nachrichten.',
      ru: 'Начните с **Обзора активов** чтобы перечислить всё имущество и обязательства. Затем ознакомьтесь с **Юридическими документами**. Когда будете готовы, используйте **Конструктор завещания**. В разделе **Шаблоны** есть готовые формы. Наконец, **Оставьте после себя** — создайте личные послания.',
      ua: 'Почніть з **Огляду активів** щоб перерахувати все майно та зобов\'язання. Потім ознайомтеся з **Юридичними документами**. Коли будете готові, використайте **Конструктор заповіту**. У розділі **Шаблони** є готові форми. Нарешті, **Залиште після себе** — створіть особисті послання.'
    },
    route: '/tools',
    priority: 8
  },
  {
    id: 'faq_mobile',
    category: 'faq',
    tags: ['mobile', 'phone', 'tablet', 'responsive'],
    keywords: {
      en: ['mobile', 'phone', 'tablet', 'app', 'responsive'],
      de: ['mobil', 'handy', 'tablet', 'app', 'responsiv'],
      ru: ['мобильный', 'телефон', 'планшет', 'приложение'],
      ua: ['мобільний', 'телефон', 'планшет', 'додаток']
    },
    content: {
      en: 'Ready Legacy is a **responsive web application** that works on any device — desktop, tablet, or smartphone. There\'s no separate mobile app needed; just open the website in your mobile browser. All features work on all screen sizes.',
      de: 'Ready Legacy ist eine **responsive Webanwendung**, die auf jedem Gerät funktioniert — Desktop, Tablet oder Smartphone. Keine separate App nötig; öffnen Sie einfach die Website im mobilen Browser.',
      ru: 'Ready Legacy — это **адаптивное веб-приложение**, которое работает на любом устройстве — компьютере, планшете или смартфоне. Отдельное мобильное приложение не нужно — просто откройте сайт в мобильном браузере.',
      ua: 'Ready Legacy — це **адаптивний веб-додаток**, що працює на будь-якому пристрої — комп\'ютері, планшеті чи смартфоні. Окремий мобільний додаток не потрібен — просто відкрийте сайт у мобільному браузері.'
    },
    priority: 5
  },
  {
    id: 'faq_partnership',
    category: 'faq',
    tags: ['partner', 'invest', 'mvp', 'join'],
    keywords: {
      en: ['partner', 'invest', 'join', 'collaborate', 'mvp', 'opportunity'],
      de: ['partner', 'investieren', 'mitmachen', 'zusammenarbeit', 'mvp'],
      ru: ['партнёр', 'инвестировать', 'присоединиться', 'сотрудничество', 'mvp'],
      ua: ['партнер', 'інвестувати', 'приєднатися', 'співпраця', 'mvp']
    },
    content: {
      en: 'We\'re looking for **technical partners** to help build the full MVP! We have the concept and logic ready. Areas: secure cloud storage, AI integration, and immersive web experiences. Interested? Visit the **Get in Touch** page or click "Partner With Us" on the homepage.',
      de: 'Wir suchen **technische Partner** für das vollständige MVP! Konzept und Logik sind fertig. Bereiche: sicherer Cloud-Speicher, KI-Integration und immersive Web-Erlebnisse. Interessiert? Besuchen Sie die **Kontakt**-Seite.',
      ru: 'Мы ищем **технических партнёров** для создания полного MVP! Концепция и логика готовы. Направления: безопасное облачное хранилище, интеграция ИИ и иммерсивный веб. Заинтересованы? Посетите страницу **Контакт**.',
      ua: 'Ми шукаємо **технічних партнерів** для створення повного MVP! Концепція та логіка готові. Напрямки: безпечне хмарне сховище, інтеграція ШІ та імерсивний веб. Зацікавлені? Відвідайте сторінку **Контакт**.'
    },
    route: '/contact',
    priority: 6
  },
  {
    id: 'faq_dark_light',
    category: 'faq',
    tags: ['theme', 'dark', 'light', 'mode', 'appearance'],
    keywords: {
      en: ['dark mode', 'light mode', 'theme', 'appearance', 'switch'],
      de: ['dunkelmodus', 'hellmodus', 'thema', 'aussehen', 'wechseln'],
      ru: ['тёмная тема', 'светлая тема', 'оформление', 'переключить'],
      ua: ['темна тема', 'світла тема', 'оформлення', 'переключити']
    },
    content: {
      en: 'Ready Legacy supports **dark and light themes**. Toggle between them using the theme switch button in the navigation header. Your preference is saved automatically. Dark mode is the default and is easier on the eyes.',
      de: 'Ready Legacy unterstützt **dunkles und helles Design**. Wechseln Sie über den Thema-Schalter in der Navigation. Ihre Präferenz wird automatisch gespeichert.',
      ru: 'Ready Legacy поддерживает **тёмную и светлую тему**. Переключайтесь между ними кнопкой в навигации. Ваш выбор сохраняется автоматически. Тёмная тема установлена по умолчанию.',
      ua: 'Ready Legacy підтримує **темну та світлу тему**. Переключайтеся між ними кнопкою у навігації. Ваш вибір зберігається автоматично. Темна тема встановлена за замовчуванням.'
    },
    priority: 4
  },
  {
    id: 'faq_offline',
    category: 'faq',
    tags: ['offline', 'internet', 'connection', 'work without'],
    keywords: {
      en: ['offline', 'no internet', 'work without', 'connection'],
      de: ['offline', 'kein internet', 'ohne verbindung'],
      ru: ['оффлайн', 'без интернета', 'без подключения'],
      ua: ['офлайн', 'без інтернету', 'без підключення']
    },
    content: {
      en: 'Since your data is stored **locally in your browser**, most features work even with limited connectivity after the initial page load. However, you need internet to first access the website and to use this chat assistant. Future versions will have enhanced offline support.',
      de: 'Da Ihre Daten **lokal im Browser** gespeichert werden, funktionieren die meisten Funktionen auch bei eingeschränkter Verbindung. Sie benötigen Internet für den ersten Zugriff und den Chat-Assistenten.',
      ru: 'Поскольку данные хранятся **локально в браузере**, большинство функций работают даже с ограниченным подключением после первой загрузки. Однако для первого доступа к сайту и этого чат-ассистента нужен интернет.',
      ua: 'Оскільки дані зберігаються **локально у браузері**, більшість функцій працюють навіть з обмеженим підключенням після першого завантаження. Однак для першого доступу до сайту та цього чат-асистента потрібен інтернет.'
    },
    priority: 4
  },
  {
    id: 'faq_export',
    category: 'faq',
    tags: ['export', 'download', 'print', 'pdf', 'save'],
    keywords: {
      en: ['export', 'download', 'print', 'pdf', 'save document'],
      de: ['exportieren', 'herunterladen', 'drucken', 'pdf', 'dokument speichern'],
      ru: ['экспорт', 'скачать', 'распечатать', 'pdf', 'сохранить документ'],
      ua: ['експорт', 'завантажити', 'роздрукувати', 'pdf', 'зберегти документ']
    },
    content: {
      en: 'You can **print** your documents directly from the Documents page. Click the "Print" button on any document card. For a PDF, use your browser\'s "Print to PDF" option. All your completed templates and filled forms are available in your Document Archive.',
      de: 'Sie können Ihre Dokumente direkt von der Dokumentenseite **drucken**. Klicken Sie auf "Drucken". Für PDF nutzen Sie die Browser-Funktion "Als PDF drucken". Alle ausgefüllten Vorlagen sind in Ihrem Dokumentenarchiv.',
      ru: 'Вы можете **распечатать** документы прямо со страницы Документы. Нажмите кнопку "Распечатать". Для PDF используйте функцию браузера "Печать в PDF". Все заполненные шаблоны доступны в вашем архиве документов.',
      ua: 'Ви можете **роздрукувати** документи прямо зі сторінки Документи. Натисніть кнопку "Роздрукувати". Для PDF використайте функцію браузера "Друк у PDF". Всі заповнені шаблони доступні у вашому архіві документів.'
    },
    route: '/documents',
    priority: 5
  }
];
