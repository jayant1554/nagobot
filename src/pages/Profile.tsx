import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Package, MessageSquare, Settings, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Negotiation {
  id: string;
  product_id: string;
  status: string;
  current_offer: number;
  final_price: number;
  created_at: string;
  products?: {
    name: string;
    image_url: string;
    base_price: number;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNegotiations();
    }
  }, [user]);

  const fetchNegotiations = async () => {
    try {
      const { data, error } = await supabase
        .from('negotiations')
        .select(`
          *,
          products (
            name,
            image_url,
            base_price
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNegotiations(data || []);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      toast({
        title: "Error",
        description: "Failed to load your negotiations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and track your beauty journey</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="negotiations" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Negotiations
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Negotiations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {negotiations.filter(n => n.status === 'active').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {negotiations.filter(n => n.status === 'completed').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    $
                    {negotiations
                      .filter(n => n.status === 'completed' && n.final_price && n.products?.base_price)
                      .reduce((acc, n) => acc + (n.products!.base_price - n.final_price!), 0)
                      .toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="negotiations" className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Your Negotiations</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : negotiations.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No negotiations yet. Start shopping to begin!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {negotiations.map((negotiation) => (
                      <div key={negotiation.id} className="flex items-center gap-4 p-4 rounded-lg border bg-white/30">
                        {negotiation.products?.image_url && (
                          <img 
                            src={negotiation.products.image_url} 
                            alt={negotiation.products.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{negotiation.products?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(negotiation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(negotiation.status)}>
                            {negotiation.status}
                          </Badge>
                          {negotiation.current_offer && (
                            <p className="text-sm mt-1">Offer: ${negotiation.current_offer}</p>
                          )}
                          {negotiation.final_price && (
                            <p className="text-sm font-medium text-green-600">
                              Final: ${negotiation.final_price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Order history coming soon!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This feature will be available once checkout is implemented.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage how you receive updates about your negotiations and orders.
                  </p>
                  <Button variant="outline">Configure Notifications</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Control your privacy settings and data preferences.
                  </p>
                  <Button variant="outline">Privacy Settings</Button>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;