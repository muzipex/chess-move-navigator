
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ThemeToggle from '@/components/ThemeToggle';
import ChessAnalyzer from '@/components/ChessAnalyzer';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const darkModeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const hasDarkClass = document.documentElement.classList.contains('dark');
          setIsDarkMode(hasDarkClass);
        }
      }
    });
    
    darkModeObserver.observe(document.documentElement, { attributes: true });
    
    return () => darkModeObserver.disconnect();
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Chess Next Move Detector</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <ChessAnalyzer isDarkMode={isDarkMode} />
      </main>
      
      <footer className="border-t mt-12 py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Chess Next Move Detector. Powered by Stockfish.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
