import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { Button, Input } from '../components/UI';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    document.title = 'Contact Us - OPOR8 | Get in Touch';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact OPOR8: Get help with your account, request a demo, or inquire about enterprise plans. Our team responds within 24 hours.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact OPOR8: Get help with your account, request a demo, or inquire about enterprise plans. Our team responds within 24 hours.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'support@opor8.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      detail: 'Available 24/7',
      description: 'Instant support for customers'
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      detail: 'San Francisco, CA',
      description: 'By appointment only'
    }
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
              Get in
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Have questions? Need a demo? Want to discuss enterprise plans?
              We're here to help and typically respond within 24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{method.title}</h3>
                <p className="text-blue-400 font-semibold mb-1">{method.detail}</p>
                <p className="text-slate-400 text-sm">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-300 mb-2 font-semibold">Your Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-semibold">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-semibold">Company Name</label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-semibold">Subject</label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-semibold">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your needs..."
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {submitted ? (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 text-center">
                    Message sent! We'll get back to you soon.
                  </div>
                ) : (
                  <Button type="submit" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                )}
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked</h3>
                <div className="space-y-6">
                  {[
                    {
                      q: 'How quickly will I hear back?',
                      a: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat.'
                    },
                    {
                      q: 'Can I schedule a demo?',
                      a: 'Absolutely! Mention "demo request" in your message and we\'ll send you a calendar link to book a time that works for you.'
                    },
                    {
                      q: 'Do you offer custom enterprise solutions?',
                      a: 'Yes! We work with large organizations to customize OPOR8 for their specific needs, including custom integrations and workflows.'
                    }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-semibold mb-2">{item.q}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">Quick Help</h3>
                <p className="text-slate-300 mb-6">
                  Need immediate assistance? Check out these resources:
                </p>
                <div className="space-y-3">
                  <Link to="/guides" className="block text-blue-400 hover:text-blue-300 transition">
                    → Documentation & Guides
                  </Link>
                  <Link to="/support" className="block text-blue-400 hover:text-blue-300 transition">
                    → Help Center
                  </Link>
                  <Link to="/pricing" className="block text-blue-400 hover:text-blue-300 transition">
                    → Pricing Information
                  </Link>
                  <a href="/samples" className="block text-blue-400 hover:text-blue-300 transition">
                    → Sample SOPs
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start using OPOR8 today and see how AI can revolutionize your SOP creation process.
            </p>
            <Link to="/auth">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
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
