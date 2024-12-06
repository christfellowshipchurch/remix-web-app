interface MenuItem {
  title: string;
  description?: string;
  url: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  link?: string;
}

interface AdditionalContent {
  title: string;
  link: string;
}

interface MenuContentProps {
  mainContent: MenuSection[];
  additionalContent: AdditionalContent[];
}

export const MenuContent: React.FC<MenuContentProps> = ({
  mainContent,
  additionalContent,
}) => (
  <div className="pl-8 bg-white w-screen shadow-lg grid grid-cols-4 gap-8">
    {mainContent.map((section, index) => (
      <div className="max-w-72 pr-8 p-8" key={index}>
        <h4 className="font-semibold text-text_secondary">{section.title}</h4>
        <hr className="my-4 border-t border-gray-200" />
        <ul className="mt-4 space-y-6">
          {section.items.map((item, idx) => (
            <li key={idx} className="hover:text-ocean text-black">
              <a className="flex flex-col" href={item.url}>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="font-light">{item.description}</p>
              </a>
            </li>
          ))}
        </ul>
        {section.link && (
          <a href="#" className="text-ocean mt-4 block">
            {section.link}
          </a>
        )}
      </div>
    ))}
    <div className="p-6 flex flex-col gap-6 bg-background_secondary pl-8">
      {additionalContent.map((content, index) => (
        <a
          href="#"
          key={index}
          className="hover:bg-gray-300 bg-gray-100 p-4 rounded-lg shadow"
        >
          <h5 className="font-semibold">{content.title}</h5>
          <p className="font-light">{content.link}</p>
        </a>
      ))}
    </div>
  </div>
);
