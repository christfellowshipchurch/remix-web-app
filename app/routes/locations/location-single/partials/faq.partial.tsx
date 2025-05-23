import { StyledAccordion } from "~/components";
import { Button } from "~/primitives/button/button.primitive";
import { faqData } from "~/lib/faq-data.data";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";

export const LocationFAQ = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  const isEspanol = name.includes("Español");

  return (
    <div className="content-padding bg-white">
      <div className="max-w-screen-content mx-auto flex justify-center">
        <div className="flex flex-col items-center gap-12 md:gap-20 py-16 md:pb-24 md:pt-14 max-w-[770px]">
          <div className="flex flex-col items-center gap-5 md:gap-6">
            <h2 className=" max-w-[90vw] text-center heading-h3 font-extrabold text-2xl md:text-[52px]">
              {isEspanol ? `Preguntas Frequentes` : `First Time FAQs`}
            </h2>
            <p className="text-center md:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </div>

          <StyledAccordion
            data={faqData(name)}
            bg="white"
            center
            border="#C6C6C6"
          />

          <div className="flex flex-col items-center gap-5 text-center">
            <div className="text-[26px] font-bold">
              {isEspanol
                ? `¿Tienes preguntas adicionales?`
                : `Still have a question?`}
            </div>
            <p className="text-[15px]">
              {isEspanol
                ? `Alguien de nuestro equipo estará encatado de responder a tus preguntas`
                : `Someone from our team is happy to answer any of your questions!`}
            </p>
            <Button
              href="https://rock.gocf.org/contactus"
              target="_blank"
              className="w-full rounded-sm"
              intent="secondary"
            >
              {isEspanol ? `Contáctanos` : `Contact`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
