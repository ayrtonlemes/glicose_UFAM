'use client'
import React, { useEffect, useState } from "react";

import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { getPatientById, PatientData } from "../../services/getPatientById";
import { usePathname } from "next/navigation";
import CaloriesGraphBar from "@/app/components/CaloriesGraph";

const PatientDetails = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const pathname = usePathname();


  const id = pathname ? pathname.split("/").filter(Boolean).pop() : null;
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        if(id) {
            const data = await getPatientById(id);
            console.log(data)
            setPatientData(data);
        }
        else {
            setError("PacienteNaoEncontrado")
        }
      } catch (err) {
        setError("Erro ao carregar dados do paciente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) return <Typography>Carregando dados...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Detalhes do Paciente
      </Typography>

      {patientData && patientData.patient && (
        <Box marginBottom={4}>
          <Typography variant="h6">Informações do Paciente:</Typography>
          <Typography>ID: {patientData.patient.id_patient}</Typography>
          <Typography>Nome: {patientData.patient.name}</Typography>
          <Typography>Idade: {patientData.patient.age}</Typography>
          <Typography>Gênero: {patientData.patient.gender}</Typography>
        </Box>
      )}

      <TableContainer component={Paper} style={{ marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Dados de Variabilidade Cardíaca
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>SDNN</TableCell>
              <TableCell>RMSSD</TableCell>
              <TableCell>LF/HF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientData?.patient_data.map((pd, index) => (
              <TableRow key={index}>
                <TableCell>{pd.date.join(", ")}</TableCell>
                <TableCell>{pd.time.join(", ")}</TableCell>
                <TableCell>{pd.SDNN.join(", ")}</TableCell>
                <TableCell>{pd.RMSSD.join(", ")}</TableCell>
                <TableCell>{pd.LF_HF.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} style={{ marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Registro Alimentar
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Hora Início</TableCell>
              <TableCell>Hora Fim</TableCell>
              <TableCell>Alimento</TableCell>
              <TableCell>Calorias</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientData?.food_log.map((fl, index) => (
              <TableRow key={index}>
                <TableCell>{fl.date.join(", ")}</TableCell>
                <TableCell>{fl.time_begin.join(", ")}</TableCell>
                <TableCell>{fl.time_end.join(", ")}</TableCell>
                <TableCell>{fl.logged_food.join(", ")}</TableCell>
                <TableCell>{fl.calories.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CaloriesGraphBar>
        
      </CaloriesGraphBar>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom>
          Dados dos Sensores
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>EDA</TableCell>
              <TableCell>Glicose</TableCell>
              <TableCell>Temperatura da Pele</TableCell>
              <TableCell>Frequência Cardíaca</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientData?.sensors.map((sensor, index) => (
              <TableRow key={index}>
                <TableCell>{sensor.date.join(", ")}</TableCell>
                <TableCell>{sensor.time.join(", ")}</TableCell>
                <TableCell>{sensor.eda.join(", ")}</TableCell>
                <TableCell>{sensor.glicose_dex.join(", ")}</TableCell>
                <TableCell>{sensor.skin_Temperature.join(", ")}</TableCell>
                <TableCell>{sensor.HR.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientDetails;
