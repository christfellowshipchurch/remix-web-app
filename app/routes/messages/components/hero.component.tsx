import Button from "~/primitives/button";

export default function MessagesHero() {
  return (
    <div className="min-h-[50vh] p-16 bg-[url('https://cloudfront.christfellowship.church/GetImage.ashx?guid=d600ee2d-7aaf-41e6-9562-e5e7faedbbb9')] bg-cover flex flex-col justify-end">
      {/* Overlay */}
      <div className="absolute z-0 inset-0 bg-black bg-opacity-50"></div>

      {/* Title Section */}
      <div className="mx-auto w-full max-w-xxl relative text-white z-10">
        <h1 className="heading-h1 ">Messages</h1>
        <hr className="border-white my-12 opacity-45" />
        {/* Bread crumbs */}
        <div className="w-full flex justify-between">
          <div>
            <a>{`Home > `}</a>
            <a>{`Messages`}</a>
          </div>
          <div>
            <Button intent={"white"}>Live Broadcasts</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
