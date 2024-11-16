import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import "./BookFeature.css";

export function BookRecfeature({ isBookfeature, toggleBookFeatureState }) {
  const [chats, setChats] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    if (isBookfeature) {
      axios
        .get(`http://localhost:5001/api/chats/getLast10Chats/${userId}`)
        .then((response) => {
          setChats(response.data);

          let combinedText = "";
          response.data.forEach((chat) => {
            if (chat.chatHistory && chat.chatHistory.length > 0) {
              chat.chatHistory.forEach((message) => {
                combinedText += message.text + " ";
              });
            }
          });

          combinedText = combinedText.trim();

          if (!combinedText) {
            console.error("No text found for the API request.");
            return;
          }

          fetchBookRecommendations(combinedText);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [isBookfeature, userId]);

  const fetchBookRecommendations = async (text) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Based on the following user conversation, please suggest 5 relevant and popular book titles along with their authors. Format the response as 'Title by Author'.",
            },
            { role: "user", content: text },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CHAT_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText = response.data.choices[0].message.content.trim();

      const books = generatedText
        .split("\n")
        .filter((book) => book)
        .map((book) => {
          const cleanedBook = book.replace(/^\d+\.\s/, "").trim();

          const [title, author] = cleanedBook.split(" by ");
          const cleanedTitle =
            title && title !== '""'
              ? title.replace(/\*\*/g, "").trim()
              : "Unknown";
          const cleanedAuthor =
            author && author !== '""'
              ? author.replace(/\*\*/g, "").trim()
              : "Unknown";

          return {
            title: cleanedTitle,
            author: cleanedAuthor,
          };
        });

      setRecommendedBooks(books);
    } catch (error) {
      console.error("Error fetching book recommendations from OpenAI:", error);
    }
  };

  return (
    <div
      className={`book-feature-outer-box ${
        isBookfeature ? "feature-active-book" : "feature-inactive-book"
      }`}
    >
      <button
        className={`close-book-feature-button ${
          isBookfeature ? "feature-active-book" : "feature-inactive-book"
        }`}
        onClick={toggleBookFeatureState}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <div className="book-card-container">
        {recommendedBooks.length > 0 ? (
          recommendedBooks.map((book, index) => (
            <div className="book-card" key={index}>
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">by {book.author}</p>
            </div>
          ))
        ) : (
          <div className="loading-card">
            <p>Loading recommendations...</p>
          </div>
        )}
      </div>
    </div>
  );
}
