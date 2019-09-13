# csc582image
UM Flint CSC582 Image Storage in Oracle with NodeJS Web Frontend

VM setup:
  Hardware: 2 vCPUs, 8GB RAM, 128GB HD LVM autoprovision
  Centos 7 1810 server minimal netinstall with OpenSSH 
  Basic username: chris
  IP: 141.216.24.220

GIT Repo:
  (chris) cd ~
  git clone git@github.com:chriswier/csc582image.git

Oracle Setup:  https://www.oracle.com/database/technologies/oracle19c-linux-downloads.html

  1.  Install apps as root (root)
     a. yum install git wget xauth
     b. yum groupinstall "Development Tools"
  2.  Download LINUX.X64_193000_db_home.zip to /usr/local/src
  3.  Unzip it, move all files to /usr/local/src/oracle193000
  4.  cd /usr/local/src/oracle193000
  5.  ./runInstaller
     a. Create and configure a single instance database
     b. Server class
     c. Standard Edition 2
     d. Location: /usr/app/oracle  (premake directory before)
          (sudo) mkdir -p /home/oracle
          (sudo) chown chris:chris /home/oracle
     e. Inventory: /home/orainventory  (premake directory before)
        Group: chris
          (sudo) mkdir -p /home/orainventory
          (sudo) chown chris:chris /home/orainventory
     f. General purpose database
     g. DB name: cwiering1.csc582.umflint.edu
        SID: cwiering1
        Virtualation: yes, with orclpdb
     h. Auto memory management: no, max memory: 6184
     i. File system loc: /home/oracle/oradata
     j. Management options: <skip>
     k. Recovery: enable, /home/oracle/recovery_area
     l. Schema password: same,  use:  Despair-Chalk-0
     m. Groups:  default
     n. Root script execution: auto-run via sudo
        (type appropriate user password)
     o. Save DB response:  /home/chris/csc582/dbinstall.rsp
     p. Install!
