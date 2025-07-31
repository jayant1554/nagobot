import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <Card className="h-full flex flex-col gradient-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
      <CardHeader className="pb-3 relative">
        <div className="aspect-square w-full mb-4 overflow-hidden rounded-xl relative group">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {product.category}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              ${product.base_price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${(product.base_price * 1.2).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onNegotiate(product.id)}
          disabled={product.stock === 0}
          className="w-full font-medium group-hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          size="lg"
        >
          {product.stock > 0 ? '💬 Start Negotiation' : '❌ Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};