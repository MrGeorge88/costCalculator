'use client';

export function TailwindTest() {
  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Tailwind Test</h1>
      <p className="text-sm">If you can see this with red background, Tailwind is working!</p>
      <div className="mt-4 flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded"></div>
        <div className="w-4 h-4 bg-green-500 rounded"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
      </div>
    </div>
  );
}
