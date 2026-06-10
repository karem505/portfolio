import type { Metadata } from 'next'
import ServicePage, { ServicePageContent } from '@/components/ServicePage'
import { getServiceClusterPosts } from '@/lib/blog'
import {
  AiTrainingServiceJsonLd,
  AiTrainingCourseJsonLd,
  ServiceFaqJsonLd,
  ServiceBreadcrumbJsonLd,
} from '@/components/JsonLd'

const BASE = 'https://aboelmakarem.pro/ai-training'

// ISR: revalidate hourly so the related-posts cluster stays fresh.
export const revalidate = 3600

type SP = { searchParams: { lang?: string } }

export function generateMetadata({ searchParams }: SP): Metadata {
  const ar = searchParams?.lang === 'ar'
  const title = ar
    ? 'تدريب الذكاء الاصطناعي للموظفين والمدراء التنفيذيين'
    : 'Corporate AI Training for Employees & Executives | MENA'
  const description = ar
    ? 'تدريب احترافي على الذكاء الاصطناعي للموظفين والمدراء التنفيذيين في مصر والإمارات والسعودية. ChatGPT وClaude وهندسة الأوامر، حضورياً أو عن بُعد، بالعربية أو الإنجليزية.'
    : 'Hands-on corporate AI training for employees & executives across Egypt, the UAE & Saudi Arabia. ChatGPT, Claude & prompt engineering. Arabic or English.'
  const url = ar ? `${BASE}?lang=ar` : BASE
  const ogTitle = ar
    ? 'تدريب الذكاء الاصطناعي للموظفين والمدراء التنفيذيين'
    : 'Professional AI Training for Employees & Executives'
  const ogImage = `https://aboelmakarem.pro/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent(ar ? 'تدريب الذكاء الاصطناعي' : 'AI Training')}${ar ? '&lang=ar' : ''}`

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
    eyebrow: t('AI Training for Teams', 'تدريب الذكاء الاصطناعي للفرق'),
    h1: t(
      'Professional AI Training for Employees & Executives',
      'تدريب احترافي على الذكاء الاصطناعي للموظفين والمدراء التنفيذيين'
    ),
    subtitle: t(
      'Hands-on, practical AI training that teaches your team to use real tools — ChatGPT, Claude, prompt engineering and agentic automation — to do everyday work faster. Delivered personally by Abo-Elmakarem Shohoud, on-site or live online across Egypt, the UAE and Saudi Arabia, in Arabic or English.',
      'تدريب عملي وتطبيقي يُمكّن فريقك من استخدام أدوات الذكاء الاصطناعي الحقيقية — ChatGPT وClaude وهندسة الأوامر والأتمتة الذكية — لإنجاز العمل اليومي بشكل أسرع. يقدّمه ابوالمكارم شهود شخصياً، حضورياً أو أونلاين، في مصر والإمارات والسعودية، باللغة العربية أو الإنجليزية.'
    ),
    ctaLabel: t('Book a Training Session', 'احجز جلسة تدريبية'),
    ctaHref: '/contact-info',
    sections: [
      {
        h2: t('What Is Corporate AI Training?', 'ما هو تدريب الذكاء الاصطناعي للشركات؟'),
        body: t(
          'Corporate AI training is hands-on, instructor-led upskilling that teaches a company’s employees and executives to use real AI tools — ChatGPT, Claude, generative AI and agentic automation — on their actual daily tasks. It focuses on practical prompt engineering and live workflows, not abstract theory or coding. Abo-Elmakarem Shohoud delivers it personally for teams across Egypt, the UAE and Saudi Arabia, in Arabic or English, on-site or online.',
          'تدريب الذكاء الاصطناعي للشركات هو برنامج عملي بقيادة مدرّب يُمكّن موظفي الشركة وقياداتها من استخدام أدوات الذكاء الاصطناعي الحقيقية — ChatGPT وClaude والذكاء الاصطناعي التوليدي والأتمتة الذكية — في مهامهم اليومية الفعلية. يركّز على هندسة الأوامر العملية وسير العمل المباشر، لا على النظريات المجرّدة أو البرمجة. يقدّمه ابوالمكارم شهود شخصياً للفرق في مصر والإمارات والسعودية، بالعربية أو الإنجليزية، حضورياً أو عن بُعد.'
        ),
      },
      {
        h2: t(
          'Two Tracks: AI Training for Employees and for Executives',
          'مساران: تدريب للموظفين وتدريب للمدراء التنفيذيين'
        ),
        body: t(
          'AI training works best when it is split by role, so each group learns what actually changes their day. Employee tracks are workflow-first — writing, analysis, reporting, customer replies and automating repetitive tasks with ChatGPT and Claude. Executive and leadership tracks focus on AI strategy, evaluating use cases, governance and decision-making. Both run as one coordinated program so the whole organization adopts AI consistently, not in isolated pockets.',
          'يحقق تدريب الذكاء الاصطناعي أفضل أثره عندما يُقسَّم حسب الدور، فيتعلّم كل فريق ما يغيّر يومه فعلاً. مسار الموظفين يبدأ من سير العمل — الكتابة والتحليل والتقارير والردود على العملاء وأتمتة المهام المتكررة بأدوات ChatGPT وClaude. أما مسار المدراء والقادة التنفيذيين فيركّز على استراتيجية الذكاء الاصطناعي، وتقييم حالات الاستخدام، والحوكمة، واتخاذ القرار. يسير المساران ضمن برنامج واحد منسّق ليتبنّى الذكاء الاصطناعي على مستوى المؤسسة كلها بشكل موحّد.'
        ),
        bullets: [
          t(
            'For your team (employees): prompt engineering, drafting and editing, summarizing documents, data analysis, faster customer replies, automating repetitive work.',
            'لفريقك (الموظفون): هندسة الأوامر، الكتابة والتحرير، تلخيص المستندات، تحليل البيانات، تسريع الردود على العملاء، وأتمتة الأعمال المتكررة.'
          ),
          t(
            'For executives & leaders: spotting high-value AI use cases, setting policy and governance, evaluating risk, and a working prompt set for research, communication and decision support.',
            'للمدراء والقادة التنفيذيين: اكتشاف حالات الاستخدام عالية القيمة، وضع السياسات والحوكمة، تقييم المخاطر، ومجموعة أوامر جاهزة للبحث والتواصل ودعم القرار.'
          ),
          t(
            'Per department: examples tailored to marketing, sales, HR, finance, operations and admin.',
            'لكل قسم: أمثلة مصمّمة للتسويق والمبيعات والموارد البشرية والمالية والعمليات والإدارة.'
          ),
          t(
            'One coordinated rollout: so AI adoption is consistent across the whole organization.',
            'تطبيق واحد منسّق: ليكون تبنّي الذكاء الاصطناعي موحّداً عبر المؤسسة كلها.'
          ),
        ],
      },
      {
        h2: t(
          'What the Training Covers — Generative AI, Prompt Engineering & Automation',
          'ما الذي يغطّيه التدريب — الذكاء الاصطناعي التوليدي وهندسة الأوامر والأتمتة'
        ),
        body: t(
          'The training covers the AI skills that speed up real work: prompt engineering with ChatGPT and Claude, generative AI for writing and analysis, agentic automation and business process automation for repetitive workflows, and safe, sensible use of AI at work. There is no coding. Every participant practises on their own real tasks during the session and leaves with a tested prompt library they can use the same day. Examples are tailored to your industry and your team’s day-to-day work.',
          'يغطّي التدريب مهارات الذكاء الاصطناعي التي تسرّع العمل الحقيقي: هندسة الأوامر (البرومبت) باستخدام ChatGPT وClaude، والذكاء الاصطناعي التوليدي للكتابة والتحليل، والأتمتة الذكية وأتمتة العمليات للمهام المتكررة، والاستخدام الآمن والمسؤول للذكاء الاصطناعي في العمل. لا برمجة على الإطلاق. يتدرّب كل مشارك على مهامه الحقيقية أثناء الجلسة، ويخرج بمكتبة أوامر مُجرَّبة يمكنه استخدامها في اليوم نفسه. والأمثلة مصمَّمة حسب قطاع شركتك وعمل فريقك اليومي.'
        ),
        bullets: [
          t('Prompt engineering: writing clear instructions that get accurate, reliable results.', 'هندسة الأوامر: صياغة تعليمات واضحة تعطي نتائج دقيقة وموثوقة.'),
          t('Generative AI for drafting, editing, summarizing and analysis.', 'الذكاء الاصطناعي التوليدي للكتابة والتحرير والتلخيص والتحليل.'),
          t('ChatGPT and Claude side by side — when to use which.', 'ChatGPT وClaude جنباً إلى جنب — ومتى تستخدم كلاً منهما.'),
          t('Agentic AI and business process automation for repetitive, multi-step tasks.', 'الذكاء الاصطناعي الوكيلي (Agentic) وأتمتة العمليات للمهام المتكررة متعددة الخطوات.'),
          t('A practical, tested prompt library each participant keeps.', 'مكتبة أوامر عملية ومُجرَّبة يحتفظ بها كل مشارك.'),
          t('Responsible, safe use of AI with company data.', 'الاستخدام المسؤول والآمن للذكاء الاصطناعي مع بيانات الشركة.'),
        ],
      },
      {
        h2: t(
          'Delivery: On-Site & Live Online Across Egypt, the UAE & Saudi Arabia',
          'طريقة التقديم: حضورياً وأونلاين في مصر والإمارات والسعودية'
        ),
        body: t(
          'Training is delivered on-site at your offices across the UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, Jeddah) and Egypt (Cairo), or live online for distributed teams. Sessions run in Arabic or English, with examples tailored to your industry. Formats range from a focused half-day workshop of three to four hours, which builds immediate momentum on two or three high-value tasks, to multi-session programs spread over several weeks for deeper, lasting adoption.',
          'يُقدَّم التدريب حضورياً في مقر شركتك عبر الإمارات (دبي وأبوظبي) والسعودية (الرياض وجدة) ومصر (القاهرة)، أو أونلاين مباشرةً للفرق الموزّعة. تُقدَّم الجلسات بالعربية أو الإنجليزية، مع أمثلة مصمَّمة حسب قطاعك. وتتراوح الصيغ بين ورشة عمل مركّزة لنصف يوم من ثلاث إلى أربع ساعات تبني زخماً فورياً على مهمتين أو ثلاث عالية القيمة، وبرامج متعددة الجلسات تمتد على أسابيع لتحقيق تبنٍّ أعمق وأطول أثراً.'
        ),
        bullets: [
          t('On-site at your offices: UAE, Saudi Arabia, Egypt.', 'حضورياً في مقر شركتك: الإمارات والسعودية ومصر.'),
          t('Live online for distributed and remote teams.', 'أونلاين مباشرةً للفرق الموزّعة وعن بُعد.'),
          t('Delivered in Arabic or English.', 'بالعربية أو الإنجليزية.'),
          t('Half-day workshop (3–4 hours) or multi-week program.', 'ورشة نصف يوم (3–4 ساعات) أو برنامج يمتد على أسابيع.'),
          t('Content customized to your industry and real tasks.', 'محتوى مخصّص لقطاعك ومهامك الحقيقية.'),
        ],
      },
      {
        h2: t(
          'Outcomes — Practical AI Skills That Speed Up Real Work',
          'النتائج — مهارات ذكاء اصطناعي عملية تسرّع العمل الحقيقي'
        ),
        body: t(
          'The goal of the training is measurable time saved on real work, not certificates for theory. After the program, employees handle repetitive tasks — drafting, summarizing, reporting, replying — faster and with less effort, and executives can evaluate AI use cases and set direction with confidence. Each participant leaves with concrete skills and a tested prompt library applied to a task that matters to your business, so the learning translates into day-to-day productivity from week one.',
          'هدف التدريب هو توفير وقت قابل للقياس في العمل الحقيقي، لا شهادات في النظريات. بعد البرنامج، يُنجز الموظفون المهام المتكررة — الصياغة والتلخيص والتقارير والردود — بشكل أسرع وبجهد أقل، ويصبح المدراء قادرين على تقييم حالات استخدام الذكاء الاصطناعي ورسم الاتجاه بثقة. يخرج كل مشارك بمهارات ملموسة ومكتبة أوامر مُجرَّبة مطبَّقة على مهمة تهمّ شركتك فعلاً، لتتحوّل المعرفة إلى إنتاجية يومية من الأسبوع الأول.'
        ),
      },
      {
        h2: t(
          'Why Train with Karem — A Practitioner Who Ships AI Products',
          'لماذا التدريب مع كارم — ممارس يبني منتجات ذكاء اصطناعي حقيقية'
        ),
        body: t(
          'Abo-Elmakarem Shohoud is an independent corporate AI trainer and a working full-stack developer who ships AI-powered SaaS — Tornix.ai, Oravex.app and Costra.net. He teaches what genuinely works in production, not what reads well in a slide deck. With a background as a Full-Stack Developer, DevOps Engineer, Scrum Master and Business Analyst, and as a native Arabic speaker based in Cairo, he trains teams across Egypt and the Gulf in fluent Arabic or English.',
          'ابوالمكارم شهود مدرّب ذكاء اصطناعي مستقل للشركات، وفي الوقت نفسه مطوّر full-stack يبني ويُطلق منتجات SaaS مدعومة بالذكاء الاصطناعي — Tornix.ai وOravex.app وCostra.net. يُدرّب ما ينجح فعلاً في بيئة الإنتاج، لا ما يبدو جميلاً في شريحة عرض. بخلفيته كمطوّر full-stack ومهندس DevOps وScrum Master ومحلل أعمال، وكونه ناطقاً أصلياً بالعربية ومقيماً في القاهرة، يدرّب الفرق في مصر والخليج بالعربية الفصيحة أو الإنجليزية.'
        ),
        bullets: [
          t('A practitioner who builds production AI, not just a course author.', 'ممارس يبني ذكاءً اصطناعياً في بيئة الإنتاج، لا مجرّد مؤلّف دورة.'),
          t('Native Arabic and fluent English — removes the language barrier that slows adoption.', 'ناطق أصلي بالعربية ويتقن الإنجليزية — يزيل حاجز اللغة الذي يبطئ التبنّي.'),
          t('Real engineering background: full-stack, DevOps, Scrum, business analysis.', 'خلفية هندسية حقيقية: full-stack وDevOps وScrum وتحليل أعمال.'),
          t('Independent and hands-on — you work directly with the trainer, start to finish.', 'مستقل وعملي — تتعامل مباشرةً مع المدرّب من البداية إلى النهاية.'),
          t('Aligned with regional digital-transformation goals such as Saudi Vision 2030 and the UAE’s national AI agenda.', 'منسجم مع أهداف التحول الرقمي في المنطقة مثل رؤية السعودية 2030 والأجندة الوطنية للذكاء الاصطناعي في الإمارات.'),
        ],
      },
      {
        h2: t(
          'How the Program Works — From Scoping to Follow-Up',
          'كيف يسير البرنامج — من تحديد النطاق إلى المتابعة'
        ),
        body: t(
          'Getting started begins with a short scoping conversation to identify the daily tasks that consume the most time in your team. From there, Karem designs a workshop that trains employees and executives on the right AI tools for their real work, delivers it on-site or online in Arabic or English, and follows up to reinforce adoption. The right length and format depend on team size, current AI skill level and your goals — scoped with you before booking.',
          'تبدأ الرحلة بجلسة قصيرة لتحديد النطاق نكتشف فيها المهام اليومية الأكثر استهلاكاً للوقت في فريقك. بناءً عليها، يصمّم كارم ورشة تُدرّب الموظفين والمدراء على أدوات الذكاء الاصطناعي المناسبة لعملهم الفعلي، ويقدّمها حضورياً أو أونلاين بالعربية أو الإنجليزية، مع متابعة بعد التدريب لترسيخ الاستخدام. ويعتمد الطول والصيغة المناسبان على حجم الفريق ومستواه الحالي في الذكاء الاصطناعي وأهدافك — ويُحدَّدان معك قبل الحجز.'
        ),
        ordered: true,
        bullets: [
          t('Scoping call — identify the highest-value, most time-consuming tasks.', 'جلسة تحديد النطاق — اكتشاف المهام الأعلى قيمة والأكثر استهلاكاً للوقت.'),
          t('Custom design — workshop built around your team’s real workflows.', 'تصميم مخصّص — ورشة مبنية على سير عمل فريقك الحقيقي.'),
          t('Delivery — on-site or live online, in Arabic or English.', 'التقديم — حضورياً أو أونلاين، بالعربية أو الإنجليزية.'),
          t('Follow-up — reinforce adoption and answer questions after the session.', 'المتابعة — ترسيخ التبنّي والإجابة عن الأسئلة بعد الجلسة.'),
        ],
      },
    ],
    faqHeading: t('Frequently Asked Questions', 'الأسئلة الشائعة'),
    faq: [
      {
        q: t('What is corporate AI training and who is it for?', 'ما هو تدريب الذكاء الاصطناعي للشركات ولمن هو موجَّه؟'),
        a: t(
          'Corporate AI training is hands-on, instructor-led upskilling that teaches your staff to use real AI tools — ChatGPT, Claude, generative AI and agentic automation — on their actual daily tasks. It is for both rank-and-file employees who want to work faster and executives who set AI strategy. Sessions focus on practical prompt engineering and live workflows, not abstract theory or coding.',
          'تدريب الذكاء الاصطناعي للشركات هو برنامج عملي بقيادة مدرّب يُعلّم موظفيك استخدام أدوات الذكاء الاصطناعي الحقيقية — ChatGPT وClaude والذكاء الاصطناعي التوليدي والأتمتة الذكية — في مهامهم اليومية. وهو موجَّه للموظفين الراغبين في العمل بشكل أسرع وللمدراء التنفيذيين الذين يرسمون استراتيجية الذكاء الاصطناعي. تركّز الجلسات على هندسة الأوامر العملية وسير العمل المباشر، لا على النظريات المجرّدة أو البرمجة.'
        ),
      },
      {
        q: t('Do you offer separate AI training for employees and for executives?', 'هل تقدّم تدريباً منفصلاً للموظفين وآخر للمدراء التنفيذيين؟'),
        a: t(
          'Yes. Employee tracks are workflow-first: writing, analysis, reporting, customer replies and automating repetitive tasks with ChatGPT and Claude. Executive and leadership tracks focus on AI strategy, evaluating use cases, governance and decision-making, plus a working set of prompts for research and communication. Both run as one coordinated program so the whole organization adopts AI consistently.',
          'نعم. مسار الموظفين يبدأ من سير العمل: الكتابة والتحليل والتقارير والردود على العملاء وأتمتة المهام المتكررة بأدوات ChatGPT وClaude. أما مسار المدراء والقادة التنفيذيين فيركّز على استراتيجية الذكاء الاصطناعي، وتقييم حالات الاستخدام، والحوكمة، واتخاذ القرار، إضافةً إلى مجموعة أوامر جاهزة للبحث والتواصل. ويسير المساران ضمن برنامج واحد منسّق ليتبنّى الذكاء الاصطناعي على مستوى المؤسسة كلها بشكل موحّد.'
        ),
      },
      {
        q: t('Is the training available on-site in the UAE, Saudi Arabia and Egypt?', 'هل التدريب متاح حضورياً في الإمارات والسعودية ومصر؟'),
        a: t(
          'Yes. Karem delivers AI training on-site at your offices across the UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, Jeddah) and Egypt (Cairo), as well as live online for distributed teams. Sessions can be delivered in English or Arabic, with examples tailored to your industry and your team’s real, day-to-day work.',
          'نعم. يقدّم كارم تدريب الذكاء الاصطناعي حضورياً في مقر شركتك عبر الإمارات (دبي وأبوظبي) والسعودية (الرياض وجدة) ومصر (القاهرة)، إضافةً إلى التقديم أونلاين مباشرةً للفرق الموزّعة. ويمكن تقديم الجلسات بالعربية أو الإنجليزية، مع أمثلة مصمَّمة حسب قطاعك وعمل فريقك اليومي الفعلي.'
        ),
      },
      {
        q: t('How long does an AI training workshop take?', 'كم تستغرق ورشة تدريب الذكاء الاصطناعي؟'),
        a: t(
          'Formats range from a focused half-day workshop of three to four hours to multi-session programs spread over several weeks. A half-day session builds immediate momentum on two or three high-value tasks, while a multi-week program drives deeper, lasting adoption with practice between sessions. The right length depends on team size, current AI skill level and your goals, scoped with you before booking.',
          'تتراوح الصيغ بين ورشة مركّزة لنصف يوم من ثلاث إلى أربع ساعات، وبرامج متعددة الجلسات تمتد على عدة أسابيع. تبني جلسة نصف اليوم زخماً فورياً على مهمتين أو ثلاث عالية القيمة، بينما يحقّق البرنامج الممتد على أسابيع تبنّياً أعمق وأطول أثراً مع التطبيق بين الجلسات. ويعتمد الطول المناسب على حجم الفريق ومستواه الحالي في الذكاء الاصطناعي وأهدافك، ويُحدَّد معك قبل الحجز.'
        ),
      },
      {
        q: t('Will the training work for non-technical staff?', 'هل التدريب مناسب للموظفين غير التقنيين؟'),
        a: t(
          'Yes. The training is built for non-technical teams — marketing, sales, HR, finance, operations and admin. There is no coding. The core skill is prompt engineering: writing clear instructions that get accurate, useful results from AI. Everyone practises on their own real tasks during the session and leaves with a tested prompt library they can use immediately.',
          'نعم. صُمّم التدريب للفرق غير التقنية — التسويق والمبيعات والموارد البشرية والمالية والعمليات والإدارة. لا برمجة على الإطلاق. المهارة الأساسية هي هندسة الأوامر: صياغة تعليمات واضحة تعطي نتائج دقيقة ومفيدة من الذكاء الاصطناعي. يتدرّب الجميع على مهامهم الحقيقية أثناء الجلسة، ويخرجون بمكتبة أوامر مُجرَّبة يمكنهم استخدامها فوراً.'
        ),
      },
      {
        q: t('Can the training be delivered in Arabic?', 'هل يمكن تقديم التدريب باللغة العربية؟'),
        a: t(
          'Yes. Karem is a native Arabic speaker based in Cairo and delivers AI training fully in Arabic or English for teams across Egypt and the Gulf. Arabic delivery removes the language barrier that slows AI adoption, lets staff practise prompts in Arabic and English, and aligns naturally with regional digital-transformation goals such as Saudi Vision 2030 and the UAE’s national AI agenda.',
          'نعم. كارم ناطق أصلي بالعربية ومقيم في القاهرة، ويقدّم تدريب الذكاء الاصطناعي بالكامل بالعربية أو الإنجليزية للفرق في مصر والخليج. يزيل التقديم بالعربية حاجز اللغة الذي يبطئ تبنّي الذكاء الاصطناعي، ويتيح للموظفين التدرّب على الأوامر بالعربية والإنجليزية، وينسجم طبيعياً مع أهداف التحول الرقمي في المنطقة مثل رؤية السعودية 2030 والأجندة الوطنية للذكاء الاصطناعي في الإمارات.'
        ),
      },
      {
        q: t('How much does AI training cost, and how is it priced?', 'كم تكلفة تدريب الذكاء الاصطناعي وكيف يُحتسب السعر؟'),
        a: t(
          'Pricing depends on the format and the size of your team. A focused half-day workshop of three to four hours is a single fixed fee; a multi-week program is scoped per engagement based on the number of participants, the tracks involved (employees, executives, or both), and on-site versus online delivery. Tell Karem your team size and goals on a short scoping call and you will get a clear quote before booking — there is no fixed package forced on you.',
          'تعتمد التكلفة على الصيغة وحجم فريقك. ورشة نصف اليوم المركّزة من ثلاث إلى أربع ساعات لها رسم ثابت واحد، أما البرنامج الممتد على أسابيع فيُحدَّد نطاقه لكل حالة حسب عدد المشاركين والمسارات المطلوبة (الموظفون أو المدراء التنفيذيون أو كلاهما) وطريقة التقديم حضورياً أو أونلاين. أخبر كارم بحجم فريقك وأهدافك في جلسة قصيرة لتحديد النطاق، وستحصل على عرض سعر واضح قبل الحجز — دون فرض باقة ثابتة عليك.'
        ),
      },
      {
        q: t('What results can we expect from AI training?', 'ما النتائج التي يمكن توقّعها من التدريب؟'),
        a: t(
          'Participants leave able to use ChatGPT and Claude on their real tasks — drafting, summarizing, reporting, analysis, and customer replies — faster and with less effort, plus a tested prompt library they keep and reuse the same day. Executives leave able to spot high-value AI use cases and set policy. The training targets measurable time saved on everyday work; the exact gain depends on your team and the tasks you choose to focus on, which is why each program is scoped around your real workflows.',
          'يخرج المشاركون قادرين على استخدام ChatGPT وClaude في مهامهم الحقيقية — الصياغة والتلخيص والتقارير والتحليل والردود على العملاء — بشكل أسرع وبجهد أقل، إضافةً إلى مكتبة أوامر مُجرَّبة يحتفظون بها ويعيدون استخدامها في اليوم نفسه. ويخرج المدراء قادرين على اكتشاف حالات الاستخدام عالية القيمة ووضع السياسات. يستهدف التدريب توفير وقت قابل للقياس في العمل اليومي؛ ويعتمد مقدار التوفير الفعلي على فريقك والمهام التي تختار التركيز عليها، ولذلك يُصمَّم كل برنامج حول سير عملك الحقيقي.'
        ),
      },
    ],
    closingHeading: t('Book an AI Training Session for Your Team', 'احجز جلسة تدريب على الذكاء الاصطناعي لفريقك'),
    closingBody: t(
      'Ready to help your employees and executives work faster with AI? Tell Karem about your team, your industry and the tasks that eat the most time, and he’ll scope a practical, hands-on training program — on-site or online, in Arabic or English, across Egypt, the UAE and Saudi Arabia.',
      'هل أنت مستعد لمساعدة موظفيك ومدرائك على إنجاز العمل بشكل أسرع بالذكاء الاصطناعي؟ أخبر كارم عن فريقك وقطاعك والمهام التي تستهلك أكبر وقت، وسيصمّم لك برنامجاً تدريبياً عملياً وتطبيقياً — حضورياً أو أونلاين، بالعربية أو الإنجليزية، في مصر والإمارات والسعودية.'
    ),
    closingButton: t('Get in Touch', 'تواصل الآن'),
    closingHref: '/contact-info',
    authorName: t('Abo-Elmakarem Shohoud', 'ابوالمكارم شهود'),
    authorRole: t(
      'Full-Stack Developer & Corporate AI Trainer',
      'مطوّر Full-Stack ومدرّب ذكاء اصطناعي للشركات'
    ),
    updatedLabel: t('Updated', 'آخر تحديث'),
    updatedDate: t('June 2026', 'يونيو 2026'),
  }
}

