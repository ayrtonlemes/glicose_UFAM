import React, { useState } from "react";
import { Box, FormControlLabel, Checkbox, Slider, Typography, FormGroup } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import mockedCaloriesPatients from "../mocks/patient001_food_log.json";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CaloriesGraphDonut() {
  const [itemNb, setItemNb] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== "number") {
      return;
    }
    setItemNb(newValue);
  };

  const patientFoodLog = [
    { label: "calorie", data: mockedCaloriesPatients.map((row) => row.calorie || 0) },
    { label: "total_carb", data: mockedCaloriesPatients.map((row) => row.total_carb || 0) },
    { label: "dietary_fiber", data: mockedCaloriesPatients.map((row) => row.dietary_fiber || 0) },
    { label: "sugar", data: mockedCaloriesPatients.map((row) => row.sugar || 0) },
    { label: "protein", data: mockedCaloriesPatients.map((row) => row.protein || 0) },
    { label: "total_fat", data: mockedCaloriesPatients.map((row) => row.total_fat || 0) },
  ];

  const handleCheckboxChange = (label: string) => {
    setSelectedSeries((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((s) => s !== label)
        : [...prevSelected, label]
    );
  };

  const filteredSeries = patientFoodLog
    .filter((s) => selectedSeries.includes(s.label))
    .map((s) => ({
      ...s,
      data: s.data.slice(0, itemNb),
    }));

  // Preparando os dados para o gráfico de donut
  const chartData = {
    labels: filteredSeries.map((s) => s.label),
    datasets: [
      {
        data: filteredSeries.map((s) => s.data.reduce((acc, value) => acc + value, 0)), // Soma dos valores de cada série
        backgroundColor: ["#FF6347", "#3baf9f", "#ffcd56", "#ff9f40", "#36a2eb", "#4bc0c0"], // Cores diferentes para cada segmento
      },
    ],
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, height: 300, margin: "auto" }}>
      <FormGroup sx={{flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap"}}>
        {patientFoodLog.map((s) => (
          <FormControlLabel
            key={s.label}
            control={
              <Checkbox
                checked={selectedSeries.includes(s.label)}
                onChange={() => handleCheckboxChange(s.label)}
              />
            }
            label={s.label}
          />
        ))}
      </FormGroup>

      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
              },
            },
          },
        }}
        height={200} // Definindo a altura do gráfico
        width={200}  // Definindo a largura do gráfico
      />

      <FormControlLabel
        checked={skipAnimation}
        control={<Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />}
        label="Skip Animation"
        labelPlacement="end"
      />

      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={mockedCaloriesPatients.length}
        aria-labelledby="input-item-number"
      />
    </Box>
  );
}
