export const Footer = () => {
  return (
    <footer className="flex flex-col justify-between gap-10 bg-screen px-[10%] py-12 text-lg text-[#D0D0CE] md:flex-row lg:gap-[10%] lg:px-[8%] lg:py-16 xl:gap-[18%] xl:px-[15%]">
      <div className="flex flex-col gap-4">
        <img
          src="../app/assets/footer-logo.png"
          alt="Christ Fellowship"
          width={158}
          height={55}
        />
        <div className="flex flex-col">
          <a href="tel:5617997600">(561) 799-7600</a>
          <a
            target="_blank"
            rel="noreferrer"
            href="mailto:hello@christfellowship.church"
          >
            hello@christfellowship.church
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 xl:gap-16 lg:flex">
        <div className="flex flex-col">
          <h2 className="text-2xl text-white">Resources</h2>
          <a href="/locations/cf-everywhere">Church Online</a>
          <a href="https://www.youtube.com/playlist?list=PLUQ7jSnRB_efXMDq9Lka6stS02awWoaz4">
            Past Messages
          </a>
          <a href="/give">Give Online</a>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl text-white">Connect</h2>
          {/* OPEN CONNECT CARD MODAL */}
          <a href="/">Connect Card</a>
          <a href="https://rock.gocf.org/RequestPrayer">Request Prayer</a>
          <a href="https://church.us11.list-manage.com/subscribe?u=76848e191018191e2e2d01d77&id=3265404466">
            Subscribe to Updates
          </a>
          <a href="/contactus">Contact Us</a>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl text-white">About</h2>
          <a href="/about">Our Leadership</a>
          <a href="/career-opportunities">Career Opportunities</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-use">Terms of Use</a>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl text-white">More</h2>
          <a href="https://www.christfellowshipconference.com/">
            CF Conference
          </a>
          <a href="https://www.cfseu.com/">Get Your Degree</a>
          <a href="https://cf-church.square.site/home">Shop Online</a>
        </div>
      </div>
    </footer>
  );
};
