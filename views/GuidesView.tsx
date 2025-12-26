import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, FileText, Zap, Settings, Shield } from 'lucide-react';
import { Button } from '../components/UI';

export const GuidesView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Guides & Documentation - OPOR8 | Learn How to Use OPOR8';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 guides and documentation: Learn how to create SOPs, customize templates, manage your library, and get the most out of our AI-powered platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 guides and documentation: Learn how to create SOPs, customize templates, manage your library, and get the most out of our AI-powered platform.';
      document.head.appendChild(meta);
    }
  }, []);

  const guides = [
    {
      icon: PlayCircle,
      title: 'Getting Started',
      description: 'Complete onboarding guide to set up your account and create your first SOP pack.',
      topics: ['Account setup', 'Business profile', 'First SOP generation', 'Navigation basics'],
      readTime: '5 min',
      level: 'Beginner'
    },
    {
      icon: FileText,
      title: 'Creating SOPs',
      description: 'Master the SOP Builder and learn how to generate comprehensive documentation.',
      topics: ['Department selection', 'Questionnaire tips', 'AI customization', 'Content review'],
      readTime: '10 min',
      level: 'Beginner'
    },
    {
      icon: Zap,
      title: 'Advanced AI Features',
      description: 'Leverage advanced AI capabilities to create highly customized, context-aware SOPs.',
      topics: ['Custom prompts', 'Industry templates', 'Tone adjustment', 'Multi-language'],
      readTime: '15 min',
      level: 'Advanced'
    },
    {
      icon: BookOpen,
      title: 'Library Management',
      description: 'Organize, search, and manage your growing collection of operational documents.',
      topics: ['Search & filters', 'Categories', 'Version history', 'Bulk operations'],
      readTime: '8 min',
      level: 'Intermediate'
    },
    {
      icon: Settings,
      title: 'Team Collaboration',
      description: 'Set up your team, manage permissions, and collaborate on document creation.',
      topics: ['User roles', 'Permissions', 'Sharing', 'Approval workflows'],
      readTime: '12 min',
      level: 'Intermediate'
    },
    {
      icon: Shield,
      title: 'Security Best Practices',
      description: 'Learn how to keep your documents secure and maintain compliance standards.',
      topics: ['Access control', 'Data export', 'Audit logs', 'Compliance'],
      readTime: '10 min',
      level: 'Advanced'
    }
  ];

  const quickLinks = [
    { title: 'Video Tutorials', count: 12, icon: PlayCircle },
    { title: 'Written Guides', count: 24, icon: BookOpen },
    { title: 'FAQs', count: 45, icon: FileText },
    { title: 'API Docs', count: 8, icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O8</span>
              </div>
              <span className="text-xl font-bold text-white">OPOR8</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-slate-300 hover:text-white transition">
                Sign In
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Documentation &
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Learning Center
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to master OPOR8 and create world-class SOPs.
              From beginner guides to advanced techniques.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <link.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{link.title}</h3>
                <p className="text-slate-400 text-sm">{link.count} resources</p>
              </div>
            ))}
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Popular Guides</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center">
                      <guide.icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full">
                        {guide.level}
                      </span>
                      <span className="text-xs text-slate-500">{guide.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                    {guide.title}
                  </h3>

                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {guide.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-400 mb-3">What you'll learn:</p>
                    <ul className="space-y-2">
                      {guide.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Step-by-Step Tutorials
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Creating Your First SOP Pack',
                  steps: ['Sign up & complete onboarding', 'Select 2-3 departments', 'Answer questionnaire', 'Review generated SOPs', 'Export to PDF or Word']
                },
                {
                  title: 'Customizing AI-Generated Content',
                  steps: ['Open any SOP document', 'Click "Regenerate" with custom prompt', 'Adjust tone and detail level', 'Compare versions', 'Save your preferred version']
                },
                {
                  title: 'Setting Up Team Access',
                  steps: ['Go to Settings > Team', 'Invite team members by email', 'Assign roles (User/Admin)', 'Set document permissions', 'Enable notifications']
                },
                {
                  title: 'Exporting & Sharing Documents',
                  steps: ['Select documents from library', 'Choose export format', 'Apply branding options', 'Download or share link', 'Track who accessed']
                }
              ].map((tutorial, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{tutorial.title}</h3>
                  <ol className="space-y-3">
                    {tutorial.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex gap-4">
                        <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold text-sm">
                          {stepIdx + 1}
                        </span>
                        <span className="text-slate-300 pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Need More Help?
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Can't find what you're looking for? Our support team is here to help
                  with personalized guidance and solutions.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    '24/7 live chat support',
                    'Video call screen sharing',
                    'Custom training sessions',
                    'Dedicated success manager (Enterprise)'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/support">
                  <Button>Contact Support</Button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Links</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Release Notes', desc: 'Latest features & updates' },
                    { label: 'System Status', desc: 'Check uptime & performance' },
                    { label: 'Developer API', desc: 'Integration documentation' },
                    { label: 'Community Forum', desc: 'Connect with other users' },
                    { label: 'Feature Requests', desc: 'Suggest improvements' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition cursor-pointer">
                      <div>
                        <p className="text-white font-semibold">{item.label}</p>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                      <span className="text-blue-400">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Put what you've learned into action. Create your first SOP pack in minutes.
            </p>
            <Link to="/auth">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Creating SOPs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2024 OPOR8. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
