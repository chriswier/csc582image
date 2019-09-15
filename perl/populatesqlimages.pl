#!/usr/bin/perl

use Data::Dumper;
use DBI;
use DBD::Oracle qw(:ora_types :ora_session_modes);
use JSON;
use strict;

# Purpose: Connects to Oracle via the coco user; populates IMAGE, CAPTION,
#   LICENSE, and IMAGEFILES tables with appropriate COCO Dataset Train2017 items
# References: Perl 1,2,3,4

# # # # # # # #
# VARIABLES:
my $imagedir = '/home/chris/train2017';
my $jsonfile = '/home/chris/annotations/captions_train2017.json';

# # # # # # # #
# MAIN PROGRAM

# make connection string to Oracle
my $dbh = DBI->connect("dbi:Oracle:host=127.0.0.1;sid=cwiering1",
  'coco','coco') || die("error: " . DBI->errstr);
$dbh->{AutoCommit} = 1;
$dbh->{LongTruncOk} = 0;
$dbh->{LongReadLen} = 10*1024*1024;  # 10MB

# load the Coco JSON
open(FILE,$jsonfile);
my $jsonin = <FILE>;
close(FILE);

# parse the JSON
my $jsonhash = decode_json $jsonin;

# loop through all the images; check if there, if NOT, then populate it
foreach my $image (@{$jsonhash->{'images'}}) {
  # check to see if this one is populated already
  my $sth = $dbh->prepare('SELECT COUNT(*) AS NUMRECORDS FROM IMAGE WHERE ID=?');
  $sth->execute($image->{'id'});

  # fetch it
  my $ref = $sth->fetchrow_hashref();
  if(defined($ref->{'NUMRECORDS'}) && $ref->{'NUMRECORDS'} >= 1) { next; }

  # no records, so insert it
  my $sth = $dbh->prepare("INSERT INTO IMAGE VALUES(?,?,?,?,?,?,?,TO_DATE(?,'YYYY-MM-DD HH24:MI:SS'))");
  $sth->execute($image->{'id'},$image->{'width'},$image->{'height'},
    $image->{'file_name'},$image->{'license'},$image->{'flickr_url'},
    $image->{'coco_url'},$image->{'date_captured'});
  
  # echo out printed
  print Dumper($image);
  printf("INSERTED image id = %d\n",$image->{'id'});
}

# loop through all the annotations/captions; check if there, if NOT, then populate it
foreach my $caption (@{$jsonhash->{'annotations'}}) {
  # check to see if this one is populated already
  my $sth = $dbh->prepare('SELECT COUNT(*) AS NUMRECORDS FROM CAPTION WHERE ID=?');
  $sth->execute($caption->{'id'});

  # fetch it
  my $ref = $sth->fetchrow_hashref();
  if(defined($ref->{'NUMRECORDS'}) && $ref->{'NUMRECORDS'} >= 1) { next; }

  # no records, so insert it
  my $sth = $dbh->prepare("INSERT INTO CAPTION VALUES(?,?,?)");
  $sth->execute($caption->{'id'},$caption->{'image_id'},$caption->{'caption'});
  
  # echo out printed
  print Dumper($caption);
  printf("INSERTED caption id = %d\n",$caption->{'id'});
}

# populate licenses
# loop through all the annotations/captions; check if there, if NOT, then populate it
foreach my $license (@{$jsonhash->{'licenses'}}) {
  # check to see if this one is populated already
  my $sth = $dbh->prepare('SELECT COUNT(*) AS NUMRECORDS FROM LICENSE WHERE ID=?');
  $sth->execute($license->{'id'});

  # fetch it
  my $ref = $sth->fetchrow_hashref();
  if(defined($ref->{'NUMRECORDS'}) && $ref->{'NUMRECORDS'} >= 1) { next; }

  # no records, so insert it
  my $sth = $dbh->prepare("INSERT INTO LICENSE VALUES(?,?,?)");
  $sth->execute($license->{'id'},$license->{'name'},$license->{'url'});
 
  # echo out printed
  print Dumper($license);
  printf("INSERTED license id = %d\n",$license->{'id'});
}

# loop through all the images in the imagefiles table; check if there, if NOT, 
#  then populate it with the appropriate file blob
foreach my $image (@{$jsonhash->{'images'}}) {
  # check to see if this one is populated already
  my $sth = $dbh->prepare('SELECT COUNT(*) AS NUMRECORDS FROM IMAGEFILES WHERE ID=?');
  $sth->execute($image->{'id'});

  # fetch it
  my $ref = $sth->fetchrow_hashref();
  if(defined($ref->{'NUMRECORDS'}) && $ref->{'NUMRECORDS'} >= 1) { next; }

  # it's not defined, need to read it in
  my $filename = sprintf("%s/%s",$imagedir,$image->{'file_name'});
  my $fileimage = readBinaryFile($filename);
  my $size = lengthFile($filename);

  # put it into the database
  my $sth = $dbh->prepare('INSERT INTO imagefiles VALUES(?,?,?)');
  $sth->bind_param(1,$image->{'id'});
  $sth->bind_param(2,$fileimage,{ ora_type => ORA_BLOB, ora_field => 'IMAGE' });
  $sth->bind_param(3,$size);
  $sth->execute();
  printf("Inserted into imagefiles id: %s filename: %s\n",$image->{'id'},$image->{'file_name'});
}

# exit out
exit;

# # # # # # # # # # # # # # # # # #
sub readBinaryFile {
  my $filename = shift;
  my $file = '';

  if(-f $filename) {
    open my $fh, '<:raw', $filename;
    while(1) {
      my $success = read $fh, $file, 1024, length($file);
      die $! if not defined $success;
      last if not $success;
    }
    close $fh;

  } else {
    die "readBinaryFile() - file $filename not found!\n";
  }

  #print "Length of file: " . length($file) . "\n";
  return $file;
}

sub lengthFile {
  my $filename = shift;
  if(-f $filename) {
    return (stat($filename))[7];
  } else {
    die "lengthFile() - file $filename not found!\n";
  }
}
