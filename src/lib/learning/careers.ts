// ─────────────────────────────────────────────────────────────────────────────
// Work that lasts: occupations linked to subjects (owner direction, Nov 26-27
// 2026). We link to the official profiles and copy no numbers: pay, outlook
// and requirements change, and the Bureau of Labor Statistics (BLS) and
// O*NET publish them with their dates, geography and methods. A number we
// copied would go stale and lose its source.
//
// The "needs" and "hands-on" notes describe the KIND of work, not a forecast.
// No job is permanently safe from change, with or without AI, and we never
// score one. Method: docs in the owner's private strategy folder
// (OPEN-MIRROR-LEARNING-BLUEPRINT, "Occupational resilience").
// ─────────────────────────────────────────────────────────────────────────────

/** Lasting human needs a kind of work serves. */
export type Need =
  | "food" | "water" | "shelter" | "energy" | "infrastructure" | "health" | "care"
  | "education" | "transportation" | "repair" | "safety" | "communication"
  | "relationships" | "creativity" | "stewardship";

export const NEED_LABEL: Record<Need, string> = {
  food: "Food", water: "Water", shelter: "Shelter", energy: "Energy",
  infrastructure: "Infrastructure", health: "Health", care: "Caregiving",
  education: "Education", transportation: "Transportation", repair: "Repair",
  safety: "Safety", communication: "Communication", relationships: "Human relationships",
  creativity: "Creativity", stewardship: "Stewardship",
};

export type Occupation = {
  id: string;
  title: string;
  /** O*NET-SOC code; the O*NET profile is built from it. */
  soc: string;
  /** BLS Occupational Outlook Handbook page, when BLS publishes one. */
  bls?: string;
  needs: Need[];
  /** Most of the work is done in person, with the hands. */
  handsOn: boolean;
  /** Registered Apprenticeship is a common way in. */
  apprenticeship?: boolean;
};

const OOH = "https://www.bls.gov/ooh/";

