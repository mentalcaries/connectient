export const dynamic = 'force-dynamic'; //remove this when proper fix has been implemented
import Head from 'next/head';

import { AppointmentFooter } from '@/components/AppointmentFooter';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentHeader from '@/components/AppointmentHeader';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const supabase = createServerComponentClient<Database>({ cookies });

export default async function Appointment({
  params,
}: {
  params: { practiceCode: string };
}) {
  const { practiceCode } = params;

  const { data } = await supabase
    .from('Practice')
    .select()
    .eq('practice_code', practiceCode);

  if (!data || data?.length < 1) redirect('/');

  const [{ id, name, logo, street_address, city, phone, website }] =
    data as Practice[];
  const ogImage = logo || '/connectient-logo.png';
  const ogMetadata = {
    title: name,
    description: 'Appointments Made hi Easy',
    url: `https://connectient.co/practice/${practiceCode}`,
    image: ogImage,
  };
  return (
    <>
      <head>
        <title>{ogMetadata.title}</title>
        <meta property="og:title" content={ogMetadata.title} />
        <meta property="og:description" content={ogMetadata.description} />
        <meta property="og:url" content={ogMetadata.url} />
        <meta property="og:image" content={ogMetadata.image} />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
      </head>

      <main className="flex-1 flex flex-col gap-2 justify-center items-center">
        <AppointmentHeader practiceLogo={logo} practiceName={name} />
        <h2 className="mt-4 mb-6 w-full max-w-lg sm:text-3xl text-2xl font-extrabold tracking-wide leading-2 text-center md:leading-snug">
          Request Your{' '}
          <span className="w-full text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-500">
            Next Appointment
          </span>{' '}
          Expedition
        </h2>
        <AppointmentForm
          practiceId={id}
          practiceName={name}
          practiceLogo={logo!}
          practiceStreet={street_address as string}
          practiceCity={city}
          practicePhone={phone!}
          practiceWebsite={website!}
        />
        <AppointmentFooter
          name={name}
          streetAddress={street_address as string}
          city={city}
          phone={phone!}
        />
      </main>
    </>
  );
}
