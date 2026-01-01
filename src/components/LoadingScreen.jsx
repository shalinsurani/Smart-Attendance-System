const LoadingScreen = ({ message = 'Loading your dashboard...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">{message}</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait while we load your data...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
