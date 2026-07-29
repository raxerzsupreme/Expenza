'use client';

import Link from 'next/link';
import { Wallet, BarChart3, Tags, Download, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Wallet,
    title: 'Track Every Expense',
    description: 'Log expenses in seconds with a clean, intuitive interface. Categorize and add notes for complete records.',
  },
  {
    icon: BarChart3,
    title: 'Visualize Spending',
    description: 'See where your money goes with interactive charts. Understand your spending patterns at a glance.',
  },
  {
    icon: Tags,
    title: 'Manage Categories',
    description: 'Create custom categories with colors and icons. Set budgets and track spending against each one.',
  },
  {
    icon: Download,
    title: 'Export Your Data',
    description: 'Download your expenses as CSV, JSON, or Excel. Your data stays on your device - no account required.',
  },
];

const steps = [
  { step: '1', title: 'Add Your Expenses', description: 'Quickly log what you spent and categorize it.' },
  { step: '2', title: 'Review Your Dashboard', description: 'See charts and summaries of your spending.' },
  { step: '3', title: 'Stay on Budget', description: 'Track budgets and adjust your habits over time.' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-md border bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground"
          >
            <Sparkles className="h-4 w-4" />
            Personal Expense Tracker
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            Take Control of Your{' '}
            <span className="text-primary">Finances</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg text-muted-foreground md:text-xl"
          >
            Expenza helps you track expenses, visualize spending patterns, and stay on budget.
            Simple, beautiful, and completely offline-first.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-all hover:bg-muted active:scale-[0.98]"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-secondary/50">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground">
              Simple tools to help you understand and manage your money better.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-sm"
              >
                <div className="mb-3 inline-flex rounded-md bg-secondary p-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">
            Three simple steps to better financial awareness.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm"
              >
                {step.step}
              </motion.div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-secondary/50">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Ready to Start?</h2>
            <p className="mb-8 text-muted-foreground">
              No account needed. Your data stays on your device. Start tracking today.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Wallet className="h-4 w-4 text-primary" />
              Expenza
            </div>
            <p className="text-xs text-muted-foreground">
              Built with Next.js and IndexedDB. Your data stays local.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
