## Only run this script on development machine

MASTER_DATABASE=tradedrop_bot

DATE=`date +%d-%m-%y_%H:%M:%S`
SCHEMA_FILENAME="SQL/schema/dev_schema-$DATE.sql"
file="SQL/schema/current_schema.sql"

# Export Schema
pg_dump -s -O $MASTER_DATABASE > "$SCHEMA_FILENAME"
pg_dump -s -O $MASTER_DATABASE > "$file"

