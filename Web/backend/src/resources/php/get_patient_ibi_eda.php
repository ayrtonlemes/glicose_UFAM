<?php
// Detalhes de conexão com o banco de dados
$servername = "localhost"; // ou o endereço do seu servidor MySQL
$username = "root"; // seu usuário do banco
$password = ""; // sua senha do banco
$dbname = "newglicose"; // nome do seu banco de dados

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Verifica se o id foi passado via GET ou POST
$id_patient = isset($_GET['id']) ? $_GET['id'] : null; // Usando GET, pode usar POST dependendo da sua implementação

// Verifica se o id_patient foi fornecido
if ($id_patient === null) {
    echo json_encode(['error' => 'ID do paciente não fornecido.']);
    exit;
}

// Cria a conexão com o MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Consultando os dados das tabelas 'patient', 'eda_data' e 'ibi_data'
$sql = "
    SELECT p.name, p.age, p.gender, e.eda_value, e.timestamp AS eda_timestamp, i.ibi_value, i.timestamp AS ibi_timestamp
    FROM patient p
    LEFT JOIN eda_data e ON p.id = e.id_patient
    LEFT JOIN ibi_data i ON p.id = i.id_patient
    WHERE p.id = ?
";

// Prepara a consulta SQL
$stmt = $conn->prepare($sql);

// Verifica se a preparação da consulta foi bem-sucedida
if ($stmt === false) {
    echo json_encode(['error' => 'Erro na preparação da consulta.']);
    exit;
}

// Vincula o parâmetro id_patient à consulta
$stmt->bind_param("i", $id_patient); // "i" indica que é um inteiro

// Executa a consulta
$stmt->execute();

// Obtemos os resultados
$result = $stmt->get_result();

// Cria um array para armazenar os dados
$patient_data = array();

// Verifica se há resultados e os armazena no array
while ($row = $result->fetch_assoc()) {
    $patient_data[] = $row;
}

// Retorna os dados em formato JSON
echo json_encode($patient_data);

// Fecha a conexão com o banco de dados
$stmt->close();
$conn->close();
?>
