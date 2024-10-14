export default function ServiceTimes() {
  return (
    <div className="flex justify-center bg-gradient-to-br from-newsletter_to to-primary py-4 text-white">
      <div className="relative flex w-full max-w-[1240px] flex-col items-center gap-1 md:py-2 md:pl-6 lg:flex-row lg:gap-4 xl:gap-6 xl:pl-4">
        <div className="mb-2 flex flex-col justify-center md:pr-2 lg:mb-0 lg:gap-0 xl:pr-8">
          <h2 className="text-2xl font-bold">Every Sunday</h2>
          <p className="hidden max-w-[18vw] text-sm lg:block xl:max-w-[600px]">
            *Kids services take place at each service <br />
            *Traducciones al español ofrecidas a las 11:45am
          </p>
        </div>
        {/* Desktop */}
        <div className="hidden gap-3 py-8 text-2xl font-bold lg:flex xl:py-12 xl:text-3xl">
          <p className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2">
            8:30 AM
          </p>
          <p className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2">
            10AM
          </p>
          <p className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2">
            11:45 AM
          </p>
        </div>
        {/* Mobile */}
        <div className="flex gap-3 border-y border-white/20 py-3 text-2xl font-bold lg:hidden xl:text-3xl">
          <p className="border-r border-white/20 pl-4 pr-[17px]">8:30 AM</p>
          <p className="border-r border-white/20 pl-4 pr-[17px]">10AM</p>
          <p className="pl-4">11:45 AM</p>
        </div>
        <p className="w-full text-center text-sm lg:hidden">
          *Kids services take place at each service <br />
          *Traducciones al español ofrecidas a las 11:45am
        </p>
      </div>
    </div>
  );
}
