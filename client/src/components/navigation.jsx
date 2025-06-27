import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <i className="fas fa-marker text-2xl text-blue-600"></i>
            <span className="text-xl font-bold text-gray-900">Scribble Board</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}