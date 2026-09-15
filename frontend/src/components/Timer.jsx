import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Timer({ durationMinutes, onTimeUp, onTick }) {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        const nextSec = prev - 1;
        if (onTick) onTick(totalSeconds - nextSec);
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalSeconds]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isWarning = secondsRemaining <= 300 && secondsRemaining > 0;
  const isCritical = secondsRemaining <= 60 && secondsRemaining > 0;

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl border font-mono transition-all ${
      isCritical
        ? 'bg-red-600 text-white border-red-700 pulse-warning'
        : isWarning
        ? 'bg-amber-50 text-amber-900 border-amber-300'
        : 'bg-slate-900 text-white border-slate-800'
    }`}>
      <div className="relative flex items-center justify-center">
        {isCritical || isWarning ? (
          <AlertTriangle className={`w-5 h-5 ${isCritical ? 'text-white' : 'text-amber-600'} animate-bounce`} />
        ) : (
          <Clock className="w-5 h-5 text-rose-400" />
        )}
      </div>

      <div>
        <div className="text-xs font-sans uppercase tracking-wider font-semibold opacity-80 flex items-center justify-between">
          <span>Time Remaining</span>
          {isWarning && <span className="text-[10px] bg-red-500 text-white px-1 rounded ml-1">5m Left</span>}
        </div>
        <div className="text-xl font-bold tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}