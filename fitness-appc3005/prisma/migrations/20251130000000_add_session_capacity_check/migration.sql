-- Create a function to validate session capacity against room capacity
-- $$ is the delimiter for the function body
-- "NEW" refers to the incoming row being inserted/updated
CREATE OR REPLACE FUNCTION check_session_capacity()
RETURNS TRIGGER AS $$
DECLARE
  room_capacity INTEGER;
BEGIN
  -- Get the room's capacity for the session's room
  SELECT "capacity" INTO room_capacity
  FROM "Room"
  WHERE "id" = NEW."roomId";
  
  -- Check if room exists
  IF room_capacity IS NULL THEN
    RAISE EXCEPTION 'Room with id % does not exist', NEW."roomId";
  END IF;
  
  -- Reject the insert or update if session capacity exceeds room capacity
  IF NEW."capacity" > room_capacity THEN
    RAISE EXCEPTION 'Session capacity (%) cannot exceed room capacity (%)', NEW."capacity", room_capacity;
  END IF;
  
  -- Return the incoming row to allow the operation to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

