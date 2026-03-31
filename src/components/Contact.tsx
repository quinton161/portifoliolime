import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OWNER_EMAIL = 'quintonndlovu161@gmail.com';

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
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `[Portfolio] Message from ${data.name}`,
        from_name: data.name,
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(typeof json.message === 'string' ? json.message : 'Could not send message.');
    }
    return;
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
      await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
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
    <section id="contact" className="bg-[#F5F5F7] py-24 px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-semibold mb-4">Contact</h2>
            <p className="text-6xl font-bold tracking-tight text-[#1D1D1F] mb-8 leading-tight">
              Let's create something great together.
            </p>
            <p className="text-xl text-gray-600 mb-12 max-w-md leading-relaxed">
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  {renderIcon(FaEnvelope)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Email</p>
                  <a
                    href={`mailto:${OWNER_EMAIL}`}
                    className="text-lg font-semibold text-[#1D1D1F] hover:underline"
                  >
                    {OWNER_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  {renderIcon(FaPhone)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                  <p className="text-lg font-semibold text-[#1D1D1F]">+263 785385293</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-black">
                  {renderIcon(FaMapMarkerAlt)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Location</p>
                  <p className="text-lg font-semibold text-[#1D1D1F]">Victoria Falls, Zimbabwe</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="mb-4 inline-flex text-green-600" aria-hidden>
                  {React.createElement(FaCheckCircle as React.ComponentType<{ size?: number; className?: string }>, {
                    size: 56,
                    className: 'inline-block',
                  })}
                </span>
                <p className="text-2xl font-bold text-[#1D1D1F] mb-2">Message sent</p>
                <p className="text-gray-600 mb-8 max-w-sm">
                  Thanks — I'll get back to you as soon as I can.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="rounded-2xl bg-black px-8 py-3 font-bold text-white transition hover:bg-gray-800"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                    role="alert"
                  >
                    <span className="mt-0.5 block shrink-0" aria-hidden>
                      {React.createElement(FaExclamationCircle as React.ComponentType<{ size?: number }>, { size: 18 })}
                    </span>
                    <span>{errorText}</span>
                  </div>
                )}
                {!getWeb3FormsAccessKey() && (
                  <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
                    <strong>Tip:</strong> Add <code className="rounded bg-white px-1">REACT_APP_WEB3FORMS_ACCESS_KEY</code> in{' '}
                    <code className="rounded bg-white px-1">.env</code> (free at{' '}
                    <a href="https://web3forms.com" className="font-semibold underline" target="_blank" rel="noreferrer">
                      web3forms.com
                    </a>
                    ) for reliable delivery. Without it, submit opens your email app.
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium"
                      required
                      disabled={status === 'loading'}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium"
                      required
                      disabled={status === 'loading'}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium resize-none"
                    required
                    disabled={status === 'loading'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
