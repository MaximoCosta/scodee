<?php
// Copiar como contacto-config.php en la carpeta de arriba de public_html
// (no adentro: ahí sería público). Lo lee public/api/contacto.php.
return [
    // Contraseña de la casilla contact@scodedigital.com (Ferozo > Email > Cuentas).
    // El hosting no permite mail() de PHP: sin esto el form no envía.
    'smtp_user' => 'contact@scodedigital.com',
    'smtp_pass' => '',

    // Cloudflare > Turnstile > el widget de scodedigital.com > "Secret Key".
    // Vacío: el captcha no se verifica en el servidor.
    'turnstile_secret' => '',

    'to' => 'contact@scodedigital.com',
    'from' => 'contact@scodedigital.com',
];
