export function createMockGroup(overrides = {}) {
  return {
    objectID: "group-1",
    title: "Test Group",
    description: "A test group description",
    coverImage: { sources: [{ uri: "/test-group-image.jpg" }] },
    meetingDays: "Monday",
    meetingTime: "7:00 PM",
    minAge: 18,
    maxAge: 30,
    campusName: "Palm Beach Gardens",
    groupFor: "Adults",
    ...overrides,
  };
}
