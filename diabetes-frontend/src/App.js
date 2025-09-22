import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodpressure: "",
    skinthickness: "",
    insulin: "",
    bmi: "",
    dpf: "",
    age: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/predict", {
        pregnancies: parseInt(formData.pregnancies),
        glucose: parseFloat(formData.glucose),
        bloodpressure: parseFloat(formData.bloodpressure),
        skinthickness: parseFloat(formData.skinthickness),
        insulin: parseFloat(formData.insulin),
        bmi: parseFloat(formData.bmi),
        dpf: parseFloat(formData.dpf),
        age: parseInt(formData.age)
      });

      setResult(res.data); // save the whole response
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Error connecting to API" });
    }
  };

  return (
    <div style={{ margin: "50px auto", width: "400px", fontFamily: "Arial" }}>
      <h2>🩺 Diabetes Risk Prediction</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label>{key}:</label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Predict
        </button>
      </form>

      {result && !result.error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: result.prediction === 1 ? "#ffcccc" : "#ccffcc"
          }}
        >
          <h3>
            Prediction: {result.prediction === 1 ? "Diabetic" : "Not Diabetic"}
          </h3>
          <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
        </div>
      )}

      {result?.error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#ffcccc"
          }}
        >
          <h3>{result.error}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
