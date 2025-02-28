import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import { List, Card, Rate, Empty } from "antd";
import axios from "axios";
import "../component/Css/Search_Result_Details.css";

export const SearchResultDetails = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/result");
        setReviews(
          response.data.reviews.filter(
            (review) => review.fake_or_real === "real"
          )
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="result-container_body">
      <Header />
      {loading ? (
        <div>Loading...</div>
      ) : reviews.length > 0 ? (
        <List
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item key={item.original_review}>
              <Card title={item.original_review} extra={item.fake_or_real}>
                <p>{item.summary}</p>
                <Rate disabled defaultValue={parseFloat(item.accuracy) / 20} />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No Real Reviews Available" />
      )}
      <Footer />
    </div>
  );
};
