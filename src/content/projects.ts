/**
 * PROJECTS — every entry is based on the public repository it links to.
 * Metrics come from the notebook outputs or READMEs in those repos.
 * Add a project by copying an entry; set `featured: true` to show it on the home page.
 */
import type { Project, ProjectCategory } from "./types";

const gh = (repo: string) => `https://github.com/vinayakdon/${repo}`;

export const categories: ProjectCategory[] = [
  "AI & NLP",
  "Machine Learning",
  "Data Analytics & BI",
  "Data Engineering & Automation",
  "Software Engineering",
];

export const projects: Project[] = [
  {
    slug: "rag-scheduler",
    name: "RAG-Scheduler",
    summary:
      "A local, privacy-first assistant that answers natural-language questions about a course timetable using retrieval-augmented generation.",
    problem:
      "Timetables in spreadsheets are hard to query quickly. Asking “What do I have on Tuesday afternoon?” should just work — without sending personal data to a cloud API.",
    category: "AI & NLP",
    tech: ["React", "Vite", "Node.js", "Express", "Transformers.js", "HNSWLib", "Ollama", "Multer"],
    features: [
      "Upload a CSV; each row is embedded once with all-MiniLM-L6-v2 and indexed in HNSWLib.",
      "Queries retrieve the top-k matching rows and pass them to a local LLM via Ollama as grounded context.",
      "REST API with /status, /ingest and /ask; answers return the source rows they were based on.",
      "Runs fully offline — no API keys, no per-call cost, no data leaves the machine.",
    ],
    repo: gh("RAG_Shedular"),
    kind: "personal",
    featured: true,
    year: 2026,
    details: {
      architecture: [
        "Frontend: React + Vite with a custom useChat hook owning chat state and a services/api.js layer for backend calls.",
        "Backend: Express routes stay thin; services handle embeddings, vector storage, CSV ingestion and the RAG chain.",
        "The vector index is persisted to disk so ingestion only happens once per timetable.",
      ],
      methodology: [
        "Embed the user's question with the same model used at ingest time.",
        "Return the most similar rows by cosine distance from HNSWLib.",
        "Build a prompt that constrains the model to answer only from the retrieved rows.",
      ],
      lessons: [
        "The backend was rewritten from FastAPI to Node.js without touching the frontend, because the REST contract was defined first.",
        "Next steps documented in the repo: streaming responses, chat history persistence and PDF/calendar ingestion.",
      ],
    },
  },
  {
    slug: "fake-job-posting-detection",
    name: "Fake Job Posting Detection",
    summary:
      "An NLP classifier that flags fraudulent job ads, trained on ~18,000 postings and served through a Streamlit app.",
    problem:
      "Scammers post fake job ads to collect personal data and money. Only about 5% of postings are fraudulent — a heavily imbalanced dataset — so a naive model can look accurate while missing almost every scam.",
    category: "AI & NLP",
    tech: ["Python", "scikit-learn", "TF-IDF", "Pandas", "Streamlit"],
    features: [
      "Combined title, company profile, description, requirements and benefits into one cleaned text feature.",
      "TF-IDF with unigrams and bigrams; compared Logistic Regression, Linear SVM, Multinomial NB and Random Forest.",
      "Model selection driven by recall and F1 on the fake class rather than accuracy.",
      "Streamlit UI with example postings, confidence indicators and input validation for meaningless text.",
    ],
    metrics: [
      { label: "Accuracy (LinearSVC)", value: "98.99%" },
      { label: "Precision — fake class", value: "0.95" },
      { label: "Recall — fake class", value: "0.84" },
      { label: "F1 — fake class", value: "0.89" },
    ],
    repo: gh("FakeJobPostingDetection"),
    images: [
      { src: "/projects/notebooks/fakejob_019.webp", alt: "Class balance: real vs fraudulent postings" },
      { src: "/projects/notebooks/fakejob_032.webp", alt: "Company logo presence vs fraud" },
      { src: "/projects/notebooks/fakejob_027.webp", alt: "Top 10 industries by fraud ratio" },
    ],
    demo: "https://vinayakdon-fakejobpostingdetection-frontend-gfb3ve.streamlit.app",
    featured: true,
    year: 2026,
    details: {
      methodology: [
        "EDA showed fake postings often lack company logos, push remote roles and use vague, promotional language.",
        "Text cleaning removed URLs, emails and special characters before vectorisation.",
        "Four supervised models compared on a held-out test set of 3,576 postings.",
      ],
      results: [
        "LinearSVC gave the best balance: 145 of 173 fake postings caught with only 8 false alarms.",
        "Logistic Regression reached higher recall (0.91) but with 35 false positives — a useful alternative if missing a scam is costlier.",
      ],
      lessons: [
        "LinearSVC returns a decision margin, not a probability, so inference logic had to treat confidence explicitly.",
        "The whole pipeline is saved as a single .pkl so preprocessing and model can't drift apart in deployment.",
      ],
    },
  },
  {
    slug: "email-sms-spam-classifier",
    name: "Email & SMS Spam Classifier",
    summary:
      "A text classifier that labels messages as spam or not spam, with a Streamlit interface for live predictions.",
    problem:
      "Spam filters must avoid false positives — flagging a real message as spam is worse than letting one spam through. With an imbalanced dataset, precision matters more than raw accuracy.",
    category: "AI & NLP",
    tech: ["Python", "scikit-learn", "NLTK", "TF-IDF", "Pandas", "Streamlit"],
    features: [
      "Preprocessing with tokenisation, stop-word removal and Porter stemming.",
      "Compared Count and TF-IDF vectorisation and several Naive Bayes variants.",
      "Selected Multinomial Naive Bayes for zero false positives on the test set.",
      "Vectoriser and model pickled and loaded by the Streamlit app.",
    ],
    metrics: [
      { label: "Accuracy (MultinomialNB)", value: "97.1%" },
      { label: "Precision", value: "1.00" },
      { label: "Test messages", value: "1,034" },
    ],
    repo: gh("Email-Sms_spam_classifier"),
    images: [
      { src: "/projects/notebooks/spam_012.webp", alt: "Ham vs spam share in the dataset" },
      { src: "/projects/notebooks/spam_035.webp", alt: "Most frequent words in ham and spam messages" },
    ],
    featured: true,
    year: 2025,
  },
  {
    slug: "spotify-data-analysis",
    name: "Spotify Music Data Analysis",
    summary:
      "Exploratory analysis and ML-based recommendations on Spotify track and artist data for a decision support system.",
    problem:
      "Producers and curators need to know which audio features relate to popularity and how to group and recommend tracks.",
    category: "Machine Learning",
    tech: ["Python", "Pandas", "scikit-learn", "Matplotlib", "Seaborn"],
    features: [
      "Merged Kaggle tracks and artists datasets on artist ID.",
      "EDA on popularity, audio features, explicit content and trends since 2000.",
      "KMeans clustering to group songs into stylistic clusters.",
      "KNN recommender driven by danceability, energy, release year and artist followers.",
    ],
    repo: gh("SpotifyDataAnalysis"),
    images: [
      { src: "/projects/notebooks/spotify_072.webp", alt: "K-means clustering of songs by danceability and energy (k = 4)" },
      { src: "/projects/notebooks/spotify_030.webp", alt: "Feature correlation matrix" },
      { src: "/projects/notebooks/spotify_035.webp", alt: "Average popularity over time" },
    ],
    kind: "coursework",
    featured: true,
    year: 2025,
  },
  {
    slug: "bank-loan-analysis",
    name: "Bank Loan Analysis 2021",
    summary:
      "Loan-portfolio analysis with an interactive Streamlit dashboard covering applications, funding, repayments and loan health.",
    problem:
      "Lenders need a clear view of application trends, funded vs. received amounts and loan status to monitor portfolio risk.",
    category: "Data Analytics & BI",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Streamlit"],
    features: [
      "Datetime feature engineering for monthly and yearly trend analysis.",
      "KPIs: total applications, funded and received amounts, average interest rate and DTI.",
      "Breakdowns by loan status, purpose, home ownership and employment length.",
      "Streamlit dashboard with trend and status views.",
    ],
    repo: gh("Financial-Loan-Analysis"),
    demo: "https://financialloananalysis.streamlit.app",
    images: [
      { src: "/projects/loan-dashboard.webp", alt: "Bank loan dashboard overview with KPI tiles" },
      { src: "/projects/loan-trends.webp", alt: "Monthly loan application trends chart" },
      { src: "/projects/loan-status.webp", alt: "Loan status distribution bar chart" },
    ],
    featured: true,
    year: 2026,
  },
  {
    slug: "bike-sharing-dashboard",
    name: "Bike Sharing Demand Dashboard",
    summary:
      "EDA and an interactive Streamlit dashboard showing how weather and time drive bike-rental demand in Washington, D.C.",
    problem:
      "Bike-sharing operators need to understand when and why demand peaks to plan fleet availability.",
    category: "Data Analytics & BI",
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "Streamlit"],
    features: [
      "Feature engineering: year, month, hour and a day-period variable.",
      "Casual vs. registered, working vs. non-working days and seasonal trends.",
      "Hourly demand with 95% confidence intervals by weather condition.",
      "Dashboard filters for date, season, weather, hour and temperature with KPI tiles.",
    ],
    repo: gh("DataVisualizationAssignments"),
    images: [
      { src: "/projects/notebooks/bike_013.webp", alt: "Mean hourly rentals: working vs non-working days" },
      { src: "/projects/notebooks/bike_019.webp", alt: "Mean hourly rentals by weather, with 95% confidence intervals" },
      { src: "/projects/notebooks/bike_027.webp", alt: "Rentals by period of day" },
    ],
    demo: "https://datavisualizationassignment.streamlit.app",
    kind: "coursework",
    featured: true,
    year: 2026,
  },
  {
    slug: "ecommerce-sales-dashboard",
    name: "E-commerce Sales Dashboard",
    summary:
      "A Power BI dashboard tracking an Indian online store's sales performance with interactive drill-downs.",
    problem:
      "A store owner needed one place to track sales across India and see which strategies, categories and regions were working.",
    category: "Data Analytics & BI",
    tech: ["Power BI", "DAX", "Excel"],
    features: [
      "KPIs for sales amount, profit and quantity, joined across orders and order-detail tables.",
      "Time-series analysis of sales trends.",
      "Breakdowns by state, category, sub-category and payment mode with interactive filters.",
    ],
    repo: gh("Ecommerce-store-sales-dashboard"),
    images: [
      {
        src: "https://github.com/vinayakdon/Ecommerce-store-sales-dashboard/assets/78019838/e97ae771-4937-4a33-add9-991c4ee6f904",
        alt: "Power BI e-commerce sales dashboard",
      },
    ],
    featured: true,
    year: 2024,
  },
  {
    slug: "superstore-sales-dashboard",
    name: "SuperStore Sales Dashboard & Forecast",
    summary:
      "Power BI dashboard with time-series analysis and a 15-day sales forecast for a retail superstore.",
    problem:
      "Store managers need both a view of current KPIs and a short-term forecast to plan stock and staffing.",
    category: "Data Analytics & BI",
    tech: ["Power BI", "Time-series forecasting", "Excel"],
    features: [
      "KPI dashboard with interactive filters at multiple levels of granularity.",
      "Sales-strategy analysis across segments and categories.",
      "15-day sales forecast from historical data.",
    ],
    repo: gh("Super-Store-Sales-Dashboard--Power-BI"),
    images: [
      {
        src: "https://github.com/vinayakdon/Super-Store-Sales-Dashboard--Power-BI/assets/78019838/ab141332-8a66-4d47-b5aa-6220f1d6972c",
        alt: "Power BI SuperStore sales dashboard",
      },
    ],
    featured: false,
    year: 2024,
  },
  {
    slug: "data-cleaning-application",
    name: "Data Cleaning Application",
    summary:
      "A Python tool that cleans CSV and Excel datasets: backs up and removes duplicates, handles missing values and exports clean data.",
    problem:
      "The same cleaning steps are repeated at the start of every analysis. Automating them saves time and keeps duplicates recoverable.",
    category: "Data Engineering & Automation",
    tech: ["Python", "Pandas", "NumPy", "openpyxl"],
    features: [
      "Validates input format (CSV or Excel) before processing.",
      "Saves duplicate rows to a separate backup file before removing them.",
      "Fills numeric gaps with the column mean; drops rows missing non-numeric values.",
      "Tested on datasets of more than 10,000 rows.",
    ],
    repo: gh("Data-Cleaning-Python-Application"),
    featured: false,
    year: 2024,
  },
  {
    slug: "image-downloader-cli",
    name: "Image Downloader CLI",
    summary:
      "A tested Python command-line tool that downloads images from a list of URLs, validating each file and skipping failures safely.",
    problem:
      "Bulk downloads fail in messy ways — bad URLs, non-image responses, duplicate file names. The tool needs to keep going and report clearly.",
    category: "Software Engineering",
    tech: ["Python", "requests", "pytest", "unittest.mock", "argparse"],
    features: [
      "Three focused modules: URL reader, downloader and CLI.",
      "Checks Content-Type so only real images are saved; duplicate names get a numeric suffix.",
      "One bad URL is logged and skipped — it never stops the run.",
      "Offline test suite with mocked HTTP that runs in under a second; meaningful exit codes.",
    ],
    metrics: [
      { label: "Automated tests", value: "14" },
      { label: "Runtime dependencies", value: "1" },
    ],
    repo: gh("Image-downloader-automation-testing"),
    featured: true,
    year: 2026,
  },
  {
    slug: "productstore-mern",
    name: "ProductStore (MERN)",
    summary:
      "A responsive full-stack product catalogue with a REST API, built with React, Express and MongoDB.",
    problem:
      "A hands-on build of a complete CRUD application — API, database and responsive UI — with proper error handling.",
    category: "Software Engineering",
    tech: ["React", "Vite", "Chakra UI", "Zustand", "Node.js", "Express", "MongoDB"],
    features: [
      "REST API with controllers, routers and a Mongoose model.",
      "Create, list, update and delete products from the UI.",
      "Responsive Chakra UI interface.",
    ],
    repo: gh("ProductstoreApp"),
    featured: false,
    year: 2024,
  },
  {
    slug: "user-management-backend",
    name: "User Management Backend",
    summary:
      "A server-rendered Node.js app for creating, editing and deleting user profiles, backed by MongoDB.",
    problem: "Practice project for building server-side CRUD with templating and a document database.",
    category: "Software Engineering",
    tech: ["Node.js", "Express", "EJS", "MongoDB", "Tailwind CSS"],
    features: [
      "Create, read, update and delete user profiles.",
      "Views and models separated into their own folders.",
    ],
    repo: gh("Backend-project"),
    kind: "learning",
    featured: false,
    year: 2024,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
