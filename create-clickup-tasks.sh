#!/bin/bash
# Create ClickUp tasks from legal QA findings
API_KEY="pk_290444089_24BSOUSQGAFWD2G0HA228ZYQXWW7QX0O"
LIST_ID="901216894299"
URL="https://api.clickup.com/api/v2/list/$LIST_ID/task"

create_task() {
  local name="$1"
  local desc="$2"
  local priority="$3"  # 1=urgent, 2=high, 3=normal, 4=low
  local tags="$4"

  local tag_array=""
  if [ -n "$tags" ]; then
    IFS=',' read -ra TAG_LIST <<< "$tags"
    tag_array=""
    for tag in "${TAG_LIST[@]}"; do
      tag=$(echo "$tag" | xargs)
      if [ -n "$tag_array" ]; then
        tag_array="$tag_array,"
      fi
      tag_array="$tag_array\"$tag\""
    done
  fi

  local payload=$(cat <<ENDJSON
{
  "name": "$name",
  "description": "$desc",
  "priority": $priority,
  "tags": [$tag_array]
}
ENDJSON
)

  local result=$(curl -s -X POST "$URL" \
    -H "Authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local task_id=$(echo "$result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id','ERROR'))" 2>/dev/null)
  echo "  -> Task created: $task_id — $name"
}

echo "=== CRITICAL (before public launch) ==="

create_task \
  "[LEGAL] AGB / Terms of Service erstellen" \
  "Kritisch: Es gibt keine AGB/ToS.\n\nMindestinhalt:\n1. Geltungsbereich und Vertragsgegenstand\n2. Leistungsbeschreibung (Organisationstool, KEINE Rechts-/Finanz-/Medizinberatung)\n3. Registrierung und Nutzerkonto\n4. Datenspeicherung und -sicherheit\n5. Haftungsbeschränkung\n6. Kündigung und Löschung\n7. Umgang mit Tod des Nutzers\n8. Geistiges Eigentum\n9. Anwendbares Recht: CH, Gerichtsstand\n10. Altersbeschränkung: 18+\n\nRef: legal-qa-for-ia.md Q19, Q15, Q22, Q23\nQuelle: IA Rechtsberatung 2026-04-08" \
  1 \
  "legal,compliance,critical"

create_task \
  "[LEGAL] Privacy Policy aktualisieren — falsche Aussagen entfernen" \
  "Kritisch: Privacy Policy enthält falsche Angaben.\n\nFalsch:\n- 'Authentication: demo mode only' → Auth ist voll funktional (Email/PW + Google OAuth)\n- 'All data remains on your device' → Daten werden auf Neon PostgreSQL synchronisiert\n- 'encrypted form on European servers with end-to-end encryption' → E2E nicht implementiert\n\nFehlt:\n- Subprozessoren (Cloudflare, Neon, Google)\n- Rechtsgrundlage der Verarbeitung\n- Aufbewahrungsfristen\n- Grenzüberschreitende Datenübermittlung\n- Tatsächlich gespeicherte Datenkategorien (Finanzen, Medizin, Krypto, Testament)\n\nDatei: src/pages/Privacy.tsx + locales en.json/de.json\nRef: legal-qa-for-ia.md Q5, Q1\nQuelle: IA Rechtsberatung 2026-04-08" \
  1 \
  "legal,compliance,critical"

create_task \
  "[LEGAL] Impressum korrigieren — Vercel → Cloudflare" \
  "Impressum enthält falsche Hosting-Angaben:\n\nAktuell: 'Vercel Inc., 440 N Baxter St, Los Angeles, CA 90012, USA'\nKorrekt: 'Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA'\n\nCloudflare Pages ist der tatsächliche Hosting-Provider seit dem Wechsel von Vercel.\n\nDatei: src/pages/Impressum.tsx + locales en.json/de.json\nRef: legal-qa-for-ia.md Q10\nQuelle: IA Rechtsberatung 2026-04-08" \
  1 \
  "legal,compliance,critical"

create_task \
  "[LEGAL] Consent-Checkbox bei Registrierung hinzufügen" \
  "Kritisch: Registrierung erfolgt ohne Einwilligung zur Datenverarbeitung.\n\nAktuell: register.ts akzeptiert {email, password, name} — kein Consent-Check.\n\nUmzusetzen:\n- Pflicht-Checkbox: 'Ich akzeptiere die AGB und Datenschutzerklärung'\n- Consent in DB speichern: Datum, Version des Dokuments\n- Separater Consent für besondere Datenkategorien (Medizin, Testament)\n- Consent-Feld in users-Tabelle (consent_at, consent_version)\n\nDateien: functions/api/auth/register.ts, api/db/schema.ts, Login/Register UI\nRef: legal-qa-for-ia.md Q3\nQuelle: IA Rechtsberatung 2026-04-08" \
  1 \
  "legal,compliance,critical"

create_task \
  "[LEGAL] Account-Löschung und Datenexport implementieren" \
  "Privacy Policy verspricht Löschung und Export — beides nicht implementiert.\n\nZu implementieren:\n1. DELETE /api/auth/account — Konto + alle Daten löschen (CASCADE in DB vorhanden)\n2. GET /api/user-data/export — Alle Nutzerdaten als JSON exportieren\n3. UI: Buttons im Profil 'Meine Daten exportieren' und 'Konto löschen'\n4. Bestätigungsdialog vor Löschung\n5. 30-Tage-Frist nach nDSG für Bearbeitung von Anfragen\n\nDB-Schema hat ON DELETE CASCADE → Löschung des Users löscht documents + user_data automatisch.\n\nRef: legal-qa-for-ia.md Q7\nQuelle: IA Rechtsberatung 2026-04-08" \
  1 \
  "legal,compliance,critical,feature"

echo ""
echo "=== HIGH PRIORITY (next months) ==="

create_task \
  "[LEGAL] DPA mit Cloudflare, Neon, Google abschließen" \
  "Keine Data Processing Agreements mit Subprozessoren vorhanden.\n\nSubprozessoren:\n- Cloudflare (Pages + Workers) — Hosting, CDN, Edge Computing\n- Neon (PostgreSQL) — Datenbank, Region: eu-central-1 (bestätigt aus DATABASE_URL)\n- Google (OAuth 2.0) — Authentifizierung\n\nBei grenzüberschreitender Übermittlung (Cloudflare = US): Standard Contractual Clauses (SCCs) erforderlich.\n\nRef: legal-qa-for-ia.md Q1, Q10\nQuelle: IA Rechtsberatung 2026-04-08" \
  2 \
  "legal,compliance"

create_task \
  "[SEC] Rate Limiting und Brute-Force-Schutz einführen" \
  "Keine Rate-Limiting auf allen API-Endpoints.\n\nRisiken:\n- Brute-Force auf /api/auth/login (kein Lockout nach Fehlversuchen)\n- DoS auf /api/chat (unbegrenzte Anfragen)\n- CORS: Open Policy (Access-Control-Allow-Origin: *) auf Chat-API\n\nUmzusetzen:\n- Cloudflare Rate Limiting Rules oder Middleware\n- Account-Lockout nach 5 Fehlversuchen\n- CORS auf eigene Domain beschränken\n- Rate Limit Headers (X-RateLimit-*)\n\nRef: legal-qa-for-ia.md Q8, Q11\nQuelle: IA Rechtsberatung 2026-04-08" \
  2 \
  "security,compliance"

create_task \
  "[SEC] Password Reset Flow implementieren" \
  "Kein Passwort-Zurücksetzen-Flow vorhanden. Nutzer können bei Passwortverlust nicht auf ihr Konto zugreifen.\n\nUmzusetzen:\n- POST /api/auth/forgot-password — sendet Reset-Link per Email\n- POST /api/auth/reset-password — setzt neues Passwort mit Token\n- Reset-Token: kryptographisch sicher, 1h Gültigkeit\n- UI: 'Passwort vergessen?'-Link auf Login-Seite\n- Email-Versand (z.B. Cloudflare Email Workers oder Resend)\n\nWeitere Auth-Verbesserungen:\n- Passwort-Mindestlänge: 6 → 8 Zeichen erhöhen\n- bcrypt Cost Factor: 8 → 12 erhöhen\n- JWT Expiration: 30d → 7d + Refresh Token\n\nRef: legal-qa-for-ia.md Q11\nQuelle: IA Rechtsberatung 2026-04-08" \
  2 \
  "security,feature"

create_task \
  "[LEGAL] Incident Response Plan erstellen" \
  "Kein Incident-Response-Plan vorhanden.\n\nnDSG Art. 24: Meldung an EDÖB 'so rasch als möglich' bei Datenschutzverletzung.\nGDPR Art. 33: 72 Stunden für DPA-Meldung.\n\nZu erstellen:\n1. Erkennung und Klassifizierung\n2. Containment (Isolation)\n3. Bewertung Scope und Impact\n4. Benachrichtigung (EDÖB, DPA, Nutzer)\n5. Behebung und Wiederherstellung\n6. Post-Mortem\n\nVorlagen:\n- Benachrichtigungsschreiben (EN/DE) vorbereiten\n- Interne SLA: Erkennung→Bewertung (4h)→EDÖB (24h)→Nutzer (48h)\n- Verantwortliche Person benennen\n\nRef: legal-qa-for-ia.md Q31-Q33\nQuelle: IA Rechtsberatung 2026-04-08" \
  2 \
  "legal,compliance,security"

create_task \
  "[LEGAL] Disclaimers zu juristischen Tools hinzufügen" \
  "Grenze zwischen 'Organisation' und 'Rechtsberatung' muss klar sein.\n\nBetroffene Tools:\n- Testament-Tool: 'Dies ist eine organisatorische Vorlage. Rechtskraft hat nur ein handschriftlich verfasstes, datiertes und unterschriebenes Original.'\n- Patientenverfügung: 'Lassen Sie dieses Dokument von einem Arzt/Anwalt prüfen.'\n- Vorsorgeauftrag: 'Handschriftlich verfassen oder notariell beurkunden.'\n- Krypto-Wallets: Warnung — keine Seed-Phrases direkt speichern\n\nAuch im AI-Chat:\n- Disclaimer in jeder Antwort oder am Anfang der Session\n- Formulierungen: 'allgemeine Information' statt 'Empfehlung'\n\nRef: legal-qa-for-ia.md Q26, Q27, Q34\nQuelle: IA Rechtsberatung 2026-04-08" \
  2 \
  "legal,ux"

create_task \
  "[LEGAL] DPIA (Datenschutz-Folgenabschätzung) durchführen" \
  "DPIA erforderlich bei Verarbeitung besonderer Personendaten (nDSG Art. 22).\n\nBesondere Kategorien in ReadyLegacy:\n- Medizinische Daten (Patientenverfügung, Vorsorgeauftrag)\n- Potentiell religiöse Daten (Bestattungswünsche)\n- Finanzielle Daten (Bankkonten, Krypto-Wallets, Versicherungen)\n- Testamentarische Verfügungen\n\nDPIA soll enthalten:\n- Beschreibung der Verarbeitungstätigkeiten\n- Bewertung der Notwendigkeit und Verhältnismäßigkeit\n- Risikobewertung für betroffene Personen\n- Geplante Maßnahmen zur Risikominimierung\n\nRef: legal-qa-for-ia.md Q2, Q4\nQuelle: IA Rechtsberatung 2026-04-08" \
  2 \
  "legal,compliance"

echo ""
echo "=== MEDIUM PRIORITY (as growth) ==="

create_task \
  "[SEC] Verschlüsselung auf Anwendungsebene (Encryption at Rest)" \
  "Sensible Daten in Plaintext in DB (jsonb) und localStorage.\n\nBetroffen:\n- Medizinische Direktiven\n- Testamente\n- Krypto-Wallet-Informationen\n- Finanzdaten\n\nUmzusetzen:\n- Client-Side Encryption (AES-256-GCM, Schlüssel aus Benutzerpasswort)\n- Verschlüsselte Felder in DB markieren\n- Key-Derivation: PBKDF2 oder Argon2\n- localStorage: Verschlüsselt statt Plaintext speichern\n\nPrivacy Policy verspricht E2E — entweder umsetzen oder Versprechen entfernen.\n\nRef: legal-qa-for-ia.md Q9\nQuelle: IA Rechtsberatung 2026-04-08" \
  3 \
  "security,feature"

create_task \
  "[SEC] Multi-Faktor-Authentifizierung (MFA/2FA) einführen" \
  "Kein MFA vorhanden. Kritisch für Zugang zu sensiblen Daten.\n\nUmzusetzen:\n- TOTP (Google Authenticator / Authy) — empfohlen\n- Optional: SMS als Fallback\n- Mindestens optional, idealerweise verpflichtend für sensible Aktionen\n- QR-Code Enrollment, Backup-Codes\n\nRef: legal-qa-for-ia.md Q8, Q11\nQuelle: IA Rechtsberatung 2026-04-08" \
  3 \
  "security,feature"

create_task \
  "[SEC] Audit Logging implementieren" \
  "Kein Audit-Logging vorhanden. Ohne Logs kann bei einem Breach weder Scope noch Impact bestimmt werden.\n\nZu loggen:\n- Authentifizierungsereignisse (Login, Logout, fehlgeschlagene Versuche)\n- Zugriff auf sensible Daten\n- Datenänderungen (CRUD auf documents, user_data)\n- Admin-Aktionen\n- API-Zugriffe mit Timestamps und IP\n\nSpeicherung: Separate Tabelle oder externer Service (z.B. Cloudflare Logpush).\n\nRef: legal-qa-for-ia.md Q8, Q31\nQuelle: IA Rechtsberatung 2026-04-08" \
  3 \
  "security,compliance"

create_task \
  "[LEGAL] Verfahren für Zugang nach Tod entwickeln" \
  "Core-Feature des Produkts ohne juristische/technische Umsetzung.\n\nZu entwickeln:\n1. Kontaktformular/Email für Todesmeldung\n2. Erforderliche Dokumente: Todesurkunde, Erbschein, ID des Antragstellers\n3. Prüfung: Antragsteller = registrierter Begünstigter oder gesetzlicher Erbe\n4. Eingeschränkter Zugang: nur markierte Daten, begrenzte Zeit\n5. Logging aller Aktionen\n6. SLA: 10 Arbeitstage für Bearbeitung\n\nIn AGB aufnehmen: Verfahren, Bedingungen, Fristen.\n\nRef: legal-qa-for-ia.md Q20, Q24, Q25\nQuelle: IA Rechtsberatung 2026-04-08" \
  3 \
  "legal,feature"

create_task \
  "[LEGAL] GDPR-Compliance-Prüfung durchführen" \
  "GDPR wahrscheinlich anwendbar: UI auf DE/EN, Targeting DACH + EU.\n\nZu prüfen:\n- Art. 3(2): Anbieten von Diensten an Personen in der EU\n- Art. 27: EU-Vertreter benennen (falls kein EU-Sitz)\n- Art. 13/14: Informationspflichten in Privacy Policy\n- Art. 15-22: Betroffenenrechte (Auskunft, Löschung, Portabilität)\n- Art. 28: Auftragsverarbeitungsverträge (DPAs)\n- Art. 44-49: Drittlandübermittlung (SCCs mit Cloudflare)\n\nRef: legal-qa-for-ia.md Q28, Q30\nQuelle: IA Rechtsberatung 2026-04-08" \
  3 \
  "legal,compliance"

create_task \
  "[BIZ] Cyber Insurance prüfen" \
  "Angesichts sensibler Daten (Medizin, Testament, Krypto) Cyber-Versicherung empfohlen.\n\nAbzudecken:\n- Data Breach Liability\n- Business Interruption\n- Regulatory Fines\n- Notification Costs\n\nMit Versicherungsmakler klären. Besonders relevant bei B2B-Partnerschaften (Pro Senectute, Banken).\n\nRef: legal-qa-for-ia.md Q16\nQuelle: IA Rechtsberatung 2026-04-08" \
  4 \
  "legal,business"

echo ""
echo "=== DONE ==="
