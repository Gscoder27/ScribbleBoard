import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out Scribble",
    features: [
      "Up to 3 boards",
      "5 team members",
      "Basic drawing tools",
      "Integrated chat"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Best for growing teams",
    features: [
      "Unlimited boards",
      "25 team members",
      "Advanced drawing tools",
      "Video/voice chat",
      "Templates library",
      "Export & sharing"
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "$25",
    period: "/month",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited members",
      "Advanced security",
      "Priority support",
      "Custom integrations",
      "Analytics dashboard"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary" as const,
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your team's needs. No hidden fees, cancel anytime.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`rounded-xl p-8 shadow-lg border relative ${
                plan.popular
                  ? "bg-gradient-to-br from-primary to-secondary text-white transform scale-105"
                  : "bg-white border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? "text-white/80" : "text-gray-600"}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mb-6 ${plan.popular ? "text-white/80" : "text-gray-600"}`}>
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <i className={`fas fa-check mr-3 ${plan.popular ? "text-white" : "text-success"}`}></i>
                    <span className={plan.popular ? "text-white" : "text-gray-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={plan.popular ? "secondary" : plan.buttonVariant}
                  className={`w-full py-3 font-semibold ${
                    plan.popular
                      ? "bg-white text-primary hover:bg-gray-50"
                      : plan.buttonVariant === "outline"
                      ? "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <i className="fas fa-shield-alt mr-2"></i>
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <i className="fas fa-cloud mr-2"></i>
              Cloud Backup
            </div>
            <div className="flex items-center">
              <i className="fas fa-headset mr-2"></i>
              24/7 Support
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
