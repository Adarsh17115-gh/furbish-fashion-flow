
import Layout from '@/components/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-serif mb-6">About FurbishStudios</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-lg mb-4">
              FurbishStudios was founded in 2021 with a simple mission: to give pre-loved clothing and vintage watches a second life while promoting sustainable fashion.
            </p>
            <p className="mb-4">
              Our platform connects fashion lovers with unique, high-quality pieces at a fraction of their original price, helping reduce fashion waste while keeping you stylish.
            </p>
            <p className="mb-4">
              Every item on our platform is carefully curated and verified for quality and authenticity, ensuring that you receive only the best pre-loved fashion pieces.
            </p>
          </div>
          <div className="bg-cream rounded-lg p-6">
            <h3 className="text-xl font-serif mb-4">Our Values</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">1</span>
                <span><strong>Sustainability</strong> - Extending the lifecycle of quality fashion to reduce waste</span>
              </li>
              <li className="flex items-start">
                <span className="bg-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">2</span>
                <span><strong>Quality</strong> - Ensuring every item meets our high standards</span>
              </li>
              <li className="flex items-start">
                <span className="bg-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">3</span>
                <span><strong>Authenticity</strong> - Verifying each piece for genuine craftsmanship</span>
              </li>
              <li className="flex items-start">
                <span className="bg-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">4</span>
                <span><strong>Community</strong> - Creating a platform that connects like-minded fashion enthusiasts</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-cream-dark p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-serif mb-6">Our Story</h2>
          <p className="mb-4">
            FurbishStudios began when our founder, Emma Richardson, noticed how many quality clothing items and vintage watches were being discarded despite having years of life left in them. As a lifelong vintage fashion enthusiast and watch collector, she believed there was a better way.
          </p>
          <p className="mb-4">
            Starting with just a small collection of curated items from her own closet and those of friends and family, Emma built FurbishStudios from the ground up. Today, we work with carefully selected sellers across the country to bring you the finest pre-loved items.
          </p>
          <p>
            What began as a passion project has evolved into a thriving marketplace for sustainable fashion, with a special focus on women's clothing and vintage watches for all genders.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border p-6 rounded-lg bg-white text-center">
            <div className="text-4xl font-bold text-terracotta mb-2">5000+</div>
            <p className="text-muted-foreground">Items sold</p>
          </div>
          <div className="border p-6 rounded-lg bg-white text-center">
            <div className="text-4xl font-bold text-terracotta mb-2">2000+</div>
            <p className="text-muted-foreground">Happy customers</p>
          </div>
          <div className="border p-6 rounded-lg bg-white text-center">
            <div className="text-4xl font-bold text-terracotta mb-2">98%</div>
            <p className="text-muted-foreground">Satisfaction rate</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
