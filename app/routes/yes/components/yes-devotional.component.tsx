import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import {
  twentyOneDaysDevotionalData,
  spanishTwentyOneDaysDevotionalData,
} from "../yes-devotional-data";
import HTMLRenderer from "~/primitives/html-renderer";
import { cn } from "~/lib/utils";

export const DevotionalSection = ({ isSpanish }: { isSpanish?: boolean }) => {
  return (
    <div className="flex flex-col w-full h-full bg-gray pt-12 lg:pt-16">
      {/* Title Section */}
      <TitleSection isSpanish={isSpanish} />
      {/* Tabs Section */}
      <TabsSection isSpanish={isSpanish} />
    </div>
  );
};

const TabsSection = ({ isSpanish }: { isSpanish?: boolean }) => {
  const [activeTab, setActiveTab] = useState(
    isSpanish
      ? spanishTwentyOneDaysDevotionalData[0].value
      : twentyOneDaysDevotionalData[0].value,
  );

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col justify-center items-center relative mt-16"
    >
      {/* Tabs List */}
      <Tabs.List className="flex w-full gap-4 max-w-[978px] items-center md:justify-center md:flex-wrap overflow-x-auto md:overflow-x-hidden pb-10 scrollbar-hide">
        {isSpanish
          ? spanishTwentyOneDaysDevotionalData.map((tab, index) => (
              <Tabs.Trigger
                key={index}
                value={tab.value}
                className={cn(
                  "flex px-4 py-1 font-semibold bg-white data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[29px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer min-w-[90px] md:min-w-auto items-center justify-center text-center",
                  index === 0 && "md:ml-0 ml-4",
                  index === twentyOneDaysDevotionalData.length - 1 &&
                    "md:mr-0 mr-4",
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))
          : twentyOneDaysDevotionalData.map((tab, index) => (
              <Tabs.Trigger
                key={index}
                value={tab.value}
                className={cn(
                  "flex px-4 py-1 font-semibold bg-white data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[29px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer min-w-[90px] md:min-w-auto items-center justify-center text-center",
                  index === 0 && "md:ml-0 ml-4",
                  index === twentyOneDaysDevotionalData.length - 1 &&
                    "md:mr-0 mr-4",
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
      </Tabs.List>

      <div className="w-full content-padding bg-white pt-12 lg:pt-16 pb-32 lg:pb-56">
        <div className="w-full flex flex-col justify-center items-center max-w-[978px] mx-auto">
          {/* Tab */}
          {isSpanish
            ? spanishTwentyOneDaysDevotionalData.map((tab, index) => (
                <Tabs.Content
                  key={index}
                  value={tab.value}
                  className="w-full data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300"
                >
                  <HTMLRenderer
                    html={tab.content}
                    className="devotional-content"
                  />
                </Tabs.Content>
              ))
            : twentyOneDaysDevotionalData.map((tab, index) => (
                <Tabs.Content
                  key={index}
                  value={tab.value}
                  className="w-full data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300"
                >
                  <HTMLRenderer
                    html={tab.content}
                    className="devotional-content"
                  />
                </Tabs.Content>
              ))}
        </div>
      </div>
    </Tabs.Root>
  );
};

const TitleSection = ({ isSpanish }: { isSpanish?: boolean }) => {
  const copy = isSpanish
    ? {
        title: "Devocional de 21 días",
        subtitle:
          "¡Le dijiste que sí a Jesús y estamos muy emocionados por ti! Ahora, ¿qué sigue? Dentro de este devocional, descubrirás más sobre lo que significa seguir a Jesús. Cada día incluirá Escrituras para meditar e ideas para considerar al comenzar tu caminar con Dios. Juntos, analizaremos cómo es tener una relación con Jesús y cómo esa relación cambia nuestras vidas de adentro hacia afuera. Este devocional está organizado en 21 días, pero siéntete libre de seguir el ritmo que mejor te funcione. Esta es simplemente una herramienta que te ayudará a encontrar dirección y una plataforma de lanzamiento para iniciar conversaciones sobre lo que estás aprendiendo. Seguir a Jesús es un viaje en el que nunca tendrás que caminar solo. ¡Nos alegra poder hacer esto juntos!",
        download: "Descárgalo como un PDF.",
        link: "https://rock.gocf.org/Content/website/journey/YouSaidYes_Devotional.pdf",
      }
    : {
        title: "A 21-Day Devotional",
        subtitle:
          "Inside this devotional, you’ll discover more about what it means to follow Jesus. Each day will include Scriptures to meditate on and ideas to consider as you begin your walk with God. Together, we’ll unpack what it looks like to be in a relationship with Jesus and how that relationship changes our lives from the inside out. This devotional spans 21 days, but you can go at your own pace. It’s a tool to guide your journey and spark conversations about your learning. Remember, following Jesus is a journey you don’t have to take alone. We’re excited to share this with you! If you’d like, you can",
        download: "download it as a PDF.",
        link: "https://rock.gocf.org/Content/website/journey/YouSaidYes_Devotional.pdf",
      };

  return (
    <div className="w-full max-w-[978px] mx-auto px-4 lg:px-0">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-[52px] font-extrabold">{copy.title}</h1>
        <p className="font-medium text-lg text-text-secondary">
          {copy.subtitle}{" "}
          <a
            href="https://rock.gocf.org/Content/website/journey/YouSaidYes_Devotional.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean underline cursor-pointer"
          >
            {copy.download}
          </a>
        </p>
      </div>
    </div>
  );
};
