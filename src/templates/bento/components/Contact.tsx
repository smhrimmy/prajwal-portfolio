import { useTemplateData } from "@/shared/TemplateContext";
import { bentoTokens as t } from "../tokens";
import { ContactAnimation } from "@/shared/components/ContactAnimation";

export function Contact() {
  const { profile: site } = useTemplateData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "email": site?.email || "hello@example.com",
    "contactType": "customer support"
  };

  return (
    <section data-portfolio-component="contact" id="contact" className={`py-12 px-4 max-w-7xl mx-auto ${t.colors.bg} ${t.colors.text}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Contact</h2>
      </div>

      <div className={`${t.grid.container} ${t.layout.gap}`}>
        
        {/* Email Cell (1x1) */}
        <aside className={`${t.grid.span1x1} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-between items-start`}>
          <div className="mb-4">
            <span className={`text-xs font-bold tracking-widest uppercase ${t.colors.textMuted}`}>[ Direct ]</span>
          </div>
          <div className="mt-auto">
            <h3 className="font-semibold text-lg mb-1">Email</h3>
            <a href={`mailto:${site?.email || "hello@example.com"}`} className={`text-sm ${t.colors.textMuted} hover:underline`}>
              {site?.email || "hello@example.com"}
            </a>
          </div>
        </aside>

        {/* Availability Cell (1x1) */}
        <aside className={`${t.grid.span1x1} ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} ${t.motion.cardHover} flex flex-col justify-between items-start`}>
          <div className="mb-4">
            <span className={`text-xs font-bold tracking-widest uppercase ${t.colors.textMuted}`}>[ Capacity ]</span>
          </div>
          <div className="mt-auto">
            <h3 className="font-semibold text-lg mb-1">Status</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${t.colors.accents.status} ${t.motion.pulse}`} />
              <span className={`text-sm font-medium`}>Open to roles</span>
            </div>
          </div>
        </aside>

        {/* Form Cell (2x2) */}
        <article className={`md:col-span-2 md:row-span-2 ${t.colors.surface} ${t.colors.border} ${t.layout.radius} ${t.layout.padding} ${t.utils.card} flex flex-col`}>
          <h3 className="text-xl font-bold mb-6">Send a Message</h3>
          <form className="flex flex-col gap-4 flex-1" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                className={`flex-1 ${t.colors.bg} ${t.colors.border} ${t.layout.radius} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 ${t.colors.text}`}
              />
              <input 
                type="email" 
                placeholder="Email" 
                className={`flex-1 ${t.colors.bg} ${t.colors.border} ${t.layout.radius} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 ${t.colors.text}`}
              />
            </div>
            <textarea 
              placeholder="Message" 
              rows={4}
              className={`flex-1 ${t.colors.bg} ${t.colors.border} ${t.layout.radius} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 ${t.colors.text} resize-none`}
            />
            <ContactAnimation 
              buttonText="Send Request"
              className={`w-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 ${t.layout.radius} mt-auto hover:opacity-90`}
            />
          </form>
        </article>

      </div>
    </section>
  );
}
