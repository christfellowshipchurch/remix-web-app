import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import { googleCalendarLink, icsLinkEvents } from '~/lib/utils';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';
import { LoaderReturnType } from '~/routes/set-a-reminder/loader';

const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
};

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const GoogleCalendarIcon = ({ date }: { date: Date }) => (
  <svg
    width='28'
    height='28'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className='shrink-0'
  >
    {/* Background */}
    <rect width='32' height='32' rx='6' fill='white' />
    <rect width='32' height='32' rx='6' stroke='#dadce0' strokeWidth='1' />
    {/* Blue header */}
    <rect width='32' height='11' rx='6' fill='#1a73e8' />
    <rect y='6' width='32' height='5' fill='#1a73e8' />
    {/* Peg rings */}
    <rect
      x='8.5'
      y='0'
      width='2'
      height='6'
      rx='1'
      fill='white'
      opacity='0.6'
    />
    <rect
      x='21.5'
      y='0'
      width='2'
      height='6'
      rx='1'
      fill='white'
      opacity='0.6'
    />
    {/* Four Google color corner dots */}
    <circle cx='8' cy='18' r='2.2' fill='#4285F4' />
    <circle cx='24' cy='18' r='2.2' fill='#EA4335' />
    <circle cx='8' cy='27' r='2.2' fill='#34A853' />
    <circle cx='24' cy='27' r='2.2' fill='#FBBC05' />
    {/* Date number */}
    <text
      x='16'
      y='27'
      textAnchor='middle'
      fontSize='12'
      fontWeight='700'
      fill='#1a73e8'
      fontFamily='Arial, sans-serif'
    >
      {date.getDate()}
    </text>
  </svg>
);

const AppleCalendarIcon = ({ date }: { date: Date }) => (
  <svg
    width='28'
    height='28'
    viewBox='0 0 28 28'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className='shrink-0'
  >
    <rect width='28' height='28' rx='5' fill='white' />
    <rect width='28' height='28' rx='5' stroke='#e0e0e0' strokeWidth='1' />
    <rect width='28' height='10' rx='5' fill='#FF3B30' />
    <rect y='5' width='28' height='5' fill='#FF3B30' />
    <text
      x='14'
      y='8.5'
      textAnchor='middle'
      fontSize='5'
      fontWeight='600'
      fill='white'
      fontFamily='Arial, sans-serif'
      letterSpacing='0.5'
    >
      {DAYS[date.getDay()]}
    </text>
    <text
      x='14'
      y='23'
      textAnchor='middle'
      fontSize='11'
      fontWeight='700'
      fill='#1c1c1e'
      fontFamily='Arial, sans-serif'
    >
      {date.getDate()}
    </text>
  </svg>
);

const ReminderConfirmation = ({
  serviceTime,
  onSuccess,
  campusUrl,
  location,
}: {
  serviceTime: string;
  onSuccess: () => void;
  campusUrl: string;
  location: string;
}) => {
  const [formData, setFormData] = useState<LoaderReturnType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load(`/set-a-reminder?location=${campusUrl}`);
  }, [campusUrl]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setFormData(fetcher.data as LoaderReturnType);
    }
  }, [fetcher.state, fetcher.data]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  const { address, url } = formData;
  const events = icsLinkEvents({
    serviceTimes: [{ day: 'Sunday', time: serviceTime }],
    address,
    campusName: location,
    url: `https://christfellowship.church/locations/${url}`,
  });

  // Server endpoint returns text/calendar with Content-Disposition: inline —
  // iOS Safari shows the native "Add to Calendar" sheet, Android opens it
  // with the user's default calendar app (no manual download step needed).
  const icsServerUrl = `/calendar-ics?campus=${encodeURIComponent(campusUrl)}&time=${encodeURIComponent(serviceTime)}`;
  const googleHref = googleCalendarLink(events[0].event);
  const isEspanol = location?.includes('Español');

  const handleAddToCalendar = () => {
    if (isIOS() || isAndroid()) {
      window.location.href = icsServerUrl;
    } else {
      setShowDropdown((prev) => !prev);
    }
  };

  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <Icon name='check' size={96} color='#1ec27f' />
      <h2 className='font-bold text-2xl text-navy text-center'>
        {isEspanol
          ? 'Asegúrese de revisar su correo electrónico para obtener más detalles y nos vemos este domingo.'
          : "Be sure to check out your email for more details and we'll see you this Sunday!"}
      </h2>
      <div className='flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center'>
        {/* Add to Calendar — behaviour varies by device */}
        <div className='relative flex-1 md:flex-none' ref={dropdownRef}>
          <Button
            intent='secondary'
            className='rounded-xl w-full sm:w-auto sm:mx-auto'
            onClick={handleAddToCalendar}
          >
            {isEspanol ? 'Añadir al Calendario' : 'Add to Calendar'}
          </Button>

          {showDropdown && (
            <div className='absolute bottom-full left-0 mb-2 w-full min-w-[240px] rounded-xl border border-neutral-lighter bg-white shadow-lg z-50 overflow-hidden'>
              <a
                href={googleHref}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-darker hover:bg-neutral-lightest transition-colors whitespace-nowrap'
                onClick={() => setShowDropdown(false)}
              >
                <GoogleCalendarIcon date={events[0].event.startTime as Date} />
                Google Calendar
              </a>
              <div className='h-px bg-neutral-lighter' />
              <a
                href={icsServerUrl}
                className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-darker hover:bg-neutral-lightest transition-colors whitespace-nowrap'
                onClick={() => setShowDropdown(false)}
              >
                <AppleCalendarIcon date={events[0].event.startTime as Date} />
                {isEspanol
                  ? 'Calendario de Apple (.ics)'
                  : 'Apple Calendar (.ics)'}
              </a>
            </div>
          )}
        </div>

        <Button
          intent='primary'
          className='rounded-xl w-full sm:w-52'
          onClick={() => onSuccess()}
        >
          {isEspanol ? 'Continuar' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ReminderConfirmation;
