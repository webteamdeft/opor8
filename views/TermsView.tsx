import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle, Shield, Scale } from 'lucide-react';
import { Button } from '../components/UI';

export const TermsView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Terms of Service - OPOR8 | Legal Agreement';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 Terms of Service: User agreement, acceptable use policy, subscription terms, and legal obligations for using our platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 Terms of Service: User agreement, acceptable use policy, subscription terms, and legal obligations for using our platform.';
      document.head.appendChild(meta);
    }
  }, []);

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-400">
              Last Updated: December 23, 2024
            </p>
            <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
              Please read these terms carefully before using OPOR8. By accessing or using our
              service, you agree to be bound by these terms.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Important Notice</h3>
                <p className="text-slate-300 leading-relaxed">
                  These Terms of Service constitute a legally binding agreement between you and
                  OPOR8. If you do not agree to these terms, you must not access or use our services.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 mb-12">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <div className="text-slate-300 space-y-3">
                    <p>By creating an account or using OPOR8, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.</p>
                    <p>You must be at least 18 years old and have the legal capacity to enter into this agreement.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                  <div className="text-slate-300 space-y-3">
                    <p>OPOR8 provides an AI-powered platform for creating Standard Operating Procedures (SOPs) and operational documentation.</p>
                    <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.</p>
                    <p>Service availability: We aim for 99.9% uptime but do not guarantee uninterrupted access.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You must provide accurate and complete information during registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>You are responsible for all activities that occur under your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Notify us immediately of any unauthorized access or security breaches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>One account per user; sharing accounts is prohibited</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="text-slate-300 mb-4">You agree NOT to:</p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Use the service for any illegal or unauthorized purpose</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Attempt to gain unauthorized access to our systems or networks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Reverse engineer, decompile, or disassemble any part of the service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Upload malicious code, viruses, or any harmful content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Scrape, crawl, or use automated tools to access our service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Resell or redistribute our service without authorization</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Subscription & Payment</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong className="text-white">Billing:</strong> Subscriptions are billed monthly or annually based on your chosen plan.</p>
                <p><strong className="text-white">Payment Method:</strong> You authorize us to charge your payment method for all fees.</p>
                <p><strong className="text-white">Refunds:</strong> 30-day money-back guarantee for new customers. No refunds for partial months.</p>
                <p><strong className="text-white">Price Changes:</strong> We reserve the right to modify pricing with 30 days notice.</p>
                <p><strong className="text-white">Cancellation:</strong> You can cancel anytime. Access continues until the end of your billing period.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong className="text-white">Your Content:</strong> You retain ownership of all content you create using OPOR8.</p>
                <p><strong className="text-white">Our Platform:</strong> OPOR8 and all related IP remain our exclusive property.</p>
                <p><strong className="text-white">License Grant:</strong> You grant us a license to process your content to provide the service.</p>
                <p><strong className="text-white">AI Output:</strong> AI-generated content is yours, but we don't guarantee uniqueness.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Data & Privacy</h2>
              <div className="text-slate-300 space-y-3">
                <p>Our handling of your data is governed by our Privacy Policy.</p>
                <p>You are responsible for backing up your own content.</p>
                <p>We are not liable for any data loss, though we maintain regular backups.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers & Limitations</h2>
              <div className="text-slate-300 space-y-3">
                <p><strong className="text-white">AS IS Service:</strong> OPOR8 is provided "as is" without warranties of any kind.</p>
                <p><strong className="text-white">AI Accuracy:</strong> While we strive for accuracy, AI-generated content may contain errors.</p>
                <p><strong className="text-white">Limitation of Liability:</strong> Our liability is limited to the amount you paid in the last 12 months.</p>
                <p><strong className="text-white">No Consequential Damages:</strong> We are not liable for indirect, incidental, or consequential damages.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
              <div className="text-slate-300 space-y-3">
                <p>We may terminate or suspend your account for violations of these terms.</p>
                <p>You may terminate your account at any time through your settings.</p>
                <p>Upon termination, your right to access the service ceases immediately.</p>
                <p>We will delete your data within 30 days of account termination.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
              <div className="text-slate-300 space-y-3">
                <p>These terms are governed by the laws of the State of California, USA.</p>
                <p>Any disputes will be resolved in the courts of San Francisco County, California.</p>
                <p>You agree to waive any objections to this jurisdiction and venue.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <div className="text-slate-300 space-y-3">
                <p>We may modify these terms at any time with reasonable notice.</p>
                <p>Material changes will be communicated via email or platform notification.</p>
                <p>Continued use after changes constitutes acceptance of new terms.</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <div className="text-slate-300 space-y-2">
                <p><strong className="text-white">Email:</strong> legal@opor8.com</p>
                <p><strong className="text-white">Address:</strong> OPOR8 Inc., 123 Market St, San Francisco, CA 94103</p>
                <p><strong className="text-white">Support:</strong> support@opor8.com</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-blue-100 mb-6">
              If you have any questions or concerns about these terms, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Contact Us
                </Button>
              </Link>
              <a href="mailto:legal@opor8.com">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Email: legal@opor8.com
                </Button>
              </a>
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
