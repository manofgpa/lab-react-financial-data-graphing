import { useState, useEffect } from "react"
import Chart from "chartjs"

function Graph({ isLoading, priceData }) {
  const [chart, setChart] = useState(null)

  useEffect(() => {
    if (!isLoading) {
      function renderChart() {
        const ctx = document.getElementById("myCanvas").getContext("2d")

        if (chart) {
          chart.destroy()
        }

        const chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(priceData),
            datasets: [
              {
                label: "Bitcoin Price Idex",
                data: Object.values(priceData),
                borderColor: "#0330fc",
                backgroundColor: "#03b1fc",
                fill: true,
              },
            ],
          },
        })

        setChart(chartInstance)
      }

      renderChart()
    }
  }, [isLoading, priceData])

  return <div>{isLoading ? "Carregando..." : <canvas id="myCanvas" />}</div>
}

export default Graph