<?php
/**
 * Script de envío de formulario de contacto - KONECTA
 * Envía correos a info@konecta.jp
 */

// Configuración de seguridad
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Configuración
$RECIPIENT_EMAIL = 'info@konecta.jp';
$SUBJECT_PREFIX = '[KONECTA WEB]';
$MAX_MESSAGE_LENGTH = 5000;
$REQUIRED_FIELDS = ['name', 'email', 'message'];

// Función de sanitización
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validar email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Anti-spam: Rate limiting por IP
$ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = sys_get_temp_dir() . '/konecta_rate_limit_' . md5($ip) . '.txt';

if (file_exists($rate_limit_file)) {
    $last_submit = (int)file_get_contents($rate_limit_file);
    $time_diff = time() - $last_submit;

    // Máximo 1 envío cada 60 segundos
    if ($time_diff < 60) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Por favor espera ' . (60 - $time_diff) . ' segundos antes de enviar otro mensaje'
        ]);
        exit;
    }
}

// Recoger y sanitizar datos
$data = [];
foreach (['name', 'email', 'company', 'service', 'message'] as $field) {
    $data[$field] = isset($_POST[$field]) ? sanitizeInput($_POST[$field]) : '';
}

// HONEYPOT: Detectar bots
$honeypot = isset($_POST['website']) ? trim($_POST['website']) : '';
if (!empty($honeypot)) {
    // Silenciosamente rechazar (no revelar que es honeypot)
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente'
    ]);
    exit;
}

// Validar campos requeridos
$errors = [];

foreach ($REQUIRED_FIELDS as $field) {
    if (empty($data[$field])) {
        $fieldNames = [
            'name' => 'Nombre',
            'email' => 'Email',
            'message' => 'Mensaje'
        ];
        $errors[] = "El campo '" . ($fieldNames[$field] ?? $field) . "' es requerido";
    }
}

// Validar email
if (!empty($data['email']) && !isValidEmail($data['email'])) {
    $errors[] = "El email no es válido";
}

// Validar longitud del mensaje
if (strlen($data['message']) > $MAX_MESSAGE_LENGTH) {
    $errors[] = "El mensaje es demasiado largo";
}

// Si hay errores, retornar
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

// Mapeo de servicios
$servicios = [
    'representacion' => 'Representación Internacional',
    'ferias' => 'Gestión de Ferias',
    'logistica' => 'Logística Internacional',
    'adaptacion' => 'Adaptación Cultural',
    'asesoria' => 'Asesoría Legal y Normativa',
    'networking' => 'Networking Estratégico',
    'otro' => 'Otro'
];

$servicioNombre = isset($servicios[$data['service']]) ? $servicios[$data['service']] : $data['service'];

// Construir el mensaje
$email_subject = $SUBJECT_PREFIX . ' Nueva consulta de ' . $data['name'];

$email_body = "=== NUEVA CONSULTA DESDE LA WEB ===\n\n";
$email_body .= "Nombre: " . $data['name'] . "\n";
$email_body .= "Email: " . $data['email'] . "\n";

if (!empty($data['company'])) {
    $email_body .= "Empresa: " . $data['company'] . "\n";
}

if (!empty($data['service'])) {
    $email_body .= "Servicio de interés: " . $servicioNombre . "\n";
}

$email_body .= "\nMensaje:\n" . $data['message'] . "\n\n";
$email_body .= "---\n";
$email_body .= "IP del remitente: " . $ip . "\n";
$email_body .= "Fecha de envío: " . date('Y-m-d H:i:s') . "\n";
$email_body .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'No disponible') . "\n";

// Headers del correo
$headers = [];
$headers[] = 'From: noreply@konecta.jp';
$headers[] = 'Reply-To: ' . $data['email'];
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Priority: 3';

// Intentar enviar el correo
$mail_sent = @mail(
    $RECIPIENT_EMAIL,
    $email_subject,
    $email_body,
    implode("\r\n", $headers)
);

if ($mail_sent) {
    // Guardar timestamp para rate limiting
    file_put_contents($rate_limit_file, time());

    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado correctamente'
    ]);
} else {
    // Error al enviar
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Por favor intenta de nuevo.'
    ]);
}
?>
