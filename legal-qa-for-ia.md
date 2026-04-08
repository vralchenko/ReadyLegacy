# ReadyLegacy — Ответы на юридические вопросы (для IA)

**Дата:** 2026-04-08
**Подготовил:** Viktor Ralchenko (CTO)
**Контакт:** info@readylegacy.ch
**Документ:** Техническое описание текущего состояния платформы для юридической консультации

---

## Краткое описание платформы

**ReadyLegacy** — цифровая платформа для организации наследства и планирования жизни. Пользователи хранят: завещания, финансовые активы, медицинские волеизъявления, сообщения для близких, крипто-кошельки, контакты бенефициаров.

**Архитектура:**
- Frontend: React SPA, хостинг на Cloudflare Pages
- Backend: Cloudflare Workers (serverless functions)
- База данных: Neon PostgreSQL (serverless)
- Auth: Email/Password (bcrypt, cost factor 8) + Google OAuth 2.0
- JWT: HS256, срок действия 30 дней
- Хранение данных: гибридная модель — localStorage (primary) + server sync для залогиненных пользователей
- AI-чат: BM25-поиск по локальной базе знаний (без внешних AI API)

**Юридическое лицо:** ReadyLegacy, c/o Dr. Inna Praxmarer, Switzerland
**Стадия:** MVP (Minimum Viable Product)

---

## 1. Datenschutz & rechtliche Grundlage (Q1–Q7)

### Q1: Welche Gesetze gelten konkret für uns? (z. B. DSG Schweiz, ggf. DSGVO EU?)

**Текущее состояние:**
- Privacy Policy ссылается на nDSG (Swiss Federal Act on Data Protection) и GDPR
- Impressum указывает Швейцарию как юрисдикцию
- Privacy Policy: «This privacy policy is governed by Swiss law. The competent supervisory authority is the Federal Data Protection and Information Commissioner (FDPIC).»

**Gap:**
- Privacy Policy устарела — текст описывает «demo mode only» для auth и «all data stored locally in your browser», хотя фактически уже есть полноценная аутентификация и серверное хранение (PostgreSQL)
- Нет DPA (Data Processing Agreement) с субпроцессорами: Cloudflare, Neon (PostgreSQL), Google (OAuth)
- Нет анализа, применяется ли GDPR (зависит от наличия EU-пользователей и targeting EU market)

**Рекомендация:**
- Обновить Privacy Policy под фактическое состояние (серверное хранение, auth)
- Провести анализ применимости GDPR (мы доступны из EU, UI на DE/EN)
- Заключить DPA с Cloudflare, Neon, Google
- Определить роли: ReadyLegacy = Controller, Cloudflare/Neon = Processors

---

### Q2: Dürfen wir überhaupt solche sensiblen Daten speichern?

**Текущее состояние:**
Платформа хранит следующие категории данных:

| Категория | Где хранится | Формат |
|-----------|-------------|--------|
| Финансовые активы (банки, ценные бумаги, пенсии, страхование, недвижимость) | localStorage + DB (jsonb) | Plaintext |
| Крипто-кошельки (адреса, инструкции к seed-фразам) | localStorage + DB (jsonb) | Plaintext |
| Медицинские волеизъявления (Patientenverfügung, Vorsorgeauftrag) | localStorage + DB (jsonb) | Plaintext |
| Завещание (доли наследников, легаты) | localStorage + DB (jsonb) | Plaintext |
| Персональные сообщения (текст, фото, видео, аудио) | localStorage | Plaintext |
| Похоронные пожелания | localStorage + DB (jsonb) | Plaintext |
| Данные бенефициаров (имя, email, телефон, отношение) | localStorage + DB (jsonb) | Plaintext |
| Email, имя, хэш пароля пользователя | DB (PostgreSQL) | bcrypt hash для пароля |

**Gap:**
- Медицинские данные (Patientenverfügung) — «besondere Personendaten» по nDSG Art. 5 lit. c → требуют повышенной защиты
- Данные хранятся в plaintext в localStorage (доступны любому JS на домене) и в jsonb в БД без encryption at rest на уровне приложения
- Нет классификации данных по уровням чувствительности
- Нет Data Protection Impact Assessment (DPIA)

**Рекомендация:**
- Провести DPIA (обязательно при обработке особых персональных данных)
- Внедрить encryption at rest для чувствительных данных (как минимум медицинские, завещание, крипто)
- Рассмотреть E2E-шифрование (client-side encryption) для максимальной защиты
- Минимизировать хранение в localStorage для залогиненных пользователей

---

### Q3: Welche Einwilligungen (Consent) müssen Nutzer explizit geben?

**Текущее состояние:**
- ❌ **Нет consent checkbox** при регистрации — пользователь вводит email/password/name и сразу создаётся аккаунт
- ❌ **Нет ссылки на Privacy Policy / AGB** на экране регистрации
- ❌ **Нет AGB / Terms of Service** вообще
- Для Google OAuth — consent через Google, но без нашего собственного consent layer
- Баннер-предупреждение существует только для незалогиненных пользователей (о том, что данные в localStorage)

**Код регистрации** (`functions/api/auth/register.ts`):
```
Принимает: { email, password, name }
Валидация: email + password (min 6 chars) + name обязательны
Consent: НЕ ПРОВЕРЯЕТСЯ
```

