import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '../components/UI';

export const BlogView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Blog - OPOR8 | Insights on Operations & Process Excellence';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 blog: Expert insights on operations management, SOP best practices, AI in business, process optimization, and scaling strategies.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 blog: Expert insights on operations management, SOP best practices, AI in business, process optimization, and scaling strategies.';
      document.head.appendChild(meta);
    }
  }, []);

  const featuredPost = {
    title: 'The Future of Operations: How AI is Revolutionizing SOP Creation',
    excerpt: 'Discover how generative AI is transforming the way businesses create, maintain, and scale their operational documentation. Learn from real-world case studies and expert insights.',
    author: 'Sarah Chen',
    date: 'December 20, 2024',
    readTime: '8 min read',
    category: 'AI & Technology',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
  };

  const posts = [
    {
      title: '10 Signs Your Business Needs Standardized Operating Procedures',
      excerpt: 'Are you struggling with inconsistent processes and knowledge gaps? Here are the telltale signs it\'s time to implement SOPs.',
      author: 'Michael Torres',
      date: 'December 18, 2024',
      readTime: '5 min read',
      category: 'Best Practices',
      icon: BookOpen
    },
    {
      title: 'Scaling from 10 to 100 Employees: A Process Documentation Guide',
      excerpt: 'Learn how fast-growing companies maintain quality and consistency while scaling their teams rapidly.',
      author: 'Emily Johnson',
      date: 'December 15, 2024',
      readTime: '7 min read',
      category: 'Growth Strategy',
      icon: TrendingUp
    },
    {
      title: 'SOP Templates vs AI Generation: Which is Right for Your Business?',
      excerpt: 'Compare traditional SOP templates with modern AI-powered generation. Understand the pros, cons, and use cases for each approach.',
      author: 'David Kim',
      date: 'December 12, 2024',
      readTime: '6 min read',
      category: 'Guides',
      icon: Lightbulb
    },
    {
      title: 'How to Train Your Team Using SOPs: A Complete Framework',
      excerpt: 'Transform your onboarding and training process with structured documentation. Reduce ramp-up time by 50%.',
      author: 'Lisa Martinez',
      date: 'December 10, 2024',
      readTime: '9 min read',
      category: 'Team Management',
      icon: BookOpen
    },
    {
      title: 'Compliance Made Easy: Using SOPs for Regulatory Standards',
      excerpt: 'Navigate complex compliance requirements with confidence. Learn how proper documentation protects your business.',
      author: 'Robert Anderson',
      date: 'December 8, 2024',
      readTime: '6 min read',
      category: 'Compliance',
      icon: BookOpen
    },
    {
      title: 'The ROI of Process Documentation: Real Numbers from 50+ Companies',
      excerpt: 'Detailed analysis of time savings, error reduction, and productivity gains from implementing systematic SOPs.',
      author: 'Jennifer Wong',
      date: 'December 5, 2024',
      readTime: '10 min read',
      category: 'Case Studies',
      icon: TrendingUp
    }
  ];

  const categories = [
    { name: 'All Posts', count: 48 },
    { name: 'Best Practices', count: 12 },
    { name: 'AI & Technology', count: 8 },
    { name: 'Growth Strategy', count: 10 },
    { name: 'Case Studies', count: 6 },
    { name: 'Team Management', count: 7 },
    { name: 'Compliance', count: 5 }
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
              Insights &
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Best Practices
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Expert insights on operations management, process optimization, and scaling strategies.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden mb-20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto bg-gradient-to-br from-blue-600/20 to-indigo-600/20 relative overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-12">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-4 mt-4 group-hover:text-blue-400 transition">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button className="group/btn">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 mb-20">
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-white font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                        idx === 0
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm">{cat.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
                        <post.icon className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                      {post.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                    </div>

                    <span className="text-sm text-slate-500">{post.readTime}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button variant="secondary">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights on operations excellence,
              AI trends, and process optimization strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Subscribe
              </Button>
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
