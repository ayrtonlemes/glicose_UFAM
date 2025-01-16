'use client'

import React, { useEffect, useState } from "react";

import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { usePathname } from "next/navigation";
import CaloriesGraphBar from "@/app/components/CaloriesGraph";
import LineGraph from "@/app/components/LineGraph";
import { PatientInfoProps } from "@/app/types/patient";
import { sensorConfigs } from "@/app/types/sensors";
import PredictBox from "./components/PredictBox";
import { getAllPatients } from "./services/getPatients";
import { getDatetime } from "./services/getDatetime";


interface PatientDataProps {
  id_patient: number;
  name: string;
  age: number | string;
  gender: string
}

export default function Home() {
  
  const [patientData, setPatientData] = useState<PatientDataProps | null>(null);
  const [patients, setPatients] = useState<PatientDataProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | undefined>('');
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>('');
  const [selectedDate, setSelectedDate] = useState<string | undefined>('');
  const [datetimeRange, setDatetimeRange] = useState<string[]>([]);
  const [minNav, setMinNav] = useState<number>(0);
  const [maxNav, setMaxNav] = useState<number>(20);
  const allSensors = sensorConfigs;
  
  const pathname = usePathname();

  const handleSensorChange = (event: SelectChangeEvent) => {
    setSelectedSensor(event.target.value as string);
  }

  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatient(event.target.value as string);
  }

  const fetchDatetimeRange = async (id_patient: number, min: number, max: number) => {
      try {
        setLoading(true);
        if(patientData) {
          const data = await getDatetime(patientData?.id_patient, minNav, maxNav);
          const formattedDates = data.map((item: { datetime: string }) => item.datetime);
          setDatetimeRange(formattedDates);
          console.log("RANGE DATETIME: ",formattedDates);
        }
      }catch(err) {
        setError("Erro ao carregar datetimes do paciente");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

  const handleDatetimeChange = (direction: 'next' | 'prev') => {
    const step = 20
    if(minNav >=0) {
      if(direction === 'next') {
        setMinNav((prev) => prev + step);
        setMaxNav((prev) => prev + step);
      } else {
        setMinNav(minNav - 20);
        setMaxNav(maxNav - 20);
      }
    } 
    }

  const id = pathname ? pathname.split("/").filter(Boolean).pop() : null;
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
            const data = await getAllPatients();
            console.log("DATA",data)
            setPatients(data);
            console.log("PATIENTS:", patients);
            console.log("PD", patientData)
            //setError("PacienteNaoEncontrado")
      } catch (err) {
        setError("Erro ao carregar dados do paciente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  },[]);



  useEffect(() => {
    if (patientData) {
      console.log("Dados atualizados do paciente:", patientData);
    }
  }, [patientData, selectedPatient]);

  useEffect(() => {
    if (patients && selectedPatient) {
      const patient = patients.find(p => p.name === selectedPatient);
      console.log("Paciente : ", patient);
      console.log("SelectedPati: ", selectedPatient)
      if(patient) {
        setPatientData(patient); 
        fetchDatetimeRange(patient.id_patient, minNav, maxNav)
      }
    }
    
  }, [selectedPatient, patients, minNav, maxNav]);


  useEffect(() => {
    if (patients) {
      console.log("Updated patients data:", patients);
    }
  }, [patients]); // Esse useEffect será chamado sempre que 'patients' mudar

  if (loading) return <Typography>Carregando dados...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  
  return (
    <Box padding={3}>

      <FormControl sx ={{m: 1, minWidth: 300}}>
        <InputLabel id="patient-selector-label">Selecione um paciente</InputLabel>
        <Select
          labelId="patient-selector-label"
          aria-placeholder="Selecione um paciente"
          value = {selectedPatient ?? "notSelected"}
          onChange={handlePatientChange}
        >
        {patients ? patients.map((patient) => (
              <MenuItem key={patient.id_patient} value={patient.name}>
                {patient.name}
              </MenuItem>
            )) : "Não há pacientes cadastrados."}
        </Select>
      </FormControl>

      {datetimeRange.length > 0 && (
  <Box marginBottom={4}>
    <Typography variant="h6">Selecione um horário:</Typography>
    <Box display="flex" gap={2} overflow="auto">
      {datetimeRange.map((date, index) => (
        <button
          key={index}
          onClick={() => setSelectedDate(date)}
          style={{
            padding: "10px 15px",
            borderRadius: "5px",
            backgroundColor: selectedDate === date ? "#1976d2" : "#f0f0f0",
            color: selectedDate === date ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          {new Date(date).toLocaleString()} {/* Exibe no formato legível */}
        </button>
      ))}
    </Box>
  </Box>
)}


    <Box display="flex" justifyContent="space-between">
        <button onClick={() => handleDatetimeChange('prev')}>Anterior</button>
        <button onClick={() => handleDatetimeChange('next')}>Próximo</button>
    </Box>
    
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={2}
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Box flex={1} component={Paper} padding="2px">
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
            {Object.keys(allSensors).map((key) => (
              <MenuItem key={key} value={key}>
                {allSensors[key].typeSensor}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          
          <Typography>Datetime:</Typography> {/** para pegar o intervalo padrão dos sensores que existem lá.*/}
        </Box>


        {selectedSensor && (

          <LineGraph 
          selectedSensor={sensorConfigs[selectedSensor]} 
          selectedPatient={id!}>
          </LineGraph>
        )}
      </Box>

      <Box flex={1} component={Paper} padding="2px">

        <Typography variant="h6" gutterBottom>
          Registro Alimentar
        </Typography>
        <Box sx={{padding:"2px"}}>
        <CaloriesGraphBar>
          
        </CaloriesGraphBar>

        </Box>
      

      </Box>
    </Box>
    <Box flex={1} component={Paper} margin="2px" padding="4px">
    <PredictBox>
    </PredictBox>
    </Box>
  </Box>
  )
    
}
