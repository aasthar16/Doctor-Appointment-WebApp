import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "Admin") {
      fetchMessages();
    }
  }, [user]);

  // 1. Not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 2. Logged in but not admin → show access denied
  if (user?.role !== "Admin") {
    return (
      <section className="page messages">
        <h1>Access Denied</h1>
        <p>You are not authorized to view this page.</p>
      </section>
    );
  }

  return (
    <section className="page messages">
      <h1>Messages</h1>
      <div className="banner">
        {loading ? (
          <h2>Loading...</h2>
        ) : messages.length > 0 ? (
          messages.map((element) => (
            <div className="card" key={element._id}>
              <div className="details">
                <p>
                  First Name: <span>{element.firstName}</span>
                </p>
                <p>
                  Last Name: <span>{element.lastName}</span>
                </p>
                <p>
                  Email: <span>{element.email}</span>
                </p>
                <p>
                  Phone: <span>{element.phone}</span>
                </p>
                <p>
                  Message: <span>{element.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2>No Messages!</h2>
        )}
      </div>
    </section>
  );
};

export default Messages;
