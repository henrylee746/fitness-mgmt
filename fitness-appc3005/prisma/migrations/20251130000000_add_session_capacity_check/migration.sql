-- Create a function to validate session capacity against room capacity
CREATE OR REPLACE FUNCTION check_session_capacity()
RETURNS TRIGGER AS $$
DECLARE
  room_capacity INTEGER;
BEGIN
  SELECT "capacity" INTO room_capacity -- looks at room's capacity
  FROM "Room"
  WHERE "id" = NEW."roomId"; -- "NEW" is the incoming row
  
  IF NEW."capacity" > room_capacity THEN
    RAISE EXCEPTION 'Session capacity (%) cannot exceed room capacity (%)', NEW."capacity", room_capacity;
  END IF; --Rejects the insert or update if room capacity is less than session capacity
  
  RETURN NEW; -- Returns the incoming row
END;
$$ LANGUAGE plpgsql; -- Lets us write variables/if statements/etc.

-- Insert trigger
CREATE TRIGGER session_capacity_check_insert
  BEFORE INSERT ON "Session"
  FOR EACH ROW
  EXECUTE FUNCTION check_session_capacity();

-- Update trigger
CREATE TRIGGER session_capacity_check_update
  BEFORE UPDATE ON "Session"
  FOR EACH ROW
  WHEN (NEW."capacity" IS DISTINCT FROM OLD."capacity" OR NEW."roomId" IS DISTINCT FROM OLD."roomId")
  EXECUTE FUNCTION check_session_capacity();

