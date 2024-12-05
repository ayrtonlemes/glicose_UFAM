'use client'
import React, { useEffect, useState } from "react";

import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { getPatientById} from "../../services/getPatientById";
import { usePathname } from "next/navigation";
import CaloriesGraphBar from "@/app/components/CaloriesGraph";
import LineGraph from "@/app/components/LineGraph";
import { PatientInfoProps } from "@/app/types/patient";

const PatientDetails = () => {
  const [patientData, setPatientData] = useState<PatientInfoProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | undefined>('');

  const pathname = usePathname();

  const handleSensorChange = (event: SelectChangeEvent) => {
    setSelectedSensor(event.target.value as string);
  }

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

      {patientData && (
        <Box marginBottom={4}>
          <Typography variant="h6">Informações do Paciente:</Typography>
          <Typography>ID: {patientData.id_patient}</Typography>
          <Typography>Nome: {patientData.name}</Typography>
          <Typography>Idade: {patientData.age}</Typography>
          <Typography>Gênero: {patientData.gender}</Typography>
        </Box>
      )}

      <TableContainer component={Paper} style={{ marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Dados de sensores cardíacos
        </Typography>
        <Box>
          <FormControl sx ={{m: 1, minWidth: 120}}>
            <InputLabel id="sensor-select-label">Escolha o sensor</InputLabel>
            <Select 
              labelId="sensor-select-label"
              value={selectedSensor}
              onChange={handleSensorChange}
              label="Escolha um sensor"
            >
              <MenuItem value="IBI">IBI</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="BVP">BVP</MenuItem>
            </Select>
          </FormControl>
        </Box>
          <LineGraph selectedSensor={selectedSensor ? selectedSensor : ""} selectedPatient={id!}></LineGraph>
      </TableContainer>

      <TableContainer component={Paper} style={{ marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Registro Alimentar
        </Typography>

      <CaloriesGraphBar>
        
      </CaloriesGraphBar>
      </TableContainer>
      {/*
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
      * */}
    </Box>
  );
};

export default PatientDetails;