export default async function AiTrainingPage({ searchParams }: SP) {
  const ar = searchParams?.lang === 'ar'
  const content = getContent(ar)

  const clusterPosts = await getServiceClusterPosts(['how-to', 'tutorial'], 6)
  const relatedLinks = clusterPosts.length
    ? {
        heading: ar ? 'أدلة ومقالات ذات صلة' : 'Related guides & insights',
        posts: clusterPosts.map((p) => ({
          slug: p.slug,
          title: ar ? p.title_ar : p.title_en,
        })),
      }
    : undefined

  return (
    <ServicePage
      ar={ar}
      basePath="/ai-training"
      headerTitle={ar ? 'تدريب الذكاء الاصطناعي' : 'AI Training'}
      content={content}
      relatedLinks={relatedLinks}
      schema={
        <>
          <AiTrainingServiceJsonLd ar={ar} />
          <AiTrainingCourseJsonLd ar={ar} />
          <ServiceFaqJsonLd id="https://aboelmakarem.pro/ai-training#faq" faq={content.faq} />
          <ServiceBreadcrumbJsonLd
            items={[
              { name: ar ? 'الرئيسية' : 'Home', url: 'https://aboelmakarem.pro' },
              {
                name: ar ? 'تدريب الذكاء الاصطناعي' : 'AI Training',
                url: 'https://aboelmakarem.pro/ai-training',
              },
            ]}
          />
        </>
      }
    />
  )
}
