import React, { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

export function AuthPage({ onAuthSuccess }) {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="auth-page">
      {isSignIn ? (
        <SignIn onAuthSuccess={onAuthSuccess} />
      ) : (
        <SignUp onAuthSuccess={onAuthSuccess} />
      )}
      <button onClick={() => setIsSignIn(!isSignIn)}>
        {isSignIn ? 'Switch to Sign Up' : 'Switch to Sign In'}
      </button>
    </div>
  );
}
