import type { Metadata } from 'next'
import ServicePage, { ServicePageContent } from '@/components/ServicePage'
import {
  DigitalTransformationServiceJsonLd,
  ServiceFaqJsonLd,
  ServiceBreadcrumbJsonLd,
} from '@/components/JsonLd'

const BASE = 'https://aboelmakarem.pro/digital-transformation'

type SP = { searchParams: { lang?: string } }

export function generateMetadata({ searchParams }: SP): Metadata {
  const ar = searchParams?.lang === 'ar'
  const title = ar
    ? 'استشاري التحول الرقمي للشركات في مصر والخليج'
    : 'Digital Transformation Consultant — Egypt, UAE & KSA'
  const description = ar
    ? 'استشاري تحول رقمي مستقل يبني الأنظمة فعلياً: أتمتة العمليات، إعادة تصميم سير العمل بالذكاء الاصطناعي، وتحديث أنظمة ERP في مصر والإمارات والسعودية.'
    : 'Independent digital transformation consultant who builds the software. Process automation, AI workflow redesign & ERP modernization across Egypt, UAE & KSA.'
  const url = ar ? `${BASE}?lang=ar` : BASE
  const ogTitle = ar
    ? 'استشاري التحول الرقمي للشركات'
    : 'Digital Transformation That Ships Working Software'
  const ogImage = `https://aboelmakarem.pro/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent(ar ? 'التحول الرقمي' : 'Digital Transformation')}${ar ? '&lang=ar' : ''}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-US': BASE,
        'ar-EG': `${BASE}?lang=ar`,
        'x-default': BASE,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      locale: ar ? 'ar_EG' : 'en_US',
      alternateLocale: ar ? ['en_US'] : ['ar_EG'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

function getContent(ar: boolean): ServicePageContent {
  const t = (en: string, arabic: string) => (ar ? arabic : en)

  return {
    eyebrow: t('Digital Transformation Consulting', 'استشارات التحول الرقمي'),
    h1: t(
      'Digital Transformation That Ships Working Software — Not Slide Decks',
      'تحوّل رقمي يُسلِّم أنظمة تعمل فعلاً — لا مجرد عروض تقديمية'
    ),
    subtitle: t(
      'Abo-Elmakarem Shohoud is an independent digital transformation consultant who personally redesigns and automates your operations — and builds the software that runs them. He serves companies across Egypt, the UAE, and Saudi Arabia, in Arabic and English.',
      'ابوالمكارم شهود استشاري تحول رقمي مستقل يعيد تصميم عملياتك وأتمتتها بنفسه — ويبني الأنظمة التي تُشغّلها فعلياً. يخدم الشركات في مصر والإمارات والسعودية، بالعربية والإنجليزية.'
    ),
    ctaLabel: t('Book a Free Scoping Call', 'احجز جلسة تحديد نطاق مجانية'),
    ctaHref: '/contact-info',
    sections: [
      {
        h2: t(
          'What Is Digital Transformation (and How It Differs from Just Digitizing)',
          'ما هو التحول الرقمي (وكيف يختلف عن مجرد الرقمنة)'
        ),
        body: t(
          'Digital transformation redesigns how a company actually operates — its processes, data, and decisions — using software and AI, not just moving paper to screens. Digitization converts a manual step into a digital one; transformation rethinks the whole workflow so work moves faster, errors drop, and you gain real-time visibility. Abo-Elmakarem Shohoud delivers this independently for companies across Egypt, the UAE, and Saudi Arabia, typically replacing spreadsheets and disconnected tools with connected systems.',
          'التحول الرقمي يعيد تصميم طريقة عمل الشركة فعلياً — عملياتها وبياناتها وقراراتها — باستخدام البرمجيات والذكاء الاصطناعي، لا مجرد نقل الورق إلى الشاشة. الرقمنة تحوّل خطوة يدوية إلى رقمية، أما التحول فيعيد التفكير في سير العمل بأكمله ليصبح أسرع وأقل خطأً ويمنحك رؤية لحظية. يقدّم ابوالمكارم شهود هذه الخدمة بشكل مستقل للشركات في مصر والإمارات والسعودية، مستبدلاً غالباً ملفات الإكسل والأدوات المتفرقة بأنظمة متصلة.'
        ),
      },
      {
        h2: t(
          'Who This Is For — SMEs and Mid-Market Teams Stuck on Manual Processes',
          'لمن هذه الخدمة — الشركات الصغيرة والمتوسطة العالقة في العمليات اليدوية'
        ),
        body: t(
          'Digital transformation consulting is for founders, operations managers, and executives at SMEs and mid-market companies in Egypt and the Gulf whose teams still run critical work on spreadsheets, email threads, and aging systems. It suits any business feeling the cost of manual data entry, slow approvals, duplicated effort, and no single source of truth. Abo-Elmakarem Shohoud scopes engagements to fit a small company’s budget as readily as a larger one’s.',
          'استشارات التحول الرقمي موجّهة لمؤسسي الشركات ومديري العمليات والمدراء التنفيذيين في الشركات الصغيرة والمتوسطة في مصر والخليج، حيث ما تزال الفرق تدير أعمالها الحرجة عبر ملفات الإكسل ورسائل البريد والأنظمة القديمة. تناسب أي شركة تعاني من تكلفة الإدخال اليدوي للبيانات، وبطء الموافقات، وتكرار الجهد، وغياب مصدر موحّد للحقيقة. يصمّم ابوالمكارم شهود نطاق العمل ليناسب ميزانية الشركة الصغيرة بقدر ما يناسب الكبيرة.'
        ),
        bullets: [
          t('Operations run on spreadsheets, WhatsApp, and email instead of a real system.', 'العمليات تُدار عبر الإكسل وواتساب والبريد بدلاً من نظام حقيقي.'),
          t('Approvals, hand-offs, and reporting eat hours every week.', 'الموافقات والتسليمات والتقارير تستهلك ساعات كل أسبوع.'),
          t('Data lives in silos, so no one trusts the numbers.', 'البيانات موزّعة في جزر منفصلة، فلا أحد يثق بالأرقام.'),
          t('A legacy or off-the-shelf ERP no longer fits how you work.', 'نظام ERP قديم أو جاهز لم يعد يناسب طريقة عملكم.'),
          t('You want AI in your operations but don’t know where it actually helps.', 'تريدون الذكاء الاصطناعي في عملياتكم لكن لا تعرفون أين يفيد فعلاً.'),
        ],
      },
      {
        h2: t(
          'What I Deliver: Process Automation, AI Workflows & System Modernization',
          'ما الذي أقدّمه: أتمتة العمليات، سير عمل بالذكاء الاصطناعي، وتحديث الأنظمة'
        ),
        body: t(
          'A digital transformation engagement with Abo-Elmakarem Shohoud covers four things: mapping how your work really happens, automating the repetitive and error-prone steps, embedding AI where it genuinely adds value, and replacing scattered spreadsheets or legacy systems with connected software. Because he is a full-stack developer and business analyst, he both designs the solution and builds it — so you end up with a working system, not a recommendations report.',
          'يغطّي مشروع التحول الرقمي مع ابوالمكارم شهود أربعة أمور: رسم خريطة لطريقة سير عملك فعلياً، وأتمتة الخطوات المتكررة والمعرّضة للأخطاء، ودمج الذكاء الاصطناعي حيث يضيف قيمة حقيقية، واستبدال ملفات الإكسل المتفرقة أو الأنظمة القديمة بأنظمة برمجية متصلة. ولأنه مطوّر برمجيات متكامل ومحلل أعمال، فهو يصمّم الحل ويبنيه معاً — فينتهي بك الأمر إلى نظام يعمل، لا تقرير توصيات.'
        ),
        bullets: [
          t('Business process automation — automate data entry, approvals, hand-offs, and reporting.', 'أتمتة العمليات الإدارية — أتمتة إدخال البيانات والموافقات والتسليمات والتقارير.'),
          t('AI-powered process redesign — document handling, drafting, classification, and decision support.', 'إعادة تصميم العمليات بالذكاء الاصطناعي — معالجة المستندات والصياغة والتصنيف ودعم القرار.'),
          t('Spreadsheet-to-software — replace fragile Excel workflows with one connected system.', 'من الإكسل إلى نظام برمجي — استبدال سير عمل الإكسل الهش بنظام واحد متصل.'),
          t('ERP & legacy modernization — upgrade or replace systems without halting operations.', 'تحديث أنظمة ERP والأنظمة القديمة — ترقية أو استبدال الأنظمة دون توقّف العمل.'),
          t('Custom internal tools — dashboards and apps built around how your team actually works.', 'أدوات داخلية مخصّصة — لوحات تحكم وتطبيقات مبنية على طريقة عمل فريقك الحقيقية.'),
        ],
      },
      {
        h2: t(
          'How a Digital Transformation Engagement Works — My Phased Roadmap',
          'كيف تسير رحلة التحول الرقمي معي — خارطة طريق على مراحل'
        ),
        body: t(
          'Every engagement runs in phases so you fund one measurable outcome at a time, never a large multi-year commitment up front. Abo-Elmakarem Shohoud starts with a short diagnostic of your current operations, then delivers a prioritized roadmap that picks the first process worth automating for a fast, visible win. Each phase ships a working improvement, with the team trained and change managed, so day-to-day work is never disrupted.',
          'يسير كل مشروع على مراحل بحيث تموّل نتيجة واحدة قابلة للقياس في كل مرة، دون التزام كبير ممتد لسنوات منذ البداية. يبدأ ابوالمكارم شهود بدراسة تشخيصية قصيرة لعملياتك الحالية، ثم يقدّم خارطة طريق مرتّبة بالأولويات تختار أول عملية تستحق الأتمتة لتحقيق مكسب سريع وملموس. كل مرحلة تُسلّم تحسيناً يعمل فعلاً، مع تدريب الفريق وإدارة التغيير، حتى لا يتعطّل العمل اليومي.'
        ),
        ordered: true,
        bullets: [
          t('Diagnostic — map current workflows, data, and pain points.', 'التشخيص — رسم خريطة سير العمل والبيانات ونقاط الألم الحالية.'),
          t('Roadmap — prioritize what to automate first, with clear outcomes.', 'خارطة الطريق — ترتيب ما يجب أتمتته أولاً، بنتائج واضحة.'),
          t('Build & automate — ship the system or automation in a contained phase.', 'البناء والأتمتة — تسليم النظام أو الأتمتة في مرحلة محدّدة النطاق.'),
          t('Train & adopt — onboard the team and manage the change.', 'التدريب والتبنّي — تأهيل الفريق وإدارة التغيير.'),
          t('Measure & expand — track results, then move to the next priority.', 'القياس والتوسّع — متابعة النتائج ثم الانتقال للأولوية التالية.'),
        ],
      },
      {
        h2: t(
          'Why Work With an Independent Consultant Instead of an Agency',
          'لماذا تختار استشارياً مستقلاً بدلاً من شركة'
        ),
        body: t(
          'An independent digital transformation consultant gives you senior, hands-on attention and direct accountability: the same person who plans the work also builds and ships it. Agencies add account managers, layers, and overhead that slow delivery and raise cost. For SMEs and mid-market firms that want practical results fast, Abo-Elmakarem Shohoud — who both advises and engineers — is usually faster and more cost-effective than handing the project to a multi-person agency that only advises.',
          'الاستشاري المستقل للتحول الرقمي يمنحك اهتماماً مباشراً وخبرة عملية ومسؤولية واضحة: فالشخص نفسه الذي يخطّط للعمل هو من يبنيه ويُسلّمه. أما الشركات فتضيف مديري حسابات وطبقات إدارية وتكاليف إضافية تُبطئ التنفيذ وترفع السعر. للشركات الصغيرة والمتوسطة التي تريد نتائج عملية سريعة، يكون ابوالمكارم شهود — الذي يستشير ويبني معاً — أسرع وأوفر غالباً من إسناد المشروع لشركة تكتفي بتقديم النصيحة.'
        ),
      },
      {
        h2: t(
          'Why Work With Karem — A Practitioner Who Builds Production AI',
          'لماذا تعمل مع كارم — ممارس يبني أنظمة ذكاء اصطناعي حقيقية'
        ),
        body: t(
          'Abo-Elmakarem Shohoud (ابوالمكارم شهود) is a Full-Stack Developer, DevOps Engineer, Scrum Master, and Business Analyst based in Cairo, Egypt. He has shipped production, AI-powered SaaS — Tornix.ai, Oravex.app, and Costra.ailigent.ai — for clients across Egypt, the UAE, and Saudi Arabia. That means your transformation is led by someone who has actually built the kind of connected, AI-driven systems he recommends, in both Arabic and English, rather than someone who only writes strategy.',
          'ابوالمكارم شهود مطوّر برمجيات متكامل ومهندس DevOps وScrum Master ومحلل أعمال، مقرّه القاهرة في مصر. أطلق منتجات SaaS مدعومة بالذكاء الاصطناعي وصلت إلى مرحلة الإنتاج — Tornix.ai وOravex.app وCostra.ailigent.ai — لعملاء في مصر والإمارات والسعودية. هذا يعني أن تحوّلك الرقمي يقوده شخص بنى فعلاً الأنظمة المتصلة المدعومة بالذكاء الاصطناعي التي يوصي بها، بالعربية والإنجليزية، لا مجرد شخص يكتب الاستراتيجيات.'
        ),
        bullets: [
          t('Builds the software himself — full-stack engineer, not just an advisor.', 'يبني البرمجيات بنفسه — مهندس متكامل، لا مجرد مستشار.'),
          t('Bilingual delivery in fluent Arabic and English.', 'تنفيذ ثنائي اللغة بعربية وإنجليزية سليمتين.'),
          t('Serves Egypt, the UAE, and Saudi Arabia, on-site or remote.', 'يخدم مصر والإمارات والسعودية، حضورياً أو عن بُعد.'),
          t('Aligns transformation with regional goals like Saudi Vision 2030.', 'يربط التحول الرقمي بأهداف المنطقة مثل رؤية السعودية 2030.'),
          t('Cross-links with hands-on AI training so your team can run the new systems.', 'يتكامل مع تدريب عملي على الذكاء الاصطناعي ليتمكّن فريقك من تشغيل الأنظمة الجديدة.'),
        ],
      },
      {
        h2: t('How to Start Your Digital Transformation', 'كيف تبدأ التحول الرقمي لشركتك'),
        body: t(
          'Start with a free scoping call. Abo-Elmakarem Shohoud reviews your current operations, identifies the manual or costly processes worth tackling first, and proposes a phased plan with a clear first outcome — no obligation and no fixed package forced on you. From there you can begin with a low-risk diagnostic and roadmap, then decide how far and how fast to go based on real results.',
          'ابدأ بجلسة مجانية لتحديد النطاق. يراجع ابوالمكارم شهود عملياتك الحالية، ويحدّد العمليات اليدوية أو المكلفة الأجدر بالمعالجة أولاً، ويقترح خطة على مراحل بنتيجة أولى واضحة — دون التزام ودون فرض باقة ثابتة عليك. من هناك يمكنك البدء بدراسة تشخيصية وخارطة طريق منخفضة المخاطر، ثم تقرّر إلى أي مدى وبأي سرعة تمضي بناءً على نتائج فعلية.'
        ),
      },
    ],
    faqHeading: t('Frequently Asked Questions', 'الأسئلة الشائعة'),
    faq: [
      {
        q: t('What is digital transformation, and how is it different from digitizing?', 'ما هو التحول الرقمي وكيف يختلف عن الرقمنة؟'),
        a: t(
          'Digital transformation redesigns how a business operates — its processes, data, and decisions — using software and AI, not just converting paper to digital files. Digitization turns one manual step digital; transformation rethinks the entire workflow so work moves faster, errors fall, and you gain real-time visibility. It usually replaces spreadsheets and siloed tools with one connected system.',
          'التحول الرقمي يعيد تصميم طريقة عمل الشركة — عملياتها وبياناتها وقراراتها — باستخدام البرمجيات والذكاء الاصطناعي، لا مجرد تحويل الورق إلى ملفات رقمية. الرقمنة تحوّل خطوة يدوية واحدة إلى رقمية، أما التحول فيعيد التفكير في سير العمل كله ليصبح أسرع وأقل خطأً ويمنحك رؤية لحظية، مستبدلاً غالباً ملفات الإكسل والأدوات المنفصلة بنظام واحد متصل.'
        ),
      },
      {
        q: t('How much does digital transformation consulting cost for an SME?', 'كم تكلفة استشارات التحول الرقمي للشركات الصغيرة والمتوسطة؟'),
        a: t(
          'Cost depends entirely on scope. A focused diagnostic and roadmap is a small, fixed engagement; automating one department or replacing a spreadsheet process is a contained project; a full operations overhaul costs more and runs in phases. Abo-Elmakarem Shohoud scopes work in stages so you fund one measurable outcome at a time rather than a large upfront budget. No single price fits every company.',
          'تعتمد التكلفة كلياً على نطاق المشروع. الدراسة التشخيصية وخارطة الطريق مشروع صغير محدّد التكلفة، وأتمتة قسم واحد أو استبدال عملية إكسل مشروع محدود، أما التحول الشامل فأعلى تكلفة ويُنفَّذ على مراحل. يصمّم ابوالمكارم شهود العمل على مراحل بحيث تموّل نتيجة واحدة قابلة للقياس في كل مرة بدلاً من ميزانية كبيرة مقدّماً. لا يوجد سعر واحد يناسب جميع الشركات.'
        ),
      },
      {
        q: t('Should I hire an independent consultant or a large agency?', 'هل أوظّف استشارياً مستقلاً أم شركة كبيرة؟'),
        a: t(
          'An independent consultant gives you senior, hands-on attention, lower overhead, and direct accountability — the same person who plans the work also builds and ships it. Agencies add account managers, layers, and cost. For SMEs and mid-market firms wanting practical results fast, an experienced independent consultant who can both advise and engineer is usually faster and more cost-effective than an agency that only advises.',
          'الاستشاري المستقل يمنحك خبرة عملية مباشرة وتكاليف أقل ومسؤولية واضحة — فالشخص نفسه الذي يخطّط هو من يبني ويُسلّم. أما الشركات فتضيف مديري حسابات وطبقات إدارية وتكلفة أعلى. للشركات الصغيرة والمتوسطة التي تريد نتائج عملية سريعة، يكون الاستشاري المستقل القادر على الاستشارة والتنفيذ معاً أسرع وأوفر غالباً من شركة تكتفي بالنصيحة.'
        ),
      },
      {
        q: t('How do you automate manual or spreadsheet-based processes?', 'كيف تتم أتمتة العمليات اليدوية أو القائمة على الإكسل؟'),
        a: t(
          'Abo-Elmakarem Shohoud starts by mapping how the work really happens, then identifies the repetitive, error-prone steps. He replaces scattered spreadsheets with one connected system, automates the hand-offs, and adds AI where it genuinely helps — data entry, document handling, approvals, and reporting. The result is fewer manual steps, faster cycles, and real-time visibility, rolled out in phases so the team adapts smoothly.',
          'يبدأ ابوالمكارم شهود برسم خريطة لطريقة سير العمل فعلياً، ثم يحدّد الخطوات المتكررة والمعرّضة للأخطاء. يستبدل ملفات الإكسل المتفرقة بنظام واحد متصل، ويؤتمت التسليمات، ويضيف الذكاء الاصطناعي حيث يفيد فعلاً — إدخال البيانات، ومعالجة المستندات، والموافقات، والتقارير. النتيجة خطوات يدوية أقل، ودورات أسرع، ورؤية لحظية، تُطبَّق على مراحل ليتأقلم الفريق بسلاسة.'
        ),
      },
      {
        q: t('How does AI fit into digital transformation?', 'كيف يندمج الذكاء الاصطناعي في التحول الرقمي؟'),
        a: t(
          'AI turns digital transformation from simple digitization into systems that can read, draft, classify, and support decisions. In practice it automates data entry, document processing, approvals, reporting, and customer responses — cutting manual effort and errors while speeding work up. Abo-Elmakarem Shohoud adds AI only where it creates real value for your business, not technology for its own sake, and builds it into the workflow your team already uses.',
          'الذكاء الاصطناعي يحوّل التحول الرقمي من مجرد رقمنة إلى أنظمة قادرة على القراءة والصياغة والتصنيف ودعم القرار. عملياً يؤتمت إدخال البيانات، ومعالجة المستندات، والموافقات، والتقارير، والردود على العملاء — فيقلّل الجهد اليدوي والأخطاء ويسرّع الإنجاز. يضيف ابوالمكارم شهود الذكاء الاصطناعي فقط حيث يصنع قيمة حقيقية لشركتك، لا التقنية لذاتها، ويبنيه داخل سير العمل الذي يستخدمه فريقك بالفعل.'
        ),
      },
      {
        q: t('Where do you provide digital transformation services?', 'أين تقدّم خدمات التحول الرقمي؟'),
        a: t(
          'Abo-Elmakarem Shohoud provides digital transformation consulting for companies across Egypt (Cairo), the UAE (Dubai, Abu Dhabi), and Saudi Arabia (Riyadh, Jeddah), delivered on-site or remotely. He works in both Arabic and English and aligns engagements with regional digital-economy goals such as Saudi Vision 2030, making him a practical fit for SMEs and mid-market firms across the Gulf and Egypt.',
          'يقدّم ابوالمكارم شهود استشارات التحول الرقمي للشركات في مصر (القاهرة) والإمارات (دبي وأبوظبي) والسعودية (الرياض وجدة)، حضورياً أو عن بُعد. يعمل بالعربية والإنجليزية، ويربط مشاريعه بأهداف الاقتصاد الرقمي في المنطقة مثل رؤية السعودية 2030، ما يجعله خياراً عملياً للشركات الصغيرة والمتوسطة في الخليج ومصر.'
        ),
      },
    ],
    closingHeading: t('Ready to Modernize How Your Company Works?', 'جاهز لتحديث طريقة عمل شركتك؟'),
    closingBody: t(
      'Book a free scoping call with Abo-Elmakarem Shohoud. He’ll review your current operations, point to the first process worth automating, and propose a phased plan with a clear first outcome — built by the same person who advises it. Serving Egypt, the UAE, and Saudi Arabia, in Arabic and English.',
      'احجز جلسة مجانية لتحديد النطاق مع ابوالمكارم شهود. سيراجع عملياتك الحالية، ويشير إلى أول عملية تستحق الأتمتة، ويقترح خطة على مراحل بنتيجة أولى واضحة — يبنيها الشخص نفسه الذي يستشيرها. خدمة في مصر والإمارات والسعودية، بالعربية والإنجليزية.'
    ),
    closingButton: t('Book a Free Scoping Call', 'احجز جلسة مجانية'),
    closingHref: '/contact-info',
  }
}

export default function DigitalTransformationPage({ searchParams }: SP) {
  const ar = searchParams?.lang === 'ar'
  const content = getContent(ar)

  return (
    <ServicePage
      ar={ar}
      basePath="/digital-transformation"
      headerTitle={ar ? 'التحول الرقمي' : 'Digital Transformation'}
      content={content}
      schema={
        <>
          <DigitalTransformationServiceJsonLd ar={ar} />
          <ServiceFaqJsonLd id="https://aboelmakarem.pro/digital-transformation#faq" faq={content.faq} />
          <ServiceBreadcrumbJsonLd
            items={[
              { name: ar ? 'الرئيسية' : 'Home', url: 'https://aboelmakarem.pro' },
              {
                name: ar ? 'التحول الرقمي' : 'Digital Transformation',
                url: 'https://aboelmakarem.pro/digital-transformation',
              },
            ]}
          />
        </>
      }
    />
  )
}
