// ─── Demo Data Registry ──────────────────────────────────────────────────────
// Single source of truth for ALL demo data across tools.

// ─── Will Builder ────────────────────────────────────────────────────────────
export const DEMO_WILL = {
    will_name: 'Thomas Müller',
    will_origin: 'Luzern, Switzerland',
    will_spouse_q: '50',
    will_children_q: '50',
    will_others: 'Swiss Red Cross — 5% of remaining estate',
    will_legacies: 'Family watch collection to nephew Alexander\nGrandmother\'s ring to daughter Sofia\nLibrary of first editions to the University of Zurich',
    will_handwritten: true,
    will_dated: true,
};

// ─── Asset Overview: Inputs ──────────────────────────────────────────────────
export const DEMO_ASSET_INPUTS: Record<string, string> = {
    asset_brought: 'Apartment in Luzern, inherited from family (est. 450,000 CHF)',
    asset_mortgages: '180,000 CHF — Raiffeisen Bank, fixed rate until 2029',
    asset_debts: 'Car lease: 12,000 CHF remaining (BMW Financial Services)',
    funeral_type: 'cremation',
    funeral_location: 'Friedental Cemetery, Luzern',
    funeral_notes: 'Simple ceremony with close family. No flowers — donations to Swiss Red Cross instead.',
    others_notes: 'All personal journals in the top drawer of the study desk — please give to Sofia.',
};

// ─── Asset Overview: Lists ───────────────────────────────────────────────────
export const DEMO_ASSET_LISTS: Record<string, Record<string, string>[]> = {
    bank: [
        { name: 'UBS Savings Account', value: '85,000 CHF' },
        { name: 'PostFinance Checking', value: '12,400 CHF' },
    ],
    securities: [
        { name: 'UBS Global Equity Fund', value: '45,000 CHF' },
        { name: 'Vanguard S&P 500 ETF', value: '32,000 CHF' },
    ],
    bvg: [
        { name: 'Pensionskasse Stadt Luzern', value: '280,000 CHF (vested)' },
    ],
    insurance: [
        { name: 'Swiss Life — Term Life', value: '500,000 CHF payout' },
        { name: 'Helsana — Health Insurance', value: 'Basic + supplementary' },
    ],
    real_estate: [
        { name: 'Family apartment', value: '450,000 CHF', address: 'Bahnhofstrasse 42, 6003 Luzern' },
    ],
    crypto_wallets: [
        { name: 'Bitcoin — Ledger Nano X', location: 'Home safe', instructions: 'Seed phrase in bank vault envelope #12' },
    ],
    crypto_exchanges: [
        { name: 'Binance', email: 't.mueller@gmail.com', instructions: '2FA on phone — backup codes in bank vault' },
        { name: 'Coinbase', email: 't.mueller@gmail.com', instructions: 'Contact support with death certificate' },
    ],
    hardware_wallets: [
        { name: 'Ledger Nano X', location: 'Home safe', instructions: 'PIN in sealed envelope in bank vault' },
    ],
    online_accounts: [
        { name: 'Gmail', wish: 'Delete after 6 months' },
        { name: 'Facebook', wish: 'Memorialize' },
        { name: 'LinkedIn', wish: 'Delete' },
    ],
    online_banking: [
        { name: 'Revolut', instructions: 'Contact via app to close account' },
        { name: 'PayPal', instructions: 'Close account after transferring remaining balance' },
    ],
    funeral_music: [
        { name: 'Bach — Air on the G String', note: 'Opening piece' },
        { name: 'Ludovico Einaudi — Nuvole Bianche', note: 'During the ceremony' },
    ],
    funeral_people: [
        { name: 'Close friends from university', contact: 'See address book in study desk' },
        { name: 'Colleagues from Zurich office', contact: 'HR contact: hr@company.ch' },
    ],
    funeral_flowers: [
        { name: 'White roses only, or donations to Swiss Red Cross' },
    ],
    sentimental_items: [
        { name: 'Grandfather\'s pocket watch', recipient: 'Nephew Alexander', note: 'Given to me on my 18th birthday' },
        { name: 'Wedding photo album', recipient: 'Daughter Sofia', note: 'All the memories from 2005' },
    ],
    pets: [
        { name: 'Luna (Golden Retriever)', caretaker: 'Sister Maria in Bern' },
    ],
};

