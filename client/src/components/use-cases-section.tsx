import { motion } from "framer-motion";

const useCases = [
  {
    icon: "fas fa-lightbulb",
    title: "Brainstorming",
    description: "Generate ideas collaboratively with mind maps, sticky notes, and free-form drawing.",
    tags: ["Creative Teams", "Innovation"],
    gradient: "from-primary/5 to-secondary/5",
    border: "border-primary/10",
    iconBg: "bg-primary"
  },
  {
    icon: "fas fa-project-diagram",
    title: "Project Planning",
    description: "Map out timelines, dependencies, and milestones with your entire team.",
    tags: ["Product Teams", "Agile"],
    gradient: "from-accent/5 to-primary/5",
    border: "border-accent/10",
    iconBg: "bg-accent"
  },
  {
    icon: "fas fa-chalkboard-teacher",
    title: "Teaching & Training",
    description: "Create interactive lessons and workshops with real-time student engagement.",
    tags: ["Educators", "Remote Learning"],
    gradient: "from-secondary/5 to-accent/5",
    border: "border-secondary/10",
    iconBg: "bg-secondary"
  },
  {
    icon: "fas fa-drafting-compass",
    title: "Design Systems",
    description: "Build and iterate on wireframes, user flows, and design concepts together.",
    tags: ["UX Teams", "Design"],
    gradient: "from-success/5 to-primary/5",
    border: "border-success/10",
    iconBg: "bg-success"
  },
  {
    icon: "fas fa-handshake",
    title: "Client Presentations",
    description: "Present ideas interactively and gather feedback in real-time during meetings.",
    tags: ["Sales Teams", "Consulting"],
    gradient: "from-primary/5 to-accent/5",
    border: "border-primary/10",
    iconBg: "bg-gradient-to-br from-primary to-accent"
  },
  {
    icon: "fas fa-users-cog",
    title: "Team Workshops",
    description: "Run retrospectives, planning sessions, and team-building activities.",
    tags: ["HR Teams", "Team Building"],
    gradient: "from-accent/5 to-secondary/5",
    border: "border-accent/10",
    iconBg: "bg-gradient-to-br from-accent to-secondary"
  }
];

export default function UseCasesSection() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perfect for every team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From startups to enterprises, Scribble Board adapts to your workflow
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${useCase.gradient} rounded-xl p-6 border ${useCase.border}`}
            >
              <div className={`w-12 h-12 ${useCase.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${useCase.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
              <p className="text-gray-600 mb-4">{useCase.description}</p>
              <div className="flex flex-wrap gap-2">
                {useCase.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-3 py-1 ${useCase.iconBg.includes('gradient') ? 'bg-primary/10 text-primary' : `${useCase.iconBg.replace('bg-', 'bg-')}/10 ${useCase.iconBg.replace('bg-', 'text-')}`} text-sm rounded-full`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