**Gap:**
- Критический пробел: регистрация без согласия на обработку данных
- Нет записи факта получения согласия (timestamp, version Privacy Policy)
- Нет granular consent (отдельно для обработки данных, отдельно для маркетинга)

**Рекомендация:**
- Добавить обязательный checkbox «Я принимаю AGB и Privacy Policy» при регистрации
- Хранить в БД: дату согласия, версию документа, IP (опционально)
- Создать AGB/ToS

---

### Q4: Müssen wir besondere Kategorien von Daten speziell behandeln?

**Текущее состояние:**
- Все данные хранятся одинаково: jsonb в PostgreSQL, plaintext в localStorage
- Нет разграничения между обычными и особыми персональными данными
- DB schema (`api/db/schema.ts`): таблица `user_data` — универсальная key-value store (userId, key, value as jsonb)
- Таблица `documents` — тоже generic (userId, title, type, data as jsonb)

**Особые категории данных в нашей системе (nDSG Art. 5 lit. c):**
- Медицинские: Patientenverfügung, Vorsorgeauftrag
- Потенциально религиозные: похоронные пожелания могут содержать религиозные предпочтения

**Gap:**
- Нет технической дифференциации по уровню чувствительности
- Нет дополнительных мер защиты для особых категорий
- Нет отдельного consent для обработки особых персональных данных

**Рекомендация:**
- Классифицировать данные по чувствительности
- Внедрить усиленную защиту для особых категорий (шифрование, access control)
- Получить explicit consent для обработки медицинских данных

---

### Q5: Wie muss unsere Datenschutzerklärung aufgebaut sein?

**Текущее состояние** (`src/pages/Privacy.tsx`):
Текущая структура Privacy Policy:
1. Overview — ссылка на nDSG и GDPR ✅
2. Data We Collect — **устарело**: «localStorage only», «demo mode only» для auth
3. Where Is Your Data Stored? — **устарело**: «all data remains on your device», обещает «encrypted European servers» в будущем
4. Cookies — корректно: «no tracking cookies»
5. Your Rights — перечислены права (access, correction, deletion, export, withdraw consent)
6. Contact — info@readylegacy.ch ✅
7. Applicable Law — Swiss law, FDPIC ✅

**Gap:**
- Раздел 2 ложный: фактически auth — полноценный (email/password + Google OAuth), данные синхронизируются на сервер
- Раздел 3 ложный: данные хранятся на серверах Neon (PostgreSQL) и Cloudflare
- Нет информации о субпроцессорах (Cloudflare, Neon, Google)
- Нет информации о трансграничной передаче данных (Cloudflare — US компания)
- Нет информации о сроках хранения данных
- Нет информации о правовой основе обработки (Art. 6 GDPR / Art. 31 nDSG)
- Обещанные права (export, deletion) технически не реализованы

**Рекомендация:**
- Полностью переписать Privacy Policy с актуальной информацией
- Добавить: субпроцессоры, правовая основа, сроки хранения, трансграничная передача
- Не обещать функции, которые не реализованы (export, deletion), или реализовать их

---

### Q6: Müssen wir einen Datenschutzbeauftragten ernennen?

**Текущее состояние:**
- Нет назначенного Datenschutzbeauftragter (DPO)
- Компания маленькая (стартап, MVP стадия)
- Контакт для privacy: info@readylegacy.ch

**Gap:**
- По nDSG: частные компании не обязаны назначать DPO, но рекомендуется
- По GDPR (если применяется): DPO обязателен при обработке особых категорий данных в крупном масштабе (Art. 37)
- На MVP-стадии с малым числом пользователей, вероятно, не обязателен

**Рекомендация:**
- Уточнить у юриста с учётом масштаба и применимости GDPR
- Как минимум назначить ответственного за data protection (может быть один из основателей)

---

### Q7: Welche Rechte haben Nutzer (z. B. Löschung, Datenexport)?

**Текущее состояние:**
- Privacy Policy обещает: access, correction, deletion, export, withdraw consent
- Для localStorage: пользователь может очистить данные браузера самостоятельно
- **Технически реализовано:**
  - ✅ Чтение данных: API `GET /api/user-data?key=...` и `GET /api/documents`
  - ✅ Изменение данных: API `PUT /api/user-data` и `PUT /api/documents?id=...`
  - ✅ Удаление документов: API `DELETE /api/documents?id=...`
  - ❌ **Нет bulk data export** (нет endpoint для выгрузки всех данных пользователя)
  - ❌ **Нет account deletion** (нет endpoint для удаления аккаунта и всех данных)
  - ❌ **Нет UI для data export или account deletion**

**Gap:**
- Обещанные права (export, deletion) не реализованы технически
- Нет процедуры обработки запросов от субъектов данных (Data Subject Request process)
- DB schema имеет `ON DELETE CASCADE` для documents и user_data → при удалении пользователя данные удалятся автоматически, но endpoint не существует

**Рекомендация:**
- Реализовать `DELETE /api/auth/account` — удаление аккаунта (CASCADE удалит связанные данные)
- Реализовать `GET /api/user-data/export` — экспорт всех данных в JSON/CSV
- Добавить UI: кнопки в профиле «Export my data» и «Delete my account»
- Определить процедуру и сроки обработки запросов (nDSG: 30 дней)

---

## 2. Datensicherheit & technische Anforderungen (Q8–Q13)

