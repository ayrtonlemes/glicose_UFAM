<?php
// Configurações de conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "glicose";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Recebe os dados enviados via POST (JSON)
$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    echo json_encode(['error' => 'Erro ao decodificar JSON.']);
    exit;
}

$id_patient = $data['id_patient'] ?? null;
$sensor_type = $data['sensor'] ?? null;
$measurements = $data['measurements'] ?? null;

if ($id_patient === null) {
    echo json_encode(['error' => 'Parâmetro id_patient ausente.']);
    exit;
}
if ($sensor_type !== 'ibi') {
    echo json_encode(['error' => 'Tipo de sensor inválido.']);
    exit;
}
if (!is_array($measurements) || empty($measurements)) {
    echo json_encode(['error' => 'measurements não é um array ou está vazio.']);
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['error' => "Falha na conexão: " . $conn->connect_error]));
}

$check_patient_sql = "SELECT id_patient FROM patient WHERE id_patient = ?";
$check_patient_stmt = $conn->prepare($check_patient_sql);
$check_patient_stmt->bind_param("i", $id_patient);
$check_patient_stmt->execute();
$check_patient_result = $check_patient_stmt->get_result();
if ($check_patient_result->num_rows === 0) {
    echo json_encode(['error' => 'Paciente não encontrado.']);
    exit;
}

// Ordena os measurements por datetime
usort($measurements, function ($a, $b) {
    return strtotime($a['datetime']) - strtotime($b['datetime']);
});

$first_datetime = new DateTime($measurements[0]['datetime']);
$last_datetime = new DateTime(end($measurements)['datetime']);
$interval = $first_datetime->diff($last_datetime);

//if ($interval->i < 5 && $interval->h == 0) {
    //echo json_encode(['message' => 'Intervalo entre o primeiro e o último registro menor que 5 minutos. Dados ignorados.']);
    //exit;
//}

$sql = "INSERT INTO ibi_data (id_patient, datetime, ibi) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Erro ao preparar a consulta: ' . $conn->error]);
    exit;
}

$insert_glicodex_sql = "INSERT INTO glicodex_data (id_patient, datetime) VALUES (?, ?)";
$insert_glicodex_stmt = $conn->prepare($insert_glicodex_sql);
if (!$insert_glicodex_stmt) {
    echo json_encode(['error' => 'Erro ao preparar a inserção na glicodex_data: ' . $conn->error]);
    exit;
}

foreach ($measurements as $measurement) {
    $datetime = $measurement['datetime'] ?? null;
    $ibi = isset($measurement['ibi']) ? floatval($measurement['ibi']) / 1000 : null; // Conversão de ms para s

    if ($datetime === null || $ibi === null || $ibi > 1.8) {
        continue;
    }

    if ($datetime === null || $ibi === null) {
        continue;
    }

    $stmt->bind_param("isd", $id_patient, $datetime, $ibi);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Falha ao inserir os dados na ibi_data.', 'details' => $stmt->error]);
        exit;
    }
}

// Adiciona 5 minutos ao último datetime recebido
$dateTimeObj = new DateTime($datetime);
//$dateTimeObj->modify('+5 minutes');
$datetime_glicodex = $dateTimeObj->format('Y-m-d H:i:s');


$insert_glicodex_stmt->bind_param("is", $id_patient, $datetime_glicodex);
if (!$insert_glicodex_stmt->execute()) {
    echo json_encode(['error' => 'Falha ao inserir os dados na glicodex_data.', 'details' => $insert_glicodex_stmt->error]);
    exit;
}

echo json_encode(['message' => 'Dados inseridos com sucesso.']);
$stmt->close();
$insert_glicodex_stmt->close();
$conn->close();
?>
