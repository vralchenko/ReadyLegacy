# ReadyLegacy — Antworten auf MVP-Beta Transition Fragen
**Für Meeting mit Dr. iur. Reto Fanger — 10.04.2026, 10:00 Uhr**
**Vorbereitet von: Viktor Ralchenko (CTO) | Stand: 08.04.2026**
**Basierend auf der aktuellen Codebasis (Commit 3cf0098)**

---

## Priorität 1

### Recht & Fundament

#### 1. Welche Gesetze gelten konkret für uns (Schweiz / EU) und was ist für unser Setup entscheidend?

**Unsere Einschätzung:**
- **Schweiz:** nDSG (neues Datenschutzgesetz, seit 01.09.2023) — wir sind in der Schweiz ansässig (Impressum: c/o Dr. Inna Praxmarer, Schweiz), verarbeiten Daten von Schweizer Nutzern
- **EU/GDPR:** Wahrscheinlich anwendbar — unsere UI ist auf Deutsch und Englisch, wir richten uns an den DACH-Raum. Art. 3(2) GDPR greift bei Anbieten von Diensten an Personen in der EU
- **ZGB (Erbrecht):** Art. 498 ff. — relevant für Testament-Tool (handschriftliches Testament, Formvorschriften)
- **OR:** Vertragsrecht für AGB, Haftungsklauseln

**Technisches Setup:**
- Frontend: React SPA auf Cloudflare Pages (CDN global, Edge-Server in EU für EU-Nutzer)
- Backend: Cloudflare Workers (Serverless Functions)
- Datenbank: Neon PostgreSQL (Region: `eu-central-1`, Frankfurt)
- Auth: Email/Passwort + Google OAuth 2.0
- Domain: readylegacy.ch / readylegacy.pages.dev

**Offene Frage an RA:** Genügt unser Schweizer Sitz, oder müssen wir einen EU-Vertreter nach Art. 27 GDPR benennen?

---

#### 2. Dürfen wir solche sensiblen Daten (Testamente, Zugangsdaten, medizinische Infos) speichern – und unter welchen Bedingungen?

**Was wir aktuell speichern (in Neon PostgreSQL als JSONB):**
- Testamentarische Verfügungen (Erbanteile, Legate, Handschriftlichkeits-Checkbox)
- Medizinische Direktiven (Patientenverfügung, Vorsorgeauftrag)
- Finanzielle Daten (Bankkonten, Wertpapiere, Versicherungen, Krypto-Wallets)
- Persönliche Nachrichten (Text, Foto, Video, Audio für Angehörige)
- Bestattungswünsche
- Kontaktdaten von Begünstigten (Name, Email, Telefon, Beziehung)

**Aktueller Schutz:**
- Passwörter: bcrypt-gehasht (Cost Factor 8)
- Transport: HTTPS via Cloudflare
- DB-Zugang: Credentials in Environment Variables, nicht im Code
- SQL-Injection-Schutz: Drizzle ORM mit parametrisierten Queries

**Fehlender Schutz:**
- ❌ Keine Verschlüsselung auf Anwendungsebene (Daten in DB als Plaintext-JSONB)
- ❌ Kein E2E-Verschlüsselung (trotz Versprechen in Privacy Policy)
- ❌ localStorage im Browser: Plaintext
- ❌ Keine besondere Behandlung sensibler Datenkategorien nach nDSG Art. 5 lit. c

**Offene Frage an RA:** Welche konkreten technischen Massnahmen sind für besondere Personendaten nach nDSG zwingend? Genügt TLS + DB-Level-Encryption oder brauchen wir E2E?

---

#### 3. Sind wir rechtlich ein Verantwortlicher, ein Auftragsverarbeiter oder etwas dazwischen?

**Unsere Einschätzung: Verantwortlicher (Controller)**

Begründung:
- Wir bestimmen Zweck und Mittel der Datenverarbeitung
- Nutzer geben ihre Daten in unsere Plattform ein
- Wir entscheiden über Hosting, Speicherung, Architektur
- Wir haben keine Auftraggeber, die uns Daten zur Verarbeitung übergeben

**Unsere Auftragsverarbeiter (Processors):**
| Dienstleister | Funktion | DPA vorhanden? |
|---|---|---|
| Cloudflare | Hosting, CDN, Edge Computing | ❌ Nein |
| Neon | PostgreSQL-Datenbank | ❌ Nein |
| Google | OAuth 2.0 Authentifizierung | ❌ Nein |
| Anthropic | AI-Chat (Claude) | ❌ Nein |

**Gap:** Keine DPAs (Auftragsverarbeitungsverträge) mit Subdienstleistern abgeschlossen.

---

### Tod & Zugriff

#### 4. Wer darf im Todesfall rechtlich Zugriff auf die Daten erhalten?

**Aktueller Stand im Code:**
- ❌ **Kein Zugangsverfahren nach Tod implementiert**
- Nutzer können "Trusted Contacts" (Begünstigte) hinterlegen — Name, Email, Telefon, Beziehung
- Aber: Kein technischer Mechanismus, der diesen Kontakten nach dem Tod Zugang gewährt
- Kein Kontaktformular/Prozess für Todesmeldungen
- Kein Dokumenten-Prüfverfahren (Todesurkunde, Erbschein)

**Was wir brauchen (unser Vorschlag):**
1. Kontaktformular/Email für Todesmeldung an info@readylegacy.ch
2. Erforderliche Dokumente: Todesurkunde + Ausweis des Antragstellers
3. Prüfung: Antragsteller = registrierter Begünstigter oder gesetzlicher Erbe
4. Eingeschränkter Zugang: nur vom Nutzer freigegebene Daten
5. SLA: 10 Arbeitstage für Bearbeitung

