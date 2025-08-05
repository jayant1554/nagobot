import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Beauty Boutique
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Where AI meets beauty to create personalized experiences that celebrate your unique style. 
            We believe everyone deserves to feel confident and beautiful.
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-16 bg-white/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Founded with a vision to revolutionize the beauty industry, Beauty Boutique combines 
                  cutting-edge AI technology with premium beauty products to create an unparalleled 
                  shopping experience.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Our AI-powered negotiation system ensures you get the best prices while our carefully 
                  curated product selection guarantees quality and authenticity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We're not just selling beauty products – we're building a community where every 
                  customer feels valued, heard, and beautiful.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-lg p-8 text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize luxury beauty through intelligent technology and personalized service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover-scale">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
              <p className="text-muted-foreground">
                Beauty has no boundaries. We celebrate diversity and cater to all skin tones, types, and preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover-scale">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Leveraging AI to create smarter, more personalized beauty experiences for everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover-scale">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p className="text-muted-foreground">
                Only the finest products from trusted brands make it to our carefully curated collection.
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
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Sarah Chen</h3>
                <Badge variant="secondary" className="mb-2">CEO & Founder</Badge>
                <p className="text-sm text-muted-foreground">
                  Beauty industry veteran with 15+ years experience in luxury cosmetics.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Alex Rodriguez</h3>
                <Badge variant="secondary" className="mb-2">Head of AI</Badge>
                <p className="text-sm text-muted-foreground">
                  Machine learning expert specializing in personalization and recommendation systems.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Maya Patel</h3>
                <Badge variant="secondary" className="mb-2">Product Curator</Badge>
                <p className="text-sm text-muted-foreground">
                  Beauty consultant and makeup artist with expertise in inclusive product selection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;