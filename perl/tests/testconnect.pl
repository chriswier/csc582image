#!/usr/bin/perl

use Data::Dumper;
use DBI;
use DBD::Oracle qw(:ora_types :ora_session_modes);
use strict;

# make connection string
my $dbh = DBI->connect("dbi:Oracle:host=127.0.0.1;sid=cwiering1",
  'cocoweb','cocoweb') || die("error: " . DBI->errstr);
$dbh->{AutoCommit} = 1;

# make a test query
my $sth = $dbh->prepare('SELECT * FROM coco.IMAGE') || die 'Error with SQL statement ['.$DBI::errstr.' - '.$DBI::err.']';
$sth->execute();

# retrieve results
while( my $ref = $sth->fetchrow_hashref() ) {
  print Dumper($ref);
}

# exit out
exit;