**Offene Frage an RA:** Wer hat nach ZGB vorrangig Anspruch — die vom Nutzer benannten Begünstigten oder die gesetzlichen Erben? Was bei Widerspruch?

---

#### 5. Welche Nachweise müssen wir verlangen, bevor wir Zugriff gewähren?

**Aktuell:** Kein Verfahren implementiert.

**Unser Vorschlag:**
- Amtliche Todesurkunde (Original oder beglaubigte Kopie)
- Identitätsnachweis des Antragstellers (Pass/ID)
- Erbschein oder Erbbescheinigung (falls Antragsteller nicht als Begünstigter hinterlegt)
- Ggf. Vollmacht bei Vertretung

**Offene Frage an RA:** Genügt eine Todesurkunde + ID, oder brauchen wir immer einen Erbschein? Wie gehen wir mit ausländischen Dokumenten um?

---

#### 6. Wie sollen wir mit Streitfällen oder Unsicherheiten unter Angehörigen umgehen?

**Aktuell:** Kein Streitfall-Verfahren definiert.

**Unser Vorschlag:**
- Bei Unsicherheit: Zugang verweigern bis Klärung
- Verweis an zuständige Behörde (Teilungsamt, Gericht)
- Kein Zugang ohne eindeutige Legitimation
- In AGB aufnehmen: ReadyLegacy entscheidet nicht bei Streitigkeiten

**Offene Frage an RA:** Können wir die Haftung vollständig ausschliessen, wenn wir einem Erbscheininhaber Zugang gewähren und sich nachträglich ein anderer Erbe meldet?

---

### Rechtliche Wirkung & Missbrauch

#### 7. Können Inhalte auf unserer Plattform rechtlich verbindlich werden (z. B. wie ein Testament)?

**Aktuelle Disclaimers im Code:**
- Impressum: *"ReadyLegacy does not provide legal, financial, or medical advice. All tools and templates are intended as organizational aids."*
- Templates-Tool (DocumentPrint.tsx): *"This document is for organizational purposes only. It does not constitute legal advice."*
- Asset Overview: *"All values are indicative estimates — not a legal valuation."*

**Aber:** Im Testament-Tool (WillBuilder.tsx) gibt es eine Checkbox "Handschriftlich verfasst" — das suggeriert eine Nähe zur Rechtsverbindlichkeit.

**Schweizer Recht (ZGB Art. 505):** Ein eigenhändiges Testament muss:
1. Von Hand geschrieben sein
2. Datiert sein
3. Unterschrieben sein

→ Ein digital erstelltes Dokument auf unserer Plattform kann **kein** gültiges Testament sein. Aber Nutzer könnten das missverstehen.

**Offene Frage an RA:** Reichen unsere Disclaimers aus? Müssen wir beim Testament-Tool einen expliziten Warnhinweis einbauen, dass dies kein gültiges Testament ist?

---

#### 8. Welche Massnahmen müssen wir treffen, um Fehlinterpretationen als rechtlich bindendes Instrument auszuschliessen?

**Aktuell implementierte Massnahmen:**
- ✅ Genereller Disclaimer im Impressum
- ✅ Disclaimer bei Template-Druckansicht
- ✅ Asset-Disclaimer "keine rechtliche Bewertung"

**Fehlende Massnahmen:**
- ❌ Kein Disclaimer direkt im WillBuilder-Tool
- ❌ Kein Disclaimer in Patientenverfügung/Vorsorgeauftrag-Tools
- ❌ Kein Disclaimer im AI-Chat (kann rechtliche Fragen beantworten)
- ❌ Kein Disclaimer bei Registrierung/Onboarding
- ❌ Kein "Nicht-Rechtsberatung"-Banner auf der Startseite

**Unser Plan:** Kontextuelle Disclaimers in jedem juristisch relevanten Tool einbauen (ClickUp-Task erstellt).

---

### KRITISCH – Architektur & Zugriff

#### 9. Hat unsere Systemarchitektur (z. B. Zero-Knowledge vs. Zugriff durch uns) rechtliche Auswirkungen auf Haftung oder Datenschutzanforderungen?

**Aktuelle Architektur: Wir haben vollen Zugriff auf alle Daten.**

| Aspekt | Status |
|---|---|
| Zero-Knowledge | ❌ Nicht implementiert |
| E2E-Verschlüsselung | ❌ Nicht implementiert |
| Server-seitige Entschlüsselung | N/A — Daten sind Plaintext |
| Admin-Zugang zu DB | ✅ Vorhanden (Neon Dashboard) |
| Daten in DB lesbar | ✅ Ja, Plaintext JSONB |

**Konsequenzen:**
- Wir können alle Nutzerdaten lesen (Testamente, medizinische Daten, Finanzen)
- Bei einem Breach sind alle Daten kompromittiert (nicht verschlüsselt)
- Höhere Sorgfaltspflicht als bei Zero-Knowledge
- Potenziell höhere Haftung

**Privacy Policy behauptet aktuell:** *"data will be stored in encrypted form on European servers with end-to-end encryption"* — das ist **falsch** und muss korrigiert werden.

**Offene Frage an RA:** Sollten wir strategisch auf Zero-Knowledge/E2E umstellen, um Haftung zu reduzieren? Oder genügen technische + organisatorische Massnahmen (TOM)?

---

#### 10. Wie müssen wir mit Zugriffsschlüsseln, Wiederherstellung und Account-Recovery umgehen, ohne rechtliche Risiken einzugehen?

