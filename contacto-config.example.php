<?php
// Copiar como contacto-config.php en la carpeta de arriba de public_html
// (no adentro: ahí sería público). Lo lee public/api/contacto.php.
return [
    // Cloudflare > Turnstile > el widget de scodedigital.com > "Secret Key".
    'turnstile_secret' => '',
    'to' => 'contact@scodedigital.com',
    'from' => 'noreply@scodedigital.com',
];
