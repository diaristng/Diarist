import React from 'react';
import { AdBuilder } from './components/AdBuilder';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                    Ag
                </div>
                <span className="font-bold text-lg tracking-tight">AdGenius</span>
            </div>
            <nav className="flex gap-4">
               <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
               <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Docs</a>
            </nav>
        </div>
      </header>
      <main>
        <AdBuilder />
      </main>
      <footer className="bg-white border-t border-slate-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AdGenius AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;