### Q8: Welche Mindeststandards für IT-Sicherheit sind rechtlich erforderlich?

**Текущее состояние:**

| Мера | Статус | Детали |
|------|--------|--------|
| HTTPS/TLS | ✅ | Cloudflare обеспечивает TLS для всех соединений |
| Хэширование паролей | ✅ | bcrypt, cost factor 8 (bcryptjs) |
| JWT аутентификация | ✅ | HS256, 30 дней expiration |
| SQL injection защита | ✅ | Drizzle ORM (prepared statements) |
| CORS | ⚠️ | Open policy (`*`) в chat API |
| Rate limiting | ❌ | Нет на всех endpoints |
| Brute force защита | ❌ | Нет блокировки после неудачных попыток входа |
| Audit logging | ❌ | Нет логов доступа к данным |
| Input validation | ⚠️ | Базовая (email, password min 6 chars) |
| CSP headers | ❌ | Не настроены |
| 2FA/MFA | ❌ | Не реализовано |
| Session management | ⚠️ | JWT в localStorage (уязвим к XSS) |
| Password reset | ❌ | Не реализован |

**Gap:**
- bcrypt cost factor 8 — ниже рекомендуемого (OWASP рекомендует ≥10)
- JWT хранится в localStorage — уязвим к XSS-атакам
- Нет rate limiting — уязвимость к brute force и DoS
- Нет MFA для доступа к чувствительным данным
- Нет password reset flow

**Рекомендация:**
- Внедрить rate limiting (Cloudflare Rate Limiting rules или middleware)
- Увеличить bcrypt cost factor до 12
- Рассмотреть httpOnly cookies вместо localStorage для JWT
- Внедрить MFA (как минимум опционально)
- Реализовать password reset
- Добавить CSP headers

---

### Q9: Reicht Standard-Verschlüsselung oder brauchen wir E2E-Verschlüsselung?

**Текущее состояние:**
- **Transport encryption**: TLS (через Cloudflare) ✅
- **Encryption at rest (DB)**: Neon PostgreSQL обеспечивает encryption at rest на уровне инфраструктуры (AES-256), но данные доступны в plaintext через SQL-запросы
- **Application-level encryption**: ❌ Нет
- **E2E encryption**: ❌ Нет
- **localStorage**: Plaintext (доступен любому JavaScript на домене readylegacy.pages.dev)

**Privacy Policy обещает:** «When we launch the full platform, data will be stored in encrypted form on European servers with end-to-end encryption.»

**Gap:**
- Обещание E2E в Privacy Policy создаёт юридическое обязательство
- Данные в localStorage полностью незащищены
- Данные в БД доступны в plaintext через API и при компрометации credentials
- Учитывая чувствительность данных (медицинские, завещание, крипто), стандартная защита может быть недостаточной

**Рекомендация:**
- **Минимум**: убрать из Privacy Policy обещание E2E до реализации
- **Рекомендуется**: client-side encryption для чувствительных полей (AES-256-GCM, ключ из пароля пользователя)
- **Идеально**: полноценное E2E-шифрование, где сервер не имеет доступа к данным

---

### Q10: Müssen Daten in der Schweiz gespeichert werden?

**Текущее состояние:**
- **Cloudflare Pages**: CDN глобально, edge servers в т.ч. в Европе. Статические файлы (HTML/JS/CSS) кэшируются на edge
- **Cloudflare Workers**: выполняются на ближайшем edge к пользователю (для EU пользователей — в EU)
- **Neon PostgreSQL**: регион не подтверждён из конфигурации (`wrangler.toml` не указывает регион Neon). Вероятно EU, но требует проверки
- **Impressum устарел**: указывает «Vercel Inc., 440 N Baxter St, Los Angeles, CA» как хостера — **фактически используется Cloudflare**

**Gap:**
- Не подтверждён регион Neon PostgreSQL
- Impressum содержит ложную информацию о хостинге (Vercel вместо Cloudflare)
- Cloudflare — US-компания (потенциальный доступ по US CLOUD Act)
- Нет Standard Contractual Clauses (SCCs) для трансграничной передачи

**Рекомендация:**
- **Срочно**: исправить Impressum (Vercel → Cloudflare)
- Подтвердить и задокументировать регион Neon PostgreSQL (выбрать EU если ещё не сделано)
- Заключить DPA с Cloudflare и Neon (включая SCCs если данные покидают CH/EU)
- Проанализировать риски US CLOUD Act для Cloudflare

---

### Q11: Welche Anforderungen gelten für Passwort- und Zugriffssysteme?

**Текущее состояние:**
- **Регистрация**: email + password (min 6 символов) + name
- **Хэширование**: bcrypt, cost factor 8 (bcryptjs library)
- **Логин**: email/password → JWT token (30 дней)
- **Google OAuth 2.0**: альтернативный вход
- **Авторизация**: JWT Bearer token в Authorization header
- **Password requirements**: только минимальная длина 6 символов
- **Password reset**: ❌ не реализован
- **MFA/2FA**: ❌ не реализован
- **Account lockout**: ❌ нет блокировки после неудачных попыток
- **Session invalidation**: ❌ нет возможности отозвать JWT (stateless)

