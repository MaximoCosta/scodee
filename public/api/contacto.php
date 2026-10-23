<?php
// Recibe el formulario de /contacto en el hosting (Apache + PHP).
// En Vercel lo hace api/contacto.js; las dos versiones validan lo mismo.
//
// La contraseña SMTP, la clave secreta de Turnstile y los mails se leen de
// contacto-config.php, fuera de public_html (ver contacto-config.example.php).
// Sin clave de Turnstile el captcha no se verifica en el servidor y quedan el
// honeypot y el límite por IP.

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
        'to' => getenv('CONTACT_TO_EMAIL') ?: 'scodedsolutions@gmail.com',
        'from' => getenv('CONTACT_FROM_EMAIL') ?: 'contact@scodedigital.com',
        'from_name' => 'sCode',
        // Con usuario y contraseña se envía por SMTP; si no, con mail().
        'smtp_host' => 'mail.scodedigital.com',
        'smtp_port' => '465',
        'smtp_user' => '',
        'smtp_pass' => '',
    ];
    $file = dirname(__DIR__, 2) . '/contacto-config.php';
    if (is_readable($file)) {
        $custom = include $file;
        if (is_array($custom)) {
            return array_merge($defaults, array_map('strval', array_filter($custom, function ($v) { return $v !== null && $v !== ''; })));
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

function asuntoCodificado($asunto)
{
    return function_exists('mb_encode_mimeheader')
        ? mb_encode_mimeheader($asunto, 'UTF-8', 'B')
        : '=?UTF-8?B?' . base64_encode($asunto) . '?=';
}

function enviar($config, $asunto, $texto, $replyTo)
{
    if ($config['smtp_user'] !== '' && $config['smtp_pass'] !== '') {
        return enviarSmtp($config, $asunto, $texto, $replyTo);
    }
    if (!function_exists('mail')) {
        throw new RuntimeException('falta smtp_user/smtp_pass en contacto-config.php y mail() está deshabilitada');
    }
    $headers = implode("\r\n", [
        'From: ' . $config['from_name'] . ' <' . $config['from'] . '>',
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);
    return mail($config['to'], asuntoCodificado($asunto), $texto, $headers);
}

function smtpLeer($socket, $esperado)
{
    $respuesta = '';
    while (($linea = fgets($socket, 515)) !== false) {
        $respuesta .= $linea;
        if (strlen($linea) < 4 || $linea[3] === ' ') {
            break;
        }
    }
    if ((int) substr($respuesta, 0, 3) !== $esperado) {
        throw new RuntimeException('SMTP esperaba ' . $esperado . ' y recibió: ' . trim($respuesta));
    }
}

function smtpComando($socket, $comando, $esperado)
{
    fwrite($socket, $comando . "\r\n");
    smtpLeer($socket, $esperado);
}

function enviarSmtp($config, $asunto, $texto, $replyTo)
{
    $port = (int) $config['smtp_port'];
    $host = $config['smtp_host'];
    // El certificado del servidor de correo es *.ferozo.com: se valida la cadena, no el nombre.
    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => false]]);
    $socket = stream_socket_client(
        ($port === 465 ? 'ssl://' : 'tcp://') . $host . ':' . $port,
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) {
        throw new RuntimeException('SMTP no conecta: ' . $errstr);
    }
    stream_set_timeout($socket, 15);

    try {
        smtpLeer($socket, 220);
        smtpComando($socket, 'EHLO scodedigital.com', 250);
        if ($port !== 465) {
            smtpComando($socket, 'STARTTLS', 220);
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            smtpComando($socket, 'EHLO scodedigital.com', 250);
        }
        smtpComando($socket, 'AUTH LOGIN', 334);
        smtpComando($socket, base64_encode($config['smtp_user']), 334);
        smtpComando($socket, base64_encode($config['smtp_pass']), 235);
        smtpComando($socket, 'MAIL FROM:<' . $config['from'] . '>', 250);
        smtpComando($socket, 'RCPT TO:<' . $config['to'] . '>', 250);
        smtpComando($socket, 'DATA', 354);

        $mensaje = implode("\r\n", [
            'Date: ' . date('r'),
            'From: ' . $config['from_name'] . ' <' . $config['from'] . '>',
            'To: <' . $config['to'] . '>',
            'Reply-To: ' . $replyTo,
            'Subject: ' . asuntoCodificado($asunto),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@scodedigital.com>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            rtrim(chunk_split(base64_encode($texto), 76, "\r\n")),
        ]);
        smtpComando($socket, $mensaje . "\r\n.", 250);
        fwrite($socket, "QUIT\r\n");
    } finally {
        fclose($socket);
    }
    return true;
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

try {
    $enviado = enviar($config, $asunto, $texto, $email);
} catch (Throwable $error) {
    error_log('contacto: ' . $error->getMessage());
    $enviado = false;
}

if (!$enviado) {
    responder(500, ['error' => 'No se pudo enviar. Probá de nuevo en un momento o escribinos por WhatsApp.']);
}

responder(200, ['ok' => true]);
