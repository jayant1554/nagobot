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
      const initialMessage = `Hello! I see you're interested in the ${product.name}. How can I assist you today?`;
      
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

  const callNegotiationAPI = async (userMessage: string) => {
    try {
      const response = await supabase.functions.invoke('negotiate-price', {
        body: {
          userMessage,
          negotiationId: negotiation.id,
          productId: product.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error calling negotiation API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !negotiation) return;

    setIsLoading(true);
    const userMessage = newMessage;
    setNewMessage("");

    try {
      // Add user message
      await addMessage(negotiation.id, 'user', userMessage);

      // Call the LLM-powered negotiation API
      const apiResponse = await callNegotiationAPI(userMessage);

      if (apiResponse.accepted) {
        // Deal was accepted by the LLM
        await supabase
          .from('negotiations')
          .update({ 
            status: 'accepted',
            final_price: apiResponse.finalPrice
          })
          .eq('id', negotiation.id);

        await addMessage(negotiation.id, 'bot', apiResponse.message);

        toast({
          title: "Deal Confirmed!",
          description: `Order ID: ${apiResponse.orderId}`,
        });

        setNegotiation(prev => prev ? { ...prev, status: 'accepted' } : null);
      } else {
        // Continue negotiation
        if (apiResponse.offerAmount) {
          // Update negotiation with the new offer
          await supabase
            .from('negotiations')
            .update({ 
              current_offer: apiResponse.offerAmount,
              status: 'active'
            })
            .eq('id', negotiation.id);

          setNegotiation(prev => prev ? { 
            ...prev, 
            current_offer: apiResponse.offerAmount 
          } : null);
        }

        // Add bot response
        await addMessage(negotiation.id, 'bot', apiResponse.message, apiResponse.offerAmount);
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