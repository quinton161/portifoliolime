import React from 'react';
import {
  FaCheckCircle,
  FaDesktop,
  FaHeadset,
  FaShieldAlt,
  FaTools,
  FaSync,
  FaBolt,
  FaHdd,
} from 'react-icons/fa';

/** react-icons + React 19 JSX typing — use createElement like other portfolio components */
function fa(Icon: any, className?: string) {
  return React.createElement(Icon, { className, 'aria-hidden': true });
}

const packages = [
  {
    name: 'Basic Software Setup',
    price: 'Custom quote',
    items: ['Windows installation and setup', 'Essential software installation', 'System updates', 'Basic optimization'],
  },
  {
    name: 'Business Software Support',
    price: 'Custom quote',
    items: ['Software installation and configuration', 'Troubleshooting and repair', 'System configuration', 'Performance tuning'],
    featured: true,
  },
  {
    name: 'Maintenance Support',
    price: 'Monthly options',
    items: ['Scheduled system checks', 'Updates and patches', 'Priority remote support', 'Ongoing stability'],
  },
];

const processSteps = [
  'You reach out (email, form, or WhatsApp)',
  'I clarify the problem or requirements',
  'You get a clear plan or quote',
  'Work is delivered with testing',
  'Follow-up support when needed',
];

const results = [
  'Delivered software and web solutions for teams and local businesses',
  'Reduced recurring issues through proper setup and maintenance',
  'Remote and on-site support with clear communication',
  'Projects shipped on agreed timelines',
];

const techStack = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'PHP',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'JavaScript',
  'Git',
  'Windows',
  'Linux',
  'Tailwind CSS',
];

const faqItems: { q: string; a: string }[] = [
  {
    q: 'How long does a typical software setup take?',
    a: 'Most basic setups take about 1 to 2 hours depending on hardware and what needs installing. Larger rollouts are quoted separately.',
  },
  {
    q: 'Do you offer remote support?',
    a: 'Yes. Many issues can be fixed remotely with your approval and a stable connection.',
  },
  {
    q: 'Can you help with software errors and crashes?',
    a: 'Yes: troubleshooting, repair, and optimization are core parts of what I offer.',
  },
  {
    q: 'Do you work with businesses outside Victoria Falls?',
    a: 'Yes. Remote support is available anywhere; on-site work can be discussed by arrangement.',
  },
];

const SoftwareServices: React.FC = () => {
  return (
    <section
      id="software-it"
      className="border-t border-gray-100 bg-[#F5F5F7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto w-full min-w-0 space-y-16 sm:space-y-20 md:space-y-24">
        <div>
          <h2 className="text-xs sm:text-sm uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">
            Software and IT
          </h2>
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 max-w-3xl leading-[1.1]">
            Hands-on software, systems, and support - not just code on a screen.
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Many teams need someone who can fix software problems, roll out tools safely, and keep machines running. That sits
            alongside my development work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {[
              'Windows installation and setup',
              'Software installation and configuration',
              'System troubleshooting and repair',
              'Computer optimization and cleanup',
              'Remote technical support',
              'Office suite setup (Word, Excel, and similar)',
              'System updates and maintenance',
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-[#1D1D1F]">
                {fa(FaCheckCircle, 'mt-0.5 shrink-0 text-emerald-600')}
                <span className="text-sm sm:text-base">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] mb-2">Service packages</h3>
          <p className="text-gray-600 mb-10 max-w-2xl text-sm sm:text-base">
            Clear starting points - every engagement is scoped to your environment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-[1.75rem] p-6 sm:p-8 flex flex-col border ${
                  pkg.featured
                    ? 'bg-[#1D1D1F] text-white border-black shadow-xl shadow-black/10'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${pkg.featured ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pkg.price}
                </p>
                <h4 className="text-xl font-bold mb-4">{pkg.name}</h4>
                <ul className="space-y-3 flex-1 text-sm sm:text-base leading-snug">
                  {pkg.items.map((item) => (
                    <li key={item} className={`flex gap-2 ${pkg.featured ? 'text-gray-200' : 'text-gray-600'}`}>
                      {fa(FaCheckCircle, `mt-0.5 shrink-0 ${pkg.featured ? 'text-emerald-400' : 'text-emerald-600'}`)}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="rounded-[2rem] bg-white p-8 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7] text-[#1D1D1F]">
                {fa(FaSync, 'text-xl')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">How I work</h3>
            </div>
            <ol className="space-y-4">
              {processSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[2rem] bg-white p-8 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7] text-[#1D1D1F]">
                {fa(FaCheckCircle, 'text-xl')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">Results and outcomes</h3>
            </div>
            <ul className="space-y-4">
              {results.map((r) => (
                <li key={r} className="flex gap-3 text-gray-700">
                  {fa(FaBolt, 'mt-1 shrink-0 text-amber-500')}
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              {fa(FaHeadset, 'text-2xl text-amber-800')}
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F]">Emergency and on-demand support</h3>
            </div>
            <ul className="space-y-2 text-sm sm:text-base text-gray-800">
              <li>Urgent software and system issues</li>
              <li>Recovery-focused remote troubleshooting</li>
              <li>Same-day support when schedule allows</li>
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              {fa(FaShieldAlt, 'text-2xl text-slate-700')}
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F]">System recovery and cleanup</h3>
            </div>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-2">
                {fa(FaTools, 'mt-0.5 shrink-0')} Malware and unwanted software removal (as appropriate)
              </li>
              <li className="flex items-start gap-2">
                {fa(FaHdd, 'mt-0.5 shrink-0')} Backup guidance and restore workflows
              </li>
              <li className="flex items-start gap-2">
                {fa(FaDesktop, 'mt-0.5 shrink-0')} System repair and stability checks
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] mb-2">Technologies and tools</h3>
          <p className="text-gray-600 mb-8 max-w-2xl text-sm sm:text-base">
            A sample of what I use for development and day-to-day systems work.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {techStack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1D1D1F] shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#1D1D1F] text-white p-8 sm:p-10 md:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Monthly support plans</h3>
          <p className="text-gray-300 mb-8 max-w-2xl text-sm sm:text-base">
            For businesses that want fewer surprises: updates, monitoring basics, and a direct line when something breaks.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200 text-sm sm:text-base">
            <li className="flex gap-2">
              {fa(FaCheckCircle, 'mt-0.5 shrink-0 text-emerald-400')} Scheduled updates and patch management
            </li>
            <li className="flex gap-2">
              {fa(FaCheckCircle, 'mt-0.5 shrink-0 text-emerald-400')} Bug fixes and small configuration changes
            </li>
            <li className="flex gap-2">
              {fa(FaCheckCircle, 'mt-0.5 shrink-0 text-emerald-400')} Health checks and performance reviews
            </li>
            <li className="flex gap-2">
              {fa(FaCheckCircle, 'mt-0.5 shrink-0 text-emerald-400')} Priority response for covered systems
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] mb-8">Frequently asked questions</h3>
          <div className="space-y-3 max-w-3xl">
            {faqItems.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm open:shadow-md transition-shadow"
              >
                <summary className="cursor-pointer list-none font-semibold text-[#1D1D1F] flex justify-between gap-4">
                  {q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 select-none" aria-hidden>
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareServices;
