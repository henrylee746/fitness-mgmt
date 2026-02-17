/*Was created using --create-only flag, 
SQL must be manually added to the database
and then manually written to the schema.prisma file 
as well.
Then migrate dev again and generate the client again.
*/
CREATE VIEW "MemberInfo" AS
SELECT DISTINCT ON (m."id")
  h."weight",
  h."weightGoal",
  m."firstName",
  m."lastName",
  m."email"
FROM "Member" AS m
LEFT JOIN "HealthMetric" AS h
  ON m."id" = h."memberId"
ORDER BY m."id", h."timestamp" DESC NULLS LAST;