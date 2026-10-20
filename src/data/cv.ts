export interface ExperienceEntry {
  role: string;
  organization: string;
  period: string;
  location: string;
  division?: string;
  highlights: string[];
  tags: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details: string;
}

export const cvData = {
  header: {
    name: 'Damien Fernandes',
    title: 'Solutions Architect (Banking Software) & PhD Researcher in Environmental Impact of AI (cLCA)',
    location: 'Annecy (74), France',
    linkedin: 'https://www.linkedin.com/in/damienfernandes/',
    github: 'https://github.com/damienfernandes',
    summary:
      'Solutions Architect at SBS Software with 18+ years of experience in enterprise banking software, technical architecture frameworks, and engineering management. Currently pursuing a 5-year PhD (2nd year) at the LISTIC laboratory (Université Savoie Mont Blanc) on the multi-criteria Consequential Life Cycle Assessment (cLCA — GWP, AFP, water, energy) of integrating Artificial Intelligence into enterprise business service processes.',
  },
  experience: [
    {
      role: 'PhD Researcher — Consequential LCA of AI',
      organization: 'LISTIC Laboratory (Université Savoie Mont Blanc) & SBS Software',
      period: 'Nov. 2024 – Present (5-Year Doctoral Track)',
      location: 'Annecy (74), France',
      division: 'Joint Industry-Academic Doctoral Research',
      highlights: [
        'Conducting a 5-year doctoral thesis on the multi-criteria Consequential Life Cycle Assessment (cLCA) of integrating Artificial Intelligence into enterprise business service processes.',
        'Evaluating multi-criteria environmental indicators beyond carbon alone: Global Warming Potential (GWP), Acidification / Abiotic Footprint (AFP/ADP), Water consumption, and Primary Energy demand.',
        'Modeling systemic shifts, process-level substitutions, and rebound effects induced by AI adoption within banking and enterprise service workflows.',
        'Speaker at academic and industry events, including "Les OFF de l’IA 2026" (Annecy): "Facing AI: What choices for enterprises?".',
      ],
      tags: [
        'Consequential LCA (cLCA)',
        'Sustainable AI',
        'Multi-Criteria Impact (GWP, AFP, Water, Energy)',
        'Business Process Modeling',
      ],
    },
    {
      role: 'Solutions Architect',
      organization: 'SBS Software (formerly Sopra Banking Software)',
      period: '2022 – Present',
      location: 'Annecy (74), France',
      division: 'Enterprise & Banking Solutions Architecture',
      highlights: [
        'Designing scalable, resilient, and sustainable software architectures for core banking and financial services ecosystems.',
        'Assessing the architectural, operational, and environmental trade-offs of integrating AI capabilities and cloud-native services into business processes.',
        'Driving non-functional architecture governance (performance, eco-design, modularity, interoperability, security) across engineering teams.',
      ],
      tags: [
        'Solutions Architecture',
        'Banking Software',
        'Software Eco-Design',
        'Distributed Systems',
      ],
    },
    {
      role: 'Engineering Manager / Agility Manager & Technical Architecture Lead',
      organization: 'Sopra Banking Software',
      period: 'June 2012 – 2022',
      location: 'Annecy (74), France',
      division: 'Banking Loans Division & R&D Technical Architecture Cell',
      highlights: [
        'Engineering Manager and Project Manager within the Banking Loans Division and the R&D Technical Architecture unit.',
        'Technical Leader for Sopra Banking Software core frameworks, defining R&D architectural standards and reusable engineering foundations.',
        'Agility Manager & Scrum Master (from March 2018) leading Agile transformation, Management 3.0 practices, and HR/team coaching across R&D architecture teams.',
      ],
      tags: [
        'Engineering Management',
        'Technical Architecture',
        'Banking Frameworks',
        'Agile / Management 3.0',
        'Java / JEE',
      ],
    },
    {
      role: 'Lead Analyst & Software Developer (Client Rating Platform)',
      organization: 'UTiGROUP (for Crédit Agricole Headquarters)',
      period: 'Sept. 2010 – May 2012',
      location: 'Lyon (69) / Annecy (74), France',
      division: 'Client: Crédit Agricole — Head Office (Annecy)',
      highlights: [
        'Managed the software development lifecycle for Crédit Agricole’s customer credit rating and scoring application.',
        'Designed and implemented core business logic and graphical user interface features.',
        'Coordinated technical analysis, release delivery, and stakeholder alignment with banking domain experts.',
      ],
      tags: ['Credit Rating Systems', 'Banking IT', 'Software Engineering', 'Java'],
    },
    {
      role: 'Software Analyst & Performance Engineer',
      organization: 'Micropole-Univers',
      period: 'Jan. 2010 – Sept. 2010',
      location: 'Aix-en-Provence (13), France',
      division: 'Clients: Fongecif & CARIF Île-de-France (Kelios Platform)',
      highlights: [
        'Developed business and UI features for the "Kelios" platform used to manage regional professional training programs across Île-de-France.',
        'Led load testing campaigns, performance profiling, and end-to-end optimization across both the application layer and relational databases.',
      ],
      tags: ['Load Testing', 'Database Optimization', 'Web Applications', 'Kelios'],
    },
    {
      role: 'Software Engineer & Service Center Specialist',
      organization: 'Sopra Group',
      period: 'Sept. 2008 – Dec. 2009',
      location: 'Aix-en-Provence (13), France',
      division: 'Clients: BNP Paribas Factor, Regional Council of Bouches-du-Rhône, City of Marseille',
      highlights: [
        'BNP Paribas Factor (May 2009 – Dec. 2009, Payment Media Dept.): Contributed to setting up a delivery service center, created estimation nomograms (abaques de chiffrage), onboarded/trained new engineers, authored detailed technical specifications, and implemented the Belgian CODA financial exchange standard following the Fortis Bank integration.',
        'Regional Council of Bouches-du-Rhône (March 2009 – May 2009): Developed software modules for the Departmental House for Persons with Disabilities (MDPH).',
        'City of Marseille Administration (Oct. 2008 – March 2009): Executed technical application migration, evolutionary maintenance, and third-party application maintenance (TMA).',
      ],
      tags: [
        'Payment Systems (CODA)',
        'Service Center Setup',
        'Technical Specifications',
        'Application Migration',
      ],
    },
    {
      role: 'R&D Software Analyst & Developer — "Evolan" Banking Suite',
      organization: 'Sopra Group',
      period: '2008 (6 months)',
      location: 'Annecy (74), France',
      division: 'R&D Banking Solutions Division ("Evolan")',
      highlights: [
        'Conducted functional/technical analysis and software development within the "Evolan" banking product suite.',
        'Contributed to "Evolan Charging for Services" and "Evolan New Business" banking software modules.',
      ],
      tags: ['Evolan', 'Core Banking R&D', 'Software Analysis'],
    },
    {
      role: 'Early Career & Summer IT / Operations Roles',
      organization: 'Cereal Partners France (Nestlé) / Sofreco / La Poste',
      period: '2003 – 2007',
      location: 'Rumilly (74) & Savoie, France',
      highlights: [
        'Summer 2007 — Cereal Partners France (IT Division, Rumilly): Database evolution, maintenance, and data management on the global "GLOBE" enterprise system.',
        '2006–2007 — Sofreco (3 months): Mobility and transportation survey investigator for the Savoie metropolitan area.',
        '2004–2007 (Summers) — Cereal Partners France & La Poste (2003): Production operations and postal distribution.',
      ],
      tags: ['GLOBE System', 'Database Maintenance', 'Field Surveys'],
    },
  ] as ExperienceEntry[],
  education: [
    {
      degree: 'PhD in Computer Science & Environmental Assessment (Consequential LCA of AI)',
      institution: 'Université Savoie Mont Blanc (USMB) — LISTIC Laboratory',
      period: '2024 – 2029 (In Progress, Year 2)',
      location: 'Annecy / Le Bourget-du-Lac, France',
      details:
        '5-year doctoral thesis on the Multi-Criteria Consequential Life Cycle Assessment (GWP, AFP, water, energy, etc.) of integrating Artificial Intelligence into enterprise business service processes.',
    },
    {
      degree: 'Master’s Degree in Information & Communication Technologies (ICT) — Computer Science & Cooperative Systems',
      institution: 'Université de Savoie (Université Savoie Mont Blanc)',
      period: '2006 – 2008',
      location: 'Le Bourget-du-Lac (73), France',
      details:
        'Master "Technologie de l’Information et des Communications, mention Informatique et Systèmes Coopératifs". Focus on distributed systems, formal methods, and software engineering.',
    },
    {
      degree: 'Bachelor’s Degree (Licence) in Fundamental & Applied Sciences — Mathematics & Computer Science',
      institution: 'Université de Savoie (Université Savoie Mont Blanc)',
      period: '2003 – 2006',
      location: 'Le Bourget-du-Lac (73), France',
      details: 'Major in Computer Science and Applied Mathematics.',
    },
    {
      degree: 'Scientific High School Diploma (Baccalauréat Scientifique)',
      institution: 'Lycée Démotz de la Salle',
      period: '2002 – 2003',
      location: 'Rumilly (74), France',
      details: 'Science & Mathematics track.',
    },
  ] as EducationEntry[],
  skills: {
    'Research & Environmental Assessment': [
      'Consequential Life Cycle Assessment (cLCA)',
      'Multi-Criteria Impact Assessment (GWP, AFP/ADP, Water, Primary Energy)',
      'Systemic & Rebound Effect Modeling',
      'Green IT & Sustainable AI in Business Processes',
      'Sustainable Web & Software Eco-Design',
    ],
    'Architecture & Software Engineering': [
      'Enterprise & Solutions Architecture',
      'Core Banking & Lending Platforms',
      'UML, BPMN, Sequence & Use Case Modeling',
      'Formal Methods (B-Method)',
      'Performance Profiling & Load Testing',
    ],
    'Languages, Platforms & Databases': [
      'Java / JEE (J2EE), Spring, Hibernate, Struts, Swing/AWT',
      'Rust, Python, C++, C#, .NET, Ruby on Rails, ADA, Erlang, Caml, Pascal, Smalltalk',
      'Web Technologies (HTML, TypeScript/JavaScript, PHP, Astro)',
      'Oracle (9i/10g, PL/SQL), PostgreSQL, Sybase, MySQL',
    ],
    'Leadership, Languages & Civic Engagement': [
      'Engineering Management, Agile / Scrum, Management 3.0 & Team Coaching',
      'Languages: French (Native), English (Fluent / Professional), Spanish (Working knowledge)',
      'Volunteer Firefighter (2008–2010, Aix-en-Provence Principal Fire & Rescue Center — Victim rescue, urban & forest fire certified)',
      'Ballroom & Latin Dance Instructor (Beginner & Intermediate levels)',
    ],
  },
};
