import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loading...',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
