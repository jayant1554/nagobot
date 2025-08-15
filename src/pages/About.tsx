import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Users, Award, MessageSquare, TrendingUp } from "lucide-react";
const About = () => {
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text mb-6">NAGO-BOT</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered negotiation platform that helps you get the best deals through intelligent conversation. 
            Smart, fair, and efficient price negotiations for everyone.
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-16 bg-white/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Founded with a vision to revolutionize price negotiation, NAGO-BOT combines 
                  cutting-edge AI technology with smart conversation algorithms to create fair 
                  and efficient deal-making experiences.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Our intelligent negotiation system understands market dynamics, user preferences, 
                  and fair pricing to ensure both buyers and sellers get optimal outcomes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We're not just facilitating transactions – we're building a platform where every 
                  negotiation is transparent, fair, and mutually beneficial.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg p-8 text-center">
                <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize fair pricing through intelligent negotiation technology and transparent deal-making.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover-scale">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-muted-foreground">
                Every negotiation is clear and open. We believe in honest communication and fair deal-making for all parties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover-scale">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Intelligence</h3>
              <p className="text-muted-foreground">
                Leveraging advanced AI to create smarter, more efficient negotiation experiences for everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover-scale">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Efficiency</h3>
              <p className="text-muted-foreground">
                Fast, smart negotiations that save time while ensuring optimal outcomes for all participants.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">David Kim</h3>
                <Badge variant="secondary" className="mb-2">CEO & Founder</Badge>
                <p className="text-sm text-muted-foreground">
                  E-commerce and negotiation systems expert with 15+ years in marketplace technologies.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bot className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Alex Rodriguez</h3>
                <Badge variant="secondary" className="mb-2">Head of AI</Badge>
                <p className="text-sm text-muted-foreground">
                  Machine learning expert specializing in conversational AI and intelligent negotiation algorithms.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Lisa Wang</h3>
                <Badge variant="secondary" className="mb-2">Head of Strategy</Badge>
                <p className="text-sm text-muted-foreground">
                  Business strategist and market analyst specializing in pricing optimization and user experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>;
};
export default About;