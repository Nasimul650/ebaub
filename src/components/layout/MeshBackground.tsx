'use client';

import React from 'react';

export default function MeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#f4f7fb]">
      {/* Large Blurred Mesh Gradient Blobs */}
      <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-blue-400/25 to-indigo-500/20 blur-3xl" />
      <div className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-bl from-emerald-400/25 to-teal-500/20 blur-3xl" />
      <div className="absolute top-[60%] -left-[10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-amber-300/20 to-orange-400/15 blur-3xl" />
      <div className="absolute -bottom-[15%] right-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tl from-purple-400/20 to-pink-400/15 blur-3xl" />
    </div>
  );
}
