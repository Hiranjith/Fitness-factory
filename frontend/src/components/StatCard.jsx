import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-surface rounded-2xl p-4 md:p-6 border border-border flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-shrink-0 items-center justify-center ${bgClass}`}>
        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-text-secondary text-xs md:text-sm font-medium whitespace-nowrap">{title}</p>
        <h2 className="text-xl md:text-2xl font-bold mt-0.5 md:mt-1">{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;
