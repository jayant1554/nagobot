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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-square w-full mb-3">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <CardDescription className="text-sm">{product.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary">
            ${product.base_price.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onNegotiate(product.id)}
          disabled={product.stock === 0}
          className="w-full"
        >
          {product.stock > 0 ? 'Start Negotiation' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};