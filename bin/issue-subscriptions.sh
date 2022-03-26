#!/bin/bash
TABLE=${FILENAME%.csv}
UPLOAD_FILE="${FILENAME%.csv}"
## Replaced with utf8 conversion line ## ln -s "$DIR$FILENAME" $UPLOAD_FILE
iconv -f windows-1252 -t utf-8 $DIR${FILENAME%} > $UPLOAD_FILE  #converts csv data to utf8 format
mysql -u csv_import -pSuperSecurePassword5652 admin_fhmtmpl -e "TRUNCATE TABLE $TABLE;" #clear data from staging db
mysqlimport --local --replace --ignore-lines=1 --fields-terminated-by=";" --lines-terminated-by="\n" admin_fhmtmpl $UPLOAD_FILE #write data to staging db
## OLD INDEX ## rm $UPLOAD_FILE #clear cached data
rm $UPLOAD_FILE #clear cached data for new index
if [ $TABLE == "team_records" ] #team_records.csv should be the last file uploaded, this section checks if it is, then runs the proc to move data to admin_simdata. After that it notifies SHL Discord.
then
  sleep 3s
  mysql -u csv_import -pSuperSecurePassword5652 admin_fhmtmpl -e "UPDATE season SET SeasonId = ('$SEASONNUM');CALL updateSimdata();"
  /bin/indexnotifydiscord.sh ${SEASONNUM} ${LEAGUE} #notify SHL General Discord
fi
