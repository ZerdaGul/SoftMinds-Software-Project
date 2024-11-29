import React, { useState } from "react";
import "./FAQPage.scss";
import { Link } from "react-router-dom";

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

  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter FAQs based on the search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery) ||
      faq.answer.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="faq__page">
      <h1 className="faq__title">Frequently Asked Questions</h1>

      {/* Search Bar */}
      <div className="faq__search">
        <input
          type="text"
          placeholder="Search for a question or answer..."
          value={searchQuery}
          onChange={handleSearch}
          className="faq__search-input"
        />
      </div>

      {/* FAQ List */}
      <div className="faq__list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
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
          ))
        ) : (
          <p className="faq__no-results">No results found for "{searchQuery}"</p>
        )}
      </div>
      <div className="faq__more">
          <p>Still have a question?     </p>
          <Link className="faq__more-link"to={'/contactUs'}> Contact us!</Link>
      </div>
    </div>
  );
};

export default FAQPage;
