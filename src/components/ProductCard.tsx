import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package } from "lucide-react";

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
    <Card className="group h-full flex flex-col shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="aspect-square w-full">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground font-medium border-0 shadow-sm"
        >
          {product.category}
        </Badge>
        
        {/* Stock indicator */}
        <div className="absolute top-3 right-3">
          <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}></div>
        </div>
      </div>

      <CardHeader className="pb-3 flex-1">
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="py-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ${product.base_price.toFixed(2)}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Star className="w-4 h-4 fill-muted text-muted" />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onNegotiate(product.id)}
          disabled={product.stock === 0}
          className={`w-full group/btn relative overflow-hidden ${
            product.stock > 0 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-lg' 
              : 'opacity-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 relative z-10">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">
              {product.stock > 0 ? 'Start Negotiation' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Button hover effect */}
          {product.stock > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};