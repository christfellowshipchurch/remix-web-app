import Icon from '~/primitives/icon';

const links: { name: 'youtube' | 'instagram' | 'linkedIn'; url: string }[] = [
  {
    name: 'youtube',
    url: 'https://www.youtube.com/user/christfellowship',
  },

  {
    name: 'instagram',
    url: 'https://www.instagram.com/christfellowship.church/',
  },
  {
    name: 'linkedIn',
    url: 'https://www.linkedin.com/company/christ-fellowship-church/',
  },
];

export const FooterSocialLinks = () => {
  return (
    <div className='flex gap-2'>
      {links.map((link, index) => (
        <a
          href={link?.url}
          key={index}
          className='text-white hover:text-white/50 transition-colors'
          data-gtm='footer-link'
          data-link-name={link.name}
          aria-label={`${link.name} Link`}
        >
          <Icon name={link?.name} size={36} />
        </a>
      ))}
    </div>
  );
};
