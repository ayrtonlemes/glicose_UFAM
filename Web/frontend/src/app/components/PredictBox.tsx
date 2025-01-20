import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getResultModel } from '../services/getResultModel';

interface PredictBoxProps {
  loading: boolean
}

export default function PredictBox( {loading} : PredictBoxProps) {

  const [result,setResult] = useState<string | null>(null)
  
  const fetchResultData = async () => {
    
    try{
      setResult(null);
      loading = true;
      const response = await getResultModel();
      
      console.log(response);
      if(response) {
        setResult(response[1])
      }
      else {
        setResult("Nenhum dado encontrado");
      }
    }catch(error) {
      setResult("Erro ao obter os dados:");
      console.log(error);
    }finally {
      loading = false
    }
  }
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
            Hipoglicemia: Menor que 70 mg/dL.
          </Typography>
          <Typography>
            Normal: Entre 70 mg/dL e 99 mg/dL.
          </Typography>
          <Typography>
            Pré-diabetes: Entre 100 mg/dL e 125 mg/dL (também chamado de glicemia de jejum alterada).
          </Typography>
          <Typography>
            Diabetes: Igual ou superior a 126 mg/dL em mais de uma medição.
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
          <Stack sx={{flexDirection: 'row', justifyContent: 'space-between', width:'100%', marginBottom: 2}}>
          <Typography variant="h5" gutterBottom>
            Resultado:
          </Typography>
          <Button variant="outlined" onClick={fetchResultData}>Predict glicose</Button>
          </Stack>
          <Typography>
            { `O nível de glicemia de ${Number(result).toFixed(3)} mg/dL foi classificado como:` || "Aguardando previsao..."}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
