## Guzzle/Nodejs mutual SSL demo
### Setup and run the Server

Please generate and copy the certificates before running the server.   
See `Generate certificates and local development` section.

```
cd ./server
npm install
npm start
```

### Setup and run the Client
Please start the server before running this script.

1) cd ./client
2) run `composer install` 
3) Copy your certificates to directory `./certificates`
4) Run the script `php ./index.php`

### Server and certificates  

The default url of the api is `https://server.sponsor-api.com`,
please adjust this value in the script if you use another domain.

The domain name must match the domain name you used to generate the certificates.


## Certificate files location.

### Client
You need to have following `.pem` files in your `./certificates` directory.  
`server-ca-crt.pem`, `client-crt.pem` and `client-key.pem`.

### Server
Also, following `.pem` files in your `./certificates` directory.  
`client-ca-crt.pem`, `server-crt.pem` and `server-key.pem`.


# Certificates and local development

## Automatically generate the certificate
Just run the script:
```bash
./make-certificates-default.sh
```
It will automatically generate all the certificates and put them into the right directory.  
To get more details please read the script it's fairly simple.

## Manually generate the certificate
Copied from this article with minor adjustments.  
https://www.matteomattei.com/client-and-server-ssl-mutual-authentication-with-nodejs/

Add following line to `/etc/hosts` file.  
```bash
127.0.0.1 server.sponsor-api.com
127.0.0.1 client.sponsor-api.com
```
For current demo `client.sponsor-api.com` in hosts file is optional.

### Generate server certificates
We are going to create a Certification Authority (CA) certificate for the server with 10 year validity and the related key.
```bash
$ openssl req -nodes -new -x509 -days 3650 -keyout server-ca-key.pem -out server-ca-crt.pem
Generating a RSA private key
...........................................................................................+++++
.......................................+++++
writing new private key to 'ca-key.pem'
Enter PEM pass phrase:
Verifying - Enter PEM pass phrase:
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:NL
State or Province Name (full name) [Some-State]:Groningen
Locality Name (eg, city) []:Groningen
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Forus
Organizational Unit Name (eg, section) []:DevOps
Common Name (e.g. server FQDN or YOUR name) []:sponsor-api.com
Email Address []:info@sponsor-api.com
```

The PEM pass phrase is optional.  
The other questions are not mandatory, but it’s better if you answer all.  
The most important question is the Common Name which should be the server main domain (sponsor-api.com).


Now we generate the actual server certificate which will be used in the ssl handshake. 
First we have to generate a random key (4096 bit length in our example):
```bash
$ openssl genrsa -out server-key.pem 4096
Generating RSA private key, 4096 bit long modulus (2 primes)
.........++++
...................++++
e is 65537 (0x010001)
```

Then generate a Certificate Signing Request (CSR) with the key we have generated:
```bash
$ openssl req -new -sha256 -key server-key.pem -out server-csr.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:NL
State or Province Name (full name) [Some-State]:Groningen
Locality Name (eg, city) []:Groningen
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Forus
Organizational Unit Name (eg, section) []:DevOps
Common Name (e.g. server FQDN or YOUR name) []:server.sponsor-api.com
Email Address []:info@sponsor-api.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```
Pay attention to the Common Name which must have the same name of the host will serve the application (server.sponsor-api.com).   
As final step, generate the server certificate (validity 10 year) from the CSR previously created and sign it with the CA key:

```bash
$ openssl x509 -req -days 3650 -in server-csr.pem -CA server-ca-crt.pem -CAkey server-ca-key.pem -CAcreateserial -out server-crt.pem
Signature ok
subject=C = IT, ST = Florence, L = Campi Bisenzio, O = AAA Ltd, OU = DevOps, CN = server.sponsor-api.com, emailAddress = info@sponsor-api.com
Getting CA Private Key
Enter pass phrase for server-ca-key.pem:
```

The password requested is the one inserted during CA key generation. To verify the certificate signature against the CA you can issue the following command:
```bash
$ openssl verify -CAfile server-ca-crt.pem server-crt.pem
server-crt.pem: OK
```

## Generate client certificates
Now it’s time to do the same steps for the Client.  
First create a Certification Authority (CA) certificate for the client with 10 year validity and the related key.
```bash
$ openssl req -nodes -new -x509 -days 3650 -keyout client-ca-key.pem -out client-ca-crt.pem
Generating a RSA private key
..........................................................+++++
.............................................+++++
writing new private key to 'client-ca-key.pem'
Enter PEM pass phrase:
Verifying - Enter PEM pass phrase:
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:NL
State or Province Name (full name) [Some-State]:Groningen
Locality Name (eg, city) []:Groningen
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Forus
Organizational Unit Name (eg, section) []:DevOps
Common Name (e.g. server FQDN or YOUR name) []:sponsor-api.com
Email Address []:info@sponsor-api.com
```

The PEM pass phrase is optional. 
The other questions are not mandatory, but it’s better if you answer all. 
The most important question is the Common Name which should be the client main domain (sponsor-api.com).

Now we generate the actual client certificate which will be used in the ssl handshake.   
First we have to generate a random key (4096 bit length in our example):

```bash
$ openssl genrsa -out client-key.pem 4096
Generating RSA private key, 4096 bit long modulus (2 primes)
..............++++
........................................................................................++++
e is 65537 (0x010001)
```

Then generate a Certificate Signing Request (CSR) with the key we have generated:

```bash
$ openssl req -new -sha256 -key client-key.pem -out client-csr.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:NL
State or Province Name (full name) [Some-State]:Groningen
Locality Name (eg, city) []:Groningen
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Forus
Organizational Unit Name (eg, section) []:DevOps
Common Name (e.g. server FQDN or YOUR name) []:client.sponsor-api.com
Email Address []:info@sponsor-api.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

Pay attention to the Common Name which must have the same name of the host will serve the application (client.sponsor-api.com). As final step, generate the client certificate (validity 10 year) from the CSR previously created and sign it with the CA key:

```bash
$ openssl x509 -req -days 3650 -in client-csr.pem -CA client-ca-crt.pem -CAkey client-ca-key.pem -CAcreateserial -out client-crt.pem
Signature ok
subject=C = IT, ST = Groningen, L = Groningen, O = BBB Ltd, CN = client.sponsor-api.com, emailAddress = info@sponsor-api.com
Getting CA Private Key
Enter pass phrase for client-ca-key.pem:
```

The password requested is the one inserted during CA key generation.  
To verify the certificate signature against the CA you can issue the following command:

```bash
$ openssl verify -CAfile client-ca-crt.pem client-crt.pem
client-crt.pem: OK
```

Now we have all the client certificates we need!

```bash
-rw-rw-r--  1 user user 1350 dic 26 17:59 client-ca-crt.pem
-rw-rw-r--  1 user user   41 dic 26 18:06 client-ca-crt.srl
-rw-------  1 user user 1854 dic 26 17:58 client-ca-key.pem
-rw-rw-r--  1 user user 1586 dic 26 18:06 client-crt.pem
-rw-rw-r--  1 user user 1712 dic 26 18:04 client-csr.pem
-rw-------  1 user user 3243 dic 26 18:03 client-key.pem
```

