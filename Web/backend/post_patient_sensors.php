<?php
// Configurações de conexão com o banco de dados
$servername = "localhost"; // endereço do servidor MySQL
$username = "root"; // usuário do banco
$password = ""; // senha do banco
$dbname = "glicose"; // nome do banco de dados

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Recebe os dados enviados via POST (JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Verifica se a decodificação do JSON foi bem-sucedida
if ($data === null) {
    echo json_encode(['error' => 'Erro ao decodificar JSON.']);
    exit;
}

var_dump($data);

// Acessa os dados do JSON
$sensor_type = isset($data['sensor']) ? $data['sensor'] : null;
$datetime = isset($data['datetime']) ? $data['datetime'] : null;
$ibi_values = isset($data['ibi']) && is_array($data['ibi']) ? $data['ibi'] : null; // Array de valores IBI
$id_patient = isset($data['id_patient']) ? $data['id_patient'] : null;

// Verifica se todos os parâmetros obrigatórios foram fornecidos
if ($sensor_type === null || $datetime === null || $ibi_values === null || $id_patient === null) {
    echo json_encode(['error' => 'Parâmetros insuficientes.']);
    exit;
}

// Conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    die(json_encode(['error' => "Falha na conexão: " . $conn->connect_error]));
}

// Verifica se o id_patient existe na tabela patient
$check_patient_sql = "SELECT id_patient FROM patient WHERE id_patient = ?";
$check_patient_stmt = $conn->prepare($check_patient_sql);
$check_patient_stmt->bind_param("i", $id_patient); // "i" indica que o valor é um inteiro
$check_patient_stmt->execute();
$check_patient_result = $check_patient_stmt->get_result();

if ($check_patient_result->num_rows === 0) {
    echo json_encode(['error' => 'Paciente não encontrado.']);
    exit;
}

// Define a tabela com base no tipo de sensor
if ($sensor_type !== 'ibi') {
    echo json_encode(['error' => 'Tipo de sensor inválido para esta tabela.']);
    exit;
}

// Prepara a consulta SQL para inserção na tabela ibi_data
$sql = "INSERT INTO ibi_data (id_patient, datetime, ibi) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Erro ao preparar a consulta: ' . $conn->error]);
    exit;
}

// Itera sobre o array de valores IBI e insere cada um no banco de dados
foreach ($ibi_values as $ibi) {
    $stmt->bind_param("isd", $id_patient, $datetime, $ibi); // "isd" (inteiro, string, double)
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Falha ao inserir os dados.', 'details' => $stmt->error]);
        exit;
    }
}

echo json_encode(['success' => 'Dados inseridos com sucesso.']);

// Fecha a conexão
$stmt->close();
$conn->close();
?>