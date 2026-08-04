import React from 'react';

export interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gainable.fr',
    url: 'https://www.gainable.fr',
    logo: 'https://www.gainable.fr/assets/logo-share.png',
    description: "La première plateforme de mise en relation d'experts certifiés en climatisation gainable, pompes à chaleur et génie climatique.",
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    sameAs: [],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gainable.fr',
    url: 'https://www.gainable.fr',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.gainable.fr/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
    </>
  );
}
