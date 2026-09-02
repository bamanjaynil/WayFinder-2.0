import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Map, Sparkles, User, Search, BookOpen } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const items = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Search },
    { to: '/trips', label: 'Trips', icon: Map },
    { to: '/compass', label: 'Compass', icon: Compass },
    { to: '/profile', label: 'You', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors ${
                  isActive
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition-all ${
                      isActive ? 'bg-slate-900 text-amber-400' : 'bg-transparent text-current'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
