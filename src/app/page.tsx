'use client';

import Link from 'next/link';
import { Wallet, BarChart3, Tags, Download, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Wallet,
    title: 'Track Every Expense',
    description: 'Log expenses in seconds with a clean, intuitive interface. Categorize and add notes for complete records.',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: BarChart3,
    title: 'Visualize Spending',
    description: 'See where your money goes with interactive charts. Understand your spending patterns at a glance.',
    gradient: 'from-purple-500 to-fuchsia-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: Tags,
    title: 'Manage Categories',
    description: 'Create custom categories with colors and icons. Set budgets and track spending against each one.',
    gradient: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
  },
  {
    icon: Download,
    title: 'Export Your Data',
    description: 'Download your expenses as CSV or JSON. Your data stays on your device - no account required.',
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
  },
];

const steps = [
  { step: '1', title: 'Add Your Expenses', description: 'Quickly log what you spent and categorize it.', color: 'bg-gradient-to-br from-violet-500 to-purple-600' },
  { step: '2', title: 'Review Your Dashboard', description: 'See charts and summaries of your spending.', color: 'bg-gradient-to-br from-purple-500 to-fuchsia-600' },
  { step: '3', title: 'Stay on Budget', description: 'Track budgets and adjust your habits over time.', color: 'bg-gradient-to-br from-fuchsia-500 to-pink-600' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-violet-700 shadow-sm backdrop-blur dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
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
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Finances
              </span>
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
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white/80 px-8 text-sm font-medium text-violet-700 shadow-sm backdrop-blur transition-all hover:bg-violet-50 hover:border-violet-300 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/50"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t">
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
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-fuchsia-50/50 dark:from-violet-950/10 dark:via-purple-950/10 dark:to-fuchsia-950/10">
        <div className="container mx-auto px-4 py-20">
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
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color} text-white font-bold text-xl shadow-lg`}
                >
                  {step.step}
                </motion.div>
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-transparent to-violet-50/50 dark:to-violet-950/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-semibold">
              <div className="rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 p-1.5">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              Expenza
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js and IndexedDB. Your data stays local.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
