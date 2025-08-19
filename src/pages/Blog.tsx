import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, Brain, Cpu, LineChart, Shield } from "lucide-react";

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
  // Mock AI blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Top 10 AI Trends in 2024",
      excerpt:
        "From generative AI to autonomous agents, discover the most important artificial intelligence trends shaping 2024.",
      content: "Full content here...",
      author: "Jayant Bisht",
      category: "AI",
      publishedAt: "2024-03-10",
      imageUrl: "/placeholder.svg",
      readTime: 6,
    },
    {
      id: "2",
      title: "A Beginner’s Guide to Large Language Models",
      excerpt:
        "Understand what LLMs are, how they work, and why they’re transforming industries from customer support to education.",
      content: "Full content here...",
      author: "Sarah Lee",
      category: "Machine Learning",
      publishedAt: "2024-03-05",
      imageUrl: "/placeholder.svg",
      readTime: 8,
    },
    {
      id: "3",
      title: "How AI is Transforming Healthcare",
      excerpt:
        "From diagnosis to personalized treatment, explore how artificial intelligence is improving patient outcomes.",
      content: "Full content here...",
      author: "Dr. Alex Kumar",
      category: "AI in Healthcare",
      publishedAt: "2024-02-28",
      imageUrl: "/placeholder.svg",
      readTime: 7,
    },
    {
      id: "4",
      title: "Ethics in AI: Challenges and Solutions",
      excerpt:
        "Bias, transparency, and accountability are critical challenges in AI. Learn how experts are tackling them.",
      content: "Full content here...",
      author: "Emily Carter",
      category: "AI Ethics",
      publishedAt: "2024-02-20",
      imageUrl: "/placeholder.svg",
      readTime: 5,
    },
    {
      id: "5",
      title: "Getting Started with Deep Learning",
      excerpt:
        "A simple guide for beginners to understand the fundamentals of deep learning and how to build neural networks.",
      content: "Full content here...",
      author: "Michael Johnson",
      category: "Deep Learning",
      publishedAt: "2024-02-12",
      imageUrl: "/placeholder.svg",
      readTime: 6,
    },
    {
      id: "6",
      title: "AI in Finance: Smarter Trading and Risk Analysis",
      excerpt:
        "Discover how AI models are changing stock market predictions, fraud detection, and risk management.",
      content: "Full content here...",
      author: "Priya Sharma",
      category: "AI in Finance",
      publishedAt: "2024-02-08",
      imageUrl: "/placeholder.svg",
      readTime: 7,
    },
  ];

  const categories = [
    { id: "all", name: "All Posts", icon: Brain, count: blogPosts.length },
    {
      id: "AI",
      name: "AI",
      icon: Cpu,
      count: blogPosts.filter((p) => p.category === "AI").length,
    },
    {
      id: "Machine Learning",
      name: "Machine Learning",
      icon: LineChart,
      count: blogPosts.filter((p) => p.category === "Machine Learning").length,
    },
    {
      id: "AI Ethics",
      name: "AI Ethics",
      icon: Shield,
      count: blogPosts.filter((p) => p.category === "AI Ethics").length,
    },
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI":
        return "bg-blue-500";
      case "Machine Learning":
        return "bg-purple-500";
      case "AI Ethics":
        return "bg-red-500";
      case "AI in Healthcare":
        return "bg-green-500";
      case "Deep Learning":
        return "bg-pink-500";
      case "AI in Finance":
        return "bg-yellow-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Latest insights, tutorials, and research on Artificial Intelligence
            and Machine Learning.
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
              <Badge
                className={`absolute top-4 left-4 ${getCategoryColor(
                  featuredPost.category
                )}`}
              >
                Featured
              </Badge>
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge
                variant="secondary"
                className={`w-fit mb-3 ${getCategoryColor(
                  featuredPost.category
                )} text-white`}
              >
                {featuredPost.category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {featuredPost.title}
              </h2>
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
              <Card
                key={post.id}
                className="bg-white/50 backdrop-blur-sm border-white/20 overflow-hidden hover-scale group"
              >
                <div className="relative h-48">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${getCategoryColor(
                      post.category
                    )}`}
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
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
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
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest AI insights,
              tutorials, and exclusive resources.
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
