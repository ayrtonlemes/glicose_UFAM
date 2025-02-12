<?php
// Defina as credenciais do banco de dados
$servername = "localhost"; // ou o endereço do seu servidor MySQL
$username = "root"; // seu usuário do banco
$password = ""; // sua senha do banco
$dbname = "glicose"; // nome do seu banco de dados

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Cria a conexão com o MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die(json_encode(['error' => "Falha na conexão: " . $conn->connect_error]));
}

// Prepara a consulta SQL para obter todos os pacientes
$sql = "SELECT * FROM patient";
$result = $conn->query($sql);

// Cria um array para armazenar os dados
$patient_list = array();

// Verifica se há resultados e os armazena no array
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $patient_list[] = $row;
    }
}

// Retorna os dados em formato JSON
echo json_encode($patient_list);

// Fecha a conexão com o banco de dados
$conn->close();
?>
