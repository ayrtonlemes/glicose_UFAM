import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import patientsData from "../mocks/patient001_hr.json"
import patientIBI from "../mocks/patient001_ibi.json"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SelectedSensorProps {
  sensor: string | undefined
}
const LineGraph = (selectedSensor: SelectedSensorProps) => {
  
  //Fazer verificação de qual sensor foi selecionado
  let mockData = selectedSensor.sensor === "HR" ? patientsData.slice(0,400) : patientIBI.slice(0,400); //Selecionado o 
  let patientValues = selectedSensor.sensor === "HR" ? mockData.map((item) => item.value) : mockData.map((item) => item.ibi);

  const timeStampPatient = selectedSensor.sensor === "HR"? mockData.map((item) => item.timestamp.split(' ')) : mockData.map((item) => item.datetime.split(' '))

  const data = {
    labels: timeStampPatient.map((time) => time[1]),
    datasets: [
      {
        label: "HR (BPM)",
        data: patientValues, // Valores do sensor no eixo Y , Y(x)
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        pointRadius: 2,
        tension: 0.4, // Suaviza a linha
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Heart Rate Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (HH:mm:ss)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Heart Rate (BPM)",
        },
        min: 50, // Limite inferior
        max: 140, // Ajustar com base nos dados reais
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineGraph;
