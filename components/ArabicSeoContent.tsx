/**
 * Hidden-but-indexable Arabic content block.
 *
 * Why this exists:
 *   The landing page is client-rendered with a language toggle. Googlebot's
 *   first crawl only sees the default (English) render, so the Arabic surface
 *   was never being indexed — searches like "ابوالمكارم شهود" failed.
 *
 * This block ships the Arabic name, role, and section copy into the SSR HTML
 * stream regardless of toggle state. It is visually hidden via .sr-only-seo
 * (rendered but not visible) so the UX is unaffected.
 */
export default function ArabicSeoContent() {
  return (
    <div className="sr-only-seo" lang="ar" dir="rtl" aria-hidden="true">
      <h1>ابوالمكارم شهود — مطور Full-Stack ومهندس DevOps و Scrum Master</h1>
      <p>
        ابوالمكارم شهود (كارم شهود) مطور Full-Stack ومهندس DevOps و Scrum Master ومحلل أعمال
        في شركة Ailigent مقيم في القاهرة، مصر. يبني ويُشغّل ثلاث منصات SaaS مدعومة بالذكاء
        الاصطناعي: Tornix.ai و Oravex.app و Costra.net، ويخدم عملاء في مصر والإمارات
        العربية المتحدة والمملكة العربية السعودية.
      </p>
      <h2>الخدمات والتخصصات</h2>
      <ul>
        <li>تطوير Full-Stack بـ TypeScript و React و Next.js و Python و FastAPI و Node.js</li>
        <li>هندسة DevOps و البنية السحابية: Docker و GitHub Actions و AWS EC2 و Railway و Nginx</li>
        <li>وكلاء صوتيون بالذكاء الاصطناعي: LiveKit Agents و OpenAI Realtime API و MCP و Tavus</li>
        <li>تطوير ERP على Odoo 18 و حلول التحول الرقمي</li>
        <li>Scrum Master و تحليل أعمال للمشاريع التقنية</li>
      </ul>
      <h2>المشاريع</h2>
      <p>
        <strong>Tornix.ai</strong> — منصة SaaS لإدارة المشاريع بالذكاء الاصطناعي مع محرك
        Critical Path Method وتوافق مع ملفات Primavera P6 و XER.
      </p>
      <p>
        <strong>Oravex.app</strong> — منصة ERP مبنية على Odoo 18 مع معالجة اللغة الطبيعية
        تتيح استعلامات ERP باللغة العربية والإنجليزية.
      </p>
      <p>
        <strong>Costra.net</strong> — منصة تقدير تكلفة وتحليلات إنشاءات مدعومة
        بالذكاء الاصطناعي مع دعم كامل للعربية و RTL.
      </p>
      <h2>التواصل</h2>
      <p>
        للتواصل: ابوالمكارم شهود متاح للعمل عن بُعد، أدوار دوام كامل، عقود استشارية،
        ومشاريع بنطاق محدد. تواصل عبر LinkedIn أو نموذج التواصل في الموقع.
      </p>
    </div>
  )
}
