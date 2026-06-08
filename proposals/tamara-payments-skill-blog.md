# Blog draft — Tamara payments Claude skill

Source for `scripts/publish-blog-posts.mjs`. Publish with:
`SUPABASE_SERVICE_KEY=<key> node scripts/publish-blog-posts.mjs proposals/tamara-payments-skill-blog.md`

# Post 1 — Tamara payments Claude skill (links the open-source repo)

**slug:** `tamara-payments-integration-claude-skill`

**title_en:** How to Integrate Tamara Payments (BNPL) Correctly — and the Open-Source AI Skill That Does It

**title_ar:** كيف تدمج مدفوعات تمارا (BNPL) بشكل صحيح — والأداة مفتوحة المصدر التي تنفّذ ذلك بالذكاء الاصطناعي

**excerpt_en:** Tamara has hard timing rules and a strict order-status flow, so one wrong guess can leave real orders unsettled. Here's how a correct Tamara integration actually works — the full checkout → authorise → capture → refund flow, the mistakes that break settlement, and a free open-source Claude skill that gives any AI agent Tamara's real docs.

**excerpt_ar:** لدى تمارا قواعد توقيت صارمة وتدفّق دقيق لحالات الطلب، فأي تخمين خاطئ قد يترك طلبات حقيقية دون تسوية. إليك كيف يعمل تكامل تمارا الصحيح فعلاً — مسار checkout ← authorise ← capture ← refund كاملاً، والأخطاء التي تكسر التسوية، وأداة مجانية مفتوحة المصدر تمنح أي وكيل ذكاء اصطناعي وثائق تمارا الحقيقية.

**meta_description_en:** Integrate Tamara payments (BNPL) the right way: the full checkout → authorise → capture → refund flow, webhooks, and a free open-source Claude skill. (149 chars)

**meta_description_ar:** ادمج مدفوعات تمارا (BNPL) بشكل صحيح: مسار checkout ← authorise ← capture ← refund كاملاً، والـ webhooks، وأداة Claude مجانية مفتوحة المصدر. (139 chars)

**post_type:** `tutorial`

**seo_keywords:**
```
["Tamara payments integration", "Tamara API", "Tamara BNPL", "integrate Tamara", "Tamara webhook", "Tamara checkout", "Tamara authorise capture refund", "Tamara WooCommerce", "Tamara Shopify", "Tamara Salla", "buy now pay later Saudi Arabia", "BNPL API", "Claude skill", "AI payment integration", "تمارا"]
```

**content_en:**
```markdown
If you've ever asked an AI coding assistant to wire up a payment provider, you've seen it confidently invent an endpoint that doesn't exist. With most APIs that's an annoying bug you catch in testing. With **Tamara** it's worse: the API has hard timing rules and a strict order-status state machine, so a confident guess can leave **real orders unsettled** — the merchant ships the goods and never gets paid.

I integrate Tamara for clients across Egypt, the UAE, and Saudi Arabia, so I packaged everything I know about doing it correctly into a free, open-source **[Claude](https://claude.com/claude-code) skill**. This post walks through how a correct Tamara integration actually works — and how the skill makes any AI agent get it right the first time.

## What is Tamara?

**Tamara (تمارا)** is the leading shopping and **buy-now-pay-later (BNPL)** platform in the GCC — Saudi Arabia, the UAE, Bahrain, Kuwait, and Oman. Shoppers split a purchase into interest-free instalments ("Pay in 3", "Pay in 4", "Pay next month") while the merchant is paid up front. It's one of the highest-converting payment options in the region, which is why almost every serious Gulf store offers it.

## Pick the integration path first

Before writing a line of code, decide *how* you're adding Tamara — the docs differ for each path:

- **Direct API** — custom code on your own backend; the most control.
- **E-commerce plugin** — a no-code install on a hosted store: WooCommerce, Shopify, Salla, Magento, OpenCart, PrestaShop, Zid, Salesforce Commerce Cloud, ExpandCart, and more.
- **Channel partner** — add Tamara through a gateway you already use (Checkout.com, PayTabs, Amazon Payment Services, CCAvenue…).
- **In-store / POS** — physical shops, via an SMS payment link or a QR "Scan-to-Pay" code.
- **Mobile SDK** — inside an app (Android, iOS, Flutter, React Native).

If you're on WooCommerce or Salla, install the official plugin and you're 90% done. The rest of this post is about the **Direct API**, because that's where the subtle, expensive mistakes happen.

## The Tamara API "golden path"

Every direct integration has the same shape. Memorise it:

1. **Create a checkout session** — `POST /checkout`. Store the returned `order_id` and redirect the customer to the returned `checkout_url`. Status starts at `new`.
2. **Customer pays** on Tamara's hosted page → status becomes `approved`.
3. **The `order_approved` webhook** fires server-to-server — this is your reliable trigger, not the browser redirect.
4. **Authorise** — `POST /orders/{order_id}/authorise` → status `authorised` (treat as paid). This step is **mandatory** unless auto-authorisation is enabled.
5. **Capture on fulfilment/shipment** — `POST /payments/capture` (full or partial) → `fully_captured` / `partially_captured`. Capture is what actually moves money into your settlement.
6. **Refund or cancel** — refund captured amounts (`/payments/refund`); cancel or reduce still-`authorised` orders (`/orders/{order_id}/cancel`).

**Environments & auth:** sandbox is `https://api-sandbox.tamara.co`, production is `https://api.tamara.co`. Authenticate every request with `Authorization: Bearer {API_TOKEN}`. Build and test entirely on sandbox before you request live credentials.

