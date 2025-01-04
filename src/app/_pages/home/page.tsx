import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Placeholder blog post data (replace with your actual data fetching)
interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
  excerpt: string;
  date: string;
}

const featuredPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mastering the Art of Mindful Living",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Discover practical techniques to cultivate mindfulness in your daily routine and unlock a more peaceful, centered way of living.",
    date: "October 26, 2024",
  },
  {
    id: 2,
    title: "Unlocking Creativity: A Journey Within",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Explore the depths of your imagination and learn how to tap into your creative potential through inspiring exercises and insightful guidance.",
    date: "October 22, 2024",
  },
  {
    id: 3,
    title: "The Power of Connection: Building Meaningful Relationships",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Dive into the essence of human connection and discover how to foster authentic, supportive relationships that enrich your life.",
    date: "October 18, 2024",
  },
];

const latestPosts: BlogPost[] = [
  ...featuredPosts, // Duplicate featured posts for demo
  {
    id: 4,
    title: "Navigating Change: Embracing Life's Transitions",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Learn how to navigate life's inevitable changes with grace and resilience, turning challenges into opportunities for growth.",
    date: "October 15, 2024",
  },
  {
    id: 5,
    title: "The Science of Happiness: Evidence-Based Strategies for Well-being",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Delve into the science of happiness and discover practical, evidence-based strategies to enhance your well-being and live a more fulfilling life.",
    date: "October 12, 2024",
  },
  {
    id: 6,
    title: "Culinary Adventures: Exploring Global Flavors",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Embark on a culinary journey around the world, exploring diverse flavors, exotic ingredients, and the cultural stories behind each dish.",
    date: "October 9, 2024",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <section className="relative w-full h-screen">
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Welcome to Our Blog
          </h1>
          <p className="mt-4 text-lg text-white sm:text-xl md:text-2xl">
            Your source for insightful articles and engaging content.
          </p>
          <Button
            asChild
            type="button"
            variant="outline"
            size="lg"
            className="mt-8 "
          >
            <Link to="/blogs">Explore Articles</Link>
          </Button>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16">
        <h2 className="mb-10 text-3xl font-bold text-center">Featured Posts</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover w-full h-48"
                />
              </CardHeader>
              <CardContent>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="link">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-gray-100">
        <h2 className="mb-10 text-3xl font-bold text-center">Latest Posts</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover w-full h-48"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">{post.date}</p>
                <Button variant="link">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="px-8 py-12 mx-auto bg-gray-100 rounded-lg md:max-w-xl">
          <h2 className="mb-4 text-2xl font-bold">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-6 text-gray-600">
            Stay updated with our latest articles and news.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-800 text-gray-400">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
          {/* Add social media links here */}
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
