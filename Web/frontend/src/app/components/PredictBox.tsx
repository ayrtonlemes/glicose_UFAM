import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getResultModel } from '../services/getResultModel';

interface PredictBoxProps {
  idPatient?: string | null;
  datetime?: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void
}

export default function PredictBox({ idPatient, datetime, loading, setLoading }: PredictBoxProps) {
  const [result, setResult] = useState<string | number | null>(null);
  const [glicoResult, setGlicoResult] = useState<string>('Waiting...');

  const classifyGlico = (value: string | number) => {
    const numericValue = parseFloat(value as string).toFixed(3);
    console.log("value:", numericValue);

    if (parseFloat(numericValue) <= 70) {
      setGlicoResult("Hypoglycemia");
    } else if (parseFloat(numericValue) <= 99) {
      setGlicoResult("Normal");
    } else if (parseFloat(numericValue) <= 125) {
      setGlicoResult("Prediabetes");
    } else {
      setGlicoResult("Diabetes");
    }

    setLoading(false);
  };

  const fetchResultData = async () => {
    try {
      setLoading(true);
      const response = (idPatient && datetime) ? await getResultModel(idPatient, datetime) : ""
      // Buscar os dados
      if (response !== "") {
        const value = response;
        setResult(value); // Atualizar o valor de result
        classifyGlico(value); // Classificar imediatamente
      } else {
        setResult("No data found");
        setGlicoResult("Invalid value");
      }
    } catch (error) {
      console.error("Error getting data:", error);
      setResult("Error getting data");
      setGlicoResult("Invalid value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Seção da esquerda */}
        <Box
          sx={{
            flex: 1,
            paddingRight: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Alinha os textos à esquerda
            textAlign: 'left',        // Garante alinhamento de texto
          }}
        >
          <Typography>
            <Typography component="span" fontWeight="bold">Hypoglycemia:</Typography> Less than 70 mg/dL.
          </Typography>
          <Typography>
            <Typography component="span" fontWeight="bold">Normal:</Typography> Between 70 mg/dL and 99 mg/dL.
          </Typography>
          <Typography>
            <Typography component="span" fontWeight="bold">Prediabetes:</Typography> Between 100 mg/dL and 125 mg/dL (also called impaired fasting blood glucose)
          </Typography>
          <Typography>
            <Typography component="span" fontWeight="bold">Diabetes:</Typography> Equal or higher to 126 mg/dL in more than one measurement.
          </Typography>

        </Box>

        {/* Divisor cinza */}
        <Box sx={{ width: '1px', height: '100%', backgroundColor: 'gray', marginX: 2 }} />

        {/* Seção da direita */}
        <Box
          sx={{
            flex: 1,
            paddingLeft: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Alinha textos à esquerda
            textAlign: 'left',        // Garante alinhamento de texto
          }}
        >
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 2 }}>
            <Typography variant="h5" gutterBottom>
              Result:
            </Typography>
            <Button variant="outlined" onClick={fetchResultData}>Predict glicose</Button>
          </Stack>
          {/* Exibe a mensagem baseada no resultado */}
          <Typography>
            {result && !isNaN(Number(result))
              ? `A blood glucose level of ${parseFloat(result as string).toFixed(3)} mg/dL is estimated as: ${glicoResult}`
              : "Click the button to estimate glucose level"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
