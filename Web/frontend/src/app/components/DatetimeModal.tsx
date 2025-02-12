import { useMemo, useState } from "react";
import { Modal, Box, Typography, Button, MenuItem, Select } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const GlucoseModal = ({ open, handleClose, glucoseReadings, onConfirm }) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  
  const handleConfirmClick = () => {
    if (selectedDate && selectedTime) {
      onConfirm(`${selectedDate} ${selectedTime}`);
      handleClose(); // Fecha o modal após confirmar
    }
  };

  const uniqueDates = useMemo(() => {
    const dateSet = new Set(glucoseReadings.map((entry) => entry.split(" ")[0]));
    return Array.from(dateSet)
  },[glucoseReadings]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const availableTimes = useMemo(() => {
    return glucoseReadings
    .filter((entry) => entry.startsWith(selectedDate))
    .map((entry) => entry.split(" ")[1]);
  },[selectedDate, glucoseReadings]);
  
  const nextTime = useMemo(() => {
    const index = availableTimes.indexOf(selectedTime);
    return index !== -1 && index + 1 < availableTimes.length ? availableTimes[index + 1] : "";
  }, [selectedTime, availableTimes]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Glucose
        </Typography>

        {/* Selecionar Data */}
        <Typography variant="body1">Select a date</Typography>
        <Select
          fullWidth
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        >
          {uniqueDates.map((date) => (
            <MenuItem key={date} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
        
        {/* Selecionar Horário (se data for selecionada) */}
        {selectedDate && (
          <>
            <Typography variant="body1">Select a time</Typography>
            <Select
              fullWidth
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              sx={{ mt: 1, mb: 2 }}
            >
              {availableTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        <Box display="flex" alignItems="center" mt={1} mb={2}>
          <CalendarToday sx={{ mr: 1 }} />
          <Typography variant="body2">{selectedDate}  {selectedTime}</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", borderRadius: 1, textAlign: "center" }}>
          <Typography variant="h4">{selectedDate.split("-")[2]}</Typography> {/*coleta o dia */}
          <Typography variant="body2">{selectedDate}</Typography>
          <Typography variant="h5">{selectedTime}</Typography>
        </Box>
        {/*se existir próximo horario */}
        {nextTime && (
            <>
                <Typography variant="body2" mt={2} color="gray">Next time</Typography>
                <Box sx={{ p: 2, bgcolor: "gray", color: "white", borderRadius: 1, textAlign: "center", mt: 1 }}>
                    <Typography variant="h4">{selectedDate.split("-")[2]}</Typography>
                    <Typography variant="body2">{selectedDate}</Typography>
                    <Typography variant="h5">{nextTime}</Typography>
                </Box>
            </>
        )}
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleConfirmClick} disabled={!selectedTime}>
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default GlucoseModal;
