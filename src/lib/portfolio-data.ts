// Portfolio data for Mohamed Bakkouri
// Centralized so content is easy to update later

export const profile = {
  name: "Mohamed Bakkouri",
  firstName: "Mohamed",
  lastName: "Bakkouri",
  role: "Spécialiste en Marketing Digital",
  location: "Fès, Maroc",
  email: "mohamedbakkouri88@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohamedbakkouri/",
  linkedinCerts: "https://www.linkedin.com/in/mohamedbakkouri/details/certifications/",
  intro:
    "Étudiant en Master Marketing Digital à l'ENCG Fès. Double culture académique — Classes Préparatoires ECS puis Master Marketing Digital. Je combine stratégie, créativité et analyse de données pour développer la visibilité des marques, de l'audit SEO à la gestion des réseaux sociaux, au service d'objectifs mesurables.",
  tagline: "Stratégie · Créativité · Données",
};

export const languages = [
  { name: "Français", level: "Natif", code: "FR" },
  { name: "Arabe", level: "Natif", code: "AR" },
  { name: "Anglais", level: "Professionnel", code: "EN" },
];

export const education = [
  {
    degree: "Master 1 — Marketing Digital",
    school: "ENCG Fès",
    period: "2022 — Présent",
  },
  {
    degree: "Classes Préparatoires ECS",
    school: "Économie & Commerce Scientifique",
    period: "2020 — 2022",
  },
];

export const experiences = [
  {
    role: "Stagiaire Marketing",
    company: "Marjane Group",
    location: "Maroc",
    period: "Mai — Juin 2026",
    tags: ["Marketing", "Retail", "Distribution"],
    description:
      "Stage marketing au sein du leader marocain de la grande distribution. Participation aux opérations merchandising, analyse des ventes et support aux lancements de campagnes en magasin.",
    metric: null,
    logo: "/logo-marjane.jpg",
  },
  {
    role: "Assistant Marketing",
    company: "Ghaiti Event",
    location: "Rabat",
    period: "Juil. — Sep. 2025",
    tags: ["Event Marketing", "Social Media", "Campagnes"],
    description:
      "Pilotage de la stratégie social media pour une agence événementielle : campagnes, création de contenu et activation d'engagement autour des événements.",
    metric: "+15% d'engagement",
    logo: "/logo-ghaiti.jpg",
  },
  {
    role: "Assistant Marketing Digital",
    company: "UrbanFlex",
    location: "Paris / Remote",
    period: "Juin — Juil. 2025",
    tags: ["SEO", "Content Creation", "Remote"],
    description:
      "Production de contenus orientés conversion et optimisation SEO technique & visuelle pour une marque basée à Paris, en full remote.",
    metric: "+20% de visibilité",
    logo: null,
  },
];

export const skills = [
  { name: "SEO", category: "Acquisition" },
  { name: "Social Media", category: "Acquisition" },
  { name: "Analytics", category: "Données" },
  { name: "Création de contenu", category: "Création" },
  { name: "Stratégie Marketing", category: "Stratégie" },
  { name: "Marketing Commercial", category: "Stratégie" },
];

export const tools = [
  "Google Analytics 4",
  "Semrush",
  "Meta Business Suite",
  "HubSpot",
  "Canva Pro",
  "WordPress",
  "Looker Studio",
  "Mailchimp",
  "Notion",
  "Search Console",
  "Ahrefs",
  "Figma",
  "CapCut",
];

export const qualities = [
  "Esprit analytique",
  "Créativité",
  "Orienté résultats",
  "Vision stratégique",
  "Rigueur académique",
  "Adaptabilité",
];

export const projects = [
  {
    name: "Ghmoiya",
    subtitle: "Marque de Makeup",
    category: "Branding · Identité de marque",
    year: "2024",
    description:
      "Développement complet d'une marque de cosmétiques premium : positionnement haut de gamme autour de la Figue de Barbarie, identité visuelle raffinée et stratégie de marque complète — du naming au déploiement.",
    tags: ["Branding", "Positionnement", "Identité visuelle"],
    image: "/project-ghmoiya.jpg",
  },
  {
    name: "Ghaiti",
    subtitle: "Stratégie Événementielle",
    category: "Social Media · Événementiel",
    year: "2025",
    description:
      "Stratégie marketing pour une agence événementielle : campagnes social media, gestion de contenu et création d'engagement autour des événements. Activation multi-canal et suivi de performance.",
    tags: ["Social Media", "Campagnes", "Événementiel"],
    image: "/project-ghaiti.jpg",
  },
  {
    name: "UrbanFlex",
    subtitle: "Visibilité Digitale",
    category: "SEO & Contenu",
    year: "2025",
    description:
      "Contenus orientés conversion, optimisation SEO visuelle et technique pour maximiser la visibilité en ligne et générer des leads qualifiés. Travail en remote avec une équipe Parisienne.",
    tags: ["SEO", "Contenu", "Conversion"],
    image: "/project-urbanflex.jpg",
  },
];

export const certifications = [
  {
    name: "Google Digital Marketing",
    year: "2023",
    issuer: "Google",
    credentialId: "Google Activate",
  },
  {
    name: "Meta Social Media Marketing",
    year: "2022",
    issuer: "Meta",
    credentialId: "Meta Blueprint",
  },
  {
    name: "HubSpot Content Marketing",
    year: "2023",
    issuer: "HubSpot",
    credentialId: "HubSpot Academy",
  },
  {
    name: "Google Analytics 4",
    year: "2024",
    issuer: "Google",
    credentialId: "Skillshop",
  },
];

export const navSections = [
  { label: "Profil", href: "#about", index: "01" },
  { label: "Expérience", href: "#experience", index: "02" },
  { label: "Compétences", href: "#skills", index: "03" },
  { label: "Projets", href: "#projects", index: "04" },
  { label: "Certifications", href: "#certs", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
];
