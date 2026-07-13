export interface Scholarship {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  description: string
  link_url: string
  scholarship_type: 'Government' | 'Private' | 'International'
  eligibility_criteria?: string
  required_documents?: string[]
}

export const fallbackScholarships: Scholarship[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Embassy of India Golden Jubilee Scholarship',
    provider: 'Embassy of India, Kathmandu',
    amount: 'NPR 4,000 / Month',
    deadline: '2026-08-30 23:59:59+00',
    description: 'Awarded to Nepalese students pursuing undergraduate degree courses in medicine, engineering, science, or arts in Nepal.',
    link_url: 'https://www.goischolarship.com.np',
    scholarship_type: 'Government',
    eligibility_criteria: 'Nepali citizenship, minimum 70% marks in Class 12, family income below 2 Lakhs per annum.',
    required_documents: ['Citizenship Certificate', 'Class 12 Marks Sheet', 'Income Certificate']
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Erasmus Mundus Joint Master Degrees',
    provider: 'European Union',
    amount: 'Fully Funded (€1,500/month)',
    deadline: '2026-09-15 23:59:59+00',
    description: 'Prestigious international scholarship program for postgraduate studies in various European partner universities.',
    link_url: 'https://ec.europa.eu/programmes/erasmus-plus',
    scholarship_type: 'International',
    eligibility_criteria: 'Bachelor degree completed, English proficiency (IELTS 6.5+).',
    required_documents: ['Degree Certificate', 'LOM', '2 Recommendation Letters']
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Nepal Youth Foundation College Scholarship',
    provider: 'Nepal Youth Foundation',
    amount: 'Covers Tuition & Lodging',
    deadline: '2026-10-01 23:59:59+00',
    description: 'Offers financial support for underprivileged youth, focusing on students facing systemic or financial barriers.',
    link_url: 'https://www.nepalyouthfoundation.org',
    scholarship_type: 'Private',
    eligibility_criteria: 'Enrolled in Nepalese public college, financial hardship verification.',
    required_documents: ['Income Proof', 'College Admission Offer']
  },
  {
    id: 'dbdbdbdb-dbdb-dbdb-dbdb-dbdbdbdbdbdb',
    title: 'Pokhara University Open Scholarship Scheme',
    provider: 'Pokhara University Faculty Board',
    amount: '100% Tuition Waiver',
    deadline: '2026-11-20 23:59:59+00',
    description: 'Merit-cum-means scholarship allocated for government school students to pursue engineering, management, or IT degrees.',
    link_url: 'https://pu.edu.np',
    scholarship_type: 'Government',
    eligibility_criteria: 'Graduated from a public/government school in Nepal, cleared PU Entrance Exam.',
    required_documents: ['Government School verification certificate', 'PU Admit Card']
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Chevening Scholarships 2026-2027',
    provider: 'UK Government (FCDO)',
    amount: 'Fully Funded (Tuition, Stipend, Flights)',
    deadline: '2026-11-05 23:59:59+00',
    description: 'Flagship UK government scholarship scheme for outstanding students to study one-year postgraduate master\'s degrees in any UK university.',
    link_url: 'https://www.chevening.org/nepal',
    scholarship_type: 'International',
    eligibility_criteria: 'Bachelor degree completed, minimum 2 years of work experience, English proficiency.',
    required_documents: ['Degree Certificate', 'References', 'Biography']
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Atal Bihari Vajpayee General Scholarship Scheme',
    provider: 'Indian Council for Cultural Relations (ICCR)',
    amount: 'Fully Funded (Tuition, Stipend, Airfare)',
    deadline: '2026-08-15 23:59:59+00',
    description: 'Offers scholarships for Nepalese students to pursue undergraduate, postgraduate, and doctoral courses in Indian universities/institutes.',
    link_url: 'https://www.goischolarship.com.np',
    scholarship_type: 'Government',
    eligibility_criteria: 'Nepali citizenship, minimum 60% marks in previous examinations.',
    required_documents: ['Transcript', 'Citizenship Copy', 'Physical Fitness Certificate']
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'Mahatma Gandhi Scholarship Scheme (MGSS)',
    provider: 'Embassy of India, Kathmandu',
    amount: 'NPR 2,000 / Month',
    deadline: '2026-12-15 23:59:59+00',
    description: 'Provided to meritorious Nepali students studying in Class XI and XII in recognized schools/colleges of Nepal.',
    link_url: 'https://www.goischolarship.com.np',
    scholarship_type: 'Government',
    eligibility_criteria: 'Nepali citizenship, minimum 60% aggregate marks in Class 10 (SEE), family income check.',
    required_documents: ['SEE Marksheet', 'Citizenship/ID Proof', 'Income Proof']
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    title: 'German Academic Exchange Service (DAAD) Scholarship',
    provider: 'Government of Germany',
    amount: 'Fully Funded (€934 - €1300/month)',
    deadline: '2026-10-15 23:59:59+00',
    description: 'Supports outstanding graduates from Nepal to complete a post-graduate or Master\'s degree at a German university.',
    link_url: 'https://www.daad.de',
    scholarship_type: 'International',
    eligibility_criteria: 'Bachelor degree completed, English/German language proficiency.',
    required_documents: ['Degree Certificate', 'Motivation Letter', 'Language Certificate']
  }
]
