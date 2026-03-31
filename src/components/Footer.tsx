import React from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaArrowUp } from 'react-icons/fa';
import QuintonLogo from './QuintonLogo';

const OWNER_EMAIL = 'quintonndlovu161@gmail.com';
const PHONE_DISPLAY = '+263 785385293';
const LOCATION = 'Victoria Falls, Zimbabwe';

interface FooterProps {
  onScrollToAbout: () => void;
  onScrollToPortfolio: () => void;
  onScrollToServices: () => void;
  onScrollToSoftwareIt: () => void;
  onScrollToResume: () => void;
  onScrollToContact: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onScrollToAbout,
  onScrollToPortfolio,
  onScrollToServices,
  onScrollToSoftwareIt,
  onScrollToResume,
  onScrollToContact,
}) => {
  const base = process.env.PUBLIC_URL || '';
  const cvPdfPath = `${base}/images/Quinton_Ndlovu_CV.pdf`;

  const icon = (Icon: any, className: string, size = 18) =>
    React.createElement(Icon, { className, size, 'aria-hidden': true });

  const nav = [
    { label: 'About', onClick: onScrollToAbout },
    { label: 'Portfolio', onClick: onScrollToPortfolio },
    { label: 'Services', onClick: onScrollToServices },
    { label: 'Software & IT', onClick: onScrollToSoftwareIt },
    { label: 'Resume', onClick: onScrollToResume },
    { label: 'Contact', onClick: onScrollToContact },
  ];

  const social = [
    { Icon: FaGithub, href: 'https://github.com/', label: 'GitHub' },
    { Icon: FaLinkedin, href: 'https://linkedin.com/in/quinton-ndlovu-40b559341', label: 'LinkedIn' },
    { Icon: FaFacebook, href: 'https://facebook.com/', label: 'Facebook' },
  ];

  return (
    <footer className="bg-[#1D1D1F] text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-left p-0 m-0 bg-transparent border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-lg transition-opacity hover:opacity-90"
              aria-label="Quinton — scroll to top"
            >
              <QuintonLogo variant="footer" />
            </button>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Full-stack developer building web products and supporting software &amp; IT for teams and individuals.
            </p>
            <a
              href={cvPdfPath}
              download="Quinton_Ndlovu_CV.pdf"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Download CV
            </a>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Explore</h2>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-sm text-gray-300 hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Contact</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href={`mailto:${OWNER_EMAIL}`} className="hover:text-white transition-colors break-all">
                  {OWNER_EMAIL}
                </a>
              </li>
              <li>
                <a href="tel:+263785385293" className="hover:text-white transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="text-gray-400">{LOCATION}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Connect</h2>
            <div className="flex flex-wrap gap-3">
              {social.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label={label}
                >
                  {icon(Icon, 'text-lg')}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors"
            >
              {icon(FaArrowUp, 'text-sm')} Back to top
            </button>
          </div>
        </div>

        <div className="mt-12 sm:mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-500">
          <p className="min-w-0">© {new Date().getFullYear()} Quinton Ndlovu. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 max-sm:pr-[4.5rem] sm:pr-0">
            <a href={`${base}/privacy.html`} className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href={`${base}/terms.html`} className="hover:text-gray-300 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