// ─── Legal Docs ──────────────────────────────────────────────────────────────
export const DEMO_LEGAL_DOCS = () => {
    const today = new Date().toLocaleDateString();
    return {
        living_will: { id: 'living_will', docType: 'living_will', status: 'completed', notes: 'Signed before two witnesses in March 2024. Copy given to Dr. Meier.', lastUpdated: today, location: 'Home safe, top shelf' },
        advance_care: { id: 'advance_care', docType: 'advance_care', status: 'filed', notes: 'Notarized at Notariat Luzern. Maria designated as primary representative.', lastUpdated: today, location: 'Notary office — Dr. Keller, Luzern' },
        power_of_attorney: { id: 'power_of_attorney', docType: 'power_of_attorney', status: 'completed', notes: 'General PoA for financial matters. Granted to wife Anna.', lastUpdated: today, location: 'Bank vault — UBS Luzern' },
        will: { id: 'will', docType: 'will', status: 'filed', notes: 'Handwritten, dated, and signed. Reviewed by estate lawyer.', lastUpdated: today, location: 'Registered at Bezirksgericht Luzern' },
        organ_donation: { id: 'organ_donation', docType: 'organ_donation', status: 'completed', notes: 'Registered with Swisstransplant. Donor card in wallet.', lastUpdated: today, location: 'Wallet + digital copy in email' },
        burial_directive: { id: 'burial_directive', docType: 'burial_directive', status: 'in_progress', notes: 'Draft started. Prefer cremation at Friedental.', lastUpdated: today, location: '' },
        insurance_policies: { id: 'insurance_policies', docType: 'insurance_policies', status: 'completed', notes: 'Swiss Life term policy, Helsana health, Zurich household. All contacts documented.', lastUpdated: today, location: 'Home office filing cabinet, folder "Insurance"' },
        digital_testament: { id: 'digital_testament', docType: 'digital_testament', status: 'not_started', notes: '', lastUpdated: '', location: '' },
    };
};

// ─── Executor Tasks ──────────────────────────────────────────────────────────
export const DEMO_TASKS = () => {
    const today = new Date().toLocaleDateString();
    return [
        { id: '1', text: 'Register death at Zivilstandsamt within 2 days', category: 'Legal', done: true, createdAt: today },
        { id: '2', text: 'Notify employer and cancel employment contract', category: 'Legal', done: true, createdAt: today },
        { id: '3', text: 'Contact UBS to freeze joint accounts', category: 'Financial', done: false, createdAt: today },
        { id: '4', text: 'File insurance claim with Swiss Life', category: 'Financial', done: false, createdAt: today },
        { id: '5', text: 'Cancel health insurance (Helsana)', category: 'Financial', done: false, createdAt: today },
        { id: '6', text: 'Notify AHV/IV and pension fund', category: 'Financial', done: false, createdAt: today },
        { id: '7', text: 'Inform close family and friends', category: 'Family', done: true, createdAt: today },
        { id: '8', text: 'Arrange funeral at Friedental Cemetery', category: 'Family', done: false, createdAt: today },
        { id: '9', text: 'Collect original will from Bezirksgericht', category: 'Documents', done: false, createdAt: today },
        { id: '10', text: 'Request Erbschein (certificate of inheritance)', category: 'Documents', done: false, createdAt: today },
        { id: '11', text: 'Cancel subscriptions (Netflix, Spotify, gym)', category: 'Other', done: false, createdAt: today },
        { id: '12', text: 'Redirect mail via Post.ch', category: 'Other', done: false, createdAt: today },
    ];
};

// ─── Leave Behind ────────────────────────────────────────────────────────────
export const DEMO_LEGACY_ITEMS = () => {
    const today = new Date().toLocaleDateString();
    return [
        { id: '1', type: 'text' as const, title: 'Letter to Sofia', content: 'My dearest Sofia, if you are reading this, I want you to know that you have been the greatest joy of my life. From the moment you were born, everything changed for the better. Always follow your heart, be kind, and never stop learning. I am so proud of the woman you are becoming. With all my love, Papa.', recipient: 'Daughter Sofia', createdAt: today, tags: ['family', 'love', 'personal'] },
        { id: '2', type: 'text' as const, title: 'Message to Anna', content: 'My dear Anna, thank you for 20 beautiful years together. You made our house a home and our life an adventure. Take care of yourself, travel to those places we always talked about, and know that our love was the best thing that ever happened to me.', recipient: 'Wife Anna', createdAt: today, tags: ['love', 'marriage'] },
        { id: '3', type: 'photo' as const, title: 'Summer in Ticino 2019', content: 'The photo album from our family vacation in Lugano. We rented that little house by the lake and spent two weeks swimming, hiking, and eating gelato. The photos are in the shared Google Photos album titled "Ticino 2019".', recipient: 'Everyone', createdAt: today, tags: ['vacation', 'family', 'photos'] },
        { id: '4', type: 'video' as const, title: 'Birthday wishes for Alexander', content: 'Video recorded on iPhone, saved to iCloud. A special birthday message for when Alexander turns 18. Located in: iCloud Drive > Legacy > Videos > Alexander_18.mov', recipient: 'Nephew Alexander', createdAt: today, tags: ['birthday', 'milestone'] },
        { id: '5', type: 'link' as const, title: 'Our Spotify Playlist', content: 'https://open.spotify.com/playlist/example — A playlist of all the songs that meant something to us over the years. From our first dance to road trip favorites.', recipient: 'Wife Anna', createdAt: today, tags: ['music', 'memories'] },
    ];
};

// ─── Templates ───────────────────────────────────────────────────────────────
export const DEMO_TEMPLATES: Record<string, Record<string, string>> = {
    poa: {
        grantor_name: 'Thomas Müller', grantor_dob: '1982-06-15',
        grantor_address: 'Bahnhofstrasse 42, 6003 Luzern, Switzerland',
        attorney_name: 'Olga Sushchinskaya', attorney_relation: 'Spouse / Partner',
        attorney_address: 'Bahnhofstrasse 42, 6003 Luzern, Switzerland',
        scope: 'General (all matters)', scope_details: 'Full authority over all financial and legal matters in case of incapacity.',
        valid_from: '2026-04-01',
    },
    funeral: {
        name: 'Thomas Müller', dob: '1982-06-15',
        burial_type: 'Cremation', ceremony: 'Civil / Secular ceremony',
        location: 'Friedental Cemetery, Luzern',
        music: 'Johann Sebastian Bach — Air on the G String, Ludovico Einaudi — Nuvole Bianche',
        readings: 'Do not stand at my grave and weep — Mary Elizabeth Frye',
        other_wishes: 'Small gathering, close family and friends only. Donations to Swiss Red Cross instead of flowers.',
    },
    waiver: {
        name: 'Anna Müller', dob: '2005-03-15',
        address: 'Z\u00fcrichstrasse 10, 6004 Luzern, Switzerland',
        deceased_name: 'Grandmother Maria Müller', relationship: 'Other relative',
        reason: 'Voluntarily waiving inheritance in favor of remaining family members.',
        declaration_date: '2026-03-28',
    },
    gift: {
        donor_name: 'Thomas Müller',
        donor_address: 'Bahnhofstrasse 42, 6003 Luzern, Switzerland',
        recipient_name: 'Anna Müller', relationship: 'Child',
        gift_description: 'Savings account at UBS — CHF 50,000 for university education',
        gift_value: 'CHF 50,000',
        conditions: 'To be used exclusively for higher education expenses.',
        gift_date: '2026-06-01',
    },
    advance: {
        name: 'Thomas Müller', dob: '1982-06-15',
        address: 'Bahnhofstrasse 42, 6003 Luzern, Switzerland',
        agent_name: 'Dr. Inna Praxmarer', agent_relation: 'Close Friend',
        agent_contact: '+41 79 123 45 67 / inna@readylegacy.ch',
        personal_care: 'Full authority', financial: 'Day-to-day finances only',
        special_wishes: 'No life-prolonging measures if prognosis is terminal. Prefer palliative care at home.',
    },
};

// ─── Fill / Clear helpers ────────────────────────────────────────────────────

const uid = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);

