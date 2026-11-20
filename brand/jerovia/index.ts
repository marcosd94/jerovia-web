import type { BrandConfig, BrandCopy, SeedData } from '../types'
import { fillL10n } from '../translate'
import { seed as seedEs } from './seed'
import { translations } from './translations'

const brandEs: BrandConfig = {
  id: 'jerovia',
  name: 'Jerovia Orgánico',
  legalName: 'Paraguay Business Group S.R.L.',
  defaultLocale: 'es',
  enabledLocales: ['es', 'en', 'pt'],
  currency: 'PYG',
  headerCta: '/puntos-de-venta',
  features: { shop: true, blog: true, b2b: true, storeLocator: true, certifications: true, whatsapp: true, links: true, accounts: true },
  logo: { file: 'logo-jerovia-organico.png', alt: 'Jerovia Orgánico' },
  heroCertificationSlug: 'paraguayo-como-vos',
  nav: [
    { href: '/productos', label: { es: 'Productos', en: 'Products', pt: 'Produtos' } },
    { href: '/nosotros', label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } },
    { href: '/certificaciones', label: { es: 'Certificaciones', en: 'Certifications', pt: 'Certificações' } },
    { href: '/puntos-de-venta', label: { es: 'Dónde comprar', en: 'Where to buy', pt: 'Onde comprar' } },
    { href: '/blog', label: { es: 'Aprendé', en: 'Learn', pt: 'Aprenda' } },
    { href: '/para-empresas', label: { es: 'Para empresas', en: 'For business', pt: 'Para empresas' } },
  ],
  icons: { svg: 'favicon.svg', png: 'favicon-32.png', apple: 'apple-touch-icon.png' },
  seo: {
    titleTemplate: '%s | Jerovia Orgánico',
    description: {
      es: 'Yerba mate, mate cocido, azúcar orgánico y stevia de Paraguay. Productos orgánicos certificados, hechos junto a comunidades locales.',
      en: 'Organic yerba mate, mate cocido, sugar and stevia from Paraguay. Certified organic products made together with local communities.',
    },
  },
}

