
import Layout from '@/components/Layout';

const Shipping = () => {
  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">Shipping & Returns</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-serif mb-4">Shipping Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Processing Time</h3>
                <p className="text-muted-foreground">
                  Most orders are processed and shipped within 1-2 business days. Once your order ships, you'll receive a confirmation email with tracking information.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Domestic Shipping (United States)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Standard Shipping:</strong> $5.99 (5-7 business days)
                  </li>
                  <li>
                    <strong>Expedited Shipping:</strong> $12.99 (2-3 business days)
                  </li>
                  <li>
                    <strong>Free shipping</strong> on all orders over $100
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">International Shipping</h3>
                <p className="text-muted-foreground mb-2">
                  We ship to most countries worldwide. International shipping rates are calculated at checkout based on destination, weight, and dimensions.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Standard International:</strong> $15-$45 (7-14 business days)
                  </li>
                  <li>
                    <strong>Expedited International:</strong> $25-$65 (3-7 business days)
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Please note: Customers are responsible for all customs duties, import taxes, and any other fees that may be incurred.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Shipping Restrictions</h3>
                <p className="text-muted-foreground">
                  We currently do not ship to P.O. boxes or APO/FPO addresses. Some restrictions may apply for certain international destinations.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Order Tracking</h3>
                <p className="text-muted-foreground">
                  You can track your order by logging into your account or by using the tracking number provided in your shipping confirmation email.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-serif mb-4">Returns & Exchanges</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Return Policy</h3>
                <p className="text-muted-foreground">
                  We accept returns within 14 days of delivery for most items, provided they are in their original condition with all tags attached and original packaging intact.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Return Process</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Log into your account and navigate to your order history</li>
                  <li>Select the order containing the item(s) you wish to return</li>
                  <li>Click "Request Return" and follow the instructions</li>
                  <li>Print the provided return shipping label</li>
                  <li>Package the item(s) securely in the original packaging if possible</li>
                  <li>Drop off the package at the specified shipping carrier</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Return Shipping</h3>
                <p className="text-muted-foreground">
                  For domestic returns, a flat fee of $7.99 will be deducted from your refund to cover return shipping costs. International return shipping costs are the responsibility of the customer.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Refund Processing</h3>
                <p className="text-muted-foreground">
                  Once we receive and inspect your return, we'll process your refund within 5 business days. Refunds are issued to the original payment method used for the purchase.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Non-Returnable Items</h3>
                <p className="text-muted-foreground">
                  The following items cannot be returned:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                  <li>Items that have been worn, altered, or damaged after receipt</li>
                  <li>Intimate apparel and swimwear</li>
                  <li>Accessories that have been used or removed from original packaging</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Exchanges</h3>
                <p className="text-muted-foreground">
                  We currently do not offer direct exchanges. If you need a different size or color, please return the original item for a refund and place a new order for the desired item.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-cream p-8 rounded-lg">
          <h2 className="text-2xl font-serif mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">What if my item arrives damaged?</h3>
              <p className="text-muted-foreground">
                If your item arrives damaged, please contact our customer service within 48 hours of receipt with photos of the damage. We'll arrange for a return and replacement or refund.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Can I change my shipping address after placing an order?</h3>
              <p className="text-muted-foreground">
                Address changes must be requested within 2 hours of placing your order and before the order is processed. Please contact customer service immediately if you need to change your shipping address.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Do you offer gift wrapping?</h3>
              <p className="text-muted-foreground">
                Yes, we offer gift wrapping services for a flat fee of $5 per item. You can select this option during checkout and include a gift message.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">What if my package shows as delivered but I didn't receive it?</h3>
              <p className="text-muted-foreground">
                If your tracking information shows your package as delivered but you haven't received it, please check with neighbors and at your building's mail room or reception. If you still can't locate it, contact us within 48 hours and we'll work with the shipping carrier to investigate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
