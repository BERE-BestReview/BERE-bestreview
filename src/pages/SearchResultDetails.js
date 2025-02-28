import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import { List, Card, Rate, Empty } from "antd";
import axios from "axios";
import "../component/Css/Search_Result_Details.css";

export const SearchResultDetails = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/result");

        const filteredReviews = response.data.reviews.filter(
          (review) => review.fake_or_real?.toLowerCase() === "real"
        );

        setReviews(filteredReviews);
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
      ) : reviews && reviews.length > 0 ? (
        <List
          className="Detail_List"
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 5,
            total: reviews.length,
            onChange: (page) => {
              console.log(page);
            },
            showSizeChanger: false,
            position: "bottom",
          }}
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item className="Detail_Title" key={item.content}>
              <Card
                title={
                  <h4 className="card-title">{item.name || "No Title"}</h4>
                }
                extra={
                  <span className="card-extra">{item.date || "No Date"}</span>
                }
                className="card-container"
              >
                <div className="content-detail">
                  <p>{item.content || "No Review Content"}</p>
                  <p>
                    <strong>Rating:</strong>
                    <Rate
                      disabled
                      defaultValue={parseFloat(item.rating) || 0}
                    />
                  </p>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty className="empty" description="No Real Reviews Available" />
      )}

      <Footer />
    </div>
  );
};
