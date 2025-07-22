import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import React, { useEffect } from 'react';
import { connectWithSocketServer } from '@/lib/socketConn';
import Landing from "@/pages/landing";
import EntryPage from "@/pages/EntryPage";
import NotFound from "@/pages/not-found";
import RoomPage from '@/pages/RoomPage';
import WhiteboardRoom from "@/pages/WhiteboardRoom";

// Separate Router logic
function Router() {
  const [location] = useLocation();

  useEffect(()=>{
    connectWithSocketServer();
  }, []);

  return (
    <div key={location}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/sboard" component={EntryPage} />
        <Route path="/whiteboard/:roomId" component={WhiteboardRoom} />
        <Route path="/room/:roomId" component={RoomPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

// App wrapped in providers and ErrorBoundary
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
