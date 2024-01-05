import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const RecommendationForm = ({ advisor, onSubmit }) => {
  const [movieName, setMovieName] = useState("");
  const [rating, setRating] = useState(3);
  const [rationale, setRationale] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Add any additional validation or processing logic here
    // Then call onSubmit with the form data
    onSubmit({
      movieName,
      rating,
      rationale,
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    // Reset form state and submission status
    setMovieName("");
    setRating(3);
    setRationale("");
    setIsSubmitted(false);
  };

  return (
    <div>
      <h5>Recommendation Form</h5>
      {isSubmitted ? (
        <>
          <Alert variant="success">
            Recommendation submitted successfully!
          </Alert>
        </>
      ) : (
        <Form>
          <Form.Group controlId="recommendation">
            <Form.Label>What do you recommend for the advisor?</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie name ..."
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="rating">
            <Form.Label>How would you rate the advice?</Form.Label>
            <Form.Control
              as="select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="rationale">
            <Form.Label>
              In five sentences or less, explain why {advisor.name} should watch
              the movie you have chosen.
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default RecommendationForm;
