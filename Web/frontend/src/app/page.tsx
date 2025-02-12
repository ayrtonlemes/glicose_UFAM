'use client'

import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Paper, Backdrop, CircularProgress, Stack, Modal } from "@mui/material";
import { sensorConfigs } from "@/app/types/sensors";
import { getAllPatients } from "./services/getPatients";
import { getDatetime } from "./services/getDatetime";
import LineGraph from "@/app/components/LineGraph";
import CaloriesGraphBar from "@/app/components/CaloriesGraph";
import PredictBox from "./components/PredictBox";
import { getPatientSensors } from "./services/getPatientSensors";
import { Alarm } from "@mui/icons-material";
import GlucoseModal from "./components/DatetimeModal";
import { getAllDatetimePatient } from "./services/getAllDatetimePatient";

interface PatientDataProps {
  id_patient: number;
  name: string;
  age: number | string;
  gender: string;
}

export default function Home() {
  const [patientData, setPatientData] = useState<PatientDataProps | null>(null);
  const [patients, setPatients] = useState<PatientDataProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | undefined>('');
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [datetimeRange, setDatetimeRange] = useState<string[]>([]); //apagar
  const [datetimeList, setDatetimeList] = useState<string[]>([]);
  const [minNav, setMinNav] = useState<number>(0); //apagar
  const [maxNav, setMaxNav] = useState<number>(20); //apagar
  const [sensorData, setSensorData] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const allSensors = sensorConfigs;

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      setError("Erro ao carregar pacientes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchDatetimeRange = useCallback(async (id_patient: number, min: number, limit: number) => {
    try {
      setLoading(true);
      const data = await getDatetime(id_patient, min, limit);
      if (data && data.length > 0) {
        const formattedDates = data.map((item: { datetime: string }) => item.datetime);
        setDatetimeRange(formattedDates);
        console.log("Atualizado datetimeRange:", formattedDates);
      } else {
        setDatetimeRange([]);
      }
    } catch (err) {
      setError("Erro ao carregar datetimes do paciente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDatetimes = useCallback(async (id_patient: number) => {
    try {
      setLoading(true)
      //set message of loading datetimes..maybe..
      const data = await getAllDatetimePatient(id_patient);
      if(data && data.length > 0) {
        const allDates = data.map((item: {datetime: string}) => item.datetime)
        setDatetimeList(allDates);
        console.log("Atualizado todos os datetimes do paciente.")
      } else {
        setDatetimeList([]);
      } 
    } catch(err) {
      setError("Erro ao carregar todos os datetimes");
      console.log(err)
    } finally {
      setLoading(false);
    }
  }, [])

  const fetchSensorsData = useCallback(async (id_patient: number, selectedSensor: string, dateTime: string) => {
    try {
      setLoading(true);
      const data = await getPatientSensors(id_patient, selectedSensor, dateTime)
      console.log(data);
      if(data && data.length > 0) {
        setSensorData(data);
      }
    }catch(err) {
      setError("Erro ao obter dados do sensor do paciente");
      console.log(err);
    }finally {
      setLoading(false);
    }
  }, [])


  const handleConfirm = (dateTime) => {
    if(dateTime) {
      setSelectedDate(dateTime);
      console.log("Recebido e armazenado:",dateTime);
    }
    else {
      console.log("NAO FOI RECEBIDO O DATETIME!!!!");
    }
  }
  const handlePatientChange = (event: SelectChangeEvent) => {
    const selectedName = event.target.value as string;
    setSelectedPatient(selectedName);
    setSensorData([]);
    setSelectedSensor('');
    setSelectedDate('');
    const patient = patients?.find((p) => p.name === selectedName);
    if (patient) {
      setPatientData(patient);
      setMinNav(0);
      fetchDatetimeRange(patient.id_patient, 0, maxNav);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if(selectedPatient && selectedSensor && selectedDate) {
      const patient = patients?.find(p => p.name === selectedPatient);
      if(patient) {
        setSensorData([]);
        fetchSensorsData(patient.id_patient, selectedSensor, selectedDate);
      }
    }
  }, [selectedPatient, selectedSensor, selectedDate, fetchSensorsData]);
  
  useEffect(() => {
    if(patientData) {
      fetchDatetimes(patientData?.id_patient)
    }
  },[patientData]);

  //if (loading) return <Typography>Carregando dados...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (


    <Box padding={3}>
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="patient-selector-label">Select a patient</InputLabel>
        <Select
          labelId="patient-selector-label"
          value={selectedPatient ?? ''}
          onChange={handlePatientChange}
        >
          {patients
            ? patients.map((patient) => (
                <MenuItem key={patient.id_patient} value={patient.name}>
                  {patient.name}
                </MenuItem>
              ))
            : (
                <MenuItem value="" disabled>
                  No patients found.
                </MenuItem>
              )}
        </Select>
      </FormControl>

      {/* Sensores e gráficos */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Box flex={1} component={Paper} padding="2px">
          <Typography variant="h6" gutterBottom>
           Heart Sensor Data
          </Typography>
          <Box sx={{display:"flex", justifyContent: "space-between" }}>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="sensor-select-label">Select a sensor</InputLabel>
            <Select
              labelId="sensor-select-label"
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value as string)}
            >
              {Object.keys(allSensors).map((key) => (
                <MenuItem key={key} value={key}>
                  {allSensors[key].typeSensor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" sx={{mr:5}} onClick={() => setOpen(true)} disabled={patientData? false : true}>Select rangetime</Button>
            

          </Box>

          {selectedSensor && patientData && (
            <LineGraph
              selectedSensor={sensorConfigs[selectedSensor]}
              data={sensorData}
              dateTime={selectedDate}
            />
          )}
        </Box>

        <Box flex={1} component={Paper} padding="2px">
          <Typography variant="h6" gutterBottom>
            Food Data
          </Typography>
          <CaloriesGraphBar id={patientData? patientData.id_patient : 0} dateTime={selectedDate? selectedDate : ""}/>
        </Box>
      </Box>

      <Box flex={1} component={Paper} margin="2px" padding="4px" sx={{textAlign: 'left'}}>
        <PredictBox idPatient={patientData ? patientData.id_patient : null} datetime={selectedDate? selectedDate : ""} loading={loading} setLoading={setLoading}/>
      </Box>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading} // Exibe o Backdrop quando 'loading' for true
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {patientData? <GlucoseModal open={open} handleClose={() => setOpen(false)} glucoseReadings={datetimeList} onConfirm={handleConfirm}></GlucoseModal> : <></>}
    </Box>

  );
}
