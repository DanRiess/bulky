JS test: https://stackblitz.com/edit/node-abapu3?file=index.js

// run `node index.js` in the terminal
const { createHash } = require('node:crypto');

function base64urlEncode(str) {
return str.replace(/\+/g, '-').replace(/\//g, '\_').replace(/=+$/, '');
}

const b64 = 'SZSOrIKGQysIRE+jUEh3v2ZuG0sBkxhh1YwENRN+1Fg=';
const b64url = 'SZSOrIKGQysIRE-jUEh3v2ZuG0sBkxhh1YwENRN-1Fg';
codeChallenge = 'W13p7U3NcJoXEJ71rC4GeQCJL1WhCrxspT8vpt0-JmU';
const buffer = Buffer.from(b64, 'base64');

const generatedb64 = buffer.toString('base64');
const generatedb64url = base64urlEncode(buffer.toString('base64'));
const hash = createHash('sha256').update(generatedb64url).digest('base64');
const hashurl = base64urlEncode(hash);

console.log(b64 === generatedb64);
console.log(b64url === generatedb64url);

console.log(hash);
console.log(hashurl);
console.log(hashurl === codeChallenge);

// -----------------------------------------------------------------------------------

PHP test: https://php-play.dev/?c=DwfgDgFmBQD0sAICmAPAhgWzAGyQgxgPYAmScihARgPoDOALmgE70AUAlANznL4SEIAjN3i9%2BCAEwjEAEkoBXAGaKkTBAF4EVagHMk9akQB29JCdodu0OWlpIAbABZ5TbNTNFSGhIqOsGTACWRjoIMgBuaNjySOwAXAgBwaHqAHwIADosQRisGQH0THmUtg6O7kaeSKwRUTHsADQIAOQA1LDNTc0AtNTNjS3q-VYydvhM%2Bt5MaEbEhBjUlACephYAzBJc1pRO3iV2ThVVNWMT9FtIfAJyTlaX4kbYEpRFAEQZRq9b204u2N42A7OVxHEjVUaXM4XK5hHbA7B3GGPZ5vD5fEZVQwQKK4EJ4TSAsp-UGkVjY2gQVjNCloCQAVnsnVhv1cTUK9Wh4hkmL4OLMeisQA&v=8.3&f=html

<?php
$base64url_encode = fn(string $value): string => \rtrim(\strtr(\base64_encode($value), '+/', '-_'), '=');

$secret = random_bytes(32);
$b64 = base64_encode($secret);
echo $b64;

echo nl2br("\n");

$b64url = $base64url_encode($secret);
echo $b64url;

echo nl2br("\n");

$code_challenge = $base64url_encode(hash('sha256', $b64url, true));
echo $code_challenge;
