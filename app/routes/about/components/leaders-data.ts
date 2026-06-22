export type LeaderProfile = {
  id: string;
  fullName: string;
  profilePhoto: string;
  jobTitle: string;
  bio: string;
  pathname: string;
};

export const leaders: LeaderProfile[] = [
  {
    id: '1',
    fullName: 'Todd & Julie Mullins',
    jobTitle: 'Senior Pastors',
    bio: "Pastors Todd and Julie Mullins are the Senior Pastors of Christ Fellowship Church. Under their leadership, Christ Fellowship has continued its growth as a multi-site congregation that gathers thousands in South Florida each week and digitally reaches thousands beyond the region through Christ Fellowship Everywhere. <br /> <br /> Their leadership expands beyond the walls of Christ Fellowship as they serve the South Florida region and beyond. They are the founders of Church United, a partnership of local churches across various denominations that join together to transform South Florida. Todd and Julie also serve on the lead team of the Association of Related Churches (ARC) and on the board of directors for Place of Hope Children's Home in South Florida. They are both frequently invited to speak at churches and conferences around the globe, and Todd recently authored his debut book, Don't Let Doubt Take You Out. Together, they have a son, Jefferson, who also serves in ministry at Christ Fellowship alongside his wife, Cassie.",
    pathname: 'todd-julie-mullins',
    profilePhoto:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3187730',
  },
  {
    id: '2',
    fullName: 'Dr. Tom Mullins',
    jobTitle: 'Founding Pastor',
    bio: "Dr. Tom Mullins, along with his wife Donna, founded Christ Fellowship in 1984. What began as a small Bible study with 40 people meeting in their living room, has grown to nearly 30,000 people meeting at multiple locations across South Florida and many more around the globe through Christ Fellowship Everywhere. In 2011, Tom and Donna entrusted the leadership of Christ Fellowship to their son Todd and his wife, Julie. Before becoming a pastor, Tom was a successful football coach and athletic director at both the high school and collegiate levels. Tom continues to pastor at Christ Fellowship, focusing on leadership development and vision advancement. <br /> <br/> He and Donna founded Place of Hope, a residential community for neglected and abused children in South Florida and Place of Hope International, which establishes homes and cares for children around the world. Tom serves on several boards, including Place of Hope, Teen Challenge, and EQUIP. His role with EQUIP has him training national and international leaders in creating a transformation movement within their nation. Tom is the author of five books that capture his passion to develop leaders and his experience as both a coach and a pastor, including his most recent titles, Grandpa's Wisdom: Unlocking the Secrets of a Victorious Life, and Coach's Playbook: 10 Game-Changing Lessons for Young Leaders. He earned his doctorate from Liberty University along with a Ph.D. in Organizational Leadership from Southeastern University. Tom is a sought-after speaker and leader.",
    pathname: 'tom-mullins',
    profilePhoto:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3166894',
  },
  {
    id: '3',
    fullName: 'Ryan McDermott',
    jobTitle: 'Teaching Pastor',
    bio: "Pastor Ryan McDermott serves as Executive Director of Family Ministries, as well as a teaching pastor, and has led in a variety of ministry roles at Christ Fellowship since 2010. Ryan frequently speaks at events and camps with organizations like Lifeway and Student Leadership University (SLU) and is a part of the teaching faculty at Christ Fellowship's Leadership College and Southeastern University. He earned a bachelor's degree in Christian Leadership and Youth Ministry from Palm Beach Atlantic University and later completed both a Master of Arts in Ministerial Leadership and a Doctor of Ministry in Missiology at Southeastern University. Ryan is the author of two teen bible study books: Unbound: Experiencing Life & Freedom in Christ, and He is Here: Encountering God in the Wilderness. Ryan's mission in life is to love his wife well, be his kids' hero, lead thousands to Jesus, and help students be brave enough to believe they can change the world.",
    pathname: 'ryan-mcdermott',
    profilePhoto:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3166896',
  },
  {
    id: '4',
    fullName: 'Dr. John Maxwell',
    jobTitle: 'Teaching Pastor',
    bio: "Dr. John C. Maxwell is a #1 New York Times bestselling author, coach, and speaker who has sold more than 25 million books in 50 languages. As the founder of The John Maxwell Company, The John Maxwell Team, EQUIP, and the John Maxwell Foundation, he has trained more than 5 million leaders—including reaching the milestone of having trained leaders from every country of the world. The recipient of the Mother Teresa Prize for Global Peace and Leadership from the Luminary Leadership Network, Dr. Maxwell speaks each year to Fortune 500 companies, presidents of nations, and many of the world's top business leaders. Before devoting himself full-time to speaking and writing, he was a pastor for more than 30 years.",
    pathname: 'john-maxwell',
    profilePhoto:
      'https://cloudfront.christfellowship.church/GetImage.ashx?id=3166895',
  },
];
