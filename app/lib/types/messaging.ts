export type ShareMessages = {
  title: string;
  url: string;
  shareMessages: {
    title?: string;
    faceBook: string;
    twitter: string;
    email: {
      subject: string;
      body: string;
    };
    sms: string;
  };
};
