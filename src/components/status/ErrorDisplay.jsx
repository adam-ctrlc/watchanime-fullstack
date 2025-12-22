"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function ErrorDisplay({
  title = "Error",
  message,
  retryAction,
  retryText = "Try Again",
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="relative bg-[#121212]/60 backdrop-blur-xl border border-red-500/20 text-white p-8 md:p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl shadow-red-900/10">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 shadow-inner">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3 text-red-100 tracking-tight relative z-10">
          {title}
        </h2>

        {message && (
          <p className="text-red-200/70 mb-8 leading-relaxed relative z-10 border-t border-b border-red-500/10 py-4 mx-4 text-sm md:text-base">
            {message}
          </p>
        )}

        {retryAction && (
          <button
            onClick={retryAction}
            className="relative z-10 group bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">{retryText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
