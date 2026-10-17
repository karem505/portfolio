# Blog draft — Rusty Inbox build story

Source for `scripts/publish-blog-posts.mjs`. Publish with:
`SUPABASE_SERVICE_KEY=<key> node scripts/publish-blog-posts.mjs proposals/rusty-inbox-blog.md`

# Post 1 — Rusty Inbox: a native email client in Rust + Qt (links /apps/rusty-inbox and the repo)

**slug:** `rusty-inbox-open-source-email-client-rust-qt`

**title_en:** How I Built Rusty Inbox: a Fast, Open-Source Email Client in Rust and Qt 6

**title_ar:** كيف بنيت Rusty Inbox: عميل بريد سريع ومفتوح المصدر بلغة Rust و Qt 6

**excerpt_en:** Rusty Inbox is a free, open-source desktop email client for Linux, Windows and macOS with a native Rust mail engine and a Qt 6 / QML interface. Here is how it is built: the two-layer architecture that keeps the UI from ever waiting on the network, Undo Send through a local outbox, a Smart Inbox that sorts mail by its headers, sandboxed HTML rendering, and one codebase shipped to three operating systems.

**excerpt_ar:** Rusty Inbox عميل بريد مجاني ومفتوح المصدر لسطح المكتب على لينكس وويندوز وماك، بمحرّك بريد أصلي بلغة Rust وواجهة Qt 6 / QML. هنا طريقة بنائه: معمارية من طبقتين تمنع الواجهة من انتظار الشبكة، والتراجع عن الإرسال عبر صندوق صادر محلي، وصندوق وارد ذكي يفرز البريد من ترويساته، وعرض HTML معزول، وكود واحد يُنشر على ثلاثة أنظمة تشغيل.

**meta_description_en:** Rusty Inbox is a free, open-source email client in Rust and Qt 6 for Linux, Windows and macOS. The architecture, design decisions and how it ships. (149 chars)

**meta_description_ar:** Rusty Inbox عميل بريد مجاني ومفتوح المصدر بـ Rust و Qt 6 للينكس وويندوز وماك: المعمارية وقرارات التصميم وطريقة النشر على ثلاثة أنظمة. (133 chars)

**post_type:** `tutorial`

**seo_keywords:**
```
["Rusty Inbox", "open source email client", "Rust email client", "Qt email client", "Linux email client", "Thunderbird alternative", "native desktop email app", "cxx-qt", "Rust Qt QML", "IMAP client Rust", "async-imap", "lettre SMTP", "email client for Linux", "Omarchy email client", "عميل بريد مفتوح المصدر"]
```