**Gap:**
- Минимальная длина пароля 6 символов — ниже стандартов (OWASP: 8+, NIST: 8+)
- bcrypt cost 8 — ниже рекомендуемого (10+)
- Нет password complexity requirements
- JWT 30 дней без возможности отзыва — слишком долгий срок для чувствительных данных
- Нет MFA — критично для доступа к медицинским данным и завещаниям
- Нет password reset — пользователь не может восстановить доступ при утере пароля

**Рекомендация:**
- Увеличить минимальную длину пароля до 8+
- Увеличить bcrypt cost factor до 12
- Внедрить password reset (email-based)
- Внедрить MFA (TOTP или SMS)
- Сократить JWT expiration до 7 дней + refresh token mechanism
- Добавить account lockout после 5 неудачных попыток

---

### Q12: Müssen wir Sicherheitszertifizierungen (z. B. ISO 27001) haben?

**Текущее состояние:**
- Нет сертификаций
- MVP стадия, маленькая команда
- Субпроцессоры имеют свои сертификации:
  - Cloudflare: ISO 27001, SOC 2 Type II, PCI DSS
  - Neon: SOC 2 Type II (в процессе на момент knowledge cutoff)

**Gap:**
- Для MVP не обязательно, но может потребоваться для B2B (Pro Senectute, банки)
- nDSG не требует конкретных сертификаций, но требует «angemessene technische und organisatorische Massnahmen»

**Рекомендация:**
- На текущей стадии: задокументировать технические и организационные меры (TOM)
- В среднесрочной перспективе: рассмотреть SOC 2 Type II или ISO 27001
- Для партнёрств с Pro Senectute / банками: уточнить их требования к сертификации

---

### Q13: Wie müssen wir Backups rechtlich absichern?

**Текущее состояние:**
- **Neon PostgreSQL**: автоматические backups на уровне инфраструктуры (point-in-time recovery)
- **Application-level backups**: ❌ не реализованы
- **localStorage**: нет backup — при очистке браузера данные теряются (для незалогиненных пользователей)
- **Backup encryption**: зависит от Neon (инфраструктурный уровень)
- **Backup retention policy**: не определена
- **Backup testing**: не проводится

**Gap:**
- Нет документированной backup policy
- Нет процедуры восстановления (disaster recovery plan)
- Для незалогиненных пользователей (localStorage only) — нет backup вообще
- Нет гарантии, что backups покрывают все данные

**Рекомендация:**
- Задокументировать backup policy (частота, retention, encryption)
- Подтвердить backup capabilities от Neon
- Разработать disaster recovery plan
- Регулярно тестировать восстановление из backup

---

## 3. Haftung & Risiko (Q14–Q18)

### Q14: Wofür haften wir konkret, wenn Daten verloren gehen oder gehackt werden?

**Текущее состояние:**
- Disclaimer на сайте: «The content of this website is for informational purposes only. ReadyLegacy does not provide legal, financial, or medical advice. All tools and templates are intended as organizational aids and do not replace professional consultation.»
- Нет AGB с ограничением ответственности
- Нет Haftungsausschluss в отношении данных

**Риски потери данных:**
1. **localStorage cleared**: пользователь теряет все данные (если не залогинен / не синхронизировал)
2. **DB breach**: plaintext данные (завещание, медицина, крипто) полностью компрометированы
3. **JWT compromise**: 30-дневный доступ к аккаунту без возможности отзыва
4. **Account takeover**: нет MFA, нет password reset, нет brute force protection

**Gap:**
- Нет AGB → нет юридического ограничения ответственности
- Хранение чувствительных данных без адекватной защиты создаёт повышенную ответственность
- Обещания в Privacy Policy (E2E encryption, data export) не выполнены → потенциальная ответственность за misleading

**Рекомендация:**
- Создать AGB с чётким Haftungsausschluss
- Устранить расхождения между обещаниями в Privacy Policy и реальностью
- Усилить техническую защиту для снижения рисков

---

### Q15: Können wir Haftung vertraglich begrenzen?

**Текущее состояние:**
- Нет AGB/ToS → нет договорного ограничения ответственности
- Disclaimer в Impressum покрывает только «не юридическая/финансовая/медицинская консультация»

**Gap:**
- Без AGB нет правовой основы для ограничения ответственности
- Ограничение ответственности имеет пределы по швейцарскому праву (нельзя исключить грубую небрежность/умысел)

**Рекомендация:**
- Создать AGB с ограничением ответственности (в рамках допустимого по OR)
- Включить: ограничение по сумме, исключение indirect damages, force majeure
- Чётко разграничить: платформа ≠ хранилище с гарантией, платформа = организационный инструмент

---

### Q16: Brauchen wir spezielle Versicherungen (Cyber Insurance)?

**Текущее состояние:**
- Информация о страховании не содержится в кодовой базе
- Вопрос для Inna / бизнес-стороны

**Рекомендация:**
- Рассмотреть Cyber Insurance учитывая: чувствительные данные, потенциальные breach costs, B2B партнёрства
- Уточнить у страхового брокера с фокусом на: data breach liability, business interruption, regulatory fines

---

### Q17: Was passiert, wenn Nutzer falsche oder veraltete Daten speichern?

**Текущее состояние:**
- Disclaimer: «organizational aids, do not replace professional consultation»
- Нет валидации содержимого данных (платформа сохраняет что угодно)
- Нет напоминаний о проверке/обновлении данных
- Нет versioning документов (нет истории изменений)

