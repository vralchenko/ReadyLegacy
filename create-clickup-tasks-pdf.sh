#!/bin/bash
# Create additional ClickUp tasks from MVP-Beta Fragen PDF
# (topics NOT already covered by the 17 tasks from WhatsApp/IA questions)
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

echo "=== Additional tasks from MVP-Beta Fragen PDF (for Dr. Fanger meeting 10.04.2026) ==="
echo ""

echo "--- HIGH PRIORITY ---"

create_task \
  "[LEGAL] Rechtsform klären — GmbH gründen" \
  "Aktuell: kein formelles Unternehmen (Impressum: 'c/o Dr. Inna Praxmarer').\nPersönliche Haftung der Gründer bei Datenschutzverletzung möglich (nDSG Art. 60-66: Bussen bis CHF 250'000 an natürliche Personen).\n\nOptionen:\n- GmbH (CHF 20'000 Stammkapital) — empfohlen\n- AG (CHF 100'000) — für später\n\nZudem:\n- D&O-Versicherung prüfen\n- Handelsregistereintrag\n\nRef: mvp-beta-fragen-antworten.md Q49, Q50\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  2 \
  "legal,business,critical"

create_task \
  "[LEGAL] Altersbeschränkung (18+) implementieren" \
  "Keine Altersverifikation bei Registrierung.\n\nRelevanz:\n- Testament: ab 18 (ZGB Art. 467)\n- Vorsorgeauftrag: ab 18 (ZGB Art. 360)\n- GDPR Art. 8: Einwilligung ab 16\n\nUmzusetzen:\n- Mindestalter 18 in AGB festlegen\n- Checkbox bei Registrierung: 'Ich bestätige, dass ich mindestens 18 Jahre alt bin'\n- Ggf. Geburtsdatum-Pflichtfeld\n\nRef: mvp-beta-fragen-antworten.md Q37\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  2 \
  "legal,compliance,feature"

create_task \
  "[LEGAL] Inaktivitäts-Policy definieren" \
  "Aktuell: Keine Policy für inaktive Accounts.\n\nBesonderheit: Nutzer speichern Daten für den Todesfall — jahrelange Inaktivität ist vorgesehener Use Case!\n\nZu definieren:\n- Ab wann gilt ein Account als inaktiv? (z.B. 5 Jahre)\n- Benachrichtigungsverfahren (3x Email vor Löschung)\n- Ausnahme für Premium-Abos\n- In AGB klar kommunizieren\n- Aufbewahrungspflicht vs. Löschrecht balancieren\n\nRef: mvp-beta-fragen-antworten.md Q36, Q44\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  3 \
  "legal,compliance"

echo ""
echo "--- MEDIUM PRIORITY ---"

create_task \
  "[LEGAL] Kündigungsregeln und Daten nach Vertragsende definieren" \
  "Kein Abo-System implementiert, aber Pricing-Seite existiert (Free/Premium CHF 15/Family CHF 25).\n\nZu definieren (für AGB):\n- Kündigungsfrist: monatlich empfohlen\n- Button-Lösung für Online-Kündigung (EU-Richtlinie 2019/2161)\n- Nach Kündigung: 30 Tage Datenexport-Frist\n- Danach: vollständige Datenlöschung\n- Free-Plan: Daten bleiben erhalten\n- Automatische Verlängerung transparent kommunizieren\n\nRef: mvp-beta-fragen-antworten.md Q42, Q43, Q44\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  3 \
  "legal,business"

create_task \
  "[SEC] Backup-Strategie dokumentieren und absichern" \
  "Kein eigenes Backup-Konzept. Verlassen uns auf Neon PostgreSQL Provider-Backups.\n\nZu klären:\n- Neon Backup-Retention prüfen und dokumentieren\n- Eigene Backup-Strategie definieren (z.B. täglicher pg_dump)\n- Backup-Verschlüsselung\n- Recovery-Tests durchführen\n- Aufbewahrungsfristen definieren\n- GDPR: Gelöschte Daten auch aus Backups entfernen?\n\nRef: mvp-beta-fragen-antworten.md Q33\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  3 \
  "security,compliance"

create_task \
  "[BIZ] ISO 27001 / SOC 2 Zertifizierung planen" \
  "Keine Sicherheitszertifizierungen vorhanden.\n\nFür MVP: nicht zwingend, aber dokumentierte TOM erforderlich.\nFür B2B (Pro Senectute, Banken): wahrscheinlich Voraussetzung.\nFür Investoren: Wettbewerbsvorteil und Vertrauenssignal.\n\nSchritte:\n1. TOM (technische/organisatorische Massnahmen) dokumentieren\n2. Gap-Analyse gegen ISO 27001\n3. Entscheidung: SOC 2 vs. ISO 27001\n4. Timeline: 6-12 Monate nach Product-Market-Fit\n\nRef: mvp-beta-fragen-antworten.md Q32, Q48\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  4 \
  "security,business"

create_task \
  "[LEGAL] FINMA-Relevanz prüfen — Krypto-Wallet-Speicherung" \
  "ReadyLegacy speichert Krypto-Wallet-Adressen und Instruktionen zu Seed-Phrases.\n\nZu prüfen:\n- Ist die Speicherung von Krypto-Zugangsinformationen FINMA-reguliert?\n- Gelten wir als 'Finanzdienstleister' nach FIDLEG?\n- Brauchen wir eine FINMA-Bewilligung?\n- Risiko: Speicherung von Seed-Phrases = extremes Sicherheitsrisiko\n\nEmpfehlung: Warnung in UI ('Speichern Sie niemals Seed-Phrases direkt')\n\nRef: mvp-beta-fragen-antworten.md Q45, Q46\nQuelle: MVP-Beta Fragen PDF für Dr. Fanger" \
  3 \
  "legal,compliance,business"

echo ""
echo "=== DONE — 7 additional tasks created ==="
