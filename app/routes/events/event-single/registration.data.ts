export interface SubGroupTypeDescription {
  description: string;
}

export const subGroupTypeDescriptions: Record<string, SubGroupTypeDescription> =
  {
    Dedication: {
      description: "This is a description for Dedication", // TBD
    },
    "Starting Line": {
      description: "This is a description for Starting Line", // TBD
    },
    Indoor: {
      description:
        "Baptism is going public about your faith in Jesus and communicating to the world your heart-felt commitment to following Him. It’s the next step after salvation. There are opportunities for baptism all throughout the year. If you’re ready to get baptized or looking for more information, sign up here and we’ll connect with you!",
    },
    "Two Days": {
      description:
        "The Journey is the starting point to learn about the heartbeat of Christ Fellowship. Join us for a Two session experience in which you will Know God, Grow in your Relationships, Discover your Purpose & partner with us as we Impact the World together!",
    },
    "Two Days with Dream Team Kickoff": {
      description:
        "The Journey class is your first step to getting connected here at Christ Fellowship. It’s a fun group setting where you will get to know the history and heartbeat of the place you call home. During this experience, our prayer is that you will know God and grow in your relationships so that you can discover your purpose and impact the world.",
    },
  };

export const getSubGroupTypeDescription = (subGroupType: string): string => {
  return subGroupTypeDescriptions[subGroupType]?.description || "";
};