**Gap:**
- Пользователь может хранить устаревшее завещание → наследники действуют по нему → проблемы
- Нет disclaimer, специфичного для каждого инструмента (завещание, медицинское волеизъявление)
- Нет механизма «последней проверки» (last reviewed date)

**Рекомендация:**
- Добавить disclaimers к каждому инструменту: «Проверьте актуальность с юристом/врачом»
- Добавить «Last reviewed» дату для документов с напоминанием об обновлении
- В AGB: чётко указать, что пользователь несёт ответственность за актуальность своих данных

---

### Q18: Haften wir, wenn Dritte (z. B. Erben) Zugriff bekommen und Probleme entstehen?

**Текущее состояние:**
- **Beneficiary access ❌ НЕ РЕАЛИЗОВАН** — платформа позволяет вводить данные бенефициаров (имя, email, телефон, отношение), но **не предоставляет им доступ**
- Нет механизма передачи данных после смерти
- Нет верификации бенефициаров
- Нет AGB, регулирующих доступ третьих лиц

**Gap:**
- Если бенефициар получит доступ к аккаунту (например, зная пароль) — нет аудита, нет ограничений
- Нет процедуры верификации смерти
- Нет юридической рамки для передачи данных

**Рекомендация:**
- В AGB: описать процедуру и условия доступа бенефициаров
- При реализации beneficiary access: строгая верификация (Todesurkunde, ID)
- Ограничить scope доступа бенефициаров (не весь аккаунт, а только помеченные данные)

---

## 4. Verträge, AGB & Nutzungsbedingungen (Q19–Q23)

### Q19: Was muss zwingend in unseren AGB stehen?

**Текущее состояние:**
- ❌ **AGB / Terms of Service отсутствуют полностью**
- Единственные правовые документы: Privacy Policy и Impressum

**Рекомендация — минимальное содержание AGB:**
1. Geltungsbereich und Vertragsgegenstand
2. Leistungsbeschreibung (организационный инструмент, НЕ юр./фин./мед. консультация)
3. Registrierung und Nutzerkonto (Voraussetzungen, Pflichten)
4. Datenspeicherung und -sicherheit (гибридная модель, localStorage + Server)
5. Haftungsbeschränkung
6. Verfügbarkeit und Wartung (нет SLA-гарантий на MVP)
7. Kündigung und Löschung
8. Umgang mit Tod des Nutzers (процедура доступа для наследников)
9. Geistiges Eigentum
10. Schlussbestimmungen (anwendbares Recht: CH, Gerichtsstand)
11. Hinweis: kein Ersatz für professionelle Beratung

---

### Q20: Wie regeln wir Zugriff nach dem Tod?

**Текущее состояние:**
- Beneficiary data собирается (имя, email, телефон, отношение) — но **только хранится**
- ❌ Нет механизма уведомления бенефициаров
- ❌ Нет механизма передачи доступа
- ❌ Нет верификации смерти
- ❌ Нет inactivity detection
- Текущий единственный путь: наследник знает email + password пользователя

**Gap:**
- Это core feature продукта, но юридически не проработан
- Без процедуры верификации смерти — риск злоупотреблений
- Без юридического фреймворка — потенциальная ответственность за несанкционированный доступ

**Рекомендация:**
- Разработать процедуру с юристом:
  1. Запрос от наследника + Todesurkunde + ID
  2. Проверка соответствия с записями бенефициаров
  3. Предоставление ограниченного доступа (только помеченные данные)
  4. Логирование всех действий
- Закрепить процедуру в AGB
- Определить сроки (сколько хранить данные после смерти)

---

### Q21: Dürfen wir Accounts nach Inaktivität löschen?

**Текущее состояние:**
- ❌ Нет inactivity tracking
- ❌ Нет автоматического удаления
- ❌ Нет retention policy
- DB schema не содержит поле `last_login` или `last_active`
- JWT expiration 30 дней — единственный «timeout»

**Gap:**
- Для legacy-платформы удаление по inactivity — опасно (пользователь может быть неактивен, но данные нужны наследникам)
- Нет правовой основы для удаления без уведомления

**Рекомендация:**
- Добавить `last_active_at` в DB schema
- Определить retention policy с учётом специфики (legacy = данные нужны надолго)
- Прописать в AGB: сроки, уведомление перед удалением (минимум 3 предупреждения по email)
- Рассмотреть «archival mode» вместо удаления

---

### Q22: Wie formulieren wir rechtssicher den Umgang mit „digitalem Erbe"?

**Текущее состояние:**
- Платформа описана как «digital platform for life planning, legacy preservation, and bereavement support»
- Disclaimer: «organizational aids, do not replace professional consultation»
- Инструменты: Завещание (текстовый шаблон), Медицинские директивы, Финансовый обзор, Сообщения для близких

**Ключевое разграничение:**
- ReadyLegacy = **организационный инструмент** (как Evernote для наследства)
- ReadyLegacy ≠ юридически обязывающее хранилище (не нотариус, не банк)
- Завещание в ReadyLegacy — это **цифровая копия/черновик**, а не оригинал (по швейцарскому праву завещание должно быть handgeschrieben + подписано)

**Рекомендация:**
- В AGB и UI явно указать:
  - «ReadyLegacy хранит цифровые копии для организационных целей»
  - «Юридически обязывающие документы требуют надлежащего оформления по закону»
  - «Завещание: храните оригинал у нотариуса или Einzelgericht»
