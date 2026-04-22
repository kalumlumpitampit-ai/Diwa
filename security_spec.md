# Security Specification: Diwa Grade 9 English Portal

## Data Invariants
1. A **Progress** record must belong to the user (`userId` match).
2. A **Message** must have a `senderId` matching the authenticated user.
3. **Units** and **Lessons** are generally read-only for students, writable by teachers (admins).
4. **Assignments** submissions (implied) belong to the specific user.

## The Dirty Dozen Payloads (Targeting vulnerabilities)
1. **Identity Spoofing**: Attempt to create a progress record for another user.
2. **Resource Poisoning**: Attempt to inject a 1MB string into a `lessonId`.
3. **Admin Escalation**: Attempt to write to the `units` collection without admin role.
4. **Unauthorized Read**: Attempt to read another user's progress.
5. **Ghost Field Injection**: Attempt to add an `isAdmin: true` field to a progress record.
6. **Self-Assigned Role**: Attempt to create a user profile with an admin role.
7. **Negative Progress**: Attempt to set scores to negative values.
8. **Spam Attack**: Attempt to send messages with huge payloads or without timestamps.
9. **Relational Deletion**: Attempt to delete a unit with active lessons.
10. **Identity Integrity**: Attempt to message from someone else's UID.
11. **State Shortcut**: Attempt to mark a lesson complete without reaching the lesson first.
12. **PII Leak**: Attempt to list all users' emails in a single query.

## Test Runner (Draft)
A simulation of tests would ensure:
- `create` on `/progress/anotherUser` -> PERMISSION_DENIED.
- `update` on `/units/unit1` (as student) -> PERMISSION_DENIED.
- `create` on `/messages` (senderId mismatch) -> PERMISSION_DENIED.
