import express, {Request, Response}  from "express"
import patients from "./patients.json"
import fs from "fs"
import path from "path";
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 5000 //criar a porta em um arquivo env

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json());

app.get('/patients', (req: Request, res: Response)=> {
    try{
        const dataPath = path.join(__dirname, '', 'patientsbd.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
        res.json(data);
    }catch(error) {
        console.log("Erro ao ler o arquivo JSON: ", error)
        res.status(500).json({message: "Erro ao carregar dados dos pacientes"})
    }
})

app.get('/patients/:id', (req: Request, res: Response):void  => {
    try {
        const patientId = parseInt(req.params.id);

        const dataPath = path.join(__dirname, '', 'patientsbd.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        const patient = data.patient.find((p: any) => p.id_patient === patientId);
        const patientData = data.patient_data.filter((pd: any) => pd.id_patient === patientId);
        const foodLog = data.food_log.filter((fl: any) => fl.id_patient === patientId);
        const sensors = data.sensors.filter((s: any) => s.id_patient === patientId);

        if (!patient) {
            res.status(404).json({ message: "Paciente não encontrado" });
            return;
        }

        res.json({
            patient,
            patient_data: patientData,
            food_log: foodLog,
            sensors
        });
    } catch (error) {
        console.log("Erro ao buscar informações do paciente: ", error);
        res.status(500).json({ message: "Erro ao buscar informações do paciente" });
    }
});

app.get("/food_logs/:id_patient", (req: Request, res: Response):void => {
    
    const idPatient = parseInt(req.params.id_patient); 
    if (isNaN(idPatient)) {
      res.status(400).json({ error: "id_patient deve ser um número" });
    }
  
    const dataPath = path.join(__dirname, '', 'patientsbd.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const foodLogs = data.food_log.filter((log) => log.id_patient === idPatient);
  
    if (foodLogs.length === 0) {
      res.status(404).json({ message: "Nenhum food_log encontrado para este paciente." });
    }
  
    res.status(200).json({food_logs: foodLogs });
  });

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})