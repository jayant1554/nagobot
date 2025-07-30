import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ChatInterface } from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
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
      <div className="min-h-screen bg-background p-4">
        <ChatInterface product={selectedProduct} onBack={handleBackToProducts} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Smart Price
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Negotiation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of shopping with our AI-powered negotiation chatbot. 
              Get the best deals on premium products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium border border-white/30">
                ✨ AI-Powered Negotiations
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium border border-white/30">
                🛡️ Best Price Guaranteed
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce-gentle delay-1000"></div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collection and start negotiating for the best prices
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 animate-fade-in">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-lg font-medium text-muted-foreground">Loading amazing products...</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onNegotiate={handleNegotiate}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground">Check back soon for amazing deals!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
