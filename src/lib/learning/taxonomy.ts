// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror Learning: the subject directory (owner direction, Nov 26-27 2026).
//
// "Any subject in any field." Disciplines follow the broad families of the
// U.S. Classification of Instructional Programs (CIP 2020, NCES), so a later
// pass can map courses, programs and occupations onto the same codes. The
// list is a starting point, not a limit: add a subject by adding one entry.
//
// Plain words first. `words` are the everyday words someone might type
// ("fixing things", "cars", "garden"), not the formal name, so a person
// doesn't need to know what a subject is called to find it.
//
// Public name: "Open Mirror Learning". "University" stays an internal working
// title until the owner has the naming question reviewed (see the handoff).
// ─────────────────────────────────────────────────────────────────────────────

export type Subject = {
  slug: string;
  name: string;
  /** English Wikipedia article title (a free, open-licensed overview). */
  wiki: string;
  /** Everyday words that point here, singular and lower case. */
  words: string[];
  /** Occupation ids in careers.ts. */
  careers?: string[];
  /** One plain line: what you learn here. */
  line: string;
};

export type Discipline = {
  slug: string;
  name: string;
  /** CIP 2020 two-digit series this discipline draws on. */
  cip: string[];
  subjects: Subject[];
};

export const DISCIPLINES: Discipline[] = [
  {
    slug: "math", name: "Mathematics and statistics", cip: ["27"],
    subjects: [
      { slug: "arithmetic-algebra", name: "Arithmetic and algebra", wiki: "Algebra", words: ["math", "number", "algebra", "equation", "fraction", "percent"], line: "Numbers, fractions, percents and equations, from the start." },
      { slug: "geometry", name: "Geometry and trigonometry", wiki: "Geometry", words: ["geometry", "shape", "angle", "trigonometry", "measure"], line: "Shapes, angles and measuring, the math behind building and design." },
      { slug: "calculus", name: "Calculus", wiki: "Calculus", words: ["calculus", "derivative", "integral"], line: "How things change and add up: the math of motion and growth." },
      { slug: "statistics", name: "Statistics and data", wiki: "Statistics", words: ["statistic", "data", "probability", "chart", "average", "survey"], careers: ["statistician", "data-scientist"], line: "Reading data honestly: averages, chance, samples and charts." },
      { slug: "logic", name: "Logic and discrete math", wiki: "Discrete_mathematics", words: ["logic", "puzzle", "proof", "discrete"], line: "Reasoning step by step: logic, counting, proofs and puzzles." },
    ],
  },
  {
    slug: "science", name: "Natural sciences", cip: ["26", "40"],
    subjects: [
      { slug: "biology", name: "Biology", wiki: "Biology", words: ["biology", "cell", "life", "gene", "dna", "plant", "living"], line: "Living things, from cells and genes to whole ecosystems." },
      { slug: "chemistry", name: "Chemistry", wiki: "Chemistry", words: ["chemistry", "chemical", "atom", "molecule", "reaction", "experiment"], line: "What things are made of and how they react." },
      { slug: "physics", name: "Physics", wiki: "Physics", words: ["physics", "force", "motion", "gravity", "energy", "light", "electricity"], line: "Motion, forces, energy, light and electricity." },
      { slug: "astronomy", name: "Astronomy and space", wiki: "Astronomy", words: ["astronomy", "space", "star", "planet", "moon", "telescope", "rocket"], line: "Stars, planets, the Moon and how we explore space." },
      { slug: "earth-science", name: "Earth science and weather", wiki: "Earth_science", words: ["earth", "rock", "weather", "geology", "volcano", "earthquake", "climate"], line: "Rocks, weather, water and the forces that shape the planet." },
    ],
  },
  {
    slug: "computing", name: "Computers, programming and AI", cip: ["11"],
    subjects: [
      { slug: "computer-basics", name: "Computer basics", wiki: "Computer_literacy", words: ["computer", "laptop", "email", "internet", "typing", "file", "password"], careers: ["computer-support"], line: "Using a computer with confidence: files, the web, email and safety." },
      { slug: "computer-repair", name: "Computer repair and old computers", wiki: "Computer_repair_technician", words: ["computer", "laptop", "pc", "slow", "hardware", "upgrade", "old computer", "used computer"], careers: ["computer-support", "electronics-repair"], line: "Checking, fixing and upgrading computers, including putting an old one back to work." },
      { slug: "linux", name: "Linux and free software", wiki: "Linux", words: ["linux", "ubuntu", "mint", "open source", "free software", "terminal", "command line"], careers: ["computer-support"], line: "A free operating system for old and new computers, and the command line." },
      { slug: "programming", name: "Programming", wiki: "Computer_programming", words: ["code", "coding", "program", "programming", "python", "javascript", "software", "app", "game"], careers: ["software-developer"], line: "Writing instructions a computer follows: from first lines to real programs." },
      { slug: "web-development", name: "Making websites", wiki: "Web_development", words: ["website", "web", "html", "css", "site", "web page", "online"], careers: ["web-developer"], line: "Building and publishing websites: HTML, CSS, JavaScript and hosting." },
      { slug: "artificial-intelligence", name: "Artificial intelligence", wiki: "Artificial_intelligence", words: ["ai", "artificial intelligence", "machine learning", "chatbot", "neural network"], careers: ["data-scientist", "software-developer"], line: "What AI is, how it learns from data, and how to use it well and carefully." },
      { slug: "version-control", name: "Git and managing code", wiki: "Git", words: ["git", "github", "version control", "source code", "repository"], careers: ["software-developer", "web-developer"], line: "Keeping every version of your work safe, and working with others on code." },
    ],
  },
  {
    slug: "engineering", name: "Engineering and architecture", cip: ["14", "15", "04"],
    subjects: [
      { slug: "mechanical-engineering", name: "Mechanical engineering", wiki: "Mechanical_engineering", words: ["machine", "engine", "mechanical", "gear", "motor", "design", "invent"], careers: ["mechanical-engineer", "machinist"], line: "Designing machines and the parts that move them." },
      { slug: "electrical-engineering", name: "Electrical engineering", wiki: "Electrical_engineering", words: ["electrical", "power", "circuit", "electricity", "grid"], careers: ["electrical-engineer", "line-worker"], line: "Power, circuits and the systems that carry electricity." },
      { slug: "electronics", name: "Electronics", wiki: "Electronics", words: ["electronics", "circuit", "solder", "arduino", "raspberry pi", "gadget", "radio", "wire"], careers: ["electronics-repair", "electrical-engineer"], line: "Circuits, components and gadgets you can build and repair." },
      { slug: "civil-engineering", name: "Civil engineering", wiki: "Civil_engineering", words: ["bridge", "road", "dam", "civil", "infrastructure", "construction"], careers: ["civil-engineer"], line: "Roads, bridges, water systems and the structures a town depends on." },
      { slug: "architecture", name: "Architecture", wiki: "Architecture", words: ["architecture", "architect", "building design", "house plan", "blueprint"], careers: ["architect"], line: "Designing buildings people live and work in." },
    ],
  },
  {
    slug: "trades", name: "Skilled trades and repair", cip: ["46", "47", "48"],
    subjects: [
      { slug: "automotive-repair", name: "Car and truck repair", wiki: "Auto_mechanic", words: ["car", "truck", "auto", "automotive", "mechanic", "brake", "oil change", "vehicle", "diesel"], careers: ["auto-technician", "diesel-technician", "auto-body"], line: "How vehicles work and how to keep them running." },
      { slug: "small-engine-repair", name: "Small engine repair", wiki: "Small_engine", words: ["lawn mower", "mower", "chainsaw", "small engine", "motorcycle", "atv", "boat motor"], careers: ["small-engine-mechanic"], line: "Mowers, saws, bikes and boats: small engines, start to finish." },
      { slug: "electrical-work", name: "Electrical work", wiki: "Electrician", words: ["electrician", "wiring", "outlet", "breaker", "electric", "wire", "light switch"], careers: ["electrician", "line-worker", "solar-installer"], line: "Wiring homes and buildings safely, and how licensed electricians train." },
      { slug: "plumbing", name: "Plumbing", wiki: "Plumbing", words: ["plumber", "plumbing", "pipe", "leak", "drain", "faucet", "toilet", "water heater"], careers: ["plumber"], line: "Water in, water out: pipes, fixtures and how plumbers train." },
      { slug: "hvac", name: "Heating and air conditioning", wiki: "Heating,_ventilation,_and_air_conditioning", words: ["hvac", "furnace", "air conditioning", "ac", "heat pump", "heating", "cooling", "refrigeration"], careers: ["hvac-technician"], line: "Keeping homes warm, cool and breathing: furnaces, AC and heat pumps." },
      { slug: "carpentry-woodworking", name: "Carpentry and woodworking", wiki: "Woodworking", words: ["wood", "woodworking", "carpentry", "carpenter", "furniture", "build", "deck", "shelf", "saw"], careers: ["carpenter", "woodworker"], line: "Measuring, cutting and joining wood, from a shelf to a house frame." },
      { slug: "welding", name: "Welding and metalwork", wiki: "Welding", words: ["weld", "welding", "metal", "steel", "fabrication", "machining"], careers: ["welder", "machinist"], line: "Joining and shaping metal, and how welders train and certify." },
      { slug: "appliance-repair", name: "Appliance and electronics repair", wiki: "Home_appliance", words: ["appliance", "washer", "dryer", "fridge", "refrigerator", "dishwasher", "microwave", "phone screen"], careers: ["appliance-repairer", "electronics-repair"], line: "Diagnosing and fixing the machines in a home." },
      { slug: "home-repair", name: "Home repair and maintenance", wiki: "Home_repair", words: ["house", "home", "drywall", "paint", "roof", "maintenance", "handyman", "fix up"], careers: ["maintenance-repair", "carpenter", "roofer"], line: "Keeping a home in good shape: small repairs, upkeep and when to call a pro." },
      { slug: "watch-clock-repair", name: "Watch, clock and instrument repair", wiki: "Watchmaker", words: ["watch", "clock", "watchmaker", "clockmaker", "pocket watch", "instrument repair", "restore"], careers: ["watch-repairer", "instrument-repairer", "jeweler"], line: "Precise, patient work: how timepieces and instruments are made and restored." },
    ],
  },
  {
    slug: "agriculture", name: "Agriculture and food production", cip: ["01"],
    subjects: [
      { slug: "farming", name: "Farming and ranching", wiki: "Agriculture", words: ["farm", "farming", "crop", "ranch", "cattle", "tractor", "harvest", "soil"], careers: ["farmer", "farmworker"], line: "Growing food and raising animals, and what it takes to run a farm." },
      { slug: "gardening", name: "Gardening", wiki: "Gardening", words: ["garden", "gardening", "plant", "vegetable", "flower", "seed", "grow food", "grow my own", "compost"], careers: ["farmworker"], line: "Growing vegetables, fruit and flowers where you live." },
      { slug: "animal-care", name: "Animal care", wiki: "Animal_husbandry", words: ["animal", "dog", "cat", "horse", "chicken", "pet", "livestock", "vet", "veterinary"], careers: ["vet-tech", "animal-caretaker", "farmer"], line: "Caring for pets and livestock, and the work of people who do it daily." },
      { slug: "food-preservation", name: "Canning and food preservation", wiki: "Food_preservation", words: ["canning", "preserve", "pickle", "freeze", "dehydrate", "jam"], line: "Keeping food safely: canning, freezing and drying, by tested methods." },
    ],
  },
  {
    slug: "environment", name: "Environment and natural resources", cip: ["03"],
    subjects: [
      { slug: "ecology", name: "Ecology and nature", wiki: "Ecology", words: ["nature", "ecology", "ecosystem", "wildlife", "forest", "bird", "insect"], careers: ["conservation-scientist", "environmental-technician"], line: "How living things and places depend on each other." },
      { slug: "conservation", name: "Conservation and land care", wiki: "Conservation_biology", words: ["conservation", "environment", "stewardship", "park", "forestry", "land"], careers: ["conservation-scientist"], line: "Caring for land, water and wildlife so they last." },
      { slug: "energy", name: "Energy", wiki: "Energy_development", words: ["energy", "solar", "wind", "power", "battery", "efficiency", "utility"], careers: ["solar-installer", "wind-technician", "line-worker"], line: "Where power comes from, how it reaches us, and how to use less of it." },
      { slug: "water", name: "Water and wastewater", wiki: "Water_resources", words: ["water", "river", "water well", "well water", "wastewater", "water treatment", "clean water"], careers: ["water-operator", "plumber"], line: "Clean water in, used water treated: the systems every town needs." },
    ],
  },
  {
    slug: "business", name: "Business and entrepreneurship", cip: ["52"],
    subjects: [
      { slug: "starting-a-business", name: "Starting a small business", wiki: "Entrepreneurship", words: ["business", "start a business", "entrepreneur", "side hustle", "own business", "startup", "llc", "self employed"], line: "From an idea to a small, organized business: customers, an offer, records." },
      { slug: "marketing", name: "Marketing and finding customers", wiki: "Marketing", words: ["marketing", "customer", "advertising", "brand", "social media", "sales", "promote"], line: "Understanding customers and reaching them honestly, without paid ads." },
      { slug: "management", name: "Management and leadership", wiki: "Management", words: ["manage", "manager", "leadership", "team", "lead", "organize", "boss"], line: "Leading people and running work well." },
      { slug: "selling-online", name: "Selling online", wiki: "E-commerce", words: ["sell", "selling", "online store", "shop", "etsy", "ebay", "ecommerce", "inventory"], line: "Selling products online: listings, payments, shipping and trust." },
    ],
  },
  {
    slug: "money", name: "Economics, finance and accounting", cip: ["45", "52"],
    subjects: [
      { slug: "economics", name: "Economics", wiki: "Economics", words: ["economics", "economy", "inflation", "supply and demand", "free market", "trade deficit", "tariff"], line: "How people, businesses and countries choose what to make and buy." },
      { slug: "personal-finance", name: "Personal finance", wiki: "Personal_finance", words: ["money", "budget", "saving", "debt", "credit", "bank", "paycheck", "retirement"], line: "Budgeting, saving, credit and debt: the basics, from official sources." },
      { slug: "accounting", name: "Accounting and bookkeeping", wiki: "Accounting", words: ["accounting", "bookkeeping", "tax", "taxes", "record", "receipt", "spreadsheet", "books"], careers: ["accountant", "bookkeeper"], line: "Keeping honest records and reading them: the language of business." },
      { slug: "investing-basics", name: "How investing works", wiki: "Investment", words: ["invest", "investing", "stock", "bond", "fund", "interest"], line: "What stocks, bonds and funds are, and how to spot fraud. Education, not advice." },
    ],
  },
  {
    slug: "education", name: "Education and teaching", cip: ["13"],
    subjects: [
      { slug: "teaching", name: "Teaching", wiki: "Teacher", words: ["teach", "teacher", "teaching", "classroom", "lesson", "school"], careers: ["elementary-teacher", "high-school-teacher"], line: "How people learn, and how to help them." },
      { slug: "early-childhood", name: "Early childhood", wiki: "Early_childhood_education", words: ["preschool", "toddler", "baby", "little kid", "daycare", "childcare", "child"], careers: ["preschool-teacher", "childcare-worker"], line: "How young children grow and learn, and caring for them well." },
      { slug: "tutoring", name: "Tutoring and homeschooling", wiki: "Homeschooling", words: ["tutor", "tutoring", "homeschool", "homework", "help my kid"], careers: ["elementary-teacher"], line: "Teaching one learner at a time, at home or alongside school." },
    ],
  },
  {
    slug: "health", name: "Medicine and health sciences", cip: ["51"],
    subjects: [
      { slug: "anatomy", name: "Anatomy and how the body works", wiki: "Human_body", words: ["body", "anatomy", "bone", "muscle", "heart", "brain", "organ"], careers: ["registered-nurse", "physical-therapist"], line: "The parts of the body and how they work together." },
      { slug: "nursing", name: "Nursing and caregiving", wiki: "Nursing", words: ["nurse", "nursing", "caregiver", "caregiving", "patient", "hospital", "care for", "elderly"], careers: ["registered-nurse", "lpn", "home-health-aide"], line: "Caring for people when they're sick, hurt or aging, and how nurses train." },
      { slug: "first-aid", name: "First aid and emergencies", wiki: "First_aid", words: ["first aid", "cpr", "emergency", "injury", "emt", "paramedic", "bleeding"], careers: ["emt", "firefighter"], line: "What to do in the first minutes of an injury or illness, and who to call." },
      { slug: "nutrition", name: "Nutrition", wiki: "Nutrition", words: ["nutrition", "diet", "healthy eating", "vitamin", "food"], careers: ["dietitian"], line: "What food does in the body, from official health sources." },
      { slug: "public-health", name: "Public health", wiki: "Public_health", words: ["public health", "disease", "vaccine", "community health", "epidemic"], careers: ["social-worker"], line: "Keeping whole communities healthy." },
    ],
  },
  {
    slug: "people", name: "Psychology and social sciences", cip: ["42", "45"],
    subjects: [
      { slug: "psychology", name: "Psychology", wiki: "Psychology", words: ["psychology", "mind", "behavior", "emotion", "memory", "brain", "why people"], careers: ["psychologist", "social-worker"], line: "How people think, feel, learn and behave." },
      { slug: "sociology", name: "Sociology and communities", wiki: "Sociology", words: ["sociology", "society", "community", "culture", "family", "group"], careers: ["social-worker"], line: "How groups, families and communities work." },
      { slug: "human-development", name: "Human development", wiki: "Developmental_psychology", words: ["growing up", "teen", "aging", "lifespan", "parenting", "development"], careers: ["social-worker", "childcare-worker"], line: "How people grow and change from birth to old age." },
    ],
  },
  {
    slug: "history", name: "History and geography", cip: ["54", "45"],
    subjects: [
      { slug: "us-history", name: "United States history", wiki: "History_of_the_United_States", words: ["american history", "us history", "civil war", "constitution", "president"], careers: ["historian"], line: "The story of the United States, from primary sources." },
      { slug: "world-history", name: "World history", wiki: "Human_history", words: ["history", "ancient", "rome", "empire", "war", "civilization", "past"], careers: ["historian"], line: "How the world got here: peoples, empires, ideas and wars." },
      { slug: "geography", name: "Geography and maps", wiki: "Geography", words: ["geography", "map", "country", "travel", "continent", "place"], line: "Places, maps and how where we live shapes how we live." },
      { slug: "family-history", name: "Family history and genealogy", wiki: "Genealogy", words: ["family history", "genealogy", "ancestor", "family tree", "grandparent", "heritage"], line: "Finding the people you come from, with records you can check." },
    ],
  },
  {
    slug: "law", name: "Law, government and public policy", cip: ["22", "44", "45"],
    subjects: [
      { slug: "law-basics", name: "How law works", wiki: "Law", words: ["law", "lawyer", "court", "legal", "rights", "contract", "judge"], careers: ["lawyer", "paralegal"], line: "Courts, contracts and rights, in plain terms. Information, not legal advice." },
      { slug: "civics", name: "Civics and government", wiki: "Civics", words: ["government", "civics", "vote", "voting", "congress", "election", "citizen"], line: "How government works and how citizens take part." },
      { slug: "public-policy", name: "Public policy", wiki: "Public_policy", words: ["policy", "public policy", "politics", "city council", "public service"], line: "How communities decide what to do, and how to follow along." },
    ],
  },
  {
    slug: "philosophy", name: "Philosophy and theology", cip: ["38", "39"],
    subjects: [
      { slug: "philosophy", name: "Philosophy", wiki: "Philosophy", words: ["philosophy", "meaning", "truth", "think", "wisdom", "logic"], line: "Big questions, asked carefully: knowledge, truth, the good life." },
      { slug: "ethics", name: "Ethics", wiki: "Ethics", words: ["ethics", "right and wrong", "moral", "honesty", "fairness"], line: "Right and wrong, and how to reason about hard choices." },
      { slug: "bible-theology", name: "The Bible and Christian theology", wiki: "Christian_theology", words: ["bible", "jesus", "god", "faith", "scripture", "church", "theology", "pray", "christian", "gospel"], careers: ["clergy"], line: "Reading the Bible and learning what Christians believe and why." },
      { slug: "world-religions", name: "World religions", wiki: "Religion", words: ["religion", "religions", "belief", "world religions"], line: "What the world's faiths teach, described by careful scholars." },
    ],
  },
  {
    slug: "languages", name: "Languages and literature", cip: ["16", "23"],
    subjects: [
      { slug: "learning-languages", name: "Learning a new language", wiki: "Second-language_acquisition", words: ["language", "spanish", "french", "german", "chinese", "sign language", "asl", "bilingual", "translate"], careers: ["interpreter"], line: "How to learn a language, and free places to start." },
      { slug: "english-grammar", name: "English reading and grammar", wiki: "English_grammar", words: ["english", "grammar", "reading", "spelling", "vocabulary", "esl"], line: "Reading and writing English with confidence." },
      { slug: "literature", name: "Literature", wiki: "Literature", words: ["literature", "novel", "poetry", "poem", "book", "classic", "shakespeare"], careers: ["librarian", "writer"], line: "Great books and how to read them closely, many of them free." },
    ],
  },
  {
    slug: "communication", name: "Writing and communication", cip: ["09", "23"],
    subjects: [
      { slug: "writing", name: "Writing", wiki: "Writing", words: ["write", "writing", "essay", "story", "author", "blog", "book"], careers: ["writer"], line: "Clear writing for school, work and stories." },
      { slug: "public-speaking", name: "Public speaking", wiki: "Public_speaking", words: ["speak", "speech", "presentation", "public speaking", "talk", "confidence"], line: "Speaking to a group without dread." },
      { slug: "journalism", name: "Journalism and media literacy", wiki: "Journalism", words: ["journalism", "news", "reporter", "fact check", "media literacy", "source"], careers: ["writer"], line: "Finding facts, checking sources and telling them straight." },
    ],
  },
  {
    slug: "music", name: "Music and performing arts", cip: ["50"],
    subjects: [
      { slug: "music-theory", name: "Music theory", wiki: "Music_theory", words: ["music", "note", "chord", "scale", "rhythm", "music theory", "read music"], careers: ["musician"], line: "How music works: notes, rhythm, scales and chords." },
      { slug: "piano", name: "Piano and keyboard", wiki: "Piano", words: ["piano", "keyboard", "keys"], careers: ["musician", "instrument-repairer"], line: "Playing piano and keyboard, from the first notes." },
      { slug: "guitar", name: "Guitar", wiki: "Guitar", words: ["guitar", "bass", "ukulele", "strum"], careers: ["musician"], line: "Chords, strumming and playing songs you love." },
      { slug: "singing", name: "Singing", wiki: "Singing", words: ["sing", "singing", "voice", "choir", "worship"], careers: ["musician"], line: "Using your voice well, alone or in a choir." },
      { slug: "songwriting", name: "Songwriting and recording", wiki: "Songwriter", words: ["song", "songwriting", "lyrics", "record", "recording", "produce", "beat"], careers: ["musician"], line: "Writing songs and recording them with free tools." },
      { slug: "theater", name: "Theater and acting", wiki: "Theatre", words: ["theater", "theatre", "acting", "actor", "drama", "play", "stage"], line: "Acting, staging and putting on a show." },
    ],
  },
  {
    slug: "art", name: "Visual arts and design", cip: ["50"],
    subjects: [
      { slug: "drawing", name: "Drawing", wiki: "Drawing", words: ["draw", "drawing", "sketch", "cartoon", "comic", "doodle"], careers: ["graphic-designer"], line: "Seeing and drawing: lines, shapes, light and practice." },
      { slug: "painting", name: "Painting", wiki: "Painting", words: ["paint", "painting", "watercolor", "acrylic", "oil painting", "canvas"], line: "Color, brushes and paint, one exercise at a time." },
      { slug: "graphic-design", name: "Graphic design", wiki: "Graphic_design", words: ["design", "logo", "poster", "graphic", "font", "layout", "brand"], careers: ["graphic-designer", "web-developer"], line: "Making words and pictures work together: logos, layouts, type." },
      { slug: "crafts", name: "Crafts and making", wiki: "Handicraft", words: ["craft", "sew", "sewing", "knit", "quilt", "pottery", "jewelry", "handmade"], careers: ["jeweler", "upholsterer"], line: "Sewing, knitting, pottery, jewelry: making things by hand." },
    ],
  },
  {
    slug: "media", name: "Photography and film", cip: ["50", "10"],
    subjects: [
      { slug: "photography", name: "Photography", wiki: "Photography", words: ["photo", "photography", "camera", "picture", "portrait", "lens"], careers: ["photographer"], line: "Light, composition and your camera, phone included." },
      { slug: "filmmaking", name: "Filmmaking and video", wiki: "Filmmaking", words: ["video", "film", "movie", "youtube", "filmmaking", "camera", "documentary"], careers: ["film-editor"], line: "Planning, shooting and telling a story on video." },
      { slug: "video-editing", name: "Video editing", wiki: "Video_editing", words: ["edit video", "video editing", "editing", "cut", "clip"], careers: ["film-editor"], line: "Cutting footage into something people want to watch." },
    ],
  },
  {
    slug: "sports", name: "Sports, fitness and recreation", cip: ["31", "36"],
    subjects: [
      { slug: "fitness", name: "Fitness and exercise", wiki: "Physical_fitness", words: ["fitness", "exercise", "workout", "jog", "jogging", "go running", "marathon", "strength", "gym", "walking"], careers: ["fitness-trainer"], line: "Moving more, safely, at any age." },
      { slug: "coaching", name: "Sports and coaching", wiki: "Coach_(sport)", words: ["sport", "sports", "coach", "coaching", "team", "football", "baseball", "basketball", "soccer", "athlete"], careers: ["coach", "fitness-trainer"], line: "Playing, practicing and coaching a sport." },
      { slug: "outdoor-recreation", name: "Outdoors and recreation", wiki: "Outdoor_recreation", words: ["outdoor", "hiking", "camping", "fishing", "hunting", "kayak", "trail", "park"], careers: ["conservation-scientist"], line: "Hiking, camping, fishing and enjoying the outdoors safely." },
      { slug: "games-puzzles", name: "Games and puzzles", wiki: "Puzzle", words: ["game", "puzzle", "sudoku", "chess", "board game", "card game"], line: "Puzzles and games that build thinking skills." },
    ],
  },
  {
    slug: "culinary", name: "Cooking and culinary arts", cip: ["12"],
    subjects: [
      { slug: "cooking", name: "Cooking", wiki: "Cooking", words: ["cook", "cooking", "recipe", "kitchen", "meal", "dinner", "chef", "restaurant", "cafe", "food truck"], careers: ["chef", "cook"], line: "Cooking real meals: basic skills, recipes and planning." },
      { slug: "baking", name: "Baking", wiki: "Baking", words: ["bake", "baking", "bakery", "bread", "cake", "cookie", "pastry"], careers: ["baker"], line: "Bread, cakes and pastry, and why recipes work." },
      { slug: "food-safety", name: "Food safety", wiki: "Food_safety", words: ["food safety", "food poisoning", "leftovers", "storage", "expire"], careers: ["cook", "chef"], line: "Keeping food safe to eat, from official sources." },
    ],
  },
  {
    slug: "life", name: "Personal development and life skills", cip: ["37", "35", "32"],
    subjects: [
      { slug: "study-skills", name: "Study skills", wiki: "Study_skills", words: ["study", "studying", "exam", "test", "notes", "homework", "learn faster", "school"], line: "How to study, take notes and remember." },
      { slug: "career-planning", name: "Finding work that fits", wiki: "Career_development", words: ["career", "job", "work", "resume", "interview", "hire", "employment", "apprenticeship"], line: "Figuring out what work fits you, and the steps to get there." },
      { slug: "habits-goals", name: "Habits, goals and time", wiki: "Time_management", words: ["habit", "goal", "time", "focus", "procrastinate", "routine", "organize", "plan"], line: "Building habits and getting the important things done." },
    ],
  },
  {
    slug: "home", name: "Household management", cip: ["19"],
    subjects: [
      { slug: "budgeting", name: "Running a household budget", wiki: "Budget", words: ["budget", "bills", "household", "groceries", "save money", "frugal", "spending"], line: "A simple budget for a household, and sticking to it." },
      { slug: "childcare-parenting", name: "Parenting and family life", wiki: "Parenting", words: ["parent", "parenting", "kids", "children", "family", "baby", "toddler", "teenager"], careers: ["childcare-worker"], line: "Raising children, from official and well-reviewed sources." },
      { slug: "home-care", name: "Cleaning and caring for a home", wiki: "Housekeeping", words: ["clean", "cleaning", "laundry", "organize", "declutter", "housekeeping"], line: "Cleaning, laundry and keeping a home running." },
    ],
  },
];

export const SUBJECTS: (Subject & { discipline: string })[] = DISCIPLINES.flatMap((d) =>
  d.subjects.map((s) => ({ ...s, discipline: d.slug })),
);

export function subjectBySlug(slug: string): (Subject & { discipline: string }) | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function disciplineBySlug(slug: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.slug === slug);
}

export function wikiUrl(s: Pick<Subject, "wiki">): string {
  return `https://en.wikipedia.org/wiki/${s.wiki}`;
}
