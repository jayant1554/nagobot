import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bot, Tag } from "lucide-react";
import { useState } from "react";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const PriceNegotiationChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "👋 Hello! I’m your negotiation assistant. The listed price is $120. What’s your offer?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simple mock negotiation logic
    setTimeout(() => {
      let botReply = "🤝 Let me check with the seller...";
      const offer = parseInt(input);
      if (!isNaN(offer)) {
        if (offer >= 110) botReply = "✅ Deal! The seller accepts your offer.";
        else if (offer >= 90) botReply = "⚖️ The seller can agree on $110. Do we have a deal?";
        else botReply = "❌ Sorry, that’s too low. Please make a higher offer.";
      }

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "bot", text: botReply }
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Product Section */}
        <Card className="mb-6 bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" /> Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 items-center">
            <img
              src="/placeholder.svg"
              alt="Product"
              className="w-32 h-32 object-cover rounded-xl border"
            />
            <div>
              <h2 className="text-xl font-semibold mb-2">Smartwatch Pro X</h2>
              <p className="text-muted-foreground">Original Price: <span className="line-through">$150</span></p>
              <p className="text-lg font-bold">$120</p>
              <p className="text-sm text-muted-foreground">You can negotiate with the seller below 👇</p>
            </div>
          </CardContent>
        </Card>

        {/* Chat Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && <Bot className="h-5 w-5 mt-1 text-primary" />}
                <div
                  className={`p-3 rounded-2xl max-w-xs ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && <User className="h-5 w-5 mt-1 text-primary" />}
              </div>
            ))}
          </CardContent>
          <div className="p-4 flex gap-2 border-t border-white/20">
            <Input
              placeholder="Enter your offer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PriceNegotiationChat;
