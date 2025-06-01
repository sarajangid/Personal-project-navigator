import React from "react";
import Link from "next/link";

// export default function HomePage() {
//   return (
//     <main className="p-8">
//       <h1 className="text-4xl font-bold mb-8">Welcome to Your Personal Project Navigator</h1>
//       <p className="text-lg text-gray-700 mb-6">Organize your side projects, keep track of ideas, and never lose momentum.</p>
//       <p className="mb-4">Click below to see your projects:</p>
//       <Link href="/projects" className="text-blue-500 hover:underline">
//         View Projects
//       </Link>
//     </main>
//   );
// }

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#ffda77] flex items-center justify-center px-6">
      <div className="max-w-xl text-center bg-white/90 p-10 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Welcome to Your <span style={{ color: '#4a6fa5' }}>Project Navigator</span>
        </h1>

        <p className="text-lg text-gray-700 mb-4">
          Organize your side projects, track ideas, and stay in control.
        </p>

        <p className="text-gray-600 mb-8">Click below to get started:</p>

        <Link
          href="/projects"
          style={{ backgroundColor: 'rgb(74, 111, 165)' }}
          className="inline-block text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          View My Projects
        </Link>
      </div>
    </main>
  );
}