<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

const API_URL = 'https://server.sponsor-api.com';
const PEM_PASSPHRASE = 'password';

$requiredPemFiles = ['server-ca-crt.pem', 'client-crt.pem', 'client-key.pem'];
$missingPemFiles = array_filter($requiredPemFiles, function($pemFile) {
    return !file_exists('./certificates/' . $pemFile);
});

if (count($missingPemFiles) > 0) {
    exit(sprintf(
        "Please add missing (%s) file(s) to './certificates' directory.\n",
        join(', ', $missingPemFiles)
    ));
}

$client = new Client();
$endpoint = '/api/v1/funds';
$headers = [
    'Authorization' => 'Bearer BjHrATtUVgFD2sS3csrGZuMjZ93QmzUKcc3Gh5as4qXqsLNvh8m2VwtxznfccVyH',
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
];

$content = [
    "bsn"=> 12345678,
    "action" => "eligibility_check",
    "fund_key"=> "zuidhorn"
];

$date = date('Y-m-d H:i:s');
$line = str_repeat('-', 80 / 2 - (strlen($date) - 2));

echo "\n$line [$date] $line\n";

try {
    $response = $client->post(
        API_URL . $endpoint, [
            'json' => $content,
            'headers' => $headers,
            'connect_timeout' => 650,
            // add these
            'verify' => './certificates/server-ca-crt.pem',
            'cert' => ['./certificates/client-crt.pem', PEM_PASSPHRASE],
            'ssl_key' => ['./certificates/client-key.pem', PEM_PASSPHRASE],
        ]
    );

} catch (GuzzleException $e) {
    echo "Error code: " . $e->getCode() . "\n";
    echo "Error text: " . $e->getMessage() . "\n\n";
    exit();
}

echo "Response code: " . $response->getStatusCode() . "\n";
echo "Response body: " . json_encode(json_decode($response->getBody()->getContents()), JSON_PRETTY_PRINT) . "\n\n";


