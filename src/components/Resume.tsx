import React, { useState } from 'react';

const Resume: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'skills'>('education');

  const education = [
    {
      title: 'Software Development',
      institution: 'Uncommon.org',
      period: '2024',
      description: 'Focused on full-stack web development, modern JavaScript frameworks, and agile methodologies.'
    },
    {
      title: 'UI/UX Design',
      institution: 'Uncommon.org',
      period: '2024',
      description: 'Studied design principles, user research, and prototyping tools to create intuitive digital experiences.'
    },
    {
      title: 'Digital Marketing',
      institution: 'Uncommon.org',
      period: '2024',
      description: 'Gained expertise in SEO, content strategy, and data analytics for digital products.'
    }
  ];

  const skills = [
    { title: 'Front-End', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
    { title: 'Back-End', items: ['Node.js', 'Firebase', 'MongoDB', 'PostgreSQL'] },
    { title: 'Tools & Design', items: ['Figma', 'Git', 'Vercel', 'Postman'] }
  ];

  return (
    <section id="resume" className="bg-white py-24 px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-semibold mb-4">Resume</h2>
          <p className="text-5xl font-bold tracking-tight text-[#1D1D1F] max-w-2xl">
            My professional journey and technical expertise.
          </p>
        </div>

        <div className="flex gap-8 mb-12 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('education')}
            className={`pb-4 text-lg font-semibold transition-all ${
              activeTab === 'education'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-4 text-lg font-semibold transition-all ${
              activeTab === 'skills'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Skills
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {activeTab === 'education' ? (
            education.map((item, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-gray-100 pb-12 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-black"></div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.period}</span>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mt-2">{item.title}</h3>
                <p className="text-lg font-medium text-gray-600 mb-4">{item.institution}</p>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))
          ) : (
            skills.map((group, index) => (
              <div key={index} className="bg-[#F5F5F7] p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-6">{group.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Resume;
