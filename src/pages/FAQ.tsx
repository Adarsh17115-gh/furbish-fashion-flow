
import Layout from '@/components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">Frequently Asked Questions</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">How do I know the items are authentic?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    Every item on FurbishStudios undergoes a rigorous authentication process before being listed. Our expert team verifies each piece for authenticity, examining materials, craftsmanship, labels, and other brand-specific identifiers. For luxury items and vintage watches, we provide detailed authenticity information and, when available, original documentation.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">What condition are the pre-loved items in?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    We use a detailed condition rating system for all items:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Like New:</strong> Shows no signs of wear</li>
                    <li><strong>Excellent:</strong> Minimal signs of wear, no visible flaws</li>
                    <li><strong>Very Good:</strong> Minor signs of wear, may have small imperfections</li>
                    <li><strong>Good:</strong> Noticeable wear, may have visible imperfections</li>
                  </ul>
                  <p className="mt-2">
                    All condition details and any imperfections are clearly documented in the product listing with photos.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">How do I return an item?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    We offer a 14-day return policy for most items. To initiate a return:
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Log into your account and go to your order history</li>
                    <li>Select the order containing the item you wish to return</li>
                    <li>Click "Request Return" and follow the prompts</li>
                    <li>Print the provided return shipping label</li>
                    <li>Package the item securely in its original packaging if possible</li>
                    <li>Drop off the package at the specified shipping carrier</li>
                  </ol>
                  <p className="mt-2">
                    Once we receive and inspect the returned item, we'll process your refund within 5 business days.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">Do you ship internationally?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    Yes, we ship to most countries worldwide. International shipping rates vary based on destination, package size, and weight. Delivery times typically range from 7-21 business days for international orders. Please note that customers are responsible for any customs fees, import duties, or taxes that may apply when receiving international shipments.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">How do I sell my items on FurbishStudios?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    To become a seller on FurbishStudios:
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Create or log into your account</li>
                    <li>Navigate to "Become a Seller" in your account dashboard</li>
                    <li>Complete the seller application form</li>
                    <li>Await approval (typically 1-3 business days)</li>
                    <li>Once approved, you can list your items using our seller dashboard</li>
                  </ol>
                  <p className="mt-2">
                    We have quality standards for all items listed on our platform. Our team will review your submissions before they go live. We charge a 15% commission on successful sales.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">How are vintage watch movements serviced?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    All vintage watches on FurbishStudios have been inspected by qualified watchmakers. Unless otherwise stated in the listing, watches have been:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Tested for timekeeping accuracy</li>
                    <li>Examined for proper functionality of all features</li>
                    <li>Checked for water resistance (where applicable)</li>
                  </ul>
                  <p className="mt-2">
                    Many watches have also undergone professional servicing, which is noted in the product description. Service history documentation is provided when available. We recommend having vintage watches serviced every 3-5 years by a qualified watchmaker.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="border rounded-lg p-2">
                <AccordionTrigger className="text-left font-medium px-4">What payment methods do you accept?</AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <p>
                    We accept the following payment methods:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Major credit cards (Visa, Mastercard, American Express, Discover)</li>
                    <li>PayPal</li>
                    <li>Apple Pay</li>
                    <li>Google Pay</li>
                    <li>Bank transfers</li>
                  </ul>
                  <p className="mt-2">
                    All transactions are processed securely through our payment partners. We never store your full credit card details on our servers.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-cream rounded-lg p-6">
            <h2 className="text-xl font-serif mb-4">Still Have Questions?</h2>
            <p className="mb-4">
              Can't find the answer you're looking for? Please feel free to contact our customer support team.
            </p>
            <div className="space-y-3">
              <p>
                <strong>Email:</strong><br />
                <a href="mailto:support@furbishstudios.com" className="text-terracotta hover:underline">
                  support@furbishstudios.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong><br />
                <a href="tel:+1234567890" className="text-terracotta hover:underline">
                  (123) 456-7890
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Hours: Monday-Friday, 9am-5pm EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