**Aktuelle Auth-Architektur:**
| Funktion | Status | Details |
|---|---|---|
| Email/Password Login | ✅ | bcrypt (Cost 8), Min. 6 Zeichen |
| Google OAuth | ✅ | OpenID Connect, Scopes: email, profile |
| Password Reset | ❌ | Link in UI vorhanden, aber nicht funktional (href="#") |
| MFA/2FA | ❌ | Button in Profil vorhanden, aber nicht funktional |
| Account Recovery | ❌ | Kein Verfahren |
| Session Management | JWT | HS256, 30 Tage Gültigkeit, kein Refresh Token |

**Risiken:**
- Kein Password Reset → Nutzer verlieren bei Passwortverlust den Zugang zu ihren Daten
- Keine MFA → Ein kompromittiertes Passwort reicht für vollen Zugang
- JWT 30 Tage → Lange Angriffsfenster bei Token-Diebstahl
- bcrypt Cost 8 → Unter Industriestandard (empfohlen: 12+)

**Offene Frage an RA:** Gibt es eine Pflicht, Password-Recovery anzubieten, wenn Nutzer sensible Daten bei uns speichern? Welche Identitätsprüfung ist für Recovery erforderlich?

---

### Haftung & Risiko

#### 11. Wofür haften wir konkret im schlimmsten Fall (Datenverlust, falscher Zugriff, Missbrauch)?

**Worst-Case-Szenarien und unser Schutz:**

| Szenario | Aktueller Schutz | Haftungsrisiko |
|---|---|---|
| Data Breach (alle Nutzerdaten) | TLS, Parameterisierte Queries | HOCH — Plaintext-Daten, kein E2E |
| Falscher Zugriff nach Tod | Kein Verfahren | HOCH — kein Prozess definiert |
| Datenverlust | Neon-Backups (Provider-seitig) | MITTEL — kein eigenes Backup |
| Nutzer folgt "Testament" und es ist ungültig | Disclaimers (teilweise) | MITTEL — Disclaimers lückenhaft |
| Missbrauch gestohlener Zugangsdaten | Kein MFA, kein Rate Limiting | HOCH — keine Schutzmaßnahmen |
| AI-Chat gibt falsche Rechtsauskunft | Kein Chat-Disclaimer | MITTEL — AI als Feature |

**Keine AGB vorhanden** → Keine vertragliche Haftungsbegrenzung gegenüber Nutzern.

---

#### 12. Wie können wir unsere Haftung wirksam begrenzen?

**Unser Plan (bereits als ClickUp-Tasks angelegt):**
1. **AGB erstellen** mit Haftungsbeschränkung (Vorsatz/Grobfahrlässigkeit)
2. **Disclaimers** in allen juristisch relevanten Tools
3. **Privacy Policy korrigieren** — keine falschen Versprechen
4. **Consent-Checkbox** bei Registrierung
5. **Cyber Insurance** prüfen

**Offene Frage an RA:** Wie weit können wir die Haftung per AGB begrenzen bei der Art von Daten, die wir verarbeiten? Gilt OR Art. 100 (Verbot, Haftung für Vorsatz/Grobfahrlässigkeit auszuschliessen)?

---

#### 13. Was ist das grösste Risiko in unserem Geschäftsmodell?

**Unsere Einschätzung (Top 3):**

1. **Data Breach bei sensiblen Daten** — Testamente, medizinische Daten, Krypto-Wallet-Infos sind unverschlüsselt in der DB. Ein Leak wäre reputations- und haftungsrechtlich verheerend.

2. **Falsche Aussagen in Privacy Policy** — Wir behaupten E2E-Verschlüsselung und "no data on servers", obwohl beides nicht stimmt. Das ist ein Vertrauensbruch und potenziell abmahnfähig.

3. **Haftung bei fehlerhaftem Zugang nach Tod** — Ohne klares Verfahren riskieren wir, Daten an Unbefugte herauszugeben oder berechtigten Erben den Zugang zu verwehren.

---

### Sicherheit & Vorfälle

#### 14. Welche Sicherheitsanforderungen sind rechtlich zwingend (Verschlüsselung, Zugriffskontrolle, Architektur)?

**Aktueller Stand:**

| Anforderung | Status | Details |
|---|---|---|
| Transportverschlüsselung (TLS) | ✅ | Via Cloudflare, HTTPS überall |
| Verschlüsselung at Rest | ❌ | DB: Plaintext. localStorage: Plaintext |
| E2E-Verschlüsselung | ❌ | Nicht implementiert |
| Zugriffskontrolle | ⚠️ | JWT-basiert, aber kein MFA, kein Rate Limiting |
| Passwort-Hashing | ✅ | bcrypt, aber Cost Factor zu niedrig (8 statt 12) |
| Input-Validierung | ⚠️ | Minimale Validierung (Email-Format, PW-Länge 6) |
| CORS | ⚠️ | Open (`*`) auf Chat-API, fehlt auf anderen Endpoints |
| Rate Limiting | ❌ | Keines |
| WAF | ❌ | Cloudflare WAF nicht konfiguriert |
| Audit Logging | ❌ | Keines |

**Offene Frage an RA:** Was ist der minimale technische Standard, den nDSG Art. 8 für "angemessene technische Massnahmen" bei besonderen Personendaten verlangt?

---

#### 15. Welche rechtlichen Pflichten und Fristen gelten bei Sicherheitsvorfällen oder Datenlecks?

**Gesetzliche Pflichten:**
- **nDSG Art. 24:** Meldung an EDÖB "so rasch als möglich" bei Verletzung der Datensicherheit
- **GDPR Art. 33:** Meldung an Aufsichtsbehörde innerhalb 72 Stunden
- **GDPR Art. 34:** Benachrichtigung betroffener Personen bei hohem Risiko

