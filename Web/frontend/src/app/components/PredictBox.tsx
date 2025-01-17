import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PredictBox() {
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
          <Typography variant="h5" gutterBottom>
            Resultado:
          </Typography>
          <Typography>
            O nível de glicemia de mg/dL foi classificado como:
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
