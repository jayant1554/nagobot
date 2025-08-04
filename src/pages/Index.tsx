import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ChatInterface } from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  min_price: number;
  image_url: string;
  category: string;
  stock: number;
}
const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('products').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleNegotiate = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };
  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-4">
          <ChatInterface product={selectedProduct} onBack={handleBackToProducts} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-4 hero-text">NAGO BOT</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent-foreground mx-auto mb-6 rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">Experience the future of AI negotiation assistant. Discover premium products and secure your perfect price.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm font-medium">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              AI-Powered Negotiations
            </div>
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Best Price Guarantee
            </div>
            
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-playfair font-semibold text-center mb-2">Curated Collection</h2>
          <p className="text-center text-muted-foreground mb-12">Handpicked essentials for the modern you</p>
        </div>

        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse">
                <div className="beauty-card h-96 bg-muted/30"></div>
              </div>)}
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => <div key={product.id} className="animate-fade-in hover:animate-float" style={{
          animationDelay: `${index * 150}ms`
        }}>
                <ProductCard product={product} onNegotiate={handleNegotiate} />
              </div>)}
          </div>}
      </div>
    </div>
  );
};

export default Index;