**Unser Stand:**
- ❌ Kein Incident-Response-Plan
- ❌ Kein Breach-Notification-Template
- ❌ Keine Verantwortliche Person benannt
- ❌ Kein Audit-Log → Scope eines Breaches kann nicht bestimmt werden
- ❌ Kein Monitoring/Alerting für Anomalien

**ClickUp-Task erstellt** für Incident-Response-Plan.

---

## Priorität 2

### Datenschutz & Nutzerrechte

#### 16. Welche Einwilligungen (Consent) müssen Nutzer geben, damit wir rechtlich sauber sind?

**Aktuell:** ❌ **Keine Einwilligung wird eingeholt.**

Registration-Endpoint (`functions/api/auth/register.ts`) akzeptiert: `{email, password, name}` — kein Consent-Feld.

**Fehlende Consents:**
1. Zustimmung zu AGB (existieren nicht)
2. Zustimmung zur Datenschutzerklärung
3. Separate Einwilligung für besondere Datenkategorien (Medizin, Testament)
4. Opt-in für AI-Chat-Verarbeitung (Daten gehen an Anthropic)

**Offene Frage an RA:** Reicht eine Checkbox oder brauchen wir separate Consents für verschiedene Datenkategorien? Wie granular muss das sein?

---

#### 17. Müssen wir besondere Kategorien von Daten speziell behandeln?

**Besondere Personendaten nach nDSG Art. 5 lit. c:**
- ✅ Medizinische Daten (Patientenverfügung, Vorsorgeauftrag)
- ✅ Potenziell religiöse Daten (Bestattungswünsche)
- ⚠️ Finanzielle Daten (nicht explizit "besonders" nach nDSG, aber sensibel)
- ⚠️ Testamentarische Verfügungen (sensibel, aber keine explizite Kategorie)

**Aktueller Stand:** Alle Daten werden gleich behandelt — keine technische oder organisatorische Unterscheidung zwischen "normalen" und "besonderen" Personendaten.

**Offene Frage an RA:** Brauchen wir eine DPIA (Art. 22 nDSG) vor dem Live-Gang wegen der medizinischen Daten?

---

#### 18. Welche Rechte haben Nutzer (z. B. Löschung, Datenexport)?

**Unsere Privacy Policy verspricht:**
- ✅ Recht auf Auskunft
- ✅ Recht auf Berichtigung
- ✅ Recht auf Löschung
- ✅ Recht auf Datenportabilität (Export)
- ✅ Recht auf Widerruf der Einwilligung

**Tatsächlich implementiert:**
| Recht | Implementiert? | Details |
|---|---|---|
| Auskunft | ⚠️ | Nutzer sieht eigene Daten in der App, aber kein formeller Auskunftsprozess |
| Berichtigung | ✅ | Nutzer kann Daten in der App ändern |
| Löschung | ❌ | Kein Endpoint. DB hat CASCADE — aber kein API-Aufruf möglich |
| Datenexport | ❌ | Kein Endpoint. Nutzer kann nur manuell kopieren |
| Widerruf Consent | ❌ | Kein Consent eingeholt → kein Widerruf möglich |

**ClickUp-Task erstellt** für Account-Löschung und Datenexport.

---

#### 19. Müssen wir einen Datenschutzbeauftragten ernennen?

**nDSG:** Keine generelle Pflicht für private Unternehmen in der Schweiz, aber empfohlen.
**GDPR Art. 37:** Pflicht bei "umfangreicher Verarbeitung besonderer Kategorien" — könnte auf uns zutreffen.

