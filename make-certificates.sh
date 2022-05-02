#!/bin/bash

# parse arguments
for argument in "$@"
do
   key=$(echo $argument | cut -f1 -d=)
   key_length=${#key}

   export "$key"="${argument:$key_length+1}"
done


# make directory for cetificates
mkdir -p certificates

printf "\n================================================================================\n"
printf "Making certificates:\n"
printf "================================================================================\n"

if [ -z "$type" ]
then
printf "Please enter type (server/client): "
read certType
else
certType="$type"
fi

if [ -z "$password" ]
then
printf "Please enter CA password: "
read certCAPass
else
certCAPass="$password"
fi

printf "\n================================================================================\n"
printf "Selected type: [$certType]\n"
printf "Selected password: [$certCAPass]\n\n"

# Make CA (certificate authority)
printf "\nMaking CA ($certType-ca-key.pem and $certType-ca-crt.pem):\n"
printf "================================================================================\n\n"

openssl req -new -x509 -days 365 \
    -subj "/C=NL/ST=Groningen/L=Groningen/O=Forus/OU=DevOps/CN=*.sponsor-api.com" \
    -keyout ./certificates/${certType}-ca-key.pem \
    -out ./certificates/${certType}-ca-crt.pem \
    -passout pass:${certCAPass}

# Make certificate key
printf "\nMaking key ($certType-key.pem):\n"
printf "================================================================================\n\n"
openssl genrsa -out ./certificates/${certType}-key.pem 4096

# Generate a Certificate Signing Request (CSR)
printf "\nMaking CSR ($certType-csr.pem):\n"
printf "================================================================================\n\n"
openssl req -new -sha256 \
    -subj "/C=NL/ST=Groningen/L=Groningen/O=Forus/OU=DevOps/CN=$certType.sponsor-api.com" \
    -key ./certificates/${certType}-key.pem -out ./certificates/${certType}-csr.pem 

# Make the certificates
printf "\nMaking certificates ($certType-crt.pem):\n"
printf "================================================================================\n\n"
openssl x509 -req -days 365 \
    -in ./certificates/${certType}-csr.pem \
    -CA ./certificates/${certType}-ca-crt.pem \
    -CAkey ./certificates/${certType}-ca-key.pem \
    -CAcreateserial \
    -out ./certificates/${certType}-crt.pem \
    -passin pass:${certCAPass}

# Verify certificates
printf "\nVerifying certificates:\n"
printf "================================================================================\n\n"
openssl verify -CAfile ./certificates/${certType}-ca-crt.pem ./certificates/${certType}-crt.pem