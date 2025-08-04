import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Heart, Mail, Lock, User, Chrome } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const { error } = await signUp(email, password, firstName, lastName);

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
    // Note: Don't set loading to false here as the user will be redirected
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Sparkles className="h-10 w-10 text-primary drop-shadow-lg animate-pulse" />
              <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full blur-xl"></div>
            </div>
            <Heart className="h-8 w-8 text-primary/70 animate-pulse delay-300" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mb-3 tracking-tight">
            Beauty Boutique
          </h1>
          <p className="text-muted-foreground/80 text-lg">
            Your gateway to beauty excellence
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enhanced card with glass morphism effect */}
        <Card className="border-primary/20 shadow-2xl backdrop-blur-sm bg-background/80 border-2">
          <CardHeader className="text-center pb-6 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Continue your beauty journey with us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In Button */}
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
              disabled={isGoogleLoading || isLoading}
            >
              <Chrome className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            {/* Separator with enhanced styling */}
            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground/70 font-medium">
                  or continue with email
                </span>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted/50">
                <TabsTrigger value="signin" className="h-10 data-[state=active]:bg-background data-[state=active]:shadow-md">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="h-10 data-[state=active]:bg-background data-[state=active]:shadow-md">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enhanced footer */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-muted-foreground/70">
            By continuing, you agree to our{" "}
            <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>{" "}
            and{" "}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
            <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;