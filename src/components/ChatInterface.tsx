import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, MessageCircle, Sparkles, DollarSign, TrendingDown } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto h-screen flex flex-col p-4">
        {/* Header */}
        <div className="mb-6 animate-slide-in-left">
          <Card className="glass-effect border-0 shadow-elegant">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack} 
                  className="hover:bg-primary/10 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Starting Price:</span>
                        <Badge variant="outline" className="font-semibold">
                          ${product.base_price.toFixed(2)}
                        </Badge>
                      </div>
                      
                      {negotiation?.current_offer && (
                        <div className="flex items-center gap-1 animate-fade-in">
                          <TrendingDown className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">Current Offer:</span>
                          <Badge 
                            variant="secondary" 
                            className="bg-green-100 text-green-700 border-green-200 font-semibold animate-glow-pulse"
                          >
                            ${negotiation.current_offer.toFixed(2)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Negotiator</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col glass-effect border-0 shadow-elegant animate-fade-in">
          <CardContent className="flex-1 overflow-hidden flex flex-col p-6">
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-2xl px-6 py-4 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary to-primary-glow text-white ml-auto'
                          : 'bg-gradient-to-r from-card to-muted/30 border border-border/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                      {message.offer_amount && (
                        <Badge 
                          variant="outline" 
                          className={`mt-3 ${
                            message.sender === 'user' 
                              ? 'bg-white/20 text-white border-white/30' 
                              : 'bg-green-100 text-green-700 border-green-200'
                          }`}
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Offer: ${message.offer_amount.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-muted to-muted-foreground flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">U</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-card to-muted/30 border border-border/50 rounded-2xl px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t border-border/50 pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message or make an offer (e.g., $850)..."
                    disabled={isLoading}
                    className="pr-12 bg-background/50 border-border/50 focus:border-primary transition-colors text-base py-6"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !newMessage.trim()}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 shadow-glow"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Powered by AI</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <span>Press Enter to send</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};