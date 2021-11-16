import Graph from "./Graph"
import { useState, useEffect } from "react"
import axios from "axios"

function App() {
  const apiUrl = "http://api.coindesk.com/v1/bpi/historical/close.json"

  const [priceData, setPriceData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [currency, setCurrency] = useState("USD")
  const [maxMin, setMaxMin] = useState({ max: 0, min: 0 })
  const [dates, setDates] = useState({ start: "", end: "" })

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(apiUrl)
      .then((response) => {
        setPriceData({ ...response.data[`bpi`] })
        setIsLoading(false)
        formatMaxMin(Object.values(response.data[`bpi`]))
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      })
  }, [])

  const formatMaxMin = (values) => {
    const min = Math.min(...values)
    const max = Math.max(...values)

    setMaxMin({ min, max })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .get(
        apiUrl + `?start=${dates.start}&end=${dates.end}&currency=${currency}`
      )
      .then((response) => {
        setPriceData({ ...response.data[`bpi`] })
        setIsLoading(false)
        formatMaxMin(Object.values(response.data[`bpi`]))
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      })
  }

  const handleChange = (e) => {
    switch (e.target.name) {
      case "start":
        setDates({ ...dates, start: e.target.value })
        break
      case "end":
        setDates({ ...dates, end: e.target.value })
        break
      case "currency":
        setCurrency(e.target.value)
        break
      default:
        break
    }
  }

  return (
    <div className="p-3">
      <div className="d-flex flax-row justify-content-between">
        <div className="filters">
          <h2>Filters</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="start">From:</label>
            <input
              className="m-1"
              type="date"
              name="start"
              value={dates.start}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="end">To:</label>
            <input
              className="m-1"
              type="date"
              name="end"
              value={dates.end}
              onChange={(e) => handleChange(e)}
            />
            <button className="m-1" type="submit">
              Apply filters
            </button>
          </form>
          <div>
            <label htmlFor="currency">Currency:</label>
            <select
              className="m-1"
              name="currency"
              value={currency}
              onChange={handleChange}
            >
              <option value="USD">Dolar</option>
              <option value="EUR">Euro</option>
              <option value="BRL">Real</option>
              <option value="JPY">Japanese Yen</option>
              <option value="GBP">Pound</option>
              <option value="CHF">Swiss Franc</option>
              <option value="CAD">Canadian Dolar</option>
              <option value="CNY">Renminbi</option>
              <option value="ARS">Argentinian Peso</option>
              <option value="TRY">Lira</option>
            </select>
          </div>
        </div>
        <div>
          <h2>Values</h2>
          <p>
            <strong>Max: </strong>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
            }).format(maxMin.max)}
          </p>
          <p>
            <strong>Min: </strong>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
            }).format(maxMin.min)}
          </p>
        </div>
      </div>

      <Graph priceData={priceData} isLoading={isLoading} />
    </div>
  )
}

export default App