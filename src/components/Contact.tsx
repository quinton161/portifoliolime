import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic
  };

  const renderIcon = (Icon: any) => {
    return React.createElement(Icon, { size: 20 });
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
                  <p className="text-lg font-semibold text-[#1D1D1F]">quintonndlovu161@gmail.com</p>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">Message</label>
                <textarea 
                  placeholder="Tell me about your project..." 
                  rows={5}
                  className="w-full px-6 py-4 bg-[#F5F5F7] rounded-2xl border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium resize-none"
                  required 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;