- Добавить подсказки в UI инструментов

---

### Q23: Müssen wir Altersbeschränkungen einbauen?

**Текущее состояние:**
- ❌ Нет age verification
- ❌ Нет минимального возраста при регистрации
- ❌ Нет проверки возраста при Google OAuth
- Регистрация: email + password (min 6 chars) + name — возраст не запрашивается

**Gap:**
- nDSG: обработка данных несовершеннолетних требует согласия законных представителей
- GDPR Art. 8: для информационного общества — минимум 16 лет (или 13-16 в зависимости от страны)
- Тематика платформы (наследство, медицинские директивы) подразумевает совершеннолетних пользователей

**Рекомендация:**
- Установить минимальный возраст 18 лет (тематика = наследство)
- Добавить подтверждение возраста при регистрации (checkbox или date of birth)
- Прописать в AGB

---

## 5. Umgang mit Tod & Nachlass (Q24–Q27)

### Q24: Wie stellen wir sicher, dass wir rechtlich korrekt handeln, wenn ein Nutzer stirbt?

**Текущее состояние:**
- ❌ Нет процедуры для обработки смерти пользователя
- ❌ Нет способа для третьих лиц уведомить платформу о смерти
- ❌ Нет формы/API для запроса доступа наследниками
- Данные остаются в системе бессрочно (нет retention policy)

**Gap:**
- Core business case платформы не имеет юридического фреймворка
- При смерти пользователя: JWT истекает через 30 дней → аккаунт становится недоступным (но данные остаются в DB)
- Нет процедуры → каждый случай будет ad hoc

**Рекомендация:**
- Разработать формализованную процедуру:
  1. Контактная форма / email для уведомления о смерти
  2. Необходимые документы: Todesurkunde, Erbschein, ID заявителя
  3. Проверка: заявитель является зарегистрированным бенефициаром или законным наследником
  4. Предоставление доступа: ограниченный scope, ограниченное время
  5. Логирование всех действий
- Определить SLA для обработки (например, 10 рабочих дней)

---

### Q25: Welche Nachweise brauchen wir, um Zugriff an Angehörige zu geben?

**Текущее состояние:**
- Данные бенефициаров хранятся: имя, email, телефон, отношение (в jsonb)
- Нет верификации бенефициаров при вводе
- Нет процедуры проверки при запросе доступа

**Рекомендация (для обсуждения с юристом):**
- **Минимальный набор документов:**
  1. Todesurkunde (свидетельство о смерти)
  2. ID заявителя (Ausweis/Pass)
  3. Подтверждение связи: Erbschein или соответствие записям бенефициаров в системе
- **Процесс:**
  - Manual review (на MVP стадии)
  - Двойная проверка (two-person principle)
  - Документирование решения
- **Юридические вопросы для IA:**
  - Достаточно ли наших записей бенефициаров как основания для предоставления доступа?
  - Нужен ли Erbschein во всех случаях?
  - Каков срок давности для запроса?

---

### Q26: Dürfen wir als Plattform „Instruktionen" speichern, die rechtlich relevant sind?

**Текущее состояние:**
Платформа хранит:
- **Завещание** (Testament-Tool): доли наследников, легаты, условия — **юридически релевантные инструкции**
- **Patientenverfügung**: решения о медицинском лечении — **юридически обязывающий документ**
- **Vorsorgeauftrag**: назначение уполномоченных лиц — **юридически обязывающий документ**
- **Bestattungsverfügung**: похоронные пожелания — **юридически релевантные**
- **Крипто-кошельки**: инструкции к seed-фразам — **финансово критические**
- **Личные сообщения**: для близких после смерти — **эмоционально, но не юридически значимые**

**Disclaimer в коде:**
- Impressum: «does not provide legal, financial, or medical advice»
- Но инструменты фактически помогают создавать юридически значимые документы

**Gap:**
- Тонкая грань между «организационный инструмент» и «юридический сервис»
- Если пользователь полагается на шаблон завещания и он окажется неполным/неверным → потенциальная ответственность
- Нет предупреждения при создании юридически значимых документов

**Рекомендация:**
- В каждом юридически значимом инструменте — prominent disclaimer:
  - «Это организационный шаблон. Юридическую силу имеет только надлежаще оформленный оригинал»
  - «Рекомендуем проверить с юристом перед использованием»
- В AGB: явное разграничение «хранение ≠ юридическая услуга»
- Рассмотреть disclaimer при первом использовании каждого инструмента (modal/popup)

---

### Q27: Wo ist die Grenze zwischen „Organisation" und „rechtlicher Beratung"?

**Текущее состояние:**
- AI-чат использует BM25 поиск по базе знаний (50+ чанков) — **не LLM, не генеративный AI**
- База знаний содержит информацию о швейцарском праве (завещание, Vorsorgeauftrag, Patientenverfügung)
- Чат предоставляет общую информацию, ссылается на инструменты платформы
- Disclaimer: «does not provide legal, financial, or medical advice»

**Примеры из базы знаний:**
- «Ein Testament muss in der Schweiz eigenhändig geschrieben, datiert und unterschrieben sein»
- «Die Patientenverfügung regelt Ihre medizinischen Wünsche für den Fall der Urteilsunfähigkeit»

**Gap:**
- Граница размыта: общая правовая информация vs. конкретный совет
- Если чат «рекомендует» действия (например, «Sie sollten...»), это может быть расценено как Beratung
- Нет явного предупреждения в чате «это не юридическая консультация»

