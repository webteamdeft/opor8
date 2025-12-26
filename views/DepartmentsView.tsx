import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, Cog, Laptop, TrendingUp, Megaphone, Scale, Package, HeartPulse, GraduationCap, Building2, Shield } from 'lucide-react';
import { Button } from '../components/UI';

export const DepartmentsView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Departments & Industries - OPOR8 | SOPs for Every Business Function';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 supports 44+ departments across all industries. Generate SOPs for Finance, HR, Operations, IT, Sales, Marketing, Legal, and more. Industry-specific templates available.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 supports 44+ departments across all industries. Generate SOPs for Finance, HR, Operations, IT, Sales, Marketing, Legal, and more. Industry-specific templates available.';
      document.head.appendChild(meta);
    }
  }, []);

  const departments = [
    {
      icon: DollarSign,
      name: 'Finance & Accounting',
      description: 'Comprehensive financial procedures covering accounting, budgeting, expense management, and compliance reporting.',
      modules: ['Accounts Payable/Receivable', 'Budget Planning', 'Financial Reporting', 'Expense Management', 'Audit Procedures', 'Tax Compliance'],
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Users,
      name: 'Human Resources',
      description: 'End-to-end HR workflows from recruitment to offboarding, performance management, and employee relations.',
      modules: ['Recruitment & Onboarding', 'Performance Reviews', 'Leave Management', 'Benefits Administration', 'Payroll Processing', 'Offboarding'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Cog,
      name: 'Operations',
      description: 'Streamline daily operations with procedures for quality control, supply chain, inventory, and process optimization.',
      modules: ['Quality Control', 'Supply Chain', 'Inventory Management', 'Facility Management', 'Vendor Management', 'Process Improvement'],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Laptop,
      name: 'Information Technology',
      description: 'IT infrastructure, cybersecurity, software development, and technical support procedures for modern tech teams.',
      modules: ['System Administration', 'Cybersecurity', 'Software Development', 'Help Desk', 'Network Management', 'Data Backup'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      name: 'Sales',
      description: 'Proven sales methodologies, lead management, pipeline tracking, and customer acquisition strategies.',
      modules: ['Lead Qualification', 'Sales Pipeline', 'CRM Management', 'Contract Negotiation', 'Account Management', 'Sales Reporting'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Megaphone,
      name: 'Marketing',
      description: 'Digital marketing, content creation, brand management, and campaign execution procedures.',
      modules: ['Content Marketing', 'Social Media', 'Email Campaigns', 'Brand Guidelines', 'SEO Strategy', 'Analytics Reporting'],
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Scale,
      name: 'Legal & Compliance',
      description: 'Legal documentation, contract management, regulatory compliance, and risk assessment procedures.',
      modules: ['Contract Review', 'Compliance Audits', 'Risk Management', 'Data Privacy', 'Intellectual Property', 'Legal Documentation'],
      color: 'from-slate-500 to-gray-600'
    },
    {
      icon: Package,
      name: 'Supply Chain & Logistics',
      description: 'Procurement, shipping, receiving, warehouse management, and distribution procedures.',
      modules: ['Procurement', 'Shipping & Receiving', 'Warehouse Management', 'Distribution', 'Supplier Relations', 'Logistics Planning'],
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: HeartPulse,
      name: 'Healthcare',
      description: 'HIPAA-compliant procedures for patient care, medical records, clinical operations, and healthcare administration.',
      modules: ['Patient Intake', 'Medical Records', 'Clinical Protocols', 'Pharmacy Operations', 'Infection Control', 'Emergency Procedures'],
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: GraduationCap,
      name: 'Education & Training',
      description: 'Academic administration, curriculum development, student services, and training program management.',
      modules: ['Course Development', 'Student Admissions', 'Assessment Procedures', 'Faculty Management', 'Learning Management', 'Compliance Training'],
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Building2,
      name: 'Real Estate',
      description: 'Property management, leasing, maintenance, tenant relations, and real estate transaction procedures.',
      modules: ['Property Leasing', 'Maintenance Management', 'Tenant Relations', 'Inspections', 'Lease Administration', 'Property Accounting'],
      color: 'from-cyan-500 to-teal-600'
    },
    {
      icon: Shield,
      name: 'Security & Safety',
      description: 'Physical security, emergency response, workplace safety, and incident management procedures.',
      modules: ['Access Control', 'Emergency Response', 'Incident Reporting', 'Safety Inspections', 'Crisis Management', 'Security Audits'],
      color: 'from-yellow-500 to-amber-600'
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
              Every Department.
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Every Industry.
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              OPOR8 provides industry-specific SOP templates across 44+ business modules.
              From startups to enterprises, we cover every function your organization needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <dept.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{dept.name}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{dept.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-400 mb-3">Key Modules:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {dept.modules.map((module, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-slate-400">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-6">
              Industry-Specific Customization
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto">
              Our AI understands the nuances of your industry. Whether you're in healthcare, finance, manufacturing,
              or technology, OPOR8 generates SOPs that align with industry standards and regulatory requirements.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6">
                <p className="text-3xl font-bold text-blue-400 mb-2">44+</p>
                <p className="text-slate-300">Department Modules</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6">
                <p className="text-3xl font-bold text-blue-400 mb-2">200+</p>
                <p className="text-slate-300">SOP Templates</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6">
                <p className="text-3xl font-bold text-blue-400 mb-2">15+</p>
                <p className="text-slate-300">Industries Served</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6">
                <p className="text-3xl font-bold text-blue-400 mb-2">100%</p>
                <p className="text-slate-300">Customizable</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Building Your SOP Library Today
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Select the departments you need, answer a few questions, and let our AI generate comprehensive SOPs tailored to your business.
            </p>
            <Link to="/auth">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started Free
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
