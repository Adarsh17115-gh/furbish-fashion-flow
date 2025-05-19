
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <p className="text-lg mb-6">
              Have a question about an item? Interested in selling with us? Or just want to say hello? We'd love to hear from you!
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" name="name" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" name="subject" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Your Message
                </label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              
              <Button type="submit" className="bg-terracotta hover:bg-terracotta-dark" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div className="bg-cream rounded-lg p-8">
            <h2 className="text-2xl font-serif mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-terracotta mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:hello@furbishstudios.com" className="hover:text-terracotta">
                      hello@furbishstudios.com
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We respond to all emails within 24 hours during business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-terracotta mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-muted-foreground">
                    <a href="tel:+1234567890" className="hover:text-terracotta">
                      (123) 456-7890
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Monday-Friday, 9am-5pm EST
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-terracotta mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Visit Our Showroom</h3>
                  <p className="text-muted-foreground">
                    123 Fashion Avenue<br />
                    Suite 456<br />
                    New York, NY 10001
                  </p>
                  <p className="text-sm text-muted-foreground">
                    By appointment only
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageSquare className="w-5 h-5 text-terracotta mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-muted-foreground">
                    Available on our website during business hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