**Рекомендация:**
- Добавить disclaimer в каждый ответ чата или в начало сессии
- Формулировки: «allgemeine Information» вместо «Empfehlung/Beratung»
- В AGB: «Plattform bietet allgemeine Informationen, keine individuelle Rechtsberatung»
- Рассмотреть: каждый ответ чата заканчивается «Konsultieren Sie einen Fachberater für Ihre individuelle Situation»

---

## 6. Internationalität (Q28–Q30)

### Q28: Was ändert sich, wenn Nutzer aus der EU kommen?

**Текущее состояние:**
- UI доступен на 4 языках: EN, DE, RU, UA
- Privacy Policy ссылается на GDPR
- Нет geo-blocking → EU пользователи имеют доступ
- Немецкий язык и тематика (швейцарское наследственное право) → targeting DACH + EU

**Gap:**
- GDPR скорее всего применяется (Art. 3(2): «offering goods or services to data subjects in the Union»)
- Нет cookie consent banner (не нужен если нет cookies, но нужен анализ)
- Нет EU representative (Art. 27 GDPR) если нет establishment в EU
- Privacy Policy не полностью соответствует GDPR requirements

**Рекомендация:**
- Провести GDPR compliance assessment
- При подтверждении применимости GDPR:
  - Назначить EU representative (если нет EU office)
  - Обновить Privacy Policy (Art. 13/14 GDPR information requirements)
  - Обеспечить все права субъектов данных (Art. 15-22)
  - Заключить SCCs с субпроцессорами для трансграничной передачи

---

### Q29: Müssen wir länderspezifische Versionen erstellen?

**Текущее состояние:**
- Шаблоны юридических документов основаны на **швейцарском праве** (ZGB)
- Нет ландспецифических версий (Германия, Австрия и т.д.)
- Наследственное право отличается по странам (например, Pflichtteil DE ≠ CH)

**Gap:**
- Если DE/AT пользователь использует швейцарский шаблон завещания → может быть недействителен
- Нет предупреждения о юрисдикции при использовании инструментов

**Рекомендация:**
- **Минимум**: предупреждение «Шаблоны основаны на швейцарском праве (ZGB). Для других юрисдикций обратитесь к местному юристу»
- **Среднесрочно**: ландспецифические шаблоны для DE и AT (крупнейшие DACH-рынки)
- Прописать юрисдикцию в AGB

---

### Q30: Welche Risiken bestehen bei globaler Nutzung?

**Текущее состояние:**
- Платформа доступна глобально (нет geo-restrictions)
- CORS: open policy (`Access-Control-Allow-Origin: *`) на chat API
- Языки: EN, DE, RU, UA → потенциальные пользователи из RU/UA/EU/CH

**Риски:**
1. **Regulatory**: разные data protection laws (GDPR, CCPA, etc.)
2. **Content**: юридические шаблоны не универсальны
3. **Data localization**: некоторые страны требуют локального хранения
4. **Sanctions**: пользователи из sanctioned countries
5. **Правовая ответственность**: юридическая информация может быть неприменима/вредной в другой юрисдикции

**Рекомендация:**
- Определить target markets (начать с CH, расширить на DACH)
- В AGB: ограничить applicability швейцарским правом
- Disclaimer: «Содержимое основано на швейцарском праве и может не применяться в вашей юрисдикции»
- Рассмотреть geo-blocking для non-target markets на первом этапе

---

## 7. Notfälle & Sicherheitsvorfälle (Q31–Q33)

### Q31: Was müssen wir tun, wenn ein Datenleck passiert?

**Текущее состояние:**
- ❌ Нет incident response plan
- ❌ Нет breach notification procedure
- ❌ Нет audit logging (невозможно определить scope breach)
- ❌ Нет мониторинга безопасности
- Cloudflare предоставляет базовую DDoS protection и WAF

**Gap:**
- nDSG Art. 24: уведомление FDPIC «so rasch als möglich» при breach с высоким риском для субъектов
- GDPR Art. 33: уведомление DPA в течение 72 часов
- GDPR Art. 34: уведомление субъектов если высокий риск
- Без audit logs невозможно определить: что утекло, кто пострадал, когда произошло

**Рекомендация:**
- **Срочно**: создать базовый Incident Response Plan
- Внедрить audit logging (access to sensitive data, authentication events)
- Определить notification procedure (FDPIC + пользователи)
- Назначить ответственного за incident response

---

### Q32: Wie schnell müssen wir Nutzer und Behörden informieren?

**Текущее состояние:**
- Нет процедуры → нет определённых сроков

**Правовые требования:**
- **nDSG Art. 24**: «so rasch als möglich» уведомить FDPIC (без фиксированного срока, но на практике = несколько дней)
- **GDPR Art. 33**: 72 часа для уведомления DPA (если применяется)
- **GDPR Art. 34**: «without undue delay» уведомить субъектов при высоком риске

**Рекомендация:**
- Определить внутренние сроки: обнаружение → оценка (4h) → уведомление FDPIC (24h) → уведомление пользователей (48h)
- Подготовить шаблоны уведомлений (EN/DE)
- Определить каналы уведомления (email, сайт)

---

### Q33: Brauchen wir einen Incident-Response-Plan?