**content_en:**
```markdown
**Rusty Inbox is a free, open-source desktop email client for Linux, Windows and macOS.** Its mail engine is written in Rust and its interface in Qt 6 / QML, so the window opens in a fraction of a second and stays light on memory. It works with any IMAP/SMTP account — Gmail (with an app password), Fastmail, iCloud, Yahoo, cPanel hosting — sorts the inbox into people, notifications and newsletters, and every action works from the keyboard. The source is on [GitHub](https://github.com/karem505/rusty-inbox) under MIT or Apache 2.0, and the app has its own page here: [Rusty Inbox](/apps/rusty-inbox).

<iframe src="https://www.youtube-nocookie.com/embed/eDgUudd3zOw" title="Rusty Inbox launch video" allowfullscreen></iframe>

I built it because I live in my inbox, on a Linux desktop, and every mail client I tried was one of two things: fast but bare, or polished but a web app shipped inside its own copy of a browser. I wanted the polish without the browser. This post is the build story — the architecture, the decisions that kept it fast, and what it took to ship one codebase to three operating systems.

## What does Rusty Inbox do?

- **Smart Inbox.** Mail from people comes first. Notifications, newsletters and calendar invitations go into their own groups, which you can fold away.
- **Unified mailboxes** across every account, with per-account Sent, Drafts and Done.
- **Undo Send and Send Later.** Messages wait in a local outbox; a failed send retries by itself and stays under *Scheduled*.
- **Drafts that sync** to your provider's Drafts folder, templates, and per-account signatures.
- **Done, Snooze, Pin and bulk actions** (select all or a range), each with undo.
- **Keyboard first:** `J`/`K` to move, `E` Done, `S` snooze, `R`/`A`/`F` reply, reply all, forward, `C` compose, `Ctrl+Enter` send.
- **Desktop native:** tray icon with an unread dot, notifications, `mailto:` links, a single running instance, and live theming — on Omarchy the colours and font follow `omarchy theme set`.
- **One-click import from Thunderbird:** accounts, servers and saved passwords.
- **Local and private:** a SQLite cache on your machine, no telemetry, no cloud relay.

![Rusty Inbox Smart Inbox: people first, notifications and newsletters grouped](https://aboelmakarem.pro/apps/rusty-inbox/smart-inbox.jpg)

## How is Rusty Inbox built?

Rusty Inbox is two layers that never wait on each other. The engine, `rusty-inbox-core`, is a plain Rust library with no UI code: IMAP sync with `async-imap` over `rustls`, SMTP with `lettre`, MIME parsing with `mail-parser`, and a SQLite cache through `rusqlite`. The desktop app is Qt 6 / QML, connected to Rust through `cxx-qt`. A single `QObject` — the bridge — sits between them.

| Layer | What it does | Built with |
|---|---|---|
| Interface | Inbox, reader, composer, settings | Qt Quick / QML |
| Bridge | JSON in, Qt signals out | cxx-qt |
| Engine | Sync, send, drafts, search, import | Rust, Tokio |
| Storage | Threads, messages, outbox, settings | SQLite |

The rule that makes it feel fast is simple: **the interface only ever reads local data synchronously, and everything that touches the network reports back later as a signal.** When you open a thread, QML asks the bridge for what is already in SQLite and draws it immediately. Sync runs on a small Tokio runtime inside the app and emits a signal when new mail lands. Scrolling and typing never block on a server.

At the time of writing the project is about 7,300 lines of Rust and 3,800 lines of QML, with 64 automated tests.

## Five decisions that kept it fast and reliable

### 1. Pool IMAP connections per account

Logging in to IMAP is the slowest thing a mail client does, and some providers throttle accounts that log in too often. The engine keeps a small pool of authenticated connections per account, checks a pooled connection with a cheap liveness probe before reuse, and hands it back when the job is done. Opening a folder reuses a warm session instead of a fresh TLS handshake and login.

### 2. Undo Send is an outbox, not a timer

Pressing *Send* does not send. It writes the message to a local outbox table with a `send_at` time — now plus the undo window, or the time you picked for *Send Later*. Undo simply turns the row back into a draft. A background loop claims due rows and sends them; if the server fails, the row is marked failed, kept under *Scheduled* and retried. Because the outbox lives in SQLite, a crash or a closed laptop never loses a message.

### 3. Smart Inbox reads headers, not content

Sorting mail into people, notifications and newsletters does not need AI or a server. The signals are already in every message: a `List-Unsubscribe` or `List-Id` header means a newsletter, a calendar part means an invitation, and `Precedence: bulk` or a sender like `noreply@` means an automated notification. Everything else is a person. It is deterministic, instant, and runs entirely on your machine.

### 4. Render HTML mail in a sandbox

HTML email is untrusted content. Each message renders in its own iframe with the `sandbox` attribute and no `allow-scripts`, so no script in an email ever runs. Links open in your default browser instead of inside the app. The rest of the interface is native Qt Quick; a web view is used only for message bodies.

### 5. Import from Thunderbird by reading its own files

Most people switching mail clients come from Thunderbird, and re-typing server settings is where they give up. Rusty Inbox reads the Thunderbird profile directly — the account settings in `prefs.js` and the saved passwords in `logins.json`, decrypted with the key in NSS `key4.db` — so accounts, servers and passwords come over in one click (when the profile has no primary password).

![Replying in Rusty Inbox with recipient chips and attachments](https://aboelmakarem.pro/apps/rusty-inbox/composer.jpg)

## Shipping one codebase to Linux, Windows and macOS

Qt and Rust both cross-compile well, so the work was packaging, not porting. A GitHub Actions pipeline builds every release:

- **Linux:** an AppImage and a Flatpak bundle, plus an Arch Linux PKGBUILD that builds from source.
- **Windows 10/11:** an installer and a portable zip.
- **macOS 12+:** a `.dmg` for Apple Silicon and Intel.

An install script picks the right package for your system and updates it when you run it again.

## How do I install Rusty Inbox?

Download a package from [GitHub Releases](https://github.com/karem505/rusty-inbox/releases), or build it yourself with Rust 1.85+ and Qt 6.8+ (Qt Quick, Quick Controls 2 and Qt WebEngine):

```sh
git clone https://github.com/karem505/rusty-inbox && cd rusty-inbox
cargo build --release
./target/release/rusty-inbox
```

Then open *Settings → Accounts*. Most providers are detected from the address alone; for Gmail, create an [app password](https://myaccount.google.com/apppasswords) and use it as the password. Coming from Thunderbird, choose *Import from Thunderbird*.

<iframe src="https://www.youtube-nocookie.com/embed/QinUtaGOhWg" title="Rusty Inbox feature tour" allowfullscreen></iframe>

## What I took from building it

Speed in a desktop app is mostly an architecture decision, not an optimisation pass: keep the UI on local data, push every slow thing behind a signal, and the app feels instant on any machine. The same thinking applies to the business software I build for companies — internal tools that open instantly and never make people wait on a spinner. If that is the kind of system your team needs, that is what my [digital transformation consulting](/digital-transformation) is for.

## FAQ

**Is Rusty Inbox free?**
Yes. It is open source under MIT or Apache 2.0, with no paid tier and no account to create.

**Does Rusty Inbox work with Gmail?**
Yes, over IMAP and SMTP. Create a Google app password and use it as the account password.

**Is Rusty Inbox a Thunderbird alternative?**
It is a faster, keyboard-first inbox, and it imports your Thunderbird accounts, servers and saved passwords in one click.

**Does Rusty Inbox collect data?**
No. It has no analytics, crash reporting or servers of its own. It talks only to the mail servers you add.

**What is Rusty Inbox built with?**
A Rust mail engine (async-imap, rustls, lettre, mail-parser, SQLite, Tokio) and a Qt 6 / QML interface connected through cxx-qt.

Try it, star it, or open an issue: [github.com/karem505/rusty-inbox](https://github.com/karem505/rusty-inbox).
```

