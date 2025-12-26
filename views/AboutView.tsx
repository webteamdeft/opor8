import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, Globe, Heart, TrendingUp } from 'lucide-react';
import { Button } from '../components/UI';

export const AboutView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'About Us - OPOR8 | Our Mission to Standardize Operations';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about OPOR8: We\'re on a mission to eliminate process chaos in growing businesses. Our AI-powered platform helps companies standardize operations and scale efficiently.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about OPOR8: We\'re on a mission to eliminate process chaos in growing businesses. Our AI-powered platform helps companies standardize operations and scale efficiently.';
      document.head.appendChild(meta);
    }
  }, []);

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe every business deserves clear, standardized processes. Our mission is to eliminate operational chaos and empower teams to work smarter.'
    },
    {
      icon: Users,
      title: 'Customer-First',
      description: 'Every feature we build starts with customer feedback. We listen, iterate, and deliver solutions that solve real business problems.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to automate the tedious work of documentation, so you can focus on what matters most.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'From startups to enterprises, across 50+ countries, we\'re helping businesses worldwide standardize their operations.'
    },
    {
      icon: Heart,
      title: 'Quality Obsessed',
      description: 'We don\'t ship features until they\'re perfect. Every line of code, every document, every interaction is crafted with care.'
    },
    {
      icon: TrendingUp,
      title: 'Growth Mindset',
      description: 'We\'re constantly learning, improving, and pushing boundaries. Your success drives our innovation.'
    }
  ];

  const team = [
    { role: 'CEO & Founder', focus: 'Vision & Strategy' },
    { role: 'CTO', focus: 'Engineering & AI' },
    { role: 'Head of Product', focus: 'User Experience' },
    { role: 'Head of Customer Success', focus: 'Support & Growth' }
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
              Standardizing the Future
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                of Operations
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We're building the world's most intelligent SOP platform to help businesses scale
              without losing control of their processes.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    OPOR8 was born from a simple observation: growing businesses struggle with process chaos.
                    As teams expand, tribal knowledge gets lost, procedures become inconsistent, and quality suffers.
                  </p>
                  <p>
                    We've been there. We've seen talented teams waste hours recreating SOPs from scratch,
                    only to have them become outdated the moment they're published. We knew there had to be a better way.
                  </p>
                  <p>
                    By combining AI technology with deep operational expertise, we created OPOR8—a platform that
                    generates comprehensive, context-aware SOPs in minutes, not days. Today, we're helping hundreds
                    of companies standardize their operations and scale with confidence.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">By the Numbers</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-4xl font-bold text-blue-400 mb-2">500+</p>
                    <p className="text-slate-300">Companies Served</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-blue-400 mb-2">10K+</p>
                    <p className="text-slate-300">SOPs Generated</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-blue-400 mb-2">50+</p>
                    <p className="text-slate-300">Countries</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-blue-400 mb-2">98%</p>
                    <p className="text-slate-300">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                    <value.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
            <p className="text-center text-slate-300 mb-12 max-w-3xl mx-auto">
              We're a distributed team of operators, engineers, and designers united by one goal:
              helping businesses scale without sacrificing quality.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-xl p-6 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-white font-bold mb-2">{member.role}</h3>
                  <p className="text-slate-400 text-sm">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why OPOR8?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-First Approach',
                  desc: 'We were one of the first to apply generative AI to operational documentation, and we continue to lead in AI innovation.'
                },
                {
                  title: 'Operations Expertise',
                  desc: 'Our team has built and scaled operations at companies from seed stage to IPO. We know what works.'
                },
                {
                  title: 'Customer Obsession',
                  desc: 'Every feature request is tracked, reviewed, and prioritized based on customer impact. Your voice shapes our roadmap.'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're a customer, partner, or future team member, we'd love to connect.
              Let's build the future of operations together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Try OPOR8 Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Get in Touch
                </Button>
              </Link>
            </div>
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
