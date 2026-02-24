"use client";
import { useState, useMemo } from "react";

export default function ParticipantTable() {
  const [men, setMen] = useState(0);
  const [women, setWomen] = useState(0);

  const total = useMemo(() => men + women, [men, women]);

  return (
    <div className="w-full max-w-370 mx-auto border-2 border-black rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-black text-center py-6 text-2xl font-bold">
        Estimated Participants
      </div>

      {/* Body Section */}
      <div className="grid grid-cols-2 min-h-75">
        {/* MEN COLUMN */}
        <div className="border-r-2 border-black flex flex-col items-center justify-center gap-6 p-16">
          <h3 className="text-xl font-semibold">Men</h3>

          <input
            type="number"
            min="0"
            value={men}
            onChange={(e) => setMen(Number(e.target.value))}
            className="w-40 text-center text-xl border-2 border-gray-400 rounded-lg py-3"
          />
        </div>

        {/* WOMEN COLUMN */}
        <div className="flex flex-col items-center justify-center gap-6 p-16">
          <h3 className="text-xl font-semibold">Women</h3>

          <input
            type="number"
            min="0"
            value={women}
            onChange={(e) => setWomen(Number(e.target.value))}
            className="w-40 text-center text-xl border-2 border-gray-400 rounded-lg py-3"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black text-center py-6 text-xl font-bold">
        Total: {total}
      </div>
    </div>
  );
}