export const OCCUPATIONS: Occupation[] = [
  { id: "electrician", title: "Electricians", soc: "47-2111.00", bls: `${OOH}construction-and-extraction/electricians.htm`, needs: ["energy", "shelter", "safety"], handsOn: true, apprenticeship: true },
  { id: "plumber", title: "Plumbers, pipefitters and steamfitters", soc: "47-2152.00", bls: `${OOH}construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm`, needs: ["water", "shelter", "health"], handsOn: true, apprenticeship: true },
  { id: "hvac-technician", title: "Heating, air conditioning and refrigeration technicians", soc: "49-9021.00", bls: `${OOH}installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm`, needs: ["shelter", "health", "energy"], handsOn: true, apprenticeship: true },
  { id: "carpenter", title: "Carpenters", soc: "47-2031.00", bls: `${OOH}construction-and-extraction/carpenters.htm`, needs: ["shelter", "infrastructure"], handsOn: true, apprenticeship: true },
  { id: "roofer", title: "Roofers", soc: "47-2181.00", bls: `${OOH}construction-and-extraction/roofers.htm`, needs: ["shelter", "repair"], handsOn: true },
  { id: "welder", title: "Welders, cutters, solderers and brazers", soc: "51-4121.00", bls: `${OOH}production/welders-cutters-solderers-and-brazers.htm`, needs: ["infrastructure", "repair"], handsOn: true, apprenticeship: true },
  { id: "machinist", title: "Machinists", soc: "51-4041.00", bls: `${OOH}production/machinists-and-tool-and-die-makers.htm`, needs: ["infrastructure", "repair"], handsOn: true, apprenticeship: true },
  { id: "auto-technician", title: "Automotive service technicians and mechanics", soc: "49-3023.00", bls: `${OOH}installation-maintenance-and-repair/automotive-service-technicians-and-mechanics.htm`, needs: ["transportation", "repair"], handsOn: true, apprenticeship: true },
  { id: "diesel-technician", title: "Diesel service technicians and mechanics", soc: "49-3031.00", bls: `${OOH}installation-maintenance-and-repair/diesel-service-technicians-and-mechanics.htm`, needs: ["transportation", "repair", "food"], handsOn: true, apprenticeship: true },
  { id: "auto-body", title: "Automotive body repairers", soc: "49-3021.00", bls: `${OOH}installation-maintenance-and-repair/automotive-body-and-glass-repairers.htm`, needs: ["transportation", "repair"], handsOn: true },
  { id: "small-engine-mechanic", title: "Small engine mechanics", soc: "49-3053.00", bls: `${OOH}installation-maintenance-and-repair/small-engine-mechanics.htm`, needs: ["repair", "transportation"], handsOn: true },
  { id: "maintenance-repair", title: "General maintenance and repair workers", soc: "49-9071.00", bls: `${OOH}installation-maintenance-and-repair/general-maintenance-and-repair-workers.htm`, needs: ["repair", "shelter"], handsOn: true },
  { id: "appliance-repairer", title: "Home appliance repairers", soc: "49-9031.00", needs: ["repair", "shelter"], handsOn: true },
  { id: "electronics-repair", title: "Electrical and electronics installers and repairers", soc: "49-2094.00", bls: `${OOH}installation-maintenance-and-repair/electrical-and-electronics-installers-and-repairers.htm`, needs: ["repair", "communication"], handsOn: true },
  { id: "line-worker", title: "Line installers and repairers", soc: "49-9051.00", bls: `${OOH}installation-maintenance-and-repair/line-installers-and-repairers.htm`, needs: ["energy", "communication", "infrastructure"], handsOn: true, apprenticeship: true },
  { id: "solar-installer", title: "Solar photovoltaic installers", soc: "47-2231.00", bls: `${OOH}construction-and-extraction/solar-photovoltaic-installers.htm`, needs: ["energy"], handsOn: true },
  { id: "wind-technician", title: "Wind turbine technicians", soc: "49-9081.00", bls: `${OOH}installation-maintenance-and-repair/wind-turbine-technicians.htm`, needs: ["energy"], handsOn: true },
  { id: "water-operator", title: "Water and wastewater treatment operators", soc: "51-8031.00", bls: `${OOH}production/water-and-wastewater-treatment-plant-and-system-operators.htm`, needs: ["water", "health", "infrastructure"], handsOn: true, apprenticeship: true },
  { id: "watch-repairer", title: "Watch and clock repairers", soc: "49-9064.00", needs: ["repair", "creativity"], handsOn: true },
  { id: "instrument-repairer", title: "Musical instrument repairers and tuners", soc: "49-9063.00", needs: ["repair", "creativity"], handsOn: true },
  { id: "jeweler", title: "Jewelers and precious stone and metal workers", soc: "51-9071.00", bls: `${OOH}production/jewelers-and-precious-stone-and-metal-workers.htm`, needs: ["creativity", "repair"], handsOn: true },
  { id: "upholsterer", title: "Upholsterers", soc: "51-6093.00", needs: ["repair", "creativity"], handsOn: true },
  { id: "woodworker", title: "Cabinetmakers and bench carpenters", soc: "51-7011.00", bls: `${OOH}production/woodworkers.htm`, needs: ["shelter", "creativity"], handsOn: true },
  { id: "registered-nurse", title: "Registered nurses", soc: "29-1141.00", bls: `${OOH}healthcare/registered-nurses.htm`, needs: ["health", "care"], handsOn: true },
  { id: "lpn", title: "Licensed practical and vocational nurses", soc: "29-2061.00", bls: `${OOH}healthcare/licensed-practical-and-licensed-vocational-nurses.htm`, needs: ["health", "care"], handsOn: true },
  { id: "home-health-aide", title: "Home health and personal care aides", soc: "31-1121.00", bls: `${OOH}healthcare/home-health-aides-and-personal-care-aides.htm`, needs: ["care", "health", "relationships"], handsOn: true },
  { id: "emt", title: "EMTs and paramedics", soc: "29-2042.00", bls: `${OOH}healthcare/emts-and-paramedics.htm`, needs: ["health", "safety"], handsOn: true },
  { id: "physical-therapist", title: "Physical therapists", soc: "29-1123.00", bls: `${OOH}healthcare/physical-therapists.htm`, needs: ["health", "care"], handsOn: true },
  { id: "dietitian", title: "Dietitians and nutritionists", soc: "29-1031.00", bls: `${OOH}healthcare/dietitians-and-nutritionists.htm`, needs: ["health", "food"], handsOn: false },
  { id: "vet-tech", title: "Veterinary technologists and technicians", soc: "29-2056.00", bls: `${OOH}healthcare/veterinary-technologists-and-technicians.htm`, needs: ["health", "care", "stewardship"], handsOn: true },
  { id: "animal-caretaker", title: "Animal caretakers", soc: "39-2021.00", bls: `${OOH}personal-care-and-service/animal-care-and-service-workers.htm`, needs: ["care", "stewardship"], handsOn: true },
  { id: "firefighter", title: "Firefighters", soc: "33-2011.00", bls: `${OOH}protective-service/firefighters.htm`, needs: ["safety"], handsOn: true },
  { id: "childcare-worker", title: "Childcare workers", soc: "39-9011.00", bls: `${OOH}personal-care-and-service/childcare-workers.htm`, needs: ["care", "education", "relationships"], handsOn: true },
  { id: "preschool-teacher", title: "Preschool teachers", soc: "25-2011.00", bls: `${OOH}education-training-and-library/preschool-teachers.htm`, needs: ["education", "care", "relationships"], handsOn: true },
  { id: "elementary-teacher", title: "Kindergarten and elementary school teachers", soc: "25-2021.00", bls: `${OOH}education-training-and-library/kindergarten-and-elementary-school-teachers.htm`, needs: ["education", "relationships"], handsOn: true },
  { id: "high-school-teacher", title: "High school teachers", soc: "25-2031.00", bls: `${OOH}education-training-and-library/high-school-teachers.htm`, needs: ["education", "relationships"], handsOn: true },
  { id: "librarian", title: "Librarians and library media specialists", soc: "25-4022.00", bls: `${OOH}education-training-and-library/librarians.htm`, needs: ["education", "communication"], handsOn: false },
  { id: "social-worker", title: "Social workers", soc: "21-1021.00", bls: `${OOH}community-and-social-service/social-workers.htm`, needs: ["care", "relationships", "safety"], handsOn: true },
  { id: "psychologist", title: "Psychologists", soc: "19-3033.00", bls: `${OOH}life-physical-and-social-science/psychologists.htm`, needs: ["health", "relationships"], handsOn: false },
  { id: "clergy", title: "Clergy", soc: "21-2011.00", needs: ["relationships", "care", "education"], handsOn: true },
  { id: "farmer", title: "Farmers, ranchers and agricultural managers", soc: "11-9013.00", bls: `${OOH}management/farmers-ranchers-and-other-agricultural-managers.htm`, needs: ["food", "stewardship"], handsOn: true },
  { id: "farmworker", title: "Agricultural workers", soc: "45-2092.00", bls: `${OOH}farming-fishing-and-forestry/agricultural-workers.htm`, needs: ["food"], handsOn: true },
  { id: "chef", title: "Chefs and head cooks", soc: "35-1011.00", bls: `${OOH}food-preparation-and-serving/chefs-and-head-cooks.htm`, needs: ["food", "creativity"], handsOn: true, apprenticeship: true },
  { id: "cook", title: "Cooks", soc: "35-2014.00", bls: `${OOH}food-preparation-and-serving/cooks.htm`, needs: ["food"], handsOn: true },
  { id: "baker", title: "Bakers", soc: "51-3011.00", bls: `${OOH}production/bakers.htm`, needs: ["food", "creativity"], handsOn: true },
  { id: "conservation-scientist", title: "Conservation scientists and foresters", soc: "19-1031.00", bls: `${OOH}life-physical-and-social-science/conservation-scientists.htm`, needs: ["stewardship", "water"], handsOn: true },
  { id: "environmental-technician", title: "Environmental science and protection technicians", soc: "19-4042.00", bls: `${OOH}life-physical-and-social-science/environmental-science-and-protection-technicians.htm`, needs: ["stewardship", "health", "water"], handsOn: true },
  { id: "mechanical-engineer", title: "Mechanical engineers", soc: "17-2141.00", bls: `${OOH}architecture-and-engineering/mechanical-engineers.htm`, needs: ["infrastructure", "energy"], handsOn: false },
  { id: "electrical-engineer", title: "Electrical and electronics engineers", soc: "17-2071.00", bls: `${OOH}architecture-and-engineering/electrical-and-electronics-engineers.htm`, needs: ["energy", "communication"], handsOn: false },
  { id: "civil-engineer", title: "Civil engineers", soc: "17-2051.00", bls: `${OOH}architecture-and-engineering/civil-engineers.htm`, needs: ["infrastructure", "water", "transportation"], handsOn: false },
  { id: "architect", title: "Architects", soc: "17-1011.00", bls: `${OOH}architecture-and-engineering/architects.htm`, needs: ["shelter", "creativity"], handsOn: false },
  { id: "computer-support", title: "Computer support specialists", soc: "15-1232.00", bls: `${OOH}computer-and-information-technology/computer-support-specialists.htm`, needs: ["communication", "repair"], handsOn: false },
  { id: "software-developer", title: "Software developers", soc: "15-1252.00", bls: `${OOH}computer-and-information-technology/software-developers.htm`, needs: ["communication"], handsOn: false },
  { id: "web-developer", title: "Web developers and digital designers", soc: "15-1254.00", bls: `${OOH}computer-and-information-technology/web-developers.htm`, needs: ["communication", "creativity"], handsOn: false },
  { id: "data-scientist", title: "Data scientists", soc: "15-2051.00", bls: `${OOH}math/data-scientists.htm`, needs: ["communication"], handsOn: false },
  { id: "statistician", title: "Statisticians", soc: "15-2041.00", bls: `${OOH}math/mathematicians-and-statisticians.htm`, needs: ["health", "communication"], handsOn: false },
  { id: "accountant", title: "Accountants and auditors", soc: "13-2011.00", bls: `${OOH}business-and-financial/accountants-and-auditors.htm`, needs: ["communication"], handsOn: false },
  { id: "bookkeeper", title: "Bookkeeping, accounting and auditing clerks", soc: "43-3031.00", bls: `${OOH}office-and-administrative-support/bookkeeping-accounting-and-auditing-clerks.htm`, needs: ["communication"], handsOn: false },
  { id: "lawyer", title: "Lawyers", soc: "23-1011.00", bls: `${OOH}legal/lawyers.htm`, needs: ["safety", "relationships"], handsOn: false },
  { id: "paralegal", title: "Paralegals and legal assistants", soc: "23-2011.00", bls: `${OOH}legal/paralegals-and-legal-assistants.htm`, needs: ["safety"], handsOn: false },
  { id: "historian", title: "Historians", soc: "19-3093.00", bls: `${OOH}life-physical-and-social-science/historians.htm`, needs: ["education", "communication"], handsOn: false },
  { id: "interpreter", title: "Interpreters and translators", soc: "27-3091.00", bls: `${OOH}media-and-communication/interpreters-and-translators.htm`, needs: ["communication", "relationships"], handsOn: false },
  { id: "writer", title: "Writers and authors", soc: "27-3043.00", bls: `${OOH}media-and-communication/writers-and-authors.htm`, needs: ["communication", "creativity"], handsOn: false },
  { id: "photographer", title: "Photographers", soc: "27-4021.00", bls: `${OOH}media-and-communication/photographers.htm`, needs: ["creativity", "communication"], handsOn: true },
  { id: "film-editor", title: "Film and video editors and camera operators", soc: "27-4032.00", bls: `${OOH}media-and-communication/film-and-video-editors-and-camera-operators.htm`, needs: ["creativity", "communication"], handsOn: false },
  { id: "musician", title: "Musicians and singers", soc: "27-2042.00", bls: `${OOH}entertainment-and-sports/musicians-and-singers.htm`, needs: ["creativity", "relationships"], handsOn: true },
  { id: "graphic-designer", title: "Graphic designers", soc: "27-1024.00", bls: `${OOH}arts-and-design/graphic-designers.htm`, needs: ["creativity", "communication"], handsOn: false },
  { id: "coach", title: "Coaches and scouts", soc: "27-2022.00", bls: `${OOH}entertainment-and-sports/coaches-and-scouts.htm`, needs: ["education", "relationships", "health"], handsOn: true },
  { id: "fitness-trainer", title: "Fitness trainers and instructors", soc: "39-9031.00", bls: `${OOH}personal-care-and-service/fitness-trainers-and-instructors.htm`, needs: ["health", "relationships"], handsOn: true },
  { id: "truck-driver", title: "Heavy and tractor-trailer truck drivers", soc: "53-3032.00", bls: `${OOH}transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm`, needs: ["transportation", "food"], handsOn: true },
];

export function onetUrl(o: Pick<Occupation, "soc">): string {
  return `https://www.onetonline.org/link/summary/${o.soc}`;
}

export function occupationById(id: string): Occupation | undefined {
  return OCCUPATIONS.find((o) => o.id === id);
}

/** The needs in the order the "Work that lasts" page shows them. */
export const NEEDS_ORDER: Need[] = [
  "food", "water", "shelter", "energy", "infrastructure", "health", "care", "safety",
  "education", "transportation", "repair", "communication", "relationships", "creativity", "stewardship",
];