## The mistakes that silently break settlement

These are the ones that cost real money — and exactly what an AI assistant gets wrong when it's guessing:

- **Skipping Authorise.** An order left at `approved` is never captured and never settles. You shipped; you don't get paid. Drive Authorise from the `order_approved` webhook.
- **Trusting the browser redirect.** The success/failure redirect can be lost (closed tab, flaky network). The **webhook** is the source of truth — verify and act on it.
- **Wrong decimal count.** SAR and AED use 2 decimals, but **BHD, KWD, and OMR use 3**. Send the wrong precision and the API rejects the request with a country/currency error.
- **Not verifying the webhook.** Each webhook carries a `tamaraToken` JWT (HS256). Verify it with your **Notification token** before acting, and make handlers idempotent — Tamara may resend events.
- **Missing the timing windows.** Pay ≤ 30 min, authorise ≤ 72 h, capture/cancel ≤ 90 days. Blow a window and the order `expire`s.

## A free, open-source Claude skill for Tamara

Instead of hoping the model remembers all of that, I gave it the real documentation. The result is an open-source **[Tamara payments skill on GitHub](https://github.com/karem505/tamara-payments-skill)** — a complete offline mirror of `docs.tamara.co`: **139 pages** (114 guides + the full **OpenAPI** for all **25 API endpoints**), plus a condensed quick-reference cheat sheet for base URLs, auth, the endpoint map, the order-status flow, and webhook verification.

Drop it into your Claude Code skills directory and it **activates automatically** whenever a task mentions Tamara:

```bash
git clone https://github.com/karem505/tamara-payments-skill.git ~/.claude/skills/tamara-payments
```

Now when you ask *"integrate Tamara checkout in my WooCommerce store"* or *"why is my Tamara order stuck at `approved`?"*, the agent reads Tamara's actual docs before writing code — instead of inventing an endpoint. It covers the direct API, every e-commerce plugin, channel partners, in-store/POS, mobile SDKs, and the promotional widgets, across all five GCC markets.

## Frequently Asked Questions

**How do I integrate Tamara payments?**
Pick a path first (Direct API, plugin, channel partner, in-store/POS, or mobile SDK). For the API path, the flow is: create checkout → customer pays → `order_approved` webhook → Authorise → Capture on fulfilment → Refund/Cancel as needed.

**What is the Tamara API base URL?**
Sandbox is `https://api-sandbox.tamara.co` and production is `https://api.tamara.co`. Authenticate every request with `Authorization: Bearer {API_TOKEN}` and always test on sandbox first.

**Why is my Tamara order stuck at `approved`?**
Because **Authorise** wasn't called. After the `order_approved` webhook you must `POST /orders/{order_id}/authorise`; otherwise the order never captures and never settles.

**Does Tamara support WooCommerce, Shopify, and Salla?**
Yes — Tamara ships official plugins for Magento, WooCommerce, Shopify, Salla, OpenCart, PrestaShop, Zid, Salesforce Commerce Cloud, ExpandCart, and others.

**Which countries and currencies does Tamara support?**
Saudi Arabia (SAR), the UAE (AED), Bahrain (BHD), Kuwait (KWD), and Oman (OMR). BHD, KWD, and OMR use three decimal places.

## Need a Tamara integration done right?

I build and debug Tamara integrations — direct API, plugins, and custom checkout flows — for stores across Egypt and the Gulf. [Get in touch](/contact-info) if you want it shipped correctly the first time, or clone the [open-source skill](https://github.com/karem505/tamara-payments-skill) and build it yourself.
```

**content_ar:**
```markdown
لو سبق وطلبت من مساعد برمجة بالذكاء الاصطناعي أن يربط لك بوابة دفع، فقد رأيته يخترع بثقة نقطة نهاية (endpoint) غير موجودة. مع معظم الـ APIs يكون هذا خطأً مزعجاً تكتشفه أثناء الاختبار. أمّا مع **تمارا** فالأمر أخطر: الـ API لديه قواعد توقيت صارمة وآلة حالات دقيقة لحالة الطلب، لذا قد يترك التخمين الواثق **طلبات حقيقية دون تسوية** — يشحن التاجر البضاعة ولا يستلم المال أبداً.

أنا أنفّذ تكاملات تمارا لعملاء في مصر والإمارات والسعودية، فجمعت كل ما أعرفه عن تنفيذها بشكل صحيح في **أداة [Claude](https://claude.com/claude-code) مجانية ومفتوحة المصدر**. يشرح هذا المقال كيف يعمل تكامل تمارا الصحيح فعلاً — وكيف تجعل الأداة أي وكيل ذكاء اصطناعي ينفّذه بشكل صحيح من أول مرة.

## ما هي تمارا؟

**تمارا (Tamara)** هي المنصة الرائدة للتسوّق والشراء الآن والدفع لاحقاً (**BNPL**) في الخليج — السعودية والإمارات والبحرين والكويت وعُمان. يقسّم المتسوّق المشترى إلى أقساط بدون فوائد ("قسّمها على 3"، "قسّمها على 4"، "ادفع الشهر القادم") بينما يُدفع للتاجر مقدّماً. وهي من أعلى خيارات الدفع تحويلاً للمبيعات في المنطقة، ولهذا تقدّمها تقريباً كل المتاجر الجادّة في الخليج.

## اختر مسار التكامل أولاً

قبل كتابة أي سطر كود، حدّد *كيف* ستضيف تمارا — فالوثائق تختلف لكل مسار:

- **الـ API المباشر** — كود مخصّص على خادمك؛ أكبر قدر من التحكّم.
- **إضافة متجر** — تثبيت بدون كود على متجر مستضاف: WooCommerce، Shopify، سلة، Magento، OpenCart، PrestaShop، زد، Salesforce Commerce Cloud، ExpandCart، وغيرها.
- **شريك قناة** — أضف تمارا عبر بوابة تستخدمها أصلاً (Checkout.com، PayTabs، Amazon Payment Services، CCAvenue…).
- **داخل المتجر / نقاط البيع** — المتاجر الفعلية، عبر رابط دفع بالـ SMS أو رمز QR للدفع بالمسح.
- **SDK للموبايل** — داخل تطبيق (Android، iOS، Flutter، React Native).

إن كنت على WooCommerce أو سلة، ثبّت الإضافة الرسمية وتكون قد أنجزت 90% من العمل. وبقية المقال عن **الـ API المباشر**، لأنه حيث تقع الأخطاء الدقيقة والمكلفة.

## "المسار الذهبي" لـ API تمارا

كل تكامل مباشر له الشكل نفسه. احفظه:

1. **أنشئ جلسة دفع** — `POST /checkout`. خزّن الـ `order_id` العائد ووجّه العميل إلى الـ `checkout_url`. تبدأ الحالة عند `new`.
2. **يدفع العميل** على صفحة تمارا المستضافة → تصبح الحالة `approved`.
3. **يصل webhook الـ `order_approved`** من خادم إلى خادم — هذا هو محفّزك الموثوق، لا إعادة توجيه المتصفح.
4. **Authorise (التفويض)** — `POST /orders/{order_id}/authorise` → الحالة `authorised` (عاملها كمدفوعة). هذه الخطوة **إلزامية** ما لم يكن التفويض التلقائي مفعّلاً.
5. **Capture (التحصيل) عند الشحن/التنفيذ** — `POST /payments/capture` (كلي أو جزئي) → `fully_captured` / `partially_captured`. التحصيل هو ما ينقل المال فعلاً إلى تسويتك.
6. **استرداد أو إلغاء** — استرد المبالغ المحصّلة (`/payments/refund`)؛ وألغِ أو خفّض الطلبات التي ما زالت `authorised` (`/orders/{order_id}/cancel`).

**البيئات والمصادقة:** التجريبية `https://api-sandbox.tamara.co`، والإنتاج `https://api.tamara.co`. صادِق كل طلب بـ `Authorization: Bearer {API_TOKEN}`. اختبر كل شيء على البيئة التجريبية قبل أن تطلب بيانات الإنتاج.

## الأخطاء التي تكسر التسوية بصمت

هذه هي التي تكلّف مالاً حقيقياً — وبالضبط ما يخطئ فيه مساعد الذكاء الاصطناعي حين يخمّن:

- **تخطّي الـ Authorise.** الطلب الذي يبقى عند `approved` لا يُحصَّل ولا يُسوَّى أبداً. شحنت ولم تُدفع لك. شغّل التفويض من webhook الـ `order_approved`.
- **الاعتماد على إعادة توجيه المتصفح.** قد تُفقد إعادة التوجيه (إغلاق التبويب، شبكة ضعيفة). الـ **webhook** هو مصدر الحقيقة — تحقّق منه واعمل عليه.
- **عدد خانات عشرية خاطئ.** يستخدم SAR و AED خانتين، لكن **BHD و KWD و OMR تستخدم 3**. أرسل دقّة خاطئة فيرفض الـ API الطلب بخطأ دولة/عملة.
- **عدم التحقّق من الـ webhook.** يحمل كل webhook رمز `tamaraToken` من نوع JWT (HS256). تحقّق منه بـ **Notification token** قبل التنفيذ، واجعل المعالجات idempotent — فقد تعيد تمارا إرسال الأحداث.
- **تفويت نوافذ التوقيت.** الدفع خلال 30 دقيقة، التفويض خلال 72 ساعة، التحصيل/الإلغاء خلال 90 يوماً. تجاوز النافذة وينتهي الطلب (`expired`).

## أداة Claude مجانية ومفتوحة المصدر لتمارا

بدل أن آمل أن يتذكّر النموذج كل ذلك، أعطيته الوثائق الحقيقية. والنتيجة **[أداة تمارا للمدفوعات على GitHub](https://github.com/karem505/tamara-payments-skill)** مفتوحة المصدر — نسخة كاملة بدون إنترنت من `docs.tamara.co`: **139 صفحة** (114 دليلاً + الـ **OpenAPI** الكامل لكل الـ **25 endpoint**)، مع ورقة مرجعية سريعة للـ base URLs والمصادقة وخريطة النقاط وتدفّق حالات الطلب والتحقّق من الـ webhooks.

ضعها في مجلّد أدوات Claude Code فتُفعَّل **تلقائياً** كلّما ذُكرت تمارا في مهمّة:

```bash
git clone https://github.com/karem505/tamara-payments-skill.git ~/.claude/skills/tamara-payments
```

والآن حين تسأل *"ادمج checkout تمارا في متجر WooCommerce"* أو *"لماذا علق طلب تمارا عند `approved`؟"*، يقرأ الوكيل وثائق تمارا الفعلية قبل كتابة الكود — بدل اختراع نقطة نهاية. تغطّي الأداة الـ API المباشر، وكل إضافات المتاجر، وشركاء القنوات، ونقاط البيع، وSDKs الموبايل، وودجت الترويج، عبر أسواق الخليج الخمسة.

## أسئلة شائعة

**كيف أدمج مدفوعات تمارا؟**
اختر المسار أولاً (API مباشر، إضافة، شريك قناة، نقاط بيع، أو SDK موبايل). لمسار الـ API: أنشئ checkout ← يدفع العميل ← webhook الـ `order_approved` ← Authorise ← Capture عند التنفيذ ← استرداد/إلغاء حسب الحاجة.

**ما هو الـ base URL لـ API تمارا؟**
التجريبي `https://api-sandbox.tamara.co` والإنتاج `https://api.tamara.co`. صادِق كل طلب بـ `Authorization: Bearer {API_TOKEN}`، واختبر على التجريبي أولاً.

**لماذا علق طلب تمارا عند `approved`؟**
لأنه لم يُستدعَ الـ **Authorise**. بعد webhook الـ `order_approved` يجب `POST /orders/{order_id}/authorise`؛ وإلا لا يُحصَّل الطلب ولا يُسوَّى أبداً.

**هل تدعم تمارا WooCommerce و Shopify و سلة؟**
نعم — تقدّم تمارا إضافات رسمية لـ Magento و WooCommerce و Shopify و سلة و OpenCart و PrestaShop و زد و Salesforce Commerce Cloud و ExpandCart وغيرها.

**ما الدول والعملات التي تدعمها تمارا؟**
السعودية (SAR)، الإمارات (AED)، البحرين (BHD)، الكويت (KWD)، وعُمان (OMR). وتستخدم BHD و KWD و OMR ثلاث خانات عشرية.

## تحتاج تكامل تمارا منفّذاً بشكل صحيح؟

أبني وأصحّح تكاملات تمارا — API مباشر، وإضافات، وتدفّقات checkout مخصّصة — لمتاجر في مصر والخليج. [تواصل معي](/contact-info) إن أردت تنفيذه بشكل صحيح من أول مرة، أو انسخ [الأداة مفتوحة المصدر](https://github.com/karem505/tamara-payments-skill) ونفّذها بنفسك.
```

## Summary

One bilingual `tutorial` post that explains correct Tamara integration and links the open-source repo (inbound backlink → helps the repo rank).
