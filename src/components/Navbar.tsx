import React from 'react';
import { Building2, LayoutDashboard, Home as HomeIcon } from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'details' | 'admin';
  setView: (view: 'catalog' | 'details' | 'admin') => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Marca / Logo */}
        <button
          onClick={() => setView('catalog')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 text-stone-100">
            <Building2 className="h-5.5 w-5.5 text-amber-400" />
          </div>
          <div className="text-left">
            <span className="block text-lg font-bold tracking-tight text-stone-900 leading-none">VIVA COSTA RICA</span>
            <span className="block text-[10px] font-semibold tracking-widest text-amber-700 uppercase leading-none mt-0.5">PROPERTIES & INVESTMENTS</span>
          </div>
        </button>

        {/* Enlaces / Navegación */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setView('catalog')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              currentView === 'catalog' || currentView === 'details'
                ? 'bg-stone-100 text-stone-900'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
            id="nav-btn-catalog"
          >
            <HomeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Propiedades</span>
          </button>

          <button
            onClick={() => setView('admin')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              currentView === 'admin'
                ? 'bg-stone-900 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
            id="nav-btn-admin"
          >
            <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Panel Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

