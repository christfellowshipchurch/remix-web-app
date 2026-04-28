import InternshipsHero from './partials/hero';
import FindYourPlace from './partials/find-your-place';
import InternshipsBanner from './partials/banner';
import Paths from './partials/paths';
import { getImageUrl } from '~/lib/utils';

export { meta } from './meta';

export default function InternshipsPage() {
  return (
    <div>
      <InternshipsHero
        subheading='Christ Fellowship Internships'
        title='You don’t have to figure out your calling alone.'
        subtitle='Our Internship Programs offer intentional mentorship, practical ministry experience, and opportunities to grow spiritually, personally, and professionally.'
        ctas={[
          {
            href: '#programs',
            text: 'Explore Programs',
          },
          {
            href: 'https://job-boards.greenhouse.io/christfellowship?departments%5B%5D=4030237002',
            text: 'Apply Now',
          },
        ]}
        imageSrc={getImageUrl('3141722')}
        imageAlt='Internships Hero'
      />
      <Paths />
      <InternshipsBanner />
      <FindYourPlace />
    </div>
  );
}
