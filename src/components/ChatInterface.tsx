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
    <div className="max-w-5xl mx-auto h-[90vh] flex flex-col">
      <Card className="flex-1 flex flex-col beauty-card border-0 overflow-hidden">
        {/* Enhanced Header with Product Context */}
        <CardHeader className="flex-row items-center space-y-0 pb-6 border-b border-border/30 bg-gradient-to-r from-background to-muted/30">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4 hover:bg-primary/10 hover:text-primary rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline font-medium">Back to Store</span>
          </Button>
          
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-playfair font-semibold mb-2">
                  Negotiating: {product.name}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Original Price:</span>
                    <Badge variant="outline" className="bg-background border-border/50 font-playfair">
                      ${product.base_price.toFixed(2)}
                    </Badge>
                  </div>
                  {negotiation?.current_offer && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">AI Offer:</span>
                      <Badge className="bg-primary text-primary-foreground animate-glow font-playfair">
                        ${negotiation.current_offer.toFixed(2)}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">
                        Save ${(product.base_price - negotiation.current_offer).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden flex flex-col p-6">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'} max-w-[80%]`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-inter">{message.message}</p>
                  {message.offer_amount && (
                    <Badge 
                      variant="outline" 
                      className="mt-3 inline-flex items-center gap-2 bg-background/30 border-current/40 backdrop-blur-sm font-playfair"
                    >
                      💸 ${message.offer_amount.toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="chat-bubble-bot">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs opacity-80 font-medium">AI is analyzing your offer...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Enhanced Input Area */}
          <div className="relative">
            <div className="flex gap-3 p-4 bg-gradient-to-r from-background to-muted/20 rounded-2xl border border-border/30 backdrop-blur-sm">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or make an offer..."
                disabled={isLoading}
                className="flex-1 border-0 bg-transparent focus:ring-0 text-sm font-inter placeholder:text-muted-foreground/70"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !newMessage.trim()}
                size="lg"
                className="px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};