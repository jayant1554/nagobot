import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, Sparkles, Heart, Star, Palette } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  imageUrl: string;
  readTime: number;
}

const Blog = () => {
  // Mock blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '10 Essential Skincare Tips for Glowing Skin',
      excerpt: 'Discover the secrets to radiant, healthy skin with these expert-approved skincare tips that will transform your daily routine.',
      content: 'Full content here...',
      author: 'Dr. Sarah Chen',
      category: 'skincare',
      publishedAt: '2024-01-15',
      imageUrl: '/placeholder.svg',
      readTime: 5
    },
    {
      id: '2',
      title: 'Spring Makeup Trends 2024: What\'s Hot',
      excerpt: 'Get ready for spring with the hottest makeup trends of 2024. From bold colors to natural looks, we\'ve got you covered.',
      content: 'Full content here...',
      author: 'Maya Patel',
      category: 'makeup',
      publishedAt: '2024-01-12',
      imageUrl: '/placeholder.svg',
      readTime: 7
    },
    {
      id: '3',
      title: 'The Science Behind Anti-Aging Serums',
      excerpt: 'Understanding the ingredients that really work in anti-aging skincare and how to choose the right products for your skin type.',
      content: 'Full content here...',
      author: 'Dr. Alex Rodriguez',
      category: 'skincare',
      publishedAt: '2024-01-10',
      imageUrl: '/placeholder.svg',
      readTime: 8
    },
    {
      id: '4',
      title: 'How to Choose Your Signature Fragrance',
      excerpt: 'Finding the perfect fragrance that reflects your personality and complements your style. A complete guide to fragrance selection.',
      content: 'Full content here...',
      author: 'Isabella Rose',
      category: 'fragrance',
      publishedAt: '2024-01-08',
      imageUrl: '/placeholder.svg',
      readTime: 6
    },
    {
      id: '5',
      title: 'DIY Face Masks for Every Skin Type',
      excerpt: 'Natural, homemade face masks using ingredients from your kitchen. Effective solutions for oily, dry, and sensitive skin.',
      content: 'Full content here...',
      author: 'Maya Patel',
      category: 'skincare',
      publishedAt: '2024-01-05',
      imageUrl: '/placeholder.svg',
      readTime: 4
    },
    {
      id: '6',
      title: 'Makeup Storage and Organization Hacks',
      excerpt: 'Keep your beauty collection organized and easily accessible with these clever storage solutions and organization tips.',
      content: 'Full content here...',
      author: 'Jessica Kim',
      category: 'makeup',
      publishedAt: '2024-01-03',
      imageUrl: '/placeholder.svg',
      readTime: 5
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', icon: Sparkles, count: blogPosts.length },
    { id: 'skincare', name: 'Skincare', icon: Heart, count: blogPosts.filter(p => p.category === 'skincare').length },
    { id: 'makeup', name: 'Makeup', icon: Palette, count: blogPosts.filter(p => p.category === 'makeup').length },
    { id: 'fragrance', name: 'Fragrance', icon: Star, count: blogPosts.filter(p => p.category === 'fragrance').length },
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'skincare': return 'bg-pink-500';
      case 'makeup': return 'bg-purple-500';
      case 'fragrance': return 'bg-blue-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Beauty Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert tips, trends, and tutorials to help you look and feel your best every day.
          </p>
        </div>

        {/* Search and Categories */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 h-12 bg-white/50 backdrop-blur-sm border-white/20"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-auto p-3 hover:bg-white/50"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="flex-1 text-left">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 bg-white/50 backdrop-blur-sm border-white/20 overflow-hidden hover-scale">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-4 left-4 ${getCategoryColor(featuredPost.category)}`}>
                Featured
              </Badge>
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge 
                variant="secondary" 
                className={`w-fit mb-3 ${getCategoryColor(featuredPost.category)} text-white`}
              >
                {featuredPost.category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(featuredPost.publishedAt).toLocaleDateString()}
                </div>
                <span>{featuredPost.readTime} min read</span>
              </div>
              <Button className="w-fit">Read Full Article</Button>
            </CardContent>
          </div>
        </Card>

        {/* Recent Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="bg-white/50 backdrop-blur-sm border-white/20 overflow-hidden hover-scale group">
                <div className="relative h-48">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 ${getCategoryColor(post.category)}`}
                  >
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span>{post.readTime} min</span>
                    </div>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest beauty tips, product reviews, and exclusive offers.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input 
                placeholder="Enter your email" 
                type="email"
                className="bg-white/50 backdrop-blur-sm border-white/20"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Blog;