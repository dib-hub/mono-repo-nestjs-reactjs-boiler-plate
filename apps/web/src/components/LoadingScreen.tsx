export default function LoadingScreen(): JSX.Element {
  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}