**content_ar:**
```markdown
**Rusty Inbox عميل بريد إلكتروني مجاني ومفتوح المصدر لسطح المكتب على لينكس وويندوز وماك.** محرّك البريد مكتوب بلغة Rust والواجهة بـ Qt 6 / QML، لذلك تُفتح النافذة في جزء من الثانية ويبقى استهلاك الذاكرة منخفضاً. يعمل مع أي حساب IMAP/SMTP — Gmail (بكلمة مرور التطبيقات)، و Fastmail، و iCloud، و Yahoo، واستضافات cPanel — ويرتّب الوارد إلى أشخاص وإشعارات ونشرات، وكل إجراء متاح من لوحة المفاتيح. الكود على [GitHub](https://github.com/karem505/rusty-inbox) برخصة MIT أو Apache 2.0، وللتطبيق صفحة خاصة هنا: [Rusty Inbox](/apps/rusty-inbox?lang=ar).

<iframe src="https://www.youtube-nocookie.com/embed/eDgUudd3zOw" title="فيديو إطلاق Rusty Inbox" allowfullscreen></iframe>

بنيته لأنني أقضي يومي في البريد على سطح مكتب لينكس، وكل عميل بريد جرّبته كان واحداً من اثنين: سريع لكنه بسيط جداً، أو أنيق لكنه تطبيق ويب يأتي داخل نسخته الخاصة من متصفح. أردت الأناقة بدون المتصفح. هذا المقال قصة البناء: المعمارية، والقرارات التي أبقته سريعاً، وما تطلّبه نشر كود واحد على ثلاثة أنظمة تشغيل.

## ماذا يفعل Rusty Inbox؟

- **الصندوق الذكي.** رسائل الأشخاص أولاً، والإشعارات والنشرات ودعوات التقويم في مجموعات خاصة يمكنك طيّها.
- **صناديق موحّدة** لكل الحسابات، مع المُرسَل والمسودات والمنجَز لكل حساب.
- **التراجع عن الإرسال والجدولة.** تنتظر الرسائل في صندوق صادر محلي، والرسالة التي تفشل تُعاد محاولتها تلقائياً وتبقى ضمن *المجدوَلة*.
- **مسودات متزامنة** مع مجلد المسودات لدى مزوّد البريد، وقوالب، وتوقيع لكل حساب.
- **إنجاز وتأجيل وتثبيت وإجراءات جماعية** (تحديد الكل أو نطاق)، مع التراجع عن كل إجراء.
- **لوحة المفاتيح أولاً:** `J`/`K` للتنقّل، `E` للإنجاز، `S` للتأجيل، `R`/`A`/`F` للرد والرد على الكل والتحويل، `C` لرسالة جديدة، `Ctrl+Enter` للإرسال.
- **أصلي على سطح المكتب:** أيقونة في شريط النظام بنقطة للرسائل غير المقروءة، وإشعارات، وروابط `mailto:`، ونسخة واحدة تعمل، وتغيير السمة مباشرةً — على Omarchy تتبع الألوان والخط أمر `omarchy theme set`.
- **استيراد من Thunderbird بنقرة:** الحسابات والخوادم وكلمات المرور المحفوظة.
- **محلي وخاص:** تخزين SQLite على جهازك، بلا تتبّع ولا خوادم وسيطة.

![الصندوق الذكي في Rusty Inbox: الأشخاص أولاً والإشعارات والنشرات في مجموعات](https://aboelmakarem.pro/apps/rusty-inbox/smart-inbox.jpg)

## كيف بُني Rusty Inbox؟

Rusty Inbox طبقتان لا تنتظر إحداهما الأخرى. المحرّك `rusty-inbox-core` مكتبة Rust خالصة بلا أي كود واجهة: مزامنة IMAP عبر `async-imap` فوق `rustls`، والإرسال عبر `lettre`، وتحليل الرسائل عبر `mail-parser`، وتخزين SQLite عبر `rusqlite`. تطبيق سطح المكتب مبني بـ Qt 6 / QML ومتصل بـ Rust عبر `cxx-qt`، ويقف بينهما كائن `QObject` واحد هو الجسر.

| الطبقة | ماذا تفعل | التقنية |
|---|---|---|
| الواجهة | الوارد والقراءة والكتابة والإعدادات | Qt Quick / QML |
| الجسر | JSON للداخل وإشارات Qt للخارج | cxx-qt |
| المحرّك | المزامنة والإرسال والمسودات والبحث والاستيراد | Rust و Tokio |
| التخزين | المحادثات والرسائل والصادر والإعدادات | SQLite |

القاعدة التي تجعله سريعاً بسيطة: **الواجهة تقرأ البيانات المحلية فقط وبشكل فوري، وكل ما يحتاج الشبكة يعود لاحقاً كإشارة.** عندما تفتح محادثة، تطلب QML من الجسر ما هو موجود في SQLite وترسمه فوراً، والمزامنة تعمل على Tokio runtime صغير داخل التطبيق وتُطلق إشارة عند وصول بريد جديد. التمرير والكتابة لا يتوقفان أبداً بسبب خادم.

حتى وقت كتابة المقال، يضم المشروع نحو 7,300 سطر Rust و 3,800 سطر QML، مع 64 اختباراً آلياً.

## خمسة قرارات أبقته سريعاً وموثوقاً

### 1. تجميع اتصالات IMAP لكل حساب

تسجيل الدخول إلى IMAP أبطأ ما يفعله عميل البريد، وبعض المزوّدين يقيّدون الحسابات التي تسجّل الدخول كثيراً. يحتفظ المحرّك بمجموعة صغيرة من الاتصالات الجاهزة لكل حساب، ويفحص الاتصال بفحص خفيف قبل إعادة استخدامه، ثم يعيده بعد انتهاء المهمة. فتح مجلد يعيد استخدام جلسة جاهزة بدل مصافحة TLS وتسجيل دخول جديدين.

### 2. التراجع عن الإرسال صندوق صادر وليس مؤقتاً

الضغط على *إرسال* لا يرسل فوراً، بل يكتب الرسالة في جدول صادر محلي بوقت إرسال: الآن مضافاً إليه مهلة التراجع، أو الوقت الذي اخترته للجدولة. التراجع يعيد الصف مسودة. حلقة في الخلفية تلتقط الصفوف المستحقة وترسلها، وإن فشل الخادم يُعلَّم الصف بالفشل ويبقى ضمن *المجدوَلة* ويُعاد إرساله. ولأن الصادر محفوظ في SQLite، فلا تضيع رسالة إذا أُغلق التطبيق أو الجهاز.

### 3. الصندوق الذكي يقرأ الترويسات لا المحتوى

فرز البريد إلى أشخاص وإشعارات ونشرات لا يحتاج ذكاءً اصطناعياً ولا خادماً. الإشارات موجودة أصلاً في كل رسالة: ترويسة `List-Unsubscribe` أو `List-Id` تعني نشرة، وجزء تقويم يعني دعوة، و `Precedence: bulk` أو مرسل مثل `noreply@` يعني إشعاراً آلياً، وما عدا ذلك شخص. فرز ثابت وفوري ويعمل بالكامل على جهازك.

### 4. عرض بريد HTML داخل بيئة معزولة

بريد HTML محتوى غير موثوق. كل رسالة تُعرض في إطار iframe خاص بخاصية `sandbox` وبدون `allow-scripts`، فلا يعمل أي سكربت داخل أي رسالة، والروابط تُفتح في متصفحك الافتراضي لا داخل التطبيق. بقية الواجهة Qt Quick أصلية، وعارض الويب يُستخدم لمحتوى الرسائل فقط.

### 5. الاستيراد من Thunderbird بقراءة ملفاته مباشرة

أغلب من يغيّرون عميل البريد قادمون من Thunderbird، وإعادة كتابة إعدادات الخوادم هي اللحظة التي يستسلمون فيها. يقرأ Rusty Inbox ملف Thunderbird الشخصي مباشرة — إعدادات الحسابات في `prefs.js` وكلمات المرور المحفوظة في `logins.json` بعد فك تشفيرها بالمفتاح الموجود في `key4.db` — فتنتقل الحسابات والخوادم وكلمات المرور بنقرة واحدة (إذا لم يكن الملف محمياً بكلمة مرور رئيسية).

![الرد في Rusty Inbox مع خانات المستلمين والمرفقات](https://aboelmakarem.pro/apps/rusty-inbox/composer.jpg)

## نشر كود واحد على لينكس وويندوز وماك

كل من Qt و Rust يدعمان البناء لعدة أنظمة جيداً، فكان العمل في التحزيم لا في النقل. خط GitHub Actions يبني كل إصدار:

- **لينكس:** AppImage وحزمة Flatpak، مع ملف PKGBUILD لآرتش لينكس يبني من المصدر.
- **ويندوز 10/11:** مثبّت ونسخة محمولة zip.
- **ماك 12+:** ملف `.dmg` لمعالجات Apple Silicon و Intel.

وسكربت تثبيت يختار الحزمة المناسبة لنظامك ويحدّثها عند تشغيله مرة أخرى.

## كيف أثبّت Rusty Inbox؟

نزّل حزمة من [صفحة الإصدارات على GitHub](https://github.com/karem505/rusty-inbox/releases)، أو ابنِه بنفسك باستخدام Rust 1.85+ و Qt 6.8+ (مع Qt Quick و Quick Controls 2 و Qt WebEngine):

```sh
git clone https://github.com/karem505/rusty-inbox && cd rusty-inbox
cargo build --release
./target/release/rusty-inbox
```

ثم افتح *الإعدادات ← الحسابات*. يتعرّف التطبيق على أغلب المزوّدين من العنوان وحده؛ ولـ Gmail أنشئ [كلمة مرور للتطبيقات](https://myaccount.google.com/apppasswords) واستخدمها ككلمة المرور. وإن كنت قادماً من Thunderbird فاختر *الاستيراد من Thunderbird*.

<iframe src="https://www.youtube-nocookie.com/embed/QinUtaGOhWg" title="جولة في مزايا Rusty Inbox" allowfullscreen></iframe>

## ما تعلّمته من بنائه

السرعة في تطبيقات سطح المكتب قرار معماري قبل أن تكون تحسيناً لاحقاً: اجعل الواجهة على البيانات المحلية، وادفع كل ما هو بطيء خلف إشارة، فيبدو التطبيق فورياً على أي جهاز. ونفس التفكير أطبّقه في الأنظمة التي أبنيها للشركات — أدوات داخلية تُفتح فوراً ولا تجعل الموظفين ينتظرون. إن كان هذا ما يحتاجه فريقك، فهذا هو دور [خدمات التحول الرقمي](/digital-transformation?lang=ar).

## أسئلة شائعة

**هل Rusty Inbox مجاني؟**
نعم. مفتوح المصدر برخصة MIT أو Apache 2.0، بلا خطة مدفوعة ولا حاجة لإنشاء حساب.

**هل يعمل Rusty Inbox مع Gmail؟**
نعم، عبر IMAP و SMTP. أنشئ كلمة مرور للتطبيقات من Google واستخدمها ككلمة مرور الحساب.

**هل Rusty Inbox بديل لـ Thunderbird؟**
هو صندوق وارد أسرع يُدار بلوحة المفاتيح، ويستورد حسابات Thunderbird وخوادمه وكلمات المرور المحفوظة بنقرة واحدة.

**هل يجمع Rusty Inbox بيانات؟**
لا. لا يحتوي على تحليلات ولا تقارير أعطال ولا خوادم خاصة به، ولا يتصل إلا بخوادم البريد التي تضيفها.

**بماذا بُني Rusty Inbox؟**
محرّك بريد بلغة Rust (async-imap و rustls و lettre و mail-parser و SQLite و Tokio) وواجهة Qt 6 / QML متصلة عبر cxx-qt.

جرّبه، أو ادعمه بنجمة، أو افتح issue: [github.com/karem505/rusty-inbox](https://github.com/karem505/rusty-inbox).
```
