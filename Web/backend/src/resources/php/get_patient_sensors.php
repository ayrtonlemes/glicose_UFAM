<?php
// Defina as credenciais do banco de dados
$servername = "localhost"; // ou o endereço do seu servidor MySQL
$username = "root"; // seu usuário do banco
$password = ""; // sua senha do banco
$dbname = "glicose"; // nome do seu banco de dados

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Verifica se o id foi passado via GET ou POST
$id_patient = isset($_GET['id']) ? $_GET['id'] : null; // Usando GET, pode usar POST dependendo da sua implementação
$sensor_type = isset($_GET['sensor']) ? $_GET['sensor'] : null; // Tipo de sensor
$datetime_selected = isset($_GET['datetime']) ? $_GET['datetime'] : null; // DateTime selecionado
$interval_minutes = 5; // Intervalo fixo de 5 minutos



// Verifica se o id_patient foi fornecido
if ($id_patient === null) {
    echo json_encode(['error' => 'ID do paciente não fornecido.']);
    exit;
}

if ($sensor_type === null) {
    echo json_encode(['error' => 'Tipo de sensor não fornecido.']);
    exit;
}

if ($datetime_selected === null) {
    echo json_encode(['error' => 'Data e hora não fornecidos.']);
    exit;
}

// Cria a conexão com o MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Definir a tabela de acordo com o tipo de sensor
switch ($sensor_type) {
    case 'acc':
        $table = 'acc_data';
        break;
    case 'bvp':
        $table = 'bvp_data';
        break;
    case 'eda':
        $table = 'eda_data';
        break;
    case 'glicodex':
        $table = 'glicodex_data';
        break;
    case 'hr':
        $table='hr_data';
        break;
    case 'ibi':
        $table='ibi_data';
        break;
    case 'temp':
        $table='temp_data';
        break;

    default:
        echo json_encode(['error' => 'Tipo de sensor inválido.']);
        exit;
}

//Tratamento dos 5 minutos
$datetime_obj = new Datetime($datetime_selected);
$datetime_obj->modify('-5 minutes'); // Subtrai 5 minutos
$datetime_before = $datetime_obj->format('Y-m-d H:i:s');

// Prepara a consulta SQL com o id do paciente
$sql = "SELECT * FROM $table WHERE id_patient = ? AND datetime BETWEEN ? AND ?";
$stmt = $conn->prepare($sql);

// Verifica se a preparação da consulta foi bem-sucedida
if ($stmt === false) {
    echo json_encode(['error' => 'Erro na preparação da consulta.']);
    exit;
}

// Vincula o parâmetro id_patient à consulta
$stmt->bind_param("iss", $id_patient, $datetime_before, $datetime_selected); // "i" indica que é um inteiro

// Executa a consulta
$stmt->execute();

// Obtemos os resultados
$result = $stmt->get_result();

// Cria um array para armazenar os dados
$patient_sensors_data = array();

// Verifica se há resultados e os armazena no array
while ($row = $result->fetch_assoc()) {
    $patient_sensors_data[] = $row;
}

// Retorna os dados em formato JSON
echo json_encode($patient_sensors_data);

// Fecha a conexão com o banco de dados
$stmt->close();
$conn->close();
?>
