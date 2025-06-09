import { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch volunteer opportunities data from API
  const volunteerData = {
    churchOpportunities: [
      {
        id: "1",
        name: "Worship Team",
        description: "Join our worship team and help lead others in worship",
        location: "Main Campus",
        timeCommitment: "2-3 hours per week",
      },
      {
        id: "2",
        name: "Children's Ministry",
        description: "Help teach and care for children during services",
        location: "Main Campus",
        timeCommitment: "2 hours per week",
      },
      {
        id: "3",
        name: "Greeting Team",
        description: "Welcome and assist visitors and members",
        location: "All Campuses",
        timeCommitment: "1 hour per week",
      },
    ],
    communityOpportunities: [
      {
        id: "1",
        name: "Food Bank Volunteer",
        description: "Help distribute food to those in need",
        location: "Downtown",
        timeCommitment: "4 hours per week",
      },
      {
        id: "2",
        name: "Homeless Shelter Support",
        description: "Provide meals and support at local shelter",
        location: "Westside",
        timeCommitment: "3 hours per week",
      },
    ],
    globalOpportunities: [
      {
        id: "1",
        name: "International Mission Trip",
        description: "Serve communities in developing countries",
        location: "Various Countries",
        timeCommitment: "2 weeks",
      },
      {
        id: "2",
        name: "Global Relief Support",
        description: "Support disaster relief efforts worldwide",
        location: "Remote",
        timeCommitment: "Flexible",
      },
    ],
  };

  return Response.json(volunteerData);
}
