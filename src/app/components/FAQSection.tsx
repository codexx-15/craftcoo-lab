import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'What is your shipping policy?',
    answer: 'We offer free shipping on orders above ₹999. All orders are carefully packaged and shipped within 2-3 business days.'
  },
  {
    id: 2,
    question: 'Can I request a custom painting?',
    answer: 'Yes! We love creating custom pieces. Contact us with your ideas, and our artists will work with you to bring your vision to life.'
  },
  {
    id: 3,
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy for all products. Items must be in original condition with tags attached.'
  },
  {
    id: 4,
    question: 'How long does it take to create a custom painting?',
    answer: 'Custom paintings typically take 2-3 weeks depending on the complexity. We\'ll keep you updated throughout the process.'
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-4xl text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div 
            key={faq.id}
            className="bg-[#E6A8A8]/20 rounded-2xl border-2 border-[#D85C63]/30 overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h3 className="text-lg pr-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {faq.question}
              </h3>
              <ChevronDown 
                className={`w-5 h-5 text-[#D85C63] flex-shrink-0 transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openId === faq.id ? 'max-h-48' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
