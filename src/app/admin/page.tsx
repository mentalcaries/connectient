import Hero from '@/components/Hero';
import Features from '@/components/Features';

import { ADMIN_PORTAL_FEATURES } from '@/lib/constants';

const Admin = () => {
  const getHeroTitle = () => (
    <>
      An{' '}
      <span className="w-full text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-500">
        Efficient Appointment Management System
      </span>{' '}
      to empower Healthcare Administrators
    </>
  );

  const heroSubtitle =
    'Empowers healthcare providers and administrators with a powerful tool to efficiently manage and oversee all requested appointments in one centralized location. Simplify your appointment management process and enhance productivity with our comprehensive and intuitive dashboard.';

  const heroCalloutBtn = {
    text: 'Get Started',
    link: '/admin/unauthenticated',
  };

  return (
    <>
      <Hero
        title={getHeroTitle()}
        subtitle={heroSubtitle}
        calloutBtn={heroCalloutBtn}
      />
      <Features features={ADMIN_PORTAL_FEATURES} />
    </>
  );
};

export default Admin;
