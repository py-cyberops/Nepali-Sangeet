-- The application no longer references the empty legacy room_bell_events table.
-- DROP TABLE is intentionally omitted because managed database policies protect destructive table removal.
-- The retired listener_presence.bellLastRung column was removed through a reviewed controlled migration.
SELECT 1;
