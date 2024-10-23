import StyledAccordion from "~/components/styled-accordion";
import Button from "~/primitives/button";
import { faqData } from "~/lib/faqData";
import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export const LocationFAQ = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  const cfe = name.includes("Español");

  return (
    <div className="flex flex-col items-center gap-14 bg-[#F5F5F7] pb-24 pt-14">
      <h2 className=" max-w-[90vw] text-center text-[2rem] font-bold text-secondary">
        {cfe ? `Preguntas Frequentes` : `Frequently Asked Questions`}
      </h2>
      {/* TODO: Change from params.title to the name fetched from the query */}
      <StyledAccordion data={faqData(name)} bg="white" />
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="text-[26px] font-bold">
          {cfe
            ? `¿Tienes preguntas adicionales?`
            : `Have additional questions?`}
        </div>
        <p className="text-[15px]">
          {cfe
            ? `Alguien de nuestro equipo estará encatado de responder a tus preguntas`
            : `Someone from our team is happy to answer any of your questions!`}
        </p>
        <Button
          href="https://rock.gocf.org/contactus"
          target="_blank"
          className="w-32 rounded-[6px] lg:w-44"
          size="md"
          intent="secondary"
        >
          {cfe ? `Contáctanos` : `Contact Us`}
        </Button>
      </div>
    </div>
  );
};
