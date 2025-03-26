import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-center text-4xl font-extrabold text-gray-900">
              Welcome to Better Auth
            </h1>
            <p className="mt-3 text-center text-lg text-gray-600">
              A secure and modern authentication solution
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/sign-in"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in to your account
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create new account
            </Link>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Experience secure authentication with modern features and a
              seamless user experience.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
