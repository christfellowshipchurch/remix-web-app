import { StyledAccordion } from '~/components';
import { Button } from '~/primitives/button/button.primitive';
import { ConnectCardModal } from '~/components/modals/connect-card';
import { faqData } from '~/lib/faq-data.data';
import { getKidsGrade } from '../location-single-data';

export const LocationFAQ = ({
  campusName,
  campusUrl,
}: {
  campusName: string;
  campusUrl?: string;
}) => {
  const isEspanol = campusName.includes('Español');

  return (
    <div className='content-padding bg-white'>
      <div className='max-w-screen-content mx-auto flex justify-center'>
        <div className='flex flex-col items-center gap-12 md:gap-20 py-16 md:pb-24 md:pt-14 w-full max-w-[770px]'>
          <div className='flex flex-col items-center gap-5 md:gap-6'>
            <h2 className=' max-w-[90vw] text-center heading-h3 font-extrabold text-2xl md:text-[52px]'>
              {isEspanol ? `Preguntas Frequentes` : `First Time FAQs`}
            </h2>
          </div>

          <StyledAccordion
            data={faqData(campusName, getKidsGrade(campusUrl))}
            rootStyle='items-center'
            itemsStyle='bg-white border border-[#C6C6C6]'
          />

          <div className='flex flex-col items-center gap-5 text-center'>
            <div className='text-[26px] font-bold'>
              {isEspanol
                ? `¿Tienes preguntas adicionales?`
                : `Still have a question?`}
            </div>
            <p className='text-[15px]'>
              {isEspanol
                ? `Alguien de nuestro equipo estará encatado de responder a tus preguntas`
                : `Someone from our team is happy to answer any of your questions!`}
            </p>
            <ConnectCardModal isEspanol={isEspanol}>
              <Button
                className='w-full max-w-[200px] rounded-sm'
                intent='secondary'
              >
                {isEspanol ? `Contáctanos` : `Contact Us`}
              </Button>
            </ConnectCardModal>
          </div>
        </div>
      </div>
    </div>
  );
};
