import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  image_url: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onNegotiate: (productId: string) => void;
}

export const ProductCard = ({ product, onNegotiate }: ProductCardProps) => {
  return (
    <Card className="beauty-card h-full flex flex-col group overflow-hidden border-0">
      <CardHeader className="pb-3 relative p-0">
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Wishlist Heart */}
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 group/heart">
            <Heart className="w-4 h-4 text-gray-600 group-hover/heart:text-primary transition-colors" />
          </button>
          
          {/* New Badge */}
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
            New
          </Badge>
        </div>
        
        <div className="p-6 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-playfair font-semibold group-hover:text-primary transition-colors mb-1">
                {product.name}
              </CardTitle>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">(127)</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent-foreground/20 text-xs px-2 py-1">
              {product.category}
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-6 pb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground font-playfair">
                ${product.base_price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${(product.base_price * 1.25).toFixed(2)}
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
              20% OFF
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground font-medium">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <span className="text-xs text-primary font-medium">Free shipping</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          onClick={() => onNegotiate(product.id)}
          disabled={product.stock === 0}
          className="w-full font-medium transition-all duration-300 disabled:opacity-50 rounded-xl h-12 font-inter"
          size="lg"
        >
          {product.stock > 0 ? 'Negotiate Price' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};