**Текущее состояние:**
- ❌ Нет формализованного IRP
- ❌ Нет on-call / escalation процедуры
- ❌ Нет security monitoring

**Gap:**
- nDSG не требует IRP явно, но обязывает обеспечить «angemessene Datensicherheit»
- GDPR не требует IRP явно, но без него невозможно выполнить 72-часовое уведомление
- Учитывая чувствительность данных — IRP критически необходим

**Рекомендация:**
- Создать базовый IRP:
  1. Обнаружение и классификация инцидента
  2. Containment (изоляция)
  3. Оценка scope и impact
  4. Уведомление (FDPIC, DPA, пользователи)
  5. Устранение и восстановление
  6. Post-mortem и улучшение
- Назначить роли (кто принимает решения, кто уведомляет)
- Проводить табличные учения (table-top exercises) минимум 1 раз в год

---

## 8. Allgemeine Fragen (Q34–Q36)

### Q34: Würden Sie uns empfehlen, bestimmte Funktionen NICHT anzubieten?

**Наше мнение (для обсуждения с юристом):**

**Высокий риск — рассмотреть ограничение:**
1. **Хранение seed-фраз / крипто-ключей** — при утечке пользователь теряет средства безвозвратно. Сейчас хранятся в plaintext. Рекомендация: не хранить сами ключи, а только инструкции «где найти»
2. **Генерация завещаний** — риск восприятия как юридическая услуга. Рекомендация: только организационный шаблон + prominent disclaimer
3. **AI-чат с правовой информацией** — риск расценки как Rechtsberatung. Текущая реализация (BM25 search, не LLM) снижает этот риск

**Средний риск:**
4. **Хранение медицинских директив** — особая категория данных. ОК при надлежащей защите и consent
5. **Beneficiary access после смерти** — юридически сложно, но это core business

**Низкий риск:**
6. Финансовый обзор (обобщение активов)
7. Личные сообщения
8. Похоронные пожелания

---

### Q35: Was ist das größte Risiko in unserem Geschäftsmodell?

**Техническая оценка рисков (по severity):**

1. **Data breach с plaintext sensitive data** — медицинские данные, завещания, крипто-инструкции в plaintext в БД. При компрометации DB credentials → полный доступ ко всем данным всех пользователей. **Impact: критический**

2. **Юридическое несоответствие** — Privacy Policy содержит ложные утверждения (demo mode, localStorage only, E2E encryption promise). Отсутствие AGB. Отсутствие consent при регистрации. **Impact: высокий** (regulatory action, reputational damage)

3. **Ответственность за юридически значимые шаблоны** — пользователь полагается на шаблон завещания, который оказывается неполным → наследники теряют активы. **Impact: высокий** (liability claims)

4. **Account takeover** — нет MFA, нет brute force protection, нет rate limiting, JWT 30 дней. Злоумышленник получает доступ к чувствительным данным. **Impact: высокий**

5. **Отсутствие процедуры смерти** — core value proposition продукта не имеет юридической и технической реализации. **Impact: средний** (business risk, не regulatory)

---

### Q36: Welche „typischen Fehler" machen Startups in unserem Bereich?

**Типичные ошибки (с нашей самооценкой):**

| Ошибка | Наш статус |
|--------|-----------|
| Запуск без AGB/ToS | ⚠️ **У нас нет AGB** |
| Privacy Policy copy-paste без адаптации | ⚠️ **У нас устарела** |
| Обещания в документах, не подкреплённые реализацией | ⚠️ **E2E encryption обещано, не реализовано** |
| Нет consent при регистрации | ⚠️ **У нас нет** |
| Хранение sensitive data в plaintext | ⚠️ **У нас plaintext** |
| Нет incident response plan | ⚠️ **У нас нет** |
| Неправильный хостер в Impressum | ⚠️ **Vercel вместо Cloudflare** |
| Нет DPA с субпроцессорами | ⚠️ **Нет DPA** |
| Игнорирование GDPR при EU targeting | ⚠️ **Не проанализировано** |
| Позиционирование как «юридический сервис» вместо «организационный инструмент» | ✅ Disclaimer есть |

---

## Приоритеты (рекомендуемый порядок действий)

### Критические (до public launch)
1. ☐ Создать AGB / Terms of Service
2. ☐ Обновить Privacy Policy (убрать ложные утверждения)
3. ☐ Исправить Impressum (Vercel → Cloudflare)
4. ☐ Добавить consent checkbox при регистрации
5. ☐ Реализовать account deletion и data export

### Высокие (в ближайшие месяцы)
6. ☐ Заключить DPA с Cloudflare, Neon, Google
7. ☐ Внедрить rate limiting и brute force protection
8. ☐ Реализовать password reset
9. ☐ Создать Incident Response Plan
10. ☐ Добавить disclaimers к юридическим инструментам
11. ☐ Провести DPIA

### Средние (по мере роста)
12. ☐ Внедрить encryption at rest (application-level)
13. ☐ Внедрить MFA
14. ☐ Внедрить audit logging
15. ☐ Разработать процедуру доступа после смерти
16. ☐ Провести GDPR compliance assessment
17. ☐ Рассмотреть Cyber Insurance

---

*Документ подготовлен на основе анализа кодовой базы ReadyLegacy (commit 3cf0098). Все утверждения о технической реализации соответствуют фактическому состоянию кода на 2026-04-08.*
