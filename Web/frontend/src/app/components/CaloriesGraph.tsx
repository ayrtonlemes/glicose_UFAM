import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { BarChart } from '@mui/x-charts/BarChart';

export default function CaloriesGraphBar() {
  const [itemNb, setItemNb] = React.useState(5); 
  const [selectedSeries, setSelectedSeries] = React.useState<string[]>([]);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };

  const handleCheckboxChange = (label: string) => {
    setSelectedSeries((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((s) => s !== label)
        : [...prevSelected, label]
    );
  };

  const filteredSeries = series
    .filter((s) => selectedSeries.includes(s.label))
    .map((s) => ({
      ...s,
      data: s.data.slice(0, itemNb),
    }));

  return (
    <Box sx={{ width: '100%' }}>
    <Typography id="series-selection" gutterBottom>
      Selecione as variáveis
    </Typography>
    <FormGroup>
      {series.map((s) => (
        <FormControlLabel
          key={s.label}
          control={
            <Checkbox
              checked={selectedSeries.includes(s.label)}
              onChange={() => handleCheckboxChange(s.label)}
            />
          }
          label={s.label}
        />
      ))}
    </FormGroup>
      <BarChart
        height={300}
        series={filteredSeries}
        skipAnimation={skipAnimation}
      />
      <FormControlLabel
        checked={skipAnimation}
        control={
          <Checkbox
            onChange={(event) => setSkipAnimation(event.target.checked)}
          />
        }
        label="Skip Animation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={20}
        aria-labelledby="input-item-number"
      />
    </Box>
  );
}

const highlightScope = {
  highlight: 'series',
  fade: 'global',
} as const;

const series = [
  {
    label: 'calorie',
    data: [2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 1269, 724, 1707],
  },
  {
    label: 'total_carb',
    data: [2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031, 1757],
  },
  {
    label: 'dietary_fiber',
    data: [1145, 1214, 975, 2266, 1768, 2341, 747, 1282, 1780, 1766, 2115],
  },
  {
    label: 'sugar',
    data: [2361, 979, 2430, 1768, 1913, 2342, 1868, 1319, 1038, 2139, 1691],
  },
  {
    label: 'protein',
    data: [968, 1371, 1381, 1060, 1327, 934, 1779, 1361, 878, 1055, 1737],
  },
  {
    label: 'total_fat',
    data: [2316, 1845, 2057, 1479, 1859, 1015, 1569, 1448, 1354, 1007, 799],
  },
].map((s) => ({ ...s, highlightScope }));
