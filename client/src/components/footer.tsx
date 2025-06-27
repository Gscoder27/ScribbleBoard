import { motion } from "framer-motion";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Templates", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "Mobile App", href: "#" },
      { name: "What's New", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#contact" },
      { name: "Partners", href: "#" }
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status Page", href: "#" },
      { name: "Report Bug", href: "#" }
    ]
  }
];

const socialLinks = [
  { icon: "fab fa-twitter", href: "#" },
  { icon: "fab fa-linkedin", href: "#" },
  { icon: "fab fa-github", href: "#" },
  { icon: "fab fa-discord", href: "#" }
];

const bottomLinks = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Cookie Policy", href: "#" },
  { name: "GDPR", href: "#" }
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative z-10 bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-pencil-alt text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold">Scribble</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The ultimate collaborative whiteboard tool that brings teams together through real-time creativity and communication.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, backgroundColor: "hsl(249, 88%, 67%)" }}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.button
                      onClick={() => scrollToSection(link.href)}
                      whileHover={{ color: "white", x: 2 }}
                      className="text-left transition-colors hover:text-white"
                    >
                      {link.name}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2024 Scribble. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
            {bottomLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                whileHover={{ color: "white" }}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
