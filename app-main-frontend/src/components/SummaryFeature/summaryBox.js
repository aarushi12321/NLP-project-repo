import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./summaryFeature.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { SummaryCard } from "./summaryCard";
import { useEffect, useState } from "react";
import axios from "axios";

export function SummaryBox({ isSummaryFeature, toggleSummaryFeatureState }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [noExpanded, setNoExpanded] = useState(true);
  const [cardsData, setCardsData] = useState([]);

  const handleCardClick = (cardId) => {
    setExpandedCard(cardId === expandedCard ? null : cardId);
    setNoExpanded(!noExpanded);
  };

  const createSummary = async (chatHistory) => {
    if (!chatHistory || chatHistory.length === 0) {
      return "No chat content available for summary.";
    }
    const fullText = chatHistory.map((message) => message.text).join("\n");
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Summarize the following chat into a concise summary.",
            },
            { role: "user", content: fullText },
          ],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CHAT_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error generating summary from API:", error);
      return "Error creating summary.";
    }
  };

  const generateTitle = async (chatHistory) => {
    if (!chatHistory || chatHistory.length === 0) {
      return "Untitled Chat Summary";
    }

    const fullText = chatHistory.map((message) => message.text).join("\n");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Create a title for the following chat.",
            },
            { role: "user", content: fullText },
          ],
          max_tokens: 20,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CHAT_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error generating title from API:", error);
      return "Chat Summary";
    }
  };

  const generateWordCloudData = (chatHistory) => {
    const text = chatHistory.map((message) => message.text).join(" ");
    const words = text.split(/\s+/);
    const wordFrequency = {};

    words.forEach((word) => {
      if (word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    return Object.entries(wordFrequency).map(([word, freq]) => ({
      text: word,
      value: freq,
    }));
  };

  useEffect(() => {
    const fetchChatData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/api/chats/getLast10Chats/${userId}`
        );
        const chatHistory = response.data.filter((item) => {
          return item.chatHistory.length > 0;
        });

        const processedChats = await Promise.all(
          chatHistory.map(async (chat, index) => {
            const summary = await createSummary(chat.chatHistory);
            const title = await generateTitle(chat.chatHistory);
            const wordCloudData = generateWordCloudData(chat.chatHistory);

            return {
              id: index + 1,
              title: title,
              content: summary,
              wordCloud: wordCloudData,
            };
          })
        );

        setCardsData(processedChats);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData();
  }, []);

  return (
    <div
      className={`summary-outer-box ${
        isSummaryFeature ? "feature-active-summary" : "feature-inactive-summary"
      }`}
    >
      <button
        className={`close-summary-feature-button ${
          isSummaryFeature
            ? "feature-active-summary"
            : "feature-inactive-summary"
        }`}
        onClick={toggleSummaryFeatureState}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <div className="summary-card-outer-box">
        {cardsData.length > 0 ? (
          cardsData.map((card) => (
            <SummaryCard
              key={card.id}
              title={card.title}
              content={card.content}
              isExpanded={expandedCard === card.id}
              onExpand={() => handleCardClick(card.id)}
              onClose={() => handleCardClick(card.id)}
              wordCloud={card.wordCloud}
              noExpanded={noExpanded}
            />
          ))
        ) : (
          <div className="loading-card">
            <p>Loading summary...</p>
          </div>
        )}
      </div>
    </div>
  );
}
