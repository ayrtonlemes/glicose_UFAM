import React from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer } from "victory";

const LineGraph = () => {
  // Dados de exemplo com timestamps (substitua pelos seus CSVs)
  const data = [
    { x: new Date(2024, 10, 1, 8, 0), y: 75 }, // Timestamp: 01/11/2024 08:00
    { x: new Date(2024, 10, 1, 9, 0), y: 78 },
    { x: new Date(2024, 10, 1, 10, 0), y: 80 },
    { x: new Date(2024, 10, 1, 11, 0), y: 76 },
    { x: new Date(2024, 10, 1, 12, 0), y: 82 },
  ];

  return (
    <VictoryChart
      theme={VictoryTheme.material} // Tema padrão
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) => `Time: ${datum.x.toLocaleTimeString()} \n Value: ${datum.y}`}
          labelComponent={<VictoryTooltip />}
        />
      }
    >
      <VictoryAxis
        tickFormat={(t) => `${t}:00`} // Formata timestamps no eixo X
        style={{
          tickLabels: { fontSize: 6, padding: 5 },
        }}
      />
      <VictoryAxis
        dependentAxis
        style={{
          tickLabels: { fontSize: 6, padding: 5 },
        }}
      />
      <VictoryLine
        data={data}
        interpolation="natural" // Suaviza as linhas
        style={{
          data: { stroke: "#c43a31", strokeWidth: 2 },
          labels: { fontSize: 5 },
        }}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }, // Animação de carregamento
        }}
      />
    </VictoryChart>
  );
};

export default LineGraph;
