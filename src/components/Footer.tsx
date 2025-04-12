import { Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { title: 'MISSION', href: '#mission' },
  { title: 'WORKS', href: '#works' },
  { title: 'TEAM', href: '#team' },
  { title: 'NEWS', href: '#news' },
  { title: 'BLOG', href: '#blog' },
  { title: 'TECH BLOG', href: '#tech-blog' },
];

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/gemcook', label: 'X (Twitter)' },
  { icon: Facebook, href: 'https://facebook.com/gemcook', label: 'Facebook' },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-black/50 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-6 md:mb-8">
          {/* Menu */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Menu
            </h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <motion.li key={item.title} whileHover={{ x: 10 }}>
                  <a
                    href={item.href}
                    className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {item.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="sr-only">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contact
            </h3>
            <p className="text-sm md:text-base text-gray-300">
              お問い合わせは下記メールアドレスまでお願いいたします。
            </p>
            <a
              href="mailto:info@gemcook.com"
              className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200 mt-2 inline-block"
            >
              info@gemcook.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 md:pt-8 border-t border-white/10">
          <p className="text-xs md:text-sm text-gray-400">
            © {new Date().getFullYear()} Gemcook Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}