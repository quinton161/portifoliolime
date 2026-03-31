import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OWNER_EMAIL = 'quintonndlovu161@gmail.com';
/** Same number as phone — WhatsApp Click to Chat. */
const WHATSAPP_CHAT_URL = 'https://wa.me/263785385293';

/** Normalize env key (trim, strip stray quotes / semicolons from copy-paste). */
function getWeb3FormsAccessKey(): string {
  const raw = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY ?? '';
  return raw
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/^[;:\s]+|[;:\s]+$/g, '');
}

async function sendContactMessage(data: { name: string; email: string; message: string }): Promise<void> {
  const key = getWeb3FormsAccessKey();
  if (key) {
    // Web3Forms recommends multipart FormData (same as their HTML/React examples) so the full
    // message and fields are delivered reliably to the inbox linked to your access key.
    const formData = new FormData();
    formData.append('access_key', key);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('message', data.message);
    formData.append('subject', `[Portfolio] Message from ${data.name}`);
    // Shown as the “from” label on the notification — not the visitor’s name (that’s in `name`).
    formData.append('from_name', "Quinton's Portfolio");
    formData.append('replyto', data.email);

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || json.success !== true) {
      throw new Error(
        typeof json.message === 'string' && json.message.length > 0
          ? json.message
          : 'Could not send your message. Please try again or use the email address on the left.'
      );
    }
    return;
  }

  // No key in this build (add REACT_APP_WEB3FORMS_ACCESS_KEY locally + on Vercel for server-side delivery)
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[Contact] REACT_APP_WEB3FORMS_ACCESS_KEY is empty — using mailto fallback. Set the env var and redeploy for Web3Forms.'
    );
  }
  const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
  const body = encodeURIComponent(`From: ${data.email}\n\n${data.message}`);
  window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
}

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setStatus('loading');
    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorText(err instanceof Error ? err.message : 'Something went wrong. Try again or email directly.');
    }
  };

  const renderIcon = (Icon: any) => {
    return React.createElement(Icon, { size: 20 }) as React.ReactElement;
  };

  return (
    <section id="contact" className="bg-[#F5F5F7] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 xl:gap-24 items-start">
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-500 font-semibold mb-3 sm:mb-4">
              Contact
            </h2>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1D1D1F] mb-6 sm:mb-8 leading-[1.1] sm:leading-tight">
              Let's create something great together.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-md leading-relaxed">
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  {renderIcon(FaEnvelope)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">Email</p>
                  <a
                    href={`mailto:${OWNER_EMAIL}`}
                    className="text-base sm:text-lg font-semibold text-[#1D1D1F] hover:underline break-words"
                  >
                    {OWNER_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  {renderIcon(FaPhone)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                  <p className="text-base sm:text-lg font-semibold text-[#1D1D1F]">+263 785385293</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-green-600/25 transition hover:scale-[1.03] active:scale-[0.98]"
                  aria-label="Chat on WhatsApp — same number as phone"
                  title="WhatsApp"
                >
                  {React.createElement(FaWhatsapp as React.ComponentType<{ size?: number }>, { size: 28 })}
                </a>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">WhatsApp</p>
                  <p className="text-sm sm:text-base text-[#1D1D1F]">
                    Tap the icon to open a chat — same number as phone (+263 785385293).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  {renderIcon(FaMapMarkerAlt)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">Location</p>
                  <p className="text-base sm:text-lg font-semibold text-[#1D1D1F]">Victoria Falls, Zimbabwe</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[3rem] shadow-xl shadow-gray-200/50 w-full min-w-0">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center px-1">
                <span className="mb-4 inline-flex text-green-600" aria-hidden>
                  {React.createElement(FaCheckCircle as React.ComponentType<{ size?: number; className?: string }>, {
                    size: 56,
                    className: 'inline-block w-12 h-12 sm:w-14 sm:h-14',
                  })}
                </span>
                <p className="text-xl sm:text-2xl font-bold text-[#1D1D1F] mb-2">Message sent</p>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-sm">
                  Thanks — I'll get back to you as soon as I can.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="w-full max-w-xs rounded-2xl bg-black px-8 py-3 text-sm sm:text-base font-bold text-white transition hover:bg-gray-800"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {status === 'error' && (
                  <div
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-3 sm:px-4 py-3 text-xs sm:text-sm text-red-900"
                    role="alert"
                  >
                    <span className="mt-0.5 block shrink-0" aria-hidden>
                      {React.createElement(FaExclamationCircle as React.ComponentType<{ size?: number }>, { size: 18 })}
                    </span>
                    <span className="min-w-0 break-words">{errorText}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full min-w-0 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-base"
                      required
                      disabled={status === 'loading'}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full min-w-0 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-base"
                      required
                      disabled={status === 'loading'}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="w-full min-w-0 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium resize-y min-h-[120px] max-h-[min(50vh,320px)] text-base"
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 sm:py-5 bg-black text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none touch-manipulation"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
                <p className="text-center text-[11px] sm:text-xs text-gray-500">
                  Prefer your mail app?{' '}
                  <a href={`mailto:${OWNER_EMAIL}`} className="font-semibold text-[#1D1D1F] underline">
                    Email me directly
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
