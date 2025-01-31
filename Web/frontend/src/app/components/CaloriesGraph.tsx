import React, { useState, useRef, useEffect } from "react";
import { Box, FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getPatientFoodData } from "../services/getPatientFoodData";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  id: number;
  dateTime: string;
}

interface SensorData {
  calorie: number;
  carbo: number;
  dietary_fiber: number;
  sugar: number;
  protein: number;
  total_fat: number;
}

export default function CaloriesGraphDonut({ id, dateTime }: Props) {
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [patientFoodLog, setPatientFoodLog] = useState<SensorData[]>([]);
  const chartRef = useRef<any>(null);

  // Buscar dados do backend
  const fetchData = async () => {
    try {
      if(id && dateTime !== "") {
        const data = await getPatientFoodData(id, dateTime);
        setPatientFoodLog(
          data.map((row: any) => ({
            calorie: row.calorie || 0,
            carbo: row.carbo || 0,
            //dietary_fiber: row.dietary_fiber || 0,
            sugar: row.sugar || 0,
            protein: row.protein || 0,
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, dateTime]);

  // Alterar seleção de séries
  const handleCheckboxChange = (label: string) => {
    setSelectedSeries((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((s) => s !== label)
        : [...prevSelected, label]
    );
  };

  // Soma acumulada para o gráfico
  const aggregatedData = selectedSeries.map((label) => {
    const sum = patientFoodLog.reduce((acc, row) => acc + (row[label as keyof SensorData] || 0), 0);
    return { label, value: sum };
  });

  // Configurar os dados para o gráfico
  const chartData = {
    labels: aggregatedData.map((s) => s.label),
    datasets: [
      {
        data: aggregatedData.map((s) => s.value),
        backgroundColor: ["#FF6347", "#3baf9f", "#ffcd56", "#ff9f40", "#36a2eb", "#4bc0c0"], // Cores dos segmentos
      },
    ],
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "auto", overflow: "hidden" }}>
      <FormGroup sx={{ flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap" }}>
        {Object.keys(patientFoodLog[0] || {}).map((label) => (
          <FormControlLabel
            key={label}
            control={
              <Checkbox
                checked={selectedSeries.includes(label)}
                onChange={() => handleCheckboxChange(label)}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Box sx={{ width: "100%", height: "300px", maxWidth: "500px", margin: "auto", overflow: "hidden" }}>
        <Doughnut
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.label}: ${tooltipItem.raw}`, // Exibe valor acumulado no tooltip
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
