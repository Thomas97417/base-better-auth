"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

const faqCategories = [
  {
    title: "Subscription & Billing",
    icon: "💳",
    questions: [
      {
        question: "How does the billing cycle work?",
        answer:
          "Our billing cycle starts on the day you subscribe. You'll be billed monthly or annually, depending on your chosen plan. You can change or cancel your subscription at any time, and it will remain active until the end of your current billing period.",
      },
      {
        question: "Can I change my plan later?",
        answer:
          "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll pay immediately for the new plan and gain access to the new features right away, and we'll prorate your billing. When downgrading, the change will take effect at the start of your next billing cycle.",
      },
      {
        question: "What payment methods does the platform accept?",
        answer:
          "The platform accepts all major credit cards (Visa, MasterCard, American Express) and PayPal. For annual subscriptions, we can also accommodate bank transfers - please contact our support team for details.",
      },
    ],
  },
  {
    title: "Features & Usage",
    icon: "⚡",
    questions: [
      {
        question: "What happens when I reach my monthly token limit?",
        answer:
          "When you reach your monthly token limit, you'll be notified. You can either wait for your tokens to reset at the start of your next billing cycle, or upgrade to a higher plan for immediate access to more tokens.",
      },
      {
        question: "Do unused tokens roll over to the next month?",
        answer:
          "Yes, unused tokens will roll over to the next month. This allows you to save tokens for future use.",
      },
      {
        question: "Can I track my token usage?",
        answer:
          "Yes! You can monitor your token usage in real-time from your dashboard. We provide detailed analytics and usage patterns to help you optimize your consumption.",
      },
    ],
  },
  {
    title: "Account Management",
    icon: "👤",
    questions: [
      {
        question: "How do I cancel my subscription?",
        answer:
          "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. We don't offer refunds for partial months of service.",
      },
      {
        question: "What happens to my data if I cancel?",
        answer:
          "Your data remains secure and accessible for 30 days after cancellation. After this period, it will be automatically deleted from our systems. We recommend exporting any important data before cancelling.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="w-full py-8">
      {/* Title Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-2 bg-primary/5 rounded-full mb-4">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find answers to common questions about our services, billing, and
          features. Can&apos;t find what you&apos;re looking for?{" "}
          <Link href="/pricing/faq" className="text-primary hover:underline">
            Contact our support team
          </Link>
          .
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="grid gap-8">
        {faqCategories.map((category) => (
          <Card key={category.title} className="p-6 w-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-2xl font-semibold">{category.title}</h2>
            </div>
            <Accordion type="single" collapsible className="w-full max-w-2xl">
              {category.questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-base hover:cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Still have questions? We&apos;re here to help!
        </p>
        <Button asChild>
          <Link href="/pricing/faq" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
}
