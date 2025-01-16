import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function PredictBox() {
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, paddingRight: 2 }}>
          <Typography>
            Aqui será a box falando dos dados do modelo.
          </Typography>
        </Box>

        <Box sx={{ width: '1px', height: '50px', backgroundColor: 'gray' }} />

        <Box sx={{ flex: 1, paddingLeft: 2 }}>
          <Typography variant='h5'>
            Resultado: 
          </Typography>
          <Typography>
            O nível de glicemia de  mg/dL foi classificado como:
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
