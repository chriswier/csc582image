# csc582image
UM Flint CSC582 Image Storage in Oracle with NodeJS Web Frontend

VM setup:
  Hardware: 2 vCPUs, 8GB RAM, 128GB HD LVM autoprovision
  Ubuntu 18.04 server minimal netinstall with OpenSSH 
  Basic username: chris

Oracle Setup:  https://www.oracle.com/database/technologies/oracle19c-linux-downloads.html

  1.  Download LINUX.X64_193000_db_home.zip to /usr/local/src
  2.  Unzip it, move all files to /usr/local/src/oracle193000
  3.  (root) apt install x11-utils libaio1 build-essential
  4.  cd /usr/local/src/oracle193000
  5.  ./runInstaller
     a. Create and configure a single instance database
     b. Server class
     c. Standard Edition 2
     d. Location: /usr/app/oracle  (premake directory before)
        (sudo) mkdir -p /usr/app/oracle
        (sudo) chown chris:chris /usr/app/oracle
     e. Inventory: /usr/app/orainventory
        Group: chris
     f. General purpose database
     g. DB name: cwiering1.csc582.umflint.edu
        SID: cwiering1
        Virtualation: yes, with orclpdb
     h. Auto memory management: no, max memory: 6184
     i. File system loc: /usr/app/oracle/oradata
     j. Management options: <skip>
     k. Recovery: enable, /usr/app/oracle/recovery_area
     l. Schema password: same,  use:  Despair-Chalk-0
     m. Groups:  default
     n. Root script execution: auto-run via sudo
        (type appropriate user password)
     o. Save DB response:  /home/chris/dbinstall.rsp
     p. Install!
