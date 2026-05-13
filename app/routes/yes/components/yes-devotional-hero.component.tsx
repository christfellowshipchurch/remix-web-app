import { Link } from 'react-router';
import { Icon } from '~/primitives/icon/icon';

export const YesHero = ({ isSpanish }: { isSpanish?: boolean }) => {
  const cardData = isSpanish ? spanishHeroCardData : heroCardData;

  return (
    <div className='flex flex-col items-center w-full h-screen lg:h-full lg:min-h-[110svh]'>
      <div className='flex flex-col gap-6 items-center justify-center w-full h-[120svh] lg:h-full lg:min-h-[110svh] px-4'>
        <div className='flex flex-col gap-3 items-center text-center'>
          <h1 className='text-[40px] lg:text-[100px] font-extrabold text-dark-navy leading-tight'>
            {isSpanish ? (
              '¡Dijiste SÍ!'
            ) : (
              <>
                You Said <span className='text-white'>YES!</span>
              </>
            )}
          </h1>
          <p className='text-lg lg:text-xl text-white'>
            {isSpanish ? (
              '¡Dijiste SÍ a Jesús, y estamos muy emocionados por ti! Ahora, ¿qué sigue?'
            ) : (
              <>
                You said yes to Jesus, and we're so excited for you! Now, what's
                next?
              </>
            )}
          </p>
        </div>

        {/* Card Sections */}
        <div className='flex flex-col lg:flex-row gap-4 md:gap-6'>
          {cardData.map((card, index) => (
            <HeroCard key={index} copy={card.copy} link={card.link} />
          ))}
        </div>
      </div>
    </div>
  );
};

const heroCardData: { link: string; copy: string }[] = [
  {
    link: '/app',
    copy: 'A two-week course to start your relationship with Jesus.',
  },
  {
    link: '/app',
    copy: 'Access resources, submit prayers, & get involved in our app',
  },
  {
    link: '/app',
    copy: 'Download the free Bible App from YouVersion',
  },
];

const spanishHeroCardData: { link: string; copy: string }[] = [
  {
    link: '/app',
    copy: 'Un curso de dos semanas para comenzar tu relación con Jesús.',
  },
  {
    link: '/app',
    copy: 'Accede a recursos, envía oraciones y participa en nuestra app',
  },
  {
    link: '/app',
    copy: 'Descarga la app de la Biblia YouVersion gratis',
  },
];

const HeroCard = ({ copy, link }: { copy: string; link: string }) => {
  return (
    <Link
      to={link}
      className='bg-white lg:bg-transparent relative flex justify-between items-center lg:justify-center gap-4 border-2 border-white w-full lg:max-w-[200px] pl-4 pr-3 lg:px-2 pt-2 pb-2 lg:pt-8 lg:pb-14 rounded-[36px] group hover:bg-white transition-all duration-400 cursor-pointer'
    >
      <p className='max-w-[85%] md:max-w-[92%] lg:max-w-none lg:text-lg lg:text-center text-text-secondary lg:text-[#FAFAFC] font-semibold group-hover:text-text-secondary transition-all duration-400'>
        {copy}
      </p>
      <Icon
        name='arrowRight'
        className='lg:absolute right-auto -bottom-5 text-white bg-navy rounded-full size-10 p-[2px] lg:-rotate-45 group-hover:rotate-0 transition-all duration-400'
      />
    </Link>
  );
};
