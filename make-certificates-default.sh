#!/bin/bash

# create client certificate
./make-certificates.sh type=client password=password

# create server certificate
./make-certificates.sh type=server password=password