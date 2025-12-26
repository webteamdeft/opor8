import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Building2, Crown } from 'lucide-react';
import { Button } from '../components/UI';

export const PricingView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Pricing - OPOR8 | Simple, Transparent Plans';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 pricing: Start free, upgrade when ready. $49 per SOP pack with unlimited documents. Enterprise plans available. No hidden fees, cancel anytime.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 pricing: Start free, upgrade when ready. $49 per SOP pack with unlimited documents. Enterprise plans available. No hidden fees, cancel anytime.';
      document.head.appendChild(meta);
    }
  }, []);

  const plans = [
    {
      icon: Zap,
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for trying out OPOR8 and creating your first SOPs',
      features: [
        '3 SOP documents',
        'AI-powered generation',
        'Basic templates',
        'PDF export',
        'Email support',
        'Community access'
      ],
      cta: 'Start Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      icon: Building2,
      name: 'Professional',
      price: '$49',
      period: 'per pack',
      description: 'For growing teams that need comprehensive documentation',
      features: [
        'Unlimited documents',
        'All departments covered',
        'Advanced AI customization',
        'Word & PDF export',
        'Priority support',
        'Brand customization',
        'Version history',
        'Team collaboration'
      ],
      cta: 'Get Started',
      popular: true,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Crown,
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For large organizations with specific requirements',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Advanced security',
        'Custom workflows',
        'API access',
        'Training & onboarding'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-amber-500 to-orange-600'
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
              Simple, Transparent
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Start free and upgrade when you're ready. No hidden fees, no surprises.
              Just powerful SOP generation at a price that makes sense.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-slate-900/50 border ${
                  plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-slate-800'
                } rounded-2xl p-8 relative ${plan.popular ? 'transform scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-400 text-sm">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <Link to={plan.name === 'Enterprise' ? '/contact' : '/auth'}>
                  <Button
                    className={`w-full mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                        : ''
                    }`}
                    variant={plan.popular ? 'primary' : 'secondary'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  q: 'What is an SOP Pack?',
                  a: 'An SOP Pack is a collection of related procedures for a specific department or function. Each pack can contain unlimited individual SOP documents.'
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes! There are no long-term contracts. You can cancel your subscription at any time and keep access to your generated documents.'
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 30-day money-back guarantee. If you are not satisfied with OPOR8, we will refund your payment, no questions asked.'
                },
                {
                  q: 'How many users can access my account?',
                  a: 'Professional plans support up to 10 users. Enterprise plans include unlimited users. Additional user seats can be purchased separately.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! The Starter plan is free forever with 3 SOP documents. You can upgrade to Professional at any time to unlock unlimited documents.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards (Visa, Mastercard, Amex) and bank transfers for Enterprise plans. All payments are processed securely through Stripe.'
                }
              ].map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              All Plans Include
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'AI Generation', desc: 'Powered by Google Gemini' },
                { title: 'Secure Storage', desc: 'Bank-grade encryption' },
                { title: 'Regular Updates', desc: 'New features monthly' },
                { title: 'Data Export', desc: 'Download anytime' },
                { title: 'Mobile Access', desc: 'Work from anywhere' },
                { title: 'Automatic Backups', desc: 'Never lose your work' },
                { title: 'Version Control', desc: 'Track all changes' },
                { title: '99.9% Uptime', desc: 'Always available' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-6 text-center">
                  <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies using OPOR8 to standardize their operations.
              Start free today, no credit card required.
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
