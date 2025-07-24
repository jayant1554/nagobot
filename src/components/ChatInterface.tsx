import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  base_price: number;
  min_price: number;
  image_url: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  offer_amount?: number;
  created_at: string;
}

interface Negotiation {
  id: string;
  current_offer?: number;
  status: string;
}

interface ChatInterfaceProps {
  product: Product;
  onBack: () => void;
}

export const ChatInterface = ({ product, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeNegotiation();
  }, [product.id]);

  const initializeNegotiation = async () => {
    try {
      // Create new negotiation
      const { data: negotiationData, error: negotiationError } = await supabase
        .from('negotiations')
        .insert({
          product_id: product.id,
          status: 'active'
        })
        .select()
        .single();

      if (negotiationError) throw negotiationError;
      
      setNegotiation(negotiationData);

      // Add initial bot message
      const initialMessage = `Hello! I see you're interested in the ${product.name} priced at $${product.base_price}. I'm here to help you get the best deal! What would you like to offer?`;
      
      await addMessage(negotiationData.id, 'bot', initialMessage);
    } catch (error) {
      console.error('Error initializing negotiation:', error);
      toast({
        title: "Error",
        description: "Failed to start negotiation",
        variant: "destructive",
      });
    }
  };

  const addMessage = async (negotiationId: string, sender: 'user' | 'bot', message: string, offerAmount?: number) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          negotiation_id: negotiationId,
          sender,
          message,
          offer_amount: offerAmount
        })
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data as ChatMessage]);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const generateBotResponse = (userOffer: number): { message: string; offer?: number; accepted?: boolean } => {
    const minPrice = product.min_price;
    const basePrice = product.base_price;
    const currentBotOffer = negotiation?.current_offer ? 
      Math.max(negotiation.current_offer, minPrice) : basePrice;

    // Accept if user offers close to base price or matches/exceeds current bot offer
    if (userOffer >= basePrice * 0.95 || userOffer >= currentBotOffer * 0.98) {
      return {
        message: `Great offer! I can accept $${userOffer.toFixed(2)} for the ${product.name}. Deal!`,
        accepted: true
      };
    } 
    
    // If user offer is reasonable, make a counter offer by coming down
    if (userOffer >= minPrice) {
      const gap = currentBotOffer - userOffer;
      const counterOffer = Math.max(minPrice, userOffer + (gap * 0.6));
      
      if (counterOffer <= userOffer + 5) {
        // If we're very close, just accept
        return {
          message: `You drive a hard bargain! I can accept $${userOffer.toFixed(2)} for the ${product.name}. Deal!`,
          accepted: true
        };
      }
      
      return {
        message: `I appreciate your offer of $${userOffer.toFixed(2)}. How about we meet closer at $${counterOffer.toFixed(2)}?`,
        offer: counterOffer
      };
    } 
    
    // User offer is below minimum, make final offer
    const finalOffer = Math.max(minPrice, basePrice * 0.85);
    return {
      message: `I understand you're looking for a good deal, but $${userOffer.toFixed(2)} is quite low. My final offer is $${finalOffer.toFixed(2)}. This is a premium product with great value!`,
      offer: finalOffer
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !negotiation) return;

    setIsLoading(true);
    const userMessage = newMessage;
    setNewMessage("");

    try {
      // Add user message
      await addMessage(negotiation.id, 'user', userMessage);

      // Check if user message contains a price/offer or acceptance
      const offerMatch = userMessage.match(/\$?(\d+(?:\.\d{2})?)/);
      const acceptanceKeywords = ['deal', 'accept', 'agreed', 'ok', 'yes', 'match', 'take it', 'sold', 'confirm'];
      const isAcceptance = acceptanceKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      if (offerMatch) {
        const userOffer = parseFloat(offerMatch[1]);
        
        // Check if user is accepting the current bot offer
        if (isAcceptance && negotiation.current_offer) {
          // User is accepting the current negotiation offer
          await supabase
            .from('negotiations')
            .update({ 
              status: 'accepted',
              final_price: negotiation.current_offer
            })
            .eq('id', negotiation.id);

          await addMessage(negotiation.id, 'bot', `Perfect! Deal confirmed at $${negotiation.current_offer.toFixed(2)} for the ${product.name}. Thank you for your business!`);

          toast({
            title: "Deal Confirmed!",
            description: `Congratulations! You got the ${product.name} for $${negotiation.current_offer.toFixed(2)}`,
          });
        } else {
          // User is making a new offer
          const botResponse = generateBotResponse(userOffer);

          // Update negotiation with current offer
          await supabase
            .from('negotiations')
            .update({ 
              current_offer: userOffer,
              status: botResponse.accepted ? 'accepted' : 'active',
              final_price: botResponse.accepted ? userOffer : null
            })
            .eq('id', negotiation.id);

          // Add bot response
          await addMessage(negotiation.id, 'bot', botResponse.message, botResponse.offer);

          if (botResponse.accepted) {
            toast({
              title: "Deal Accepted!",
              description: `Congratulations! You got the ${product.name} for $${userOffer.toFixed(2)}`,
            });
          }
        }
      } else {
        // General conversation
        const responses = [
          `I understand you're interested in the ${product.name}. Feel free to make an offer!`,
          `This is a high-quality product worth every penny. What price were you thinking?`,
          `I'm here to work with you on the price. What would you like to offer?`,
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await addMessage(negotiation.id, 'bot', randomResponse);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-row items-center space-y-0 pb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-lg">Negotiating: {product.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Starting Price:</span>
              <Badge variant="outline">${product.base_price.toFixed(2)}</Badge>
              {negotiation?.current_offer && (
                <>
                  <span className="text-sm text-muted-foreground">Current Offer:</span>
                  <Badge variant="secondary">${negotiation.current_offer.toFixed(2)}</Badge>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  {message.offer_amount && (
                    <Badge variant="outline" className="mt-2">
                      Offer: ${message.offer_amount.toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or make an offer (e.g., $850)..."
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};