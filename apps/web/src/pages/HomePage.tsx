import { useEffect, useState } from 'react';

interface ApiData {
  message: string;
  timestamp: string;
}

export default function HomePage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Monorepo!</h2>
        <p className="text-gray-600">
          This is a full-stack NX monorepo with NestJS backend, React + Tailwind frontend, and
          Prisma database.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">API Status</h3>
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {data && (
          <div className="space-y-2">
            <p className="text-gray-900">
              <span className="font-semibold">Message:</span> {data.message}
            </p>
            <p className="text-gray-900">
              <span className="font-semibold">Time:</span>{' '}
              {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Backend</h4>
          <p className="text-sm text-blue-700">NestJS + PostgreSQL</p>
        </div>
        <div className="bg-green-100 rounded-lg p-6">
          <h4 className="font-semibold text-green-900 mb-2">Frontend</h4>
          <p className="text-sm text-green-700">React + Tailwind CSS</p>
        </div>
        <div className="bg-purple-100 rounded-lg p-6">
          <h4 className="font-semibold text-purple-900 mb-2">Database</h4>
          <p className="text-sm text-purple-700">Prisma ORM</p>
        </div>
      </div>
    </div>
  );
}
