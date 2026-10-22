<?php
// Recibe el formulario de /contacto en el hosting (Apache + PHP).
// En Vercel lo hace api/contacto.js; las dos versiones validan lo mismo.
//
// La clave secreta de Turnstile y los mails se leen de contacto-config.php,
// fuera de public_html (ver contacto-config.example.php). Sin clave, el
// captcha no se verifica en el servidor y quedan el honeypot y el límite por IP.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder($status, $payload)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function limpiar($value, $max)
{
    $text = trim(preg_replace('/\s+/u', ' ', (string) ($value ?? '')));
    return function_exists('mb_substr') ? mb_substr($text, 0, $max) : substr($text, 0, $max);
}

function largo($text)
{
    return function_exists('mb_strlen') ? mb_strlen($text) : strlen($text);
}

function configuracion()
{
    $defaults = [
        'turnstile_secret' => getenv('TURNSTILE_SECRET_KEY') ?: '',
        'to' => getenv('CONTACT_TO_EMAIL') ?: 'contact@scodedigital.com',
        'from' => getenv('CONTACT_FROM_EMAIL') ?: 'noreply@scodedigital.com',
        'from_name' => 'sCode',
    ];
    $file = dirname(__DIR__, 2) . '/contacto-config.php';
    if (is_readable($file)) {
        $custom = include $file;
        if (is_array($custom)) {
            return array_merge($defaults, array_filter($custom, 'strlen'));
        }
    }
    return $defaults;
}

function ipCliente()
{
    return $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
}

// Hasta 5 envíos cada 10 minutos por IP.
function dentroDelLimite($ip)
{
    $file = sys_get_temp_dir() . '/scode-contacto-' . sha1($ip);
    $now = time();
    $recent = [];
    if (is_readable($file)) {
        $saved = json_decode((string) file_get_contents($file), true);
        if (is_array($saved)) {
            $recent = array_filter($saved, function ($t) use ($now) {
                return $now - (int) $t < 600;
            });
        }
    }
    if (count($recent) >= 5) {
        return false;
    }
    $recent[] = $now;
    @file_put_contents($file, json_encode(array_values($recent)), LOCK_EX);
    return true;
}

function captchaValido($secret, $token, $ip)
{
    if ($secret === '') {
        error_log('contacto: falta turnstile_secret, no se verifica el captcha');
        return true;
    }
    if ($token === '') {
        return false;
    }
    $body = http_build_query(['secret' => $secret, 'response' => $token, 'remoteip' => $ip]);
    $raw = false;
    if (function_exists('curl_init')) {
        $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
    } else {
        $raw = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $body,
                'timeout' => 10,
            ],
        ]));
    }
    $result = json_decode((string) $raw, true);
    return is_array($result) && !empty($result['success']);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, ['error' => 'Método no permitido']);
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload)) {
    responder(400, ['error' => 'Pedido inválido']);
}

if (limpiar($payload['website'] ?? '', 200) !== '') {
    responder(200, ['ok' => true]);
}

$nombre = limpiar($payload['nombre'] ?? '', 80);
$email = strtolower(limpiar($payload['email'] ?? '', 120));
$telefono = limpiar($payload['telefono'] ?? '', 40);
$horario = limpiar($payload['horario'] ?? '', 120);
$mensaje = trim(substr((string) ($payload['mensaje'] ?? ''), 0, 4000));
$token = limpiar($payload['turnstileToken'] ?? '', 2048);

if (largo($nombre) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || largo($telefono) < 6 || largo($mensaje) < 10) {
    responder(400, ['error' => 'Revisá los datos e intentá de nuevo.']);
}

$ip = ipCliente();
if (!dentroDelLimite($ip)) {
    responder(429, ['error' => 'Recibimos varias consultas seguidas. Probá de nuevo en unos minutos.']);
}

$config = configuracion();
if (!captchaValido($config['turnstile_secret'], $token, $ip)) {
    responder(400, ['error' => 'Completá la verificación antes de enviar.']);
}

$asunto = 'Consulta web — ' . $nombre;
$texto = implode("\n", [
    'Nombre: ' . $nombre,
    'Email: ' . $email,
    'Teléfono: ' . $telefono,
    'Disponibilidad: ' . ($horario !== '' ? $horario : '—'),
    '',
    $mensaje,
]);

$headers = implode("\r\n", [
    'From: ' . $config['from_name'] . ' <' . $config['from'] . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$subject = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($asunto, 'UTF-8', 'B')
    : '=?UTF-8?B?' . base64_encode($asunto) . '?=';

$enviado = @mail($config['to'], $subject, $texto, $headers, '-f' . $config['from']);
if (!$enviado) {
    $enviado = @mail($config['to'], $subject, $texto, $headers);
}

if (!$enviado) {
    error_log('contacto: mail() devolvió false');
    responder(500, ['error' => 'No se pudo enviar. Probá de nuevo en un momento o escribinos por WhatsApp.']);
}

responder(200, ['ok' => true]);
