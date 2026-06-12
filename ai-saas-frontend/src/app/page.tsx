"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Code2,
  ImageIcon,
  Video,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "AI Chat",
    icon: MessageSquare,
    description: "Natural conversations with memory and context.",
  },
  {
    title: "Code Generation",
    icon: Code2,
    description: "Generate, debug and refactor production code.",
  },
  {
    title: "Image Generation",
    icon: ImageIcon,
    description: "Create images from prompts using modern AI models.",
  },
  {
    title: "Video Generation",
    icon: Video,
    description: "Turn ideas into short videos in minutes.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for exploring the platform.",
    features: ["Chat", "Code", "Image", "Video", "100 credits"],
  },
  {
    name: "Pro",
    price: "$19",
    description: "For creators and developers.",
    features: [
      "Unlimited chat",
      "Code generation",
      "Image generation",
      "Video generation",
      "Priority access",
    ],
  },
  {
    name: "Team",
    price: "$49",
    description: "Built for teams and startups.",
    features: [
      "Shared workspace",
      "Team collaboration",
      "Unlimited history",
      "Premium support",
    ],
  },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Indie Hacker",
    quote: "I cancelled four subscriptions after switching.",
  },
  {
    name: "David Okafor",
    role: "Startup Founder",
    quote: "One prompt creates landing pages, code and images.",
  },
  {
    name: "Priya Natarajan",
    role: "Product Designer",
    quote: "Feels like a real workspace instead of another AI toy.",
  },
];

const faqItems = [
  {
    question: "What is AI Workspace?",
    answer: "A unified AI workspace for chat, code, image and video generation.",
  },
  {
    question: "Which AI models are used?",
    answer: "Gemini, image models and video providers depending on the workspace.",
  },
  {
    question: "Can I save my generations?",
    answer: "Yes. Everything is stored and organized inside your workspace.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. You can start with free credits and upgrade later.",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-40 h-125 w-125 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute right-0 top-0 h-100 w-100 rounded-full bg-blue-500/10 blur-[120px]"
        />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mt-4 flex items-center justify-between rounded-full border bg-background/80 px-5 py-3 backdrop-blur">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded bg-violet-600 p-2 text-white">
                <Sparkles className="size-4" />
              </div>
              <span className="font-semibold">AI Workspace</span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login">
                <Button>Dashboard</Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>

            <Button size="icon" variant="ghost" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="mb-6">
              <Sparkles className="mr-2 size-3" />
              Chat • Code • Image • Video
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              One AI.<br />
              <span className="text-violet-500">
                Infinite<br />Possibilities.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              AI Workspace combines Chat, Code, Image and Video generation into one seamless experience.
            </p>

            <div className="mt-10 flex gap-4">
              <Link href="/dashboard">
                <Button>
                  Open Dashboard
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>

              <Link href="/login">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>

            <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
              <span>✓ Free credits</span>
              <span>✓ No card required</span>
            </div>
          </motion.div>

          {/* Workspace Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded-3xl border bg-card/50 p-5 shadow-2xl backdrop-blur">
              <div className="mb-6 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              <div className="grid gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-center gap-4 rounded-xl border p-4">
                    <feature.icon className="size-5 text-violet-500" />
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border p-4 text-sm text-muted-foreground">
                Ask AI Workspace anything...
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="outline">Features</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Everything you need.<br />Nothing you dont.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Stop switching between AI products. Create, build and ship inside one workspace.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-3xl border bg-card/30 p-8 backdrop-blur transition-all hover:shadow-xl"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <feature.icon className="size-6 text-violet-500" />
              </div>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge variant="outline">How It Works</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Three simple steps.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Go from idea to output in seconds.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Choose a workspace",
              description: "Pick Chat, Code, Image or Video.",
            },
            {
              step: "02",
              title: "Enter a prompt",
              description: "Describe exactly what you want.",
            },
            {
              step: "03",
              title: "Generate instantly",
              description: "Receive AI powered results in seconds.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="rounded-3xl border bg-card/30 p-8"
            >
              <span className="text-5xl font-bold text-violet-500">{item.step}</span>
              <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workspace Showcase */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge variant="outline">Workspace</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Built for creators.<br />Designed for speed.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Everything organized inside one clean dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 overflow-hidden rounded-[32px] border bg-card/40 p-8 shadow-2xl"
        >
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar Mock */}
            <div className="rounded-2xl border p-5">
              <h3 className="font-semibold">AI Workspace</h3>
              <div className="mt-6 space-y-3">
                {["Dashboard", "Chat", "Code", "Image", "Video"].map((item) => (
                  <div key={item} className="rounded-xl border px-4 py-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Mock */}
            <div className="rounded-2xl border p-6">
              <div className="space-y-4">
                <div className="rounded-xl border p-4">
                  Create a modern SaaS landing page using Next.js
                </div>
                <div className="ml-auto max-w-lg rounded-xl border bg-violet-500/10 p-4">
                  I will generate a complete SaaS landing page with authentication, pricing and responsive design.
                </div>
                <div className="rounded-xl border p-4">
                  Generate an image for the hero section.
                </div>
                <div className="ml-auto max-w-lg rounded-xl border bg-violet-500/10 p-4">
                  Image created successfully.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge variant="outline">Pricing</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Start free.<br />Scale when ready.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Simple pricing that grows with your usage.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pricing.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl border p-8 ${
                plan.name === "Pro" ? "border-violet-500 shadow-xl" : ""
              }`}
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <div className="mt-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.price !== "$0" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              <p className="mt-4 text-muted-foreground">{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm">
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full">Get Started</Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge variant="outline">Testimonials</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Loved by creators.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border p-8"
            >
              <p className="text-lg">{testimonial.quote}</p>
              <div className="mt-8">
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge variant="outline">FAQ</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Questions?
          </h2>
        </motion.div>

        <div className="mt-16 space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-2xl border p-6">
              <h3 className="font-semibold">{item.question}</h3>
              <p className="mt-3 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] border bg-linear-to-b from-violet-500/20 to-background px-8 py-24 text-center"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
          <h2 className="text-4xl font-bold md:text-6xl">
            Chat.<br />Code.<br />Image.<br />Video.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            Everything you need in one AI workspace.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">
                Open Dashboard
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg">Sign In</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">AI Workspace</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Chat. Code. Image. Video. All in one place.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/">Home</Link>
              <Link href="/login">Sign In</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>

          <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Workspace. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}