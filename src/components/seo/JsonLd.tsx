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
    '@type': ['Organization', 'Service'],
    '@id': 'https://www.gainable.fr/#organization',
    name: 'Gainable.fr',
    alternateName: ['Gainable.ch', 'Gainable.be', 'Gainable.ma', 'Gainable Pro'],
    url: 'https://www.gainable.fr',
    logo: 'https://www.gainable.fr/assets/logo-share.png',
    description: "La première plateforme internationale de mise en relation et de référencement d'experts certifiés en climatisation gainable, pompes à chaleur réversibles, bureaux d'études CVC et diagnostiqueurs.",
    serviceType: [
      'Référencement d\'installateurs de climatisation gainable',
      'Mise en relation avec experts CVC certifiés RGE QualiPAC',
      'Bureaux d\'études thermiques et génie climatique',
      'Diagnostics de performance énergétique (DPE)'
    ],
    knowsAbout: [
      'Climatisation gainable invisible',
      'Pompe à chaleur réversible air-air & air-eau',
      'VRV / DRV & systèmes multizones',
      'Génie climatique & Audit énergétique',
      'Labels RGE QualiPAC & certifications CVC'
    ],
    areaServed: [
      { '@type': 'Country', name: 'France', identifier: 'FR' },
      { '@type': 'Country', name: 'Suisse', identifier: 'CH' },
      { '@type': 'Country', name: 'Belgique', identifier: 'BE' },
      { '@type': 'Country', name: 'Maroc', identifier: 'MA' }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    sameAs: [
      'https://www.gainable.ch',
      'https://www.gainable.be',
      'https://www.gainable.ma'
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.gainable.fr/#website',
    name: 'Gainable.fr',
    url: 'https://www.gainable.fr',
    publisher: {
      '@id': 'https://www.gainable.fr/#organization'
    },
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

export interface ItemListJsonLdProps {
  name: string;
  description: string;
  items: Array<{
    name: string;
    slug: string;
    city?: string;
    country?: string;
    expertTypes?: string[];
    isLabeled?: boolean;
  }>;
}

export function ItemListJsonLd({ name, description, items }: ItemListJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'HVACBusiness',
        '@id': `https://www.gainable.fr/pro/${item.slug}`,
        name: item.name,
        url: `https://www.gainable.fr/pro/${item.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: item.city || 'France',
          addressCountry: item.country || 'FR'
        },
        award: item.isLabeled ? ['Entreprise Vérifiée Gainable.fr', 'RGE QualiPAC'] : ['Entreprise Référencée CVC']
      }
    }))
  };

  return <JsonLd data={schema} />;
}

