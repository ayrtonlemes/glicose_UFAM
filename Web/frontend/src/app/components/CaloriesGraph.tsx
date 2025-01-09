import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { BarChart } from '@mui/x-charts/BarChart';
import mockedCaloriesPatients from "../mocks/patient001_food_log.json"

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
  

  const patientFoodLog = [
    { label: "calorie", data: mockedCaloriesPatients.map((row) => row.calorie || 0) },
    { label: "total_carb", data: mockedCaloriesPatients.map((row) => row.total_carb || 0) },
    { label: "dietary_fiber", data: mockedCaloriesPatients.map((row) => row.dietary_fiber || 0) },
    { label: "sugar", data: mockedCaloriesPatients.map((row) => row.sugar || 0) },
    { label: "protein", data: mockedCaloriesPatients.map((row) => row.protein || 0) },
    { label: "total_fat", data: mockedCaloriesPatients.map((row) => row.total_fat || 0) },
  ].map((s) => ({
    ...s,  
    highlightScope: { highlight: "series", fade: "global"} as const,
    xAxis: mockedCaloriesPatients.map((row) => row.date || ""),
  }));

  const handleCheckboxChange = (label: string) => {
    setSelectedSeries((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((s) => s !== label)
        : [...prevSelected, label]
    );
  };

  const filteredSeries = patientFoodLog
    .filter((s) => selectedSeries.includes(s.label))
    .map((s) => ({
      ...s,
      data: s.data.slice(0, itemNb),
    }));

  return (
    <Box sx={{ width: '90%' }}>
    <Typography id="series-selection" gutterBottom>
      Selecione as variáveis
    </Typography>
    <FormGroup>
      {patientFoodLog.map((s) => (
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
        height={200}
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
        max={mockedCaloriesPatients.length}
        aria-labelledby="input-item-number"
      />
    </Box>
  );
}


