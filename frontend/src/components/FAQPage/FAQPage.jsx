import React, { useState } from "react";
import "./FAQPage.scss";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is the estimated delivery time for international orders?",
      answer: "Delivery time varies by location, but most orders are delivered within 7-14 business days.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, and bank transfers for international orders.",
    },
    {
      question: "Can I track my shipment?",
      answer: "Yes, once your order is shipped, you will receive a tracking number via email.",
    },
    {
      question: "Do you offer bulk discounts for large orders?",
      answer: "Yes, we offer discounts for bulk purchases. Please contact our sales team for more details.",
    },
    {
      question: "What is your return policy for international customers?",
      answer: "Returns are accepted within 30 days of delivery. Customers are responsible for return shipping costs.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="faq__page">
      <h1 className="faq__title">Frequently Asked Questions</h1>
      <div className="faq__list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq__item">
            <div
              className={`faq__question ${openIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="toggle-icon">{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && <div className="faq__answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