const copyEs: BrandCopy = {
  home: {
    heroTitle: {
      es: 'Yerba, mate cocido y stevia orgánicos. Hechos en Paraguay.',
      en: 'Organic yerba mate, mate cocido and stevia. Made in Paraguay.',
      pt: 'Erva-mate, mate cozido e stevia orgânicos. Feitos no Paraguai.',
    },
    heroText: {
      es: 'Cultivados sin pesticidas y elaborados junto a comunidades locales. Un cambio de consumo para tu cuerpo y tu relación con el planeta.',
      en: 'Grown without pesticides and made together with local communities. A change in what you consume, for your body and for the planet.',
      pt: 'Cultivados sem pesticidas e elaborados junto a comunidades locais. Uma mudança de consumo para o seu corpo e para o planeta.',
    },
    heroPrimaryCta: { es: 'Ver productos', en: 'See products', pt: 'Ver produtos' },
    heroSecondaryCta: { es: 'Soy empresa', en: 'I am a business', pt: 'Sou empresa' },
    categoriesTitle: { es: 'Elegí tu línea', en: 'Choose your range', pt: 'Escolha a sua linha' },
    featuredTitle: { es: 'Los más pedidos', en: 'Most requested', pt: 'Os mais pedidos' },
    certificationsTitle: { es: 'Certificados y con origen paraguayo', en: 'Certified, with Paraguayan origin', pt: 'Certificados e de origem paraguaia' },
    communityTitle: { es: 'Producir bien también es cuidar a quienes producen', en: 'Producing well also means caring for those who produce' },
    communityText: {
      es: 'Trabajamos con la Fundación Moisés Bertoni y su proyecto autosostenible del Centro Educativo Mbaracayú, que impulsa el espíritu emprendedor de jóvenes indígenas y campesinos y la conservación de la Reserva de Biosfera del Bosque Mbaracayú.',
      en: 'We work with the Moisés Bertoni Foundation and its self-sustaining project at the Mbaracayú Educational Center, which supports young indigenous and rural entrepreneurs and the conservation of the Mbaracayú Forest Biosphere Reserve.',
    },
    communityCta: { es: 'Conocé la comunidad', en: 'Meet the community' },
    b2bTitle: { es: '¿Tenés un negocio o distribuís?', en: 'Do you run a business or distribute?' },
    b2bText: {
      es: 'Pedí condiciones para tu empresa. Un vendedor te contacta con precios y presentaciones para distribuidores y supermercados.',
      en: 'Ask for terms for your company. A sales representative will contact you with prices and formats for distributors and supermarkets.',
    },
    b2bCta: { es: 'Pedir condiciones', en: 'Request terms' },
    pressTitle: { es: 'Jerovia en los medios', en: 'Jerovia in the press' },
  },
  b2bPage: {
    title: { es: 'Para empresas', en: 'For business', pt: 'Para empresas' },
    intro: {
      es: 'Si distribuís o vendés productos orgánicos paraguayos, dejanos tus datos. Un vendedor te va a contactar con condiciones, presentaciones y precios para tu empresa.',
      en: 'If you distribute or sell Paraguayan organic products, leave us your details. A sales representative will contact you with terms, formats and prices for your company.',
    },
    benefits: [
      { es: 'Precios y condiciones para distribuidores y supermercados, acordados directamente con un vendedor.' },
      { es: 'Productos con certificaciones vigentes y origen paraguayo.' },
      { es: 'Presentaciones para el hogar y para bares, cafés, restaurantes y heladerías.' },
    ],
  },
  storesPage: {
    title: { es: 'Dónde comprar', en: 'Where to buy', pt: 'Onde comprar' },
    intro: { es: 'Comercios que apoyan lo orgánico y lo nacional. Consultá disponibilidad en cada local.', en: 'Shops that support organic and national products. Ask each store about availability.' },
  },
  productsPage: {
    title: { es: 'Productos', en: 'Products', pt: 'Produtos' },
    intro: { es: 'Yerba mate, mate cocido, azúcar orgánico y stevia.', en: 'Yerba mate, mate cocido, organic sugar and stevia.' },
  },
  aboutPage: {
    title: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' },
    mission: {
      kicker: { es: 'Nuestra misión', en: 'Our mission', pt: 'Nossa missão' },
      title: {
        es: 'Un cambio de consumo para tu cuerpo y tu relación con el planeta',
        en: 'A change in consumption for your body and your relationship with the planet',
        pt: 'Uma mudança de consumo para o seu corpo e a sua relação com o planeta',
      },
      text: [
        {
          es: 'La comida orgánica no es una moda pasajera. Es una forma de alimentarse que protege la vida del planeta y la salud de quienes la consumen: los alimentos se cultivan sin pesticidas y se riegan con aguas naturales no tratadas.',
          en: 'Organic food is not a passing trend. It is a way of eating that protects the life of the planet and the health of those who consume it: food is grown without pesticides and irrigated with untreated natural water.',
          pt: 'A comida orgânica não é uma moda passageira. É uma forma de se alimentar que protege a vida do planeta e a saúde de quem a consome: os alimentos são cultivados sem pesticidas e irrigados com águas naturais não tratadas.',
        },
        {
          es: 'En Jerovia Orgánico vamos más allá de una posición ideológica frente al cultivo sin pesticidas: buscamos cambiar la forma de consumir.',
          en: 'At Jerovia Orgánico we go beyond an ideological stance on pesticide-free farming: we aim to change the way people consume.',
          pt: 'Na Jerovia Orgánico vamos além de uma posição ideológica sobre o cultivo sem pesticidas: buscamos mudar a forma de consumir.',
        },
      ],
    },
    pillarsTitle: { es: 'Equilibrio entre lo económico, lo social y lo ambiental', en: 'Balance between the economic, the social and the environmental', pt: 'Equilíbrio entre o econômico, o social e o ambiental' },
    pillars: [
      { title: { es: 'Económico', en: 'Economic', pt: 'Econômico' }, text: { es: 'Comercio justo: pagamos un precio digno a quienes producen y generamos trabajo en el país.', en: 'Fair trade: we pay a fair price to producers and create jobs in the country.', pt: 'Comércio justo: pagamos um preço digno a quem produz e geramos trabalho no país.' } },
      { title: { es: 'Social', en: 'Social', pt: 'Social' }, text: { es: 'Apoyamos la educación de jóvenes indígenas y campesinos junto a la Fundación Moisés Bertoni.', en: 'We support the education of indigenous and rural youth together with the Moisés Bertoni Foundation.', pt: 'Apoiamos a educação de jovens indígenas e camponeses junto com a Fundação Moisés Bertoni.' } },
      { title: { es: 'Ambiental', en: 'Environmental', pt: 'Ambiental' }, text: { es: 'Cultivo sin pesticidas, empaques biodegradables y cuidado de la Reserva de Biosfera del Bosque Mbaracayú.', en: 'Pesticide-free farming, biodegradable packaging and care for the Mbaracayú Forest Biosphere Reserve.', pt: 'Cultivo sem pesticidas, embalagens biodegradáveis e cuidado da Reserva da Biosfera do Bosque Mbaracayú.' } },
    ],
    community: {
      title: { es: 'Orgullosos de colaborar con la Fundación Moisés Bertoni', en: 'Proud to work with the Moisés Bertoni Foundation', pt: 'Orgulhosos de colaborar com a Fundação Moisés Bertoni' },
      text: {
        es: 'Apoyamos el proyecto autosostenible del Centro Educativo Mbaracayú, una iniciativa que estimula el espíritu emprendedor de jóvenes indígenas y campesinos y la conservación de la Reserva de Biosfera del Bosque Mbaracayú.',
        en: 'We support the self-sustaining project of the Mbaracayú Educational Center, an initiative that fosters entrepreneurship among indigenous and rural youth and the conservation of the Mbaracayú Forest Biosphere Reserve.',
        pt: 'Apoiamos o projeto autossustentável do Centro Educativo Mbaracayú, uma iniciativa que estimula o espírito empreendedor de jovens indígenas e camponeses e a conservação da Reserva da Biosfera do Bosque Mbaracayú.',
      },
      cta: { es: 'Conocer la comunidad', en: 'Meet the community', pt: 'Conhecer a comunidade' },
      image: 'fundacion-moises-bertoni-verde.png',
    },
    productTitle: { es: 'Lo que hace especiales a nuestros productos', en: 'What makes our products special', pt: 'O que torna nossos produtos especiais' },
    product: [
      { title: { es: '100% nacional', en: '100% Paraguayan', pt: '100% nacional' }, text: { es: 'Producidos en Paraguay. Orgullo Nacional.', en: 'Made in Paraguay. National pride.', pt: 'Produzidos no Paraguai. Orgulho Nacional.' } },
      { title: { es: 'Sin gluten, apto celíacos', en: 'Gluten-free, celiac-safe', pt: 'Sem glúten, apto para celíacos' }, text: { es: 'Certificado por Fupacel.', en: 'Certified by Fupacel.', pt: 'Certificado pela Fupacel.' } },
      { title: { es: 'Apto para diabéticos', en: 'Suitable for diabetics', pt: 'Apto para diabéticos' }, text: { es: 'Certificado por FUPADI.', en: 'Certified by FUPADI.', pt: 'Certificado pela FUPADI.' } },
      { title: { es: 'Comercio justo', en: 'Fair trade', pt: 'Comércio justo' }, text: { es: 'Una relación equitativa con quienes producen.', en: 'A fair relationship with those who produce.', pt: 'Uma relação equitativa com quem produz.' } },
    ],
    packagingTitle: { es: 'Un packaging pensado para el planeta', en: 'Packaging designed for the planet', pt: 'Uma embalagem pensada para o planeta' },
    packagingIntro: { es: 'Dos capas, las dos biodegradables y certificadas.', en: 'Two layers, both biodegradable and certified.', pt: 'Duas camadas, ambas biodegradáveis e certificadas.' },
    packaging: [
      { title: { es: 'Primer packaging', en: 'First layer', pt: 'Primeira embalagem' }, text: { es: 'Caja de cartón biodegradable certificada.', en: 'Certified biodegradable cardboard box.', pt: 'Caixa de papelão biodegradável certificada.' } },
      { title: { es: 'Segundo packaging', en: 'Second layer', pt: 'Segunda embalagem' }, text: { es: 'Bolsa de plástico biodegradable certificada (d2w).', en: 'Certified biodegradable plastic bag (d2w).', pt: 'Sacola de plástico biodegradável certificada (d2w).' } },
    ],
    videos: {
      title: { es: 'Audiovisual Jerovia', en: 'Jerovia audiovisual', pt: 'Audiovisual Jerovia' },
      items: [
        { label: { es: 'Español', en: 'Spanish', pt: 'Espanhol' }, youtubeId: 'Qtm_ypLO0xs' },
        { label: { es: 'Inglés', en: 'English', pt: 'Inglês' }, youtubeId: 'TYk9ODW5dqI' },
      ],
    },
    certsTitle: { es: 'Certificaciones que nos respaldan', en: 'Certifications that back us', pt: 'Certificações que nos respaldam' },
    contactTitle: { es: 'Visitanos o escribinos', en: 'Visit or write to us', pt: 'Visite-nos ou escreva-nos' },
    cta: { es: 'Ver los productos', en: 'See the products', pt: 'Ver os produtos' },
  },
  certificationsPage: {
    title: { es: 'Certificaciones', en: 'Certifications', pt: 'Certificações' },
    intro: {
      es: 'Lo que hacemos está respaldado por organizaciones que verifican nuestros productos y nuestra forma de trabajar.',
      en: 'What we do is backed by organizations that verify our products and the way we work.',
    },
  },
  blogPage: {
    title: { es: 'Aprendé', en: 'Learn', pt: 'Aprenda' },
    intro: { es: 'Notas, novedades y lo que dicen los medios sobre Jerovia.', en: 'Articles, news and what the press says about Jerovia.' },
  },
}

export const brand: BrandConfig = fillL10n(brandEs, translations)
export const copy: BrandCopy = fillL10n(copyEs, translations)
export const seed: SeedData = fillL10n(seedEs, translations)
export type { SeedData }
