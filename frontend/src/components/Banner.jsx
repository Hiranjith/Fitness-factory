import React from 'react';
import { Dumbbell } from 'lucide-react';

const Banner = () => {
  return (
    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden flex items-center justify-between p-8 md:p-12 border border-border mt-8">
      {/* Background Image / Gradient Placeholder */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop")',
          backgroundPosition: 'center 60%'
        }}
      ></div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-bg via-bg/80 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row w-full items-start md:items-center justify-between">
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            DISCIPLINE TODAY <br />
            <span className="text-primary">A STRONGER TOMORROW</span>
          </h2>
        </div>
        
        <div className="hidden md:flex flex-col items-center gap-2 mt-4 md:mt-0">
          <div className="flex items-center">
            <img src="/home/app-name.png" alt="Fitness Factory" className="h-16 w-auto object-contain" />
          </div>
          <p className="text-text-secondary text-sm tracking-widest font-medium uppercase mt-2">More than a gym</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
