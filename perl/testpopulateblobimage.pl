#!/usr/bin/perl

use Data::Dumper;
use DBI;
use DBD::Oracle qw(:ora_types :ora_session_modes);
use strict;

# References: #3 and #4

# make connection string
my $dbh = DBI->connect("dbi:Oracle:host=127.0.0.1;sid=cwiering1",
  'coco','coco') || die("error: " . DBI->errstr);
$dbh->{AutoCommit} = 1;
$dbh->{LongTruncOk} = 0;
$dbh->{LongReadLen} = 10*1024*1024;  # 10MB

# open a file for binary read
my $id = 1000000;
my $filename = 'test.jpg';
my $image = readBinaryFile($filename);
my $size = lengthFile($filename);
printf("Read file: %s with length: %d . (Filesize check: %d)\n",$filename,length($image),$size);

# put it into the database
my $sth = $dbh->prepare('INSERT INTO imagefiles VALUES(?,?,?)');
$sth->bind_param(1,$id);
$sth->bind_param(2,$image,{ ora_type => ORA_BLOB, ora_field => 'IMAGE' });
$sth->bind_param(3,$size);
$sth->execute();
print "Inserted into database id: $id\n";

# fetch it
$sth = $dbh->prepare('SELECT * FROM imagefiles WHERE id=?');
$sth->execute($id);

my $ref = $sth->fetchrow_hashref();
if(defined($ref->{'ID'})) { 
  #print Dumper($ref);
  #print "Length of image: " . length($ref->{'IMAGE'}) . "\n";
  my $imageretr = $ref->{'IMAGE'};
  
  if($image != $imageretr) { die "DIFFERENT DATA!"; }
  else { printf("Fetched original image from DB id %d.  Size: %d\n",$id,length($imageretr)); }

  # write the new file
  my $newfile = sprintf("test%dorig.jpg",time());
  my $newfile2 = sprintf("test%dsql.jpg",time());
  print "Writing files $newfile and $newfile2\n";
  writeBinaryFile($newfile,$image);
  writeBinaryFile($newfile2,$imageretr);

}

# remove the row
$sth = $dbh->prepare('DELETE FROM imagefiles WHERE id=?');
$sth->execute(1000000);
printf("Removed DB id %d\n",$id);

# exit out
exit;

# # # # # # # # # # # # # # # # # #
# subroutines
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

sub writeBinaryFile {
  my $filename = shift;
  my $binarydata = shift;

  open my $fh, '>', $filename or die "Cannot open $filename!\n";
  print $fh $binarydata;
  close $fh;
}
  
