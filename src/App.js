import React, { useState, useEffect } from "react";
import axios from "axios";

function CurrencyConverter() {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState("");
  const apiKey = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;


  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangeratesapi.io/v1/latest`,
          {
            params: {
              access_key: apiKey,
            },
          }
        );
        setRates(response.data.rates);
        setError("");
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError("Unable to fetch exchange rates. Please try again.");
      }
    };
    fetchRates();
  }, []);

  const handleConvert = async () => {
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      setError("Invalid currency codes.");
      return;
    }
    const conversionRate = rates[toCurrency] / rates[fromCurrency];
    setConvertedAmount((amount * conversionRate).toFixed(2));
    setError("");
  };

  return (
    <div>
      <h1>Currency Converter</h1>
      <div>
        <label>
          From:
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label>
          To:
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <button onClick={handleConvert}>Convert</button>
      </div>

      {convertedAmount && (
        <p>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CurrencyConverter;
