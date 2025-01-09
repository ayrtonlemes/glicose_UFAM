import React, { useState, useEffect } from "react";
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
import { getPatientSensors } from "../services/getPatientSensors";
import { SensorsProps, TypeSensorsProps } from "../types/sensors";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
  selectedSensor: TypeSensorsProps;
  selectedPatient: string;
}

const LineGraph = ({ selectedSensor, selectedPatient }: SelectedSensorProps) => {
  const pid = Number(selectedPatient);
  const [sensorsData, setSensorsData] = useState<SensorsProps[] | undefined>(undefined);
  const [sensorsData2, setSensorsData2] = useState<[]>()
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  useEffect(() => {
    // Carregar dados de sensores apenas quando selectedPatient mudar
    setLoading(true);
    getPatientSensors(selectedPatient)
      .then((data) => {
        setSensorsData(data);
  
        const dates = Array.from(new Set(data.map((item) => item.registro_date)));
        setUniqueDates(dates);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados dos sensores:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedPatient]); // Recarregar os dados quando selectedPatient mudar

  if (loading) {
    return <div>Carregando ... </div>;
  }

  if (!sensorsData || sensorsData.length === 0) {
    return <div>Sem dados disponíveis para este paciente.</div>;
  }

  // Filtrar dados com base na data selecionada
  const filteredData = selectedDate
    ? sensorsData.filter((item) => item.registro_date === selectedDate)
    : sensorsData;

  let sensorValues: any[] = [];
  let labels: any[] = [];

  if (selectedSensor.typeSensor === "HR") {
    sensorValues = filteredData.map((item) => item.ibi); // Ajuste conforme o campo correto de HR
    labels = filteredData.map((item) => item.registro_time);
  } else if (selectedSensor.typeSensor === "IBI") {
    sensorValues = filteredData.map((item) => item.ibi); // Acessa os dados de IBI
    labels = filteredData.map((item) => item.registro_time);
  } else if (selectedSensor.typeSensor === "BVP") {
    sensorValues = filteredData.map((item) => item.bvp); // Acessa os dados de BVP
    labels = filteredData.map((item) => item.registro_time);
  } else if(selectedSensor.typeSensor === "EDA") {
    sensorValues = filteredData.map((item) => item.eda);
    labels = filteredData.map((item) => item.registro_time);
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: //da pra colocar esse texto padrao no sensorValues
          selectedSensor.typeSensor === "HR"
            ? "HR (BPM)" //tambem fazer para unidades
            : selectedSensor.typeSensor === "IBI"
            ? "IBI"
            : selectedSensor.typeSensor === "EDA" 
            ? "EDA(mS)"
            : "BVP (hg_mm)", 
        data: sensorValues,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        pointRadius: 2,
        tension: 0.4,
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
        text:
          selectedSensor.typeSensor === "HR"
            ? "Heart Rate Over Time"
            : selectedSensor.typeSensor === "IBI"
            ? "Interval Between InnerBeats"
            : selectedSensor.typeSensor === "EDA"
            ? "ElectroDermal Activity"
            : "Blood Volume Pulse",
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
          text:
            selectedSensor.typeSensor === "HR"
              ? "Heart Rate (BPM)"
              : selectedSensor.typeSensor === "IBI"
              ? "IBI(s)"
              : selectedSensor.typeSensor === "EDA"
              ? "ElectroDermal Activity(uS)"
              :"Blood Volume Pulse (hg_mm)",
        },
        min: selectedSensor.min, // Ajuste conforme necessário
        max: selectedSensor.max, // Ajuste conforme necessário
      },
    },
  };

  return (
    <Box sx={{width : '90%'}}>
      <FormControl fullWidth>
        <InputLabel>Selecione a Data</InputLabel>
        <Select
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value)}
          label="Selecione a Data"
        >
          {uniqueDates.map((date) => (
            <MenuItem key={date} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Line data={data} options={options} />
    </Box>
  );
};

export default LineGraph;