**Offene Frage an RA:** Fällt unser Umfang (MVP/Beta, voraussichtlich <1'000 Nutzer) schon unter die GDPR-Pflicht für einen DSB?

---

### Dokumente & Verträge

#### 20. Wie müssen Datenschutzerklärung und AGB minimal korrekt aufgebaut sein?

**Datenschutzerklärung — aktueller Stand (Privacy.tsx):**
- ✅ Kontaktdaten vorhanden
- ✅ Verarbeitungszwecke erwähnt
- ✅ Nutzerrechte aufgeführt
- ✅ Aufsichtsbehörde (EDÖB) benannt
- ❌ **Falsche Behauptungen** (siehe Q9)
- ❌ Rechtsgrundlage der Verarbeitung fehlt
- ❌ Subprozessoren nicht aufgeführt
- ❌ Aufbewahrungsfristen fehlen
- ❌ Grenzüberschreitende Datenübermittlung nicht beschrieben
- ❌ Datenkategorien nicht vollständig aufgelistet

**AGB:** ❌ **Existieren nicht.**

**ClickUp-Tasks erstellt** für beide.

---

#### 21. Wie formulieren wir rechtssicher den Umgang mit „digitalem Erbe" in den AGB?

**Aktuell:** Kein AGB-Text vorhanden.

**Unser Vorschlag für AGB-Abschnitt "Digitales Erbe":**
- ReadyLegacy ist ein Organisationstool, kein Nachlassverwalter
- Hinterlegte Daten haben keine rechtliche Bindungswirkung
- Zugang nach Tod nur nach dokumentiertem Verfahren (Todesurkunde, ID)
- ReadyLegacy übernimmt keine Verantwortung für die Richtigkeit/Aktualität der Daten
- Daten werden nach [X Monaten] Inaktivität archiviert / gelöscht (Policy TBD)

**Offene Frage an RA:** Wie formulieren wir den Haftungsausschluss, damit er in CH/EU standhält?

---

#### 22. Wo ist die Grenze zwischen erlaubter Funktion und unerlaubter Rechtsberatung?

**Unsere Tools:**
| Tool | Funktion | Risiko |
|---|---|---|
| WillBuilder | Organisiert Erbwünsche | HOCH — suggeriert Testamentserstellung |
| Templates | Druckvorlagen für Vollmacht, Patientenverfügung | HOCH — Vorlagen könnten als rechtsverbindlich missverstanden werden |
| AI-Chat | Beantwortet Fragen zu Recht/Finanzen/Medizin | HOCH — KI-Antworten könnten als Beratung aufgefasst werden |
| LegalDocs | Tracking-Tool für juristische Dokumente | NIEDRIG — nur Status-Tracking |
| AssetOverview | Finanzübersicht | NIEDRIG — nur Organisationstool |

**Aktuelle Disclaimers:**
- Templates: ✅ *"for organizational purposes only... consult a qualified notary or lawyer"*
- WillBuilder: ❌ Kein Disclaimer
- AI-Chat: ❌ Kein Disclaimer

**Offene Frage an RA:** Muss der AI-Chat bei jeder Session einen Disclaimer anzeigen? Reicht ein Onboarding-Hinweis?

---

### Cloud & Infrastruktur

#### 23. Dürfen wir Cloud-Anbieter wie AWS nutzen und worauf müssen wir achten?

**Unsere Cloud-Anbieter (kein AWS):**

| Anbieter | Dienst | Sitz | Daten in EU? |
|---|---|---|---|
| Cloudflare | Pages, Workers, CDN | USA (San Francisco) | Edge-Server EU, aber US-Unternehmen |
| Neon | PostgreSQL (serverless) | USA (Firmensitz), DB in `eu-central-1` (Frankfurt) | ✅ DB in EU |
| Google | OAuth 2.0 | USA | Nur Auth-Daten (Email, Name) |
| Anthropic | AI-Chat (Claude) | USA | ❌ Chat-Daten gehen in die USA |

**Impressum sagt aktuell "Vercel"** — das ist falsch und wird korrigiert.

**Offene Frage an RA:** Genügt der EU-Standort der Neon-DB, auch wenn Neon ein US-Unternehmen ist? Brauchen wir SCCs für Cloudflare/Neon/Anthropic?

---

#### 24. Welche Verträge brauchen wir mit Cloud- und Subdienstleistern (DPA etc.)?

**Aktuell:** ❌ **Keine DPAs abgeschlossen.**

**Erforderliche DPAs:**
1. **Cloudflare** — Hosting + CDN (haben Standard-DPA verfügbar)
2. **Neon** — Datenbankprovider (haben Enterprise DPA)
3. **Google** — OAuth (haben Standard-DPA in Cloud Console)
4. **Anthropic** — AI-Chat (müssen prüfen ob DPA verfügbar)

**ClickUp-Task erstellt.**

---

#### 25. Welche Länder dürfen unsere Subdienstleister haben?

**Aktuelle Situation:**
- Cloudflare: USA (mit EU-Edge-Servern)
- Neon: USA (Firmensitz), DB-Region EU (Frankfurt)
- Google: USA
- Anthropic: USA

**Alle 4 Subdienstleister sind US-Unternehmen.**

Für Übermittlung in die USA: SCCs oder Angemessenheitsbeschluss erforderlich. Die Schweiz hat die USA (noch) nicht als "angemessen" eingestuft (nach Aufhebung des Privacy Shield).

**Offene Frage an RA:** Reichen Standard Contractual Clauses (SCCs) mit unseren US-Dienstleistern? Oder müssen wir auf EU-only-Provider wechseln?

---

### Kontrolle & Nachweisbarkeit

#### 26. Müssen wir aktiv prüfen oder dürfen wir uns auf eingereichte Dokumente verlassen?

**Kontext:** Beim Zugang nach Tod — Prüfung von Todesurkunde, Erbschein etc.

**Aktuell:** Kein Verfahren implementiert.

**Unser Vorschlag:** Formelle Prüfung der eingereichten Dokumente auf Echtheit + Plausibilität, aber keine forensische Analyse. Bei Zweifel: Verweis an Behörde.

**Offene Frage an RA:** Wie weit reicht unsere Prüfpflicht? Reicht eine Augenschein-Prüfung der Todesurkunde, oder müssen wir beim Zivilstandsamt verifizieren?

---

#### 27. Welche Logs/Audit Trails müssen wir führen?

**Aktuell:** ❌ **Kein Audit-Logging implementiert.**

- Keine Protokollierung von Logins/Logouts
- Keine Protokollierung von Datenzugriffen
- Keine Protokollierung von Datenänderungen
- Keine IP-Adressen-Logs
- Keine Fehlerprotokolle (nur console.log im Code)

**Konsequenz:** Bei einem Breach können wir weder Scope noch betroffene Nutzer identifizieren.

**ClickUp-Task erstellt.**

**Offene Frage an RA:** Welche Aufbewahrungsfrist gilt für Audit-Logs nach nDSG? 1 Jahr? 10 Jahre?

---

### Risiko & Absicherung

#### 28. Brauchen wir spezielle Versicherungen (z. B. Cyber Insurance)?

**Unsere Einschätzung: Ja, dringend empfohlen.**

Gründe:
- Verarbeitung sensibler Daten (Medizin, Testament, Krypto)
- Potenzielle B2B-Partnerschaften (Pro Senectute, Banken) — die werden Versicherungsnachweis verlangen
- Startup-Phase mit begrenzten finanziellen Reserven

**Abzudecken:**
- Data Breach Liability
- Business Interruption
- Regulatory Fines
- Notification Costs
- Rechtsverteidigung

**ClickUp-Task erstellt.**

---

#### 29. Welche typischen Fehler machen Startups in unserem Bereich?

**Unsere Selbsteinschätzung — Fehler, die wir aktuell machen:**

1. ✅ **Falsche Versprechen in Privacy Policy** — E2E-Verschlüsselung behauptet, nicht implementiert
2. ✅ **Keine AGB** — kein vertragliches Fundament mit Nutzern
3. ✅ **Keine DPAs** mit Subdienstleistern
4. ✅ **Security als Nachgedanke** — kein Rate Limiting, kein MFA, schwaches Hashing
5. ✅ **Kein Incident-Response-Plan** — keine Vorbereitung auf Breaches
6. ✅ **Feature vor Compliance** — Tools gebaut, ohne rechtliche Grundlage zu klären

**Offene Frage an RA:** Was sind die häufigsten Gründe für Bussen/Abmahnungen bei ähnlichen Startups in der Schweiz?

---

## Priorität 3

### Technische Sicherheit

#### 30. Reicht Standard-Verschlüsselung oder brauchen wir Ende-zu-Ende-Verschlüsselung?

**Aktuelle Verschlüsselung:**
- ✅ TLS/HTTPS (Transport) — via Cloudflare
- ❌ Encryption at Rest — nicht auf Anwendungsebene (Neon hat DB-Level-Encryption)
- ❌ E2E-Verschlüsselung — nicht implementiert

**Trade-offs:**
| Option | Vorteil | Nachteil |
|---|---|---|
| Standard (TLS + DB-Encryption) | Einfacher zu implementieren, AI-Chat funktioniert | Wir können alle Daten lesen → höhere Haftung |
| E2E (Client-Side Encryption) | Wir können Daten nicht lesen → geringere Haftung | AI-Chat kann Nutzerdaten nicht verarbeiten, Password-Recovery unmöglich |
| Hybrid | Balance | Komplexität |

**Unsere Privacy Policy verspricht E2E** — entweder umsetzen oder Versprechen entfernen.

**Offene Frage an RA:** Genügt für den MVP/Beta Standard-Verschlüsselung (TLS + DB-Level) wenn wir die Privacy Policy korrigieren? Ab welchem Zeitpunkt wird E2E rechtlich erwartet?

---

#### 31. Welche Anforderungen gelten für Passwort-, Authentifizierungs- und Zugriffssysteme?

**Unser Auth-Stack:**
| Parameter | Aktuell | Empfohlen |
|---|---|---|
| Passwort-Mindestlänge | 6 Zeichen | 8-12 Zeichen |
| Passwort-Komplexität | Keine Anforderung | Mindestens: Gross/Klein + Zahl |
| Hashing | bcrypt, Cost 8 | bcrypt, Cost 12+ |
| MFA/2FA | Nicht implementiert | TOTP (Google Authenticator) |
| Session-Dauer | JWT 30 Tage | 7 Tage + Refresh Token |
| Rate Limiting | Keines | 5 Fehlversuche → Lockout |
| Password Reset | Nicht implementiert | Email-basiert mit Token (1h) |
| Account Recovery | Nicht implementiert | Identitätsverifikation |
| CORS | Open (`*`) auf Chat-API | Nur eigene Domain |

---

#### 32. Müssen wir Sicherheitszertifizierungen (z. B. ISO 27001) haben?

**Aktuell:** Keine Zertifizierungen.

**Unsere Einschätzung:**
- Für MVP/Beta: Nicht zwingend, aber dokumentierte TOM (technische und organisatorische Massnahmen) erforderlich
- Für B2B (Pro Senectute, Banken): ISO 27001 oder SOC 2 wahrscheinlich Voraussetzung
- Für Scale-up: ISO 27001 als Wettbewerbsvorteil und Vertrauenssignal

**Offene Frage an RA:** Gibt es eine gesetzliche Pflicht zu Zertifizierungen oder reicht ein dokumentiertes Sicherheitskonzept?

---

#### 33. Wie müssen wir Backups rechtlich absichern?

**Aktuell:**
- Neon PostgreSQL bietet automatische Backups (Provider-seitig)
- Keine eigene Backup-Strategie
- Keine dokumentierte Backup-Policy
- Keine Recovery-Tests durchgeführt

**Offene Frage an RA:** Welche Aufbewahrungspflichten gelten? Müssen gelöschte Nutzerdaten auch aus Backups entfernt werden (GDPR "Right to be Forgotten")?

---

### Nutzerverhalten & Plattformregeln

#### 34. Was passiert, wenn Nutzer falsche oder veraltete Daten speichern?

**Aktuell:**
- Kein Mechanismus zur Validierung der Nutzerdaten
- Kein Hinweis auf Aktualisierungspflicht
- Kein automatischer Reminder für regelmässige Überprüfung

**Unser Vorschlag für AGB:**
- Nutzer sind für Richtigkeit und Aktualität ihrer Daten selbst verantwortlich
- ReadyLegacy übernimmt keine Haftung für veraltete/falsche Informationen
- Empfehlung: Jährliche Überprüfung aller hinterlegten Daten

---

#### 35. Müssen wir Nutzer aktiv auf Risiken hinweisen?

**Aktuell implementierte Warnungen:**
- ✅ Warnung für nicht-eingeloggte Nutzer: *"Daten nur lokal gespeichert, gehen bei Browser-Löschung verloren"*
- ✅ Impressum-Disclaimer: *"keine Rechts-/Finanz-/Medizinberatung"*
- ❌ Kein Risiko-Hinweis bei Krypto-Wallet-Daten (Seed-Phrases)
- ❌ Kein Risiko-Hinweis bei medizinischen Verfügungen
- ❌ Kein Hinweis auf Backup/Export-Notwendigkeit

**Offene Frage an RA:** Haben wir eine aktive Informationspflicht (Push) oder reicht ein passiver Hinweis (in AGB/FAQ)?

---

#### 36. Dürfen wir Accounts nach Inaktivität löschen?

**Aktuell:** Keine Inaktivitäts-Policy. Kein Account-Löschmechanismus überhaupt.

**Besonderheit unseres Produkts:** Nutzer könnten Daten für den Todesfall hinterlegen und dann jahrelang inaktiv sein — das ist der vorgesehene Anwendungsfall!

**Offene Frage an RA:** Wie lange müssen wir Daten aufbewahren? Können wir nach z.B. 5 Jahren Inaktivität + mehrfacher Benachrichtigung löschen?

---

#### 37. Müssen wir Altersbeschränkungen einbauen?

**Aktuell:** ❌ Keine Altersverifikation bei Registrierung.

**Relevanz:**
- Testament-Erstellung: Ab 18 Jahre (ZGB Art. 467)
- Vorsorgeauftrag: Ab 18 Jahre (ZGB Art. 360)
- nDSG: Keine explizite Altersgrenze, aber erhöhter Schutz für Minderjährige
- GDPR Art. 8: Einwilligung ab 16 Jahre (oder national niedriger)

**Unser Vorschlag:** Mindestalter 18 Jahre, Checkbox bei Registrierung.

---

### Internationalität

#### 38. Was ändert sich konkret bei Nutzern aus der EU?

**Zusätzliche Anforderungen bei EU-Nutzern:**
- GDPR vollständig anwendbar (zusätzlich zu nDSG)
- Art. 27: EU-Vertreter benennen
- Art. 13/14: Erweiterte Informationspflichten
- Art. 15-22: Volle Betroffenenrechte (inkl. Datenportabilität)
- Art. 28: DPAs mit allen Subprozessoren
- Art. 44-49: SCCs für Drittlandübermittlung

**Unsere App ist auf DE/EN** → richtet sich an DACH → GDPR sehr wahrscheinlich anwendbar.

---

#### 39. Müssen wir länderspezifische Versionen erstellen?

**Aktuell:** 2 Sprachen (EN, DE), keine länderspezifischen Anpassungen.

**Erbrecht ist national:** Schweizer Testament-Formvorschriften ≠ Deutsche ≠ Österreichische. Unser WillBuilder basiert implizit auf Schweizer Recht (ZGB).

**Offene Frage an RA:** Genügt ein Disclaimer "basiert auf Schweizer Recht" oder müssen wir bei EU-Nutzern andere Vorlagen anbieten?

---

#### 40. Welche Risiken bestehen bei globaler Nutzung?

**Risiken:**
- Unterschiedliche Erbrechts-Systeme (Common Law vs. Civil Law)
- Unterschiedliche Datenschutz-Standards
- Nutzer könnten Plattform-Inhalte für lokale Rechtsverfahren nutzen
- Unbekannte regulatorische Anforderungen in Nicht-DACH-Ländern

**Unser Vorschlag:** In AGB auf Schweizer Recht und Gerichtsstand beschränken, Disclaimer für internationale Nutzer.

---

### Organisation

#### 41. Müssen wir einen Incident-Response-Plan implementieren?

**Ja — rechtlich erforderlich.**

- nDSG Art. 24: Meldepflicht an EDÖB
- GDPR Art. 33/34: 72-Stunden-Frist

**Aktuell:** ❌ Kein Plan, keine Verantwortliche, kein Template.

**ClickUp-Task erstellt.** Unser Vorschlag:
1. Erkennung → Klassifizierung (4h)
2. Containment
3. EDÖB-Meldung (24h)
4. Nutzer-Benachrichtigung (48h)
5. Post-Mortem

---

## Priorität 4

### Business & Produkt

#### 42. Gibt es rechtliche Einschränkungen bei unserem Preismodell (Abo etc.)?

**Aktuelle Preisstruktur (Pricing.tsx):**
- Free: CHF 0 (Basis-Funktionen)
- Premium: CHF 15/Monat (Cloud Sync, unbegrenzte Dokumente)
- Family: CHF 25/Monat (bis 5 Familienmitglieder)

**Aktuell:** Kein Payment-Processing implementiert. Pricing-Seite ist informativ.

**Offene Frage an RA:** Gibt es besondere Anforderungen an Abo-Modelle im Schweizer OR? Automatische Verlängerung — welche Kündigungsfristen?

---

#### 43. Müssen wir spezielle Kündigungsregeln einhalten?

**Aktuell:** Kein Abo-System implementiert, keine Kündigungsfunktion.

**Relevante Regeln:**
- OR Art. 266a ff. (Miete als Analogie für Dauerschuldverhältnisse)
- EU-Richtlinie 2019/2161: Button-Lösung für Online-Kündigungen
- Schweiz: Kein gesetzliches Widerrufsrecht für Online-Verträge (anders als EU)

**Offene Frage an RA:** Welche Kündigungsfristen sind angemessen? Monatlich? Sofort mit anteiliger Rückerstattung?

---

#### 44. Was passiert mit Daten nach Vertragsende?

**Aktuell:** Nicht definiert. Kein Account-Löschprozess.

**Unser Vorschlag für AGB:**
- Bei Kündigung: 30 Tage zum Datenexport
- Danach: Löschung aller Daten (DB CASCADE vorhanden)
- Ausnahme: Gesetzliche Aufbewahrungspflichten
- Free-Plan: Daten bleiben erhalten (kein Vertrag)

**Offene Frage an RA:** Wie lange müssen wir Daten nach Vertragsende aufbewahren? Gibt es Aufbewahrungspflichten, die mit der Löschpflicht kollidieren?

---

### Strategische Risiken

#### 45. Welche Features würden Sie uns aus rechtlicher Sicht NICHT empfehlen?

**Unsere Einschätzung — risikoreiche Features:**

1. **AI-Chat mit Rechtsberatung** — Grenze zur unerlaubten Rechtsberatung dünn
2. **"Digital Testament"** — Suggeriert Rechtsverbindlichkeit, die nicht gegeben ist
3. **Krypto-Wallet-Speicherung** — Seed-Phrases speichern = extremes Sicherheitsrisiko
4. **Automatischer Zugang nach Tod** — Ohne Identitätsprüfung ein Missbrauchsrisiko
5. **AI Avatar** (in Family Plan angekündigt) — Deepfake/Persönlichkeitsrechte-Problematik

---

#### 46. Gibt es regulatorische Graubereiche in unserem Modell?

**Graubereiche:**
1. **Organisationstool vs. Rechtsberatung** — Wo genau liegt die Grenze bei Testaments-Vorlagen?
2. **Digitales Erbe als Dienstleistung** — Keine etablierte Regulierung in der Schweiz
3. **Speicherung von Krypto-Zugängen** — Potenzielle FINMA-Relevanz?
4. **AI-generierte "Beratung"** — Noch keine klare Regulierung in CH
5. **Besondere Personendaten als Kernprodukt** — Höchste Schutzstufe als Geschäftsmodell

---

### Compliance & Skalierung

#### 47. Müssen wir eine Datenschutz-Folgenabschätzung (DPIA) durchführen?

**Unsere Einschätzung: Ja.**

**nDSG Art. 22:** DPIA erforderlich bei "hohem Risiko für die Persönlichkeit oder die Grundrechte der betroffenen Person."

**Unsere Verarbeitung beinhaltet:**
- Besondere Personendaten (Medizin, potenziell Religion)
- Systematische Überwachung/Profiling (nein — aber umfangreiche Speicherung)
- Neue Technologien (AI-Chat)
- Verletzliche Personengruppen (potenziell — Sterbende, Trauernde)

**ClickUp-Task erstellt.**

---

#### 48. Was müssten wir ändern, um investor-ready und skalierbar compliant zu sein?

**Compliance-Roadmap für Investoren:**

| # | Massnahme | Status | Priorität |
|---|---|---|---|
| 1 | AGB erstellen | ❌ | KRITISCH |
| 2 | Privacy Policy korrigieren | ❌ | KRITISCH |
| 3 | Consent-Checkbox | ❌ | KRITISCH |
| 4 | DPAs mit Subdienstleistern | ❌ | HOCH |
| 5 | Account-Löschung + Export | ❌ | HOCH |
| 6 | Incident-Response-Plan | ❌ | HOCH |
| 7 | DPIA durchführen | ❌ | HOCH |
| 8 | Rate Limiting + MFA | ❌ | HOCH |
| 9 | Encryption at Rest | ❌ | MITTEL |
| 10 | Audit Logging | ❌ | MITTEL |
| 11 | ISO 27001 / SOC 2 | ❌ | MITTEL |
| 12 | Cyber Insurance | ❌ | MITTEL |

**Alle Tasks bereits in ClickUp angelegt.**

---

### Struktur & Haftung

#### 49. Brauchen wir eine bestimmte Rechtsform für dieses Risiko-Level?

**Aktuell:** Kein formelles Unternehmen (Impressum: "c/o Dr. Inna Praxmarer").

**Optionen:**
| Rechtsform | Kapital | Haftung | Geeignet? |
|---|---|---|---|
| Einzelfirma | CHF 0 | Unbeschränkt persönlich | ❌ Zu riskant |
| GmbH | CHF 20'000 | Beschränkt auf Stammkapital | ✅ Empfohlen |
| AG | CHF 100'000 | Beschränkt auf Aktienkapital | ⚠️ Für später |

**Offene Frage an RA:** Ist eine GmbH ausreichend oder brauchen wir angesichts der sensiblen Daten eine AG? Persönliche Haftung der Gründer bei Datenschutzverletzung?

---

#### 50. Wie minimieren wir die persönliche Haftung der Gründer?

**Massnahmen:**
1. **Juristische Person gründen** (GmbH/AG) → beschränkte Haftung
2. **D&O-Versicherung** → Absicherung Geschäftsführer
3. **Cyber Insurance** → Absicherung bei Datenschutzverletzungen
4. **AGB mit Haftungsbegrenzung** → Vertragliche Beschränkung
5. **Dokumentierte Sorgfalt** → Nachweis, dass "angemessene Massnahmen" getroffen wurden
6. **Compliance-Programm** → DPIA, DPAs, TOM dokumentiert

**Offene Frage an RA:** Können Gründer nach nDSG Art. 60-66 persönlich strafbar gemacht werden bei Datenschutzverletzungen? (Bussen bis CHF 250'000 an natürliche Personen!)

---

## Zusammenfassung der offenen Fragen an Dr. Fanger

### Kritisch (vor Beta-Launch klären)
1. Minimale technische Anforderungen für besondere Personendaten nach nDSG?
2. E2E oder Standard-Verschlüsselung — was ist Minimum?
3. Reichen unsere Disclaimers oder brauchen wir mehr?
4. Welche Rechtsform empfehlen Sie?
5. Persönliche Haftung der Gründer — wie gross ist das Risiko?

### Wichtig (nächste Wochen)
6. Wer hat Vorrang nach Tod — Begünstigte oder gesetzliche Erben?
7. Wie weit reicht unsere Dokumentenprüfpflicht?
8. GDPR-Pflichten — EU-Vertreter, DSB nötig?
9. SCCs für US-Dienstleister — reicht das?
10. DPIA — müssen wir das vor dem Launch machen?

### Strategisch
11. AI-Chat als Feature — regulatorisches Risiko?
12. Krypto-Wallet-Speicherung — FINMA-relevant?
13. Aufbewahrungsfrist vs. Löschpflicht — was gewinnt?
14. Inaktive Accounts — dürfen wir löschen bei einem Todesfall-Tool?
