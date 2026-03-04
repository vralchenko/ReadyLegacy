// Stopwords for 4 languages — filtered during BM25 tokenization
export const STOPWORDS: Record<string, Set<string>> = {
  en: new Set([
    'a','an','the','is','are','was','were','be','been','being','have','has','had',
    'do','does','did','will','would','shall','should','may','might','must','can','could',
    'i','me','my','we','our','you','your','he','she','it','they','them','their',
    'this','that','these','those','what','which','who','whom','how','when','where','why',
    'in','on','at','to','for','of','with','by','from','as','into','through','during',
    'before','after','above','below','between','out','off','over','under','about','up','down',
    'and','but','or','nor','not','so','very','just','also','than','then','too','here','there',
    'all','each','every','both','few','more','most','other','some','such','no','only','same'
  ]),
  de: new Set([
    'der','die','das','ein','eine','einer','eines','einem','einen',
    'ist','sind','war','waren','wird','werden','wurde','wurden','hat','haben','hatte','hatten',
    'ich','du','er','sie','es','wir','ihr','mein','dein','sein','unser','euer',
    'und','oder','aber','nicht','auch','noch','schon','nur','sehr','mehr',
    'in','an','auf','mit','für','von','zu','aus','bei','nach','über','unter','vor','zwischen',
    'den','dem','des','dass','wenn','weil','als','wie','was','wer','wo','kann','muss','soll',
    'hier','dort','da','so','doch','ja','nein','alle','jeder','jede','jedes','kein','keine'
  ]),
  ru: new Set([
    'и','в','на','с','по','для','от','из','к','о','у','за','не','но','а','или','что','как',
    'это','он','она','оно','они','мы','вы','я','ты','мой','твой','его','её','их','наш','ваш',
    'был','была','было','были','есть','будет','будут','быть','бы','же','ли','ни','то','этот',
    'эта','эти','тот','та','те','все','всё','весь','вся','каждый','другой','свой','себя',
    'так','уже','ещё','очень','только','можно','нужно','тоже','также','когда','где','здесь',
    'там','если','чтобы','потому','более','менее','между','после','перед','через','при','до'
  ]),
  ua: new Set([
    'і','в','на','з','по','для','від','із','до','про','у','за','не','але','а','або','що','як',
    'це','він','вона','воно','вони','ми','ви','я','ти','мій','твій','його','її','їх','наш','ваш',
    'був','була','було','були','є','буде','будуть','бути','б','же','чи','ні','то','цей',
    'ця','ці','той','та','ті','все','весь','вся','кожен','інший','свій','себе',
    'так','вже','ще','дуже','тільки','можна','потрібно','також','теж','коли','де','тут',
    'там','якщо','щоб','тому','більш','менш','між','після','перед','через','при','поки'
  ])
};
