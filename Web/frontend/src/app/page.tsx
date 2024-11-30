'use client'

import { useEffect, useState } from "react";
import PatientMetrics from "./components/PatientMetrics";
import { getAllPatients, PatientProps } from "./services/getPatients";
import PatientInfo from "./components/PatientInfo";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

export default function Home() {
  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProps | null>(null);

  const handleSelectPatient = (event: SelectChangeEvent<Number>) => {
    const patientId = event.target.value;
    const patient = patients.find((p) => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        console.log(patientsData)
        setPatients(patientsData); 
      } catch (error) {
        console.log("Erro ao carregar os dados dos pacientes.");
      }
    };
    fetchPatients();
  }, []);

  return (
    <Box sx={{ padding: '20px', width: "50%" }}>
      <Typography variant="h4">Patient Dashboard</Typography>

      <FormControl sx={{mt: 2, minWidth: "20%"}}>
        <InputLabel id="patient_selector_label" sx={{minWidth: 300, fontSize:"25px"}}>Selecione um Paciente</InputLabel>
        <Select 
          labelId="patient_selector_label"
          id="patient_selector"
          value={selectedPatient? selectedPatient.id : ""} 
          onChange={handleSelectPatient}
          label="Selecione.."
          
        >
          <MenuItem value="">
            <em>Selecione agora</em>
          </MenuItem>
            {patients.map((p) => (
              <MenuItem key={p.id} value = {p.id}>
                {p.name}
              </MenuItem>
            ))}   
        </Select>
      </FormControl>
      
      {selectedPatient && (
        <>
          <PatientInfo selectedPatient={selectedPatient} />
          <PatientMetrics selectedPatient={selectedPatient} />
        </>
      )}
    </Box>
  );
}
