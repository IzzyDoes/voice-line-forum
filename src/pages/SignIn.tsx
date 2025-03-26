
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8 animate-fade-in max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to LeftPlot</h1>
        <p className="text-center text-muted-foreground mb-6">Sign in to join the discussion</p>
        <ClerkSignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          redirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-md rounded-lg border bg-card p-6",
              headerTitle: "text-xl font-semibold text-primary",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border rounded-md bg-background hover:bg-muted",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-input text-foreground focus:ring-2 focus:ring-primary/50",
              footerAction: "text-sm text-primary hover:text-primary/80",
              identityPreview: "border rounded-md bg-background",
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignIn;
