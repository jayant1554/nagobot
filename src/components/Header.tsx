import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sparkles, Heart, LogOut, User } from 'lucide-react';
const Header = () => {
  const {
    user,
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  const getUserInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };
  return <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <Heart className="h-6 w-6 text-primary/70" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">NEGO-BOT</span>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Link to="/auth">
              <Button variant="default" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                Sign In
              </Button>
            </Link>}
        </nav>
      </div>
    </header>;
};
export default Header;