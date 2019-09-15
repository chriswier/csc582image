#!/usr/bin/perl

use JSON;
use Data::Dumper;
use strict;

# open file
open(FILE,'/home/chris/annotations/captions_train2017.json');
my $jsonin = <FILE>;
close(FILE);

# parse it
my $jsonhash = decode_json $jsonin;

# print it
print Dumper($jsonhash);
