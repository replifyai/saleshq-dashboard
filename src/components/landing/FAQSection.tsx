import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

type FAQ = {
  q: string;
  a: string;
};

const faqs: FAQ[] = [
  {
    q: "What is Replify?",
    a: "Replify is an AI-powered sales intelligence platform that turns your documents and product data into instant answers, with integrations for Shopify, WhatsApp Business, and website chatbots.",
  },
  {
    q: "How does the AI Q&A work?",
    a: "Ask questions in natural language. Replify searches your indexed content and returns concise answers with source citations so reps can respond confidently and fast.",
  },
  {
    q: "How does Replify learn over time?",
    a: "A closed feedback loop identifies knowledge gaps and continuously improves answers. Teams can review and approve updates so the AI gets smarter every day without manual retraining cycles.",
  },
  {
    q: "Which integrations are available?",
    a: "Out of the box: Shopify (products, inventory context), WhatsApp Business API for customer conversations, Google Drive ingestion, and embeddable 24/7 website chatbots.",
  },
  {
    q: "Can I deploy a chatbot on my website?",
    a: "Yes. You can embed an intelligent chatbot that answers questions 24/7 using your approved knowledge base, with citations and guardrails.",
  },
  {
    q: "Does Replify work with Shopify stores?",
    a: "Yes. Replify connects to Shopify to reference product information and support sales conversations with accurate, real‑time context.",
  },
  {
    q: "Can I connect WhatsApp Business?",
    a: "Yes. Connect your WhatsApp Business API to provide instant, automated, and accurate responses powered by your content.",
  },
  {
    q: "What content types can I upload?",
    a: "Upload PDFs, docs, product catalogs, pricing sheets, images, and videos—or connect Google Drive. Replify processes and organizes content automatically.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Data is encrypted in transit, and your content isn’t used to train shared models. You control what is uploaded and who can access it.",
  },
  {
    q: "Does it support multiple languages?",
    a: "Replify’s Q&A supports many major languages. If you need a specific language or locale, contact us and we’ll confirm current coverage.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams upload content and start asking questions in minutes. Add integrations like Shopify or WhatsApp whenever you’re ready.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Try Replify free for 14 days to experience AI Q&A, the learning loop, and integrations with your own content.",
  },
];

function FAQJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Replify’s AI Q&A, integrations, learning loop, and setup.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="divide-y">
              {faqs.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="px-4 sm:px-6 text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <FAQJsonLd />
    </section>
  );
}