// ─── Per-tool fill helpers ───────────────────────────────────────────────────
export function fillDemoWill() {
    const entries: [string, string | boolean][] = [
        ['will_name', DEMO_WILL.will_name], ['will_origin', DEMO_WILL.will_origin],
        ['will_spouse_q', DEMO_WILL.will_spouse_q], ['will_children_q', DEMO_WILL.will_children_q],
        ['will_others', DEMO_WILL.will_others], ['will_legacies', DEMO_WILL.will_legacies],
        ['will_handwritten', DEMO_WILL.will_handwritten], ['will_dated', DEMO_WILL.will_dated],
    ];
    for (const [key, val] of entries) {
        localStorage.setItem(`readylegacy_${key}`, typeof val === 'string' ? val : JSON.stringify(val));
    }
}

export function fillDemoAssets() {
    for (const [key, val] of Object.entries(DEMO_ASSET_INPUTS)) {
        localStorage.setItem(`readylegacy_${key}`, val);
    }
    for (const [key, items] of Object.entries(DEMO_ASSET_LISTS)) {
        const withIds = items.map(item => ({ ...item, id: uid() }));
        localStorage.setItem(`readylegacy_list_${key}`, JSON.stringify(withIds));
    }
}

export function fillDemoLegal() {
    localStorage.setItem('readylegacy_legal_docs_v2', JSON.stringify(DEMO_LEGAL_DOCS()));
}

export function fillDemoTasks() {
    localStorage.setItem('readylegacy_todo_tasks', JSON.stringify(DEMO_TASKS()));
}

export function fillDemoLegacy() {
    localStorage.setItem('readylegacy_legacy_vault_v2', JSON.stringify(DEMO_LEGACY_ITEMS()));
}

// ─── Fill all (bulk) ────────────────────────────────────────────────────────
export function fillAllDemoData() {
    // Will Builder
    const willEntries: [string, string | boolean][] = [
        ['will_name', DEMO_WILL.will_name],
        ['will_origin', DEMO_WILL.will_origin],
        ['will_spouse_q', DEMO_WILL.will_spouse_q],
        ['will_children_q', DEMO_WILL.will_children_q],
        ['will_others', DEMO_WILL.will_others],
        ['will_legacies', DEMO_WILL.will_legacies],
        ['will_handwritten', DEMO_WILL.will_handwritten],
        ['will_dated', DEMO_WILL.will_dated],
    ];
    for (const [key, val] of willEntries) {
        localStorage.setItem(`readylegacy_${key}`, typeof val === 'string' ? val : JSON.stringify(val));
    }

    // Asset Overview inputs
    for (const [key, val] of Object.entries(DEMO_ASSET_INPUTS)) {
        localStorage.setItem(`readylegacy_${key}`, val);
    }

    // Asset Overview lists
    for (const [key, items] of Object.entries(DEMO_ASSET_LISTS)) {
        const withIds = items.map(item => ({ ...item, id: uid() }));
        localStorage.setItem(`readylegacy_list_${key}`, JSON.stringify(withIds));
    }

    // Legal Docs
    localStorage.setItem('readylegacy_legal_docs_v2', JSON.stringify(DEMO_LEGAL_DOCS()));

    // Executor Tasks
    localStorage.setItem('readylegacy_todo_tasks', JSON.stringify(DEMO_TASKS()));

    // Leave Behind
    localStorage.setItem('readylegacy_legacy_vault_v2', JSON.stringify(DEMO_LEGACY_ITEMS()));
}

// All tool-related localStorage keys (excluding user settings like token, lang, theme)
const TOOL_KEYS = [
    'will_name', 'will_origin', 'will_spouse_q', 'will_children_q',
    'will_others', 'will_legacies', 'will_handwritten', 'will_dated',
    'asset_brought', 'asset_mortgages', 'asset_debts',
    'funeral_type', 'funeral_location', 'funeral_notes', 'others_notes',
    'list_bank', 'list_securities', 'list_bvg', 'list_insurance', 'list_real_estate',
    'list_crypto_wallets', 'list_crypto_exchanges', 'list_hardware_wallets',
    'list_online_accounts', 'list_online_banking',
    'list_funeral_music', 'list_funeral_people', 'list_funeral_flowers',
    'list_sentimental_items', 'list_pets',
    'legal_docs_v2', 'todo_tasks', 'legacy_vault_v2',
];

export function clearAllToolData() {
    for (const key of TOOL_KEYS) {
        localStorage.removeItem(`readylegacy_${key}`);
    }
}
