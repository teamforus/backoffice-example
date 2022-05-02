<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Handler\CurlHandler;

$ENV = require 'env.php';

$API_URL = $ENV['api_url'] ?? 'https://server.sponsor-api.com:4000';
$TLS_PASSPHRASE = $ENV['tls_passphrase'] ?? '';

$BEARER_TOKEN = $ENV['bearer_token'] ?? 'BjHrATtUVgFD2sS3csrGZuMjZ93QmzUKcc3Gh5as4qXqsLNvh8m2VwtxznfccVyH';
$REQUEST_PROVIDER = $ENV['request_provider'] ?? 'guzzle'; // guzzle or file_get_contents

// Check required files
$requiredPemFiles = ['server-ca-crt.pem', 'client-crt.pem', 'client-key.pem'];
$missingPemFiles = array_filter($requiredPemFiles, function($pemFile) {
    return !file_exists('../certificates/' . $pemFile);
});

if (count($missingPemFiles) > 0) {
    exit(implode("\n", [
        "Please add missing (" . implode(', ', $missingPemFiles) . ") file(s) to './certificates' directory.",
        "Or just use make-certificates-default.sh from project root to generate the certificates."
    ]));
}

$endpoint = '/api/v1/funds';
$headers = [
    'Authorization' => "Bearer $BEARER_TOKEN",
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
];

$content = [
    "id" => "forus-" . rand(10000000, 99999999),
    "bsn" => 12345678,
    "action" => "eligibility_check",
    "fund_key" => "zuidhorn",
];

$date = date('Y-m-d H:i:s');
$line = str_repeat('-', 80 / 2 - (strlen($date) - 2));

echo "\n$line [$date] $line\n";

// file_get_contents version
if ($REQUEST_PROVIDER == 'file_get_contents') {
    $arrContextOptions= [
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", array_map(function($key) use ($headers) {
                return "$key: " . $headers[$key];
            }, array_keys($headers))),
            'content' => json_encode($content),
        ],
        'ssl' => [
            'cafile' => realpath('../certificates/server-ca-crt.pem'),
            'local_cert' => realpath('../certificates/client-crt.pem'),
            'local_pk' => realpath('../certificates/client-key.pem'),
            'passphrase' => $TLS_PASSPHRASE,
            'verify_peer'=> true,
            'verify_peer_name'=> true,
        ],
    ];
    
    $response = file_get_contents($API_URL . $endpoint, false, stream_context_create($arrContextOptions));
    
    echo json_encode(json_decode($response, true), 128) . "\n";
}

// Guzzle version
if ($REQUEST_PROVIDER == 'guzzle') {
    try {
        $client = new Client();
        $response = $client->post(
            $API_URL . $endpoint, [
                'json' => $content,
                'headers' => $headers,
                'connect_timeout' => 650,
                'verify' => '../certificates/server-ca-crt.pem',
                'cert' => ['../certificates/client-crt.pem', $TLS_PASSPHRASE],
                'ssl_key' => ['../certificates/client-key.pem', $TLS_PASSPHRASE],
            ]
        );

    } catch (GuzzleException $e) {
        echo "Error code: " . $e->getCode() . "\n";
        echo "Error text: " . $e->getMessage() . "\n\n";
        exit();
    }

    echo "Response code: " . $response->getStatusCode() . "\n";
    echo "Response body: " . json_encode(json_decode($response->getBody()->getContents()), JSON_PRETTY_PRINT) . "\n\n";
}