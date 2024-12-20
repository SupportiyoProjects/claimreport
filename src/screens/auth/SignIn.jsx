import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useSignIn();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn.create({
        identifier: email,
        password,
      });
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 max-w-[480px] p-10 flex flex-col">
        <div className="text-3xl mb-10">🚀</div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-3">Welcome Back</h1>
          <p className="text-gray-600">Enter your credentials to access your account</p>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => signIn.authenticateWithRedirect({
              strategy: "oauth_google",
              redirectUrl: "/dashboard",
            })}
            className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Log in with Google
          </button>
          
          <button 
            onClick={() => signIn.authenticateWithRedirect({
              strategy: "oauth_apple",
              redirectUrl: "/dashboard",
            })}
            className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
            Log in with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Min 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-indigo-600 font-medium hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-[1.2] bg-indigo-600 rounded-l-3xl p-10 text-white hidden lg:flex items-center justify-center">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold mb-4">
            The simplest way to manage your workforce
          </h2>
          <p className="text-lg opacity-90 mb-10">
            Enter your credentials to access your account
          </p>
          
          {/* Dashboard Preview */}
          <div className="bg-white rounded-xl shadow-2xl p-4 mb-10">
            <img 
              src="/dashboard-preview.png" 
              alt="Dashboard Preview" 
              className="w-full rounded-lg"
            />
          </div>

          {/* Partner Logos */}
          <div className="flex items-center justify-center gap-8 opacity-90">
            <img src="/wechat.png" alt="WeChat" className="h-6" />
            <img src="/booking.png" alt="Booking.com" className="h-6" />
            <img src="/google.png" alt="Google" className="h-6" />
            <img src="/spotify.png" alt="Spotify" className="h-6" />
            <img src="/stripe.png" alt="Stripe" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 