import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const useCases = [
  {
    icon: "fas fa-lightbulb",
    title: "Brainstorming Sessions",
    description: "Turn ideas into visual concepts with unlimited canvas space and real-time collaboration.",
    tags: ["Creative Teams", "Innovation"],
    gradient: "from-primary/5 to-secondary/5",
    border: "border-primary/10",
    iconBg: "bg-primary"
  },
  {
    icon: "fas fa-project-diagram",
    title: "Project Planning",
    description: "Map out project timelines, dependencies, and milestones with your entire team.",
    tags: ["Project Managers", "Agile"],
    gradient: "from-secondary/5 to-accent/5",
    border: "border-secondary/10",
    iconBg: "bg-secondary"
  },
  {
    icon: "fas fa-edit",
    title: "Design Systems",
    description: "Build and iterate on wireframes, user flows, and design concepts together.",
    tags: ["UX Teams", "Design"],
    gradient: "from-success/5 to-primary/5",
    border: "border-success/10",
    iconBg: "bg-success"
  },
  {
    icon: "fas fa-chalkboard-teacher",
    title: "Remote Teaching",
    description: "Engage students with interactive lessons, diagrams, and collaborative exercises.",
    tags: ["Education", "Training"],
    gradient: "from-accent/5 to-success/5",
    border: "border-accent/10",
    iconBg: "bg-accent"
  },
  {
    icon: "fas fa-handshake",
    title: "Client Presentations",
    description: "Present ideas visually and get real-time feedback from clients and stakeholders.",
    tags: ["Sales", "Consulting"],
    gradient: "from-primary/5 to-accent/5",
    border: "border-primary/10",
    iconBg: "bg-primary"
  },
  {
    icon: "fas fa-code-branch",
    title: "Technical Architecture",
    description: "Design system architectures, database schemas, and technical workflows collaboratively.",
    tags: ["Development", "Architecture"],
    gradient: "from-secondary/5 to-success/5",
    border: "border-secondary/10",
    iconBg: "bg-secondary"
  }
];

export default function UseCasesSection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Perfect for{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              every team
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From brainstorming to execution, Scribble Board adapts to your team's unique workflow and collaboration style.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <Card className={`h-full ${useCase.border} bg-gradient-to-br ${useCase.gradient} to-white hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20`}>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${useCase.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${useCase.icon} text-white text-xl`}></i>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                    {useCase.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {useCase.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-white/60 text-gray-700 border border-gray-200 hover:bg-white/80 transition-colors duration-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}