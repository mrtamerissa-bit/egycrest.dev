/* =========================================================
   EgyCrest Financial — script.js
   Router, i18n, calculators, geo detection, forms, chatbot,
   hamburger drawer, blog accordion, form validation.
   ========================================================= */

/* =========================================================
   CONFIG: Company setup fees (Egypt)
   All formulas live here — update numbers without touching logic.
   ========================================================= */
const COMPANY_FEES = {
    llc: {
        regFee:     (cap) => Math.min(1000, Math.max(100, cap * 0.001)),
        notaryFee:  (cap) => Math.min(1000, Math.max(10,  cap * 0.0025)),
        publishFee: ()    => 300,
        barFee:     (cap) => cap > 20000 ? Math.min(5000, Math.max(100, cap * 0.005)) : 0,
        chamberFee: (cap) => cap >= 500000 ? 250 : 125,
        stampFee:   16,
        minCapital: 1000
    },
    opc: {
        regFee:     (cap) => Math.min(1000, Math.max(100, cap * 0.001)),
        notaryFee:  (cap) => Math.min(1000, Math.max(10,  cap * 0.0025)),
        publishFee: ()    => 300,
        barFee:     (cap) => cap > 20000 ? Math.min(5000, Math.max(100, cap * 0.005)) : 0,
        chamberFee: (cap) => cap >= 500000 ? 250 : 125,
        stampFee:   16,
        minCapital: 50000
    },
    jsc: {
        regFee:     (cap) => cap * 0.001,
        notaryFee:  (cap) => Math.min(10000, Math.max(10, cap * 0.0025)),
        publishFee: ()    => 300,
        barFee:     (cap) => Math.min(25000, Math.max(250, cap * 0.01)) + 50,
        chamberFee: (cap) => Math.min(2000,  Math.max(24,  cap * 0.002)),
        stampFee:   16,
        minCapital: 250000
    },
    sole: {
        regFee:     () => 40.5,
        notaryFee:  () => 0,
        publishFee: () => 0,
        barFee:     () => 0,
        chamberFee: () => 6,
        stampFee:   0,
        minCapital: 0
    }
};

const COMPANY_ADDONS = {
    esign: { price: 700,  id: 'company-esign' },
    eseal: { price: 1600, id: 'company-eseal' }
};

/* ========== TRANSLATIONS (English only; Arabic is the source HTML) ========== */
const TRANSLATIONS = {
    en: {
        /* Nav */
        nav_home: "Home",
        nav_services: "Services",
        nav_calculators: "Tax & Fees Calculator",
        nav_blog: "Blog",
        nav_pricing: "Packages",
        nav_academy: "Academy",
        nav_contact: "Contact Us",
        nav_cta: "Free Consultation",
        drawer_wa: "Chat on WhatsApp",

        /* Hero */
        hero_eb: "TAXATION | AUDITING | FINANCIAL CONSULTING",
        hero_h1: "Your Partner in <span>Every Financial Decision</span>",
        hero_p: "EgyCrest Financial provides accounting, auditing, taxation, and financial consulting services for entrepreneurs and companies with precision, transparency, and the highest levels of confidentiality through a team of certified accountants.",
        hero_cta: "Contact via WhatsApp",
        hero_cta2: "Free Consultation",

        /* Why */
        why_h2: "Why EgyCrest?",
        why_intro: "We don't just deliver accounting services we build long-term financial partnerships with our clients, founded on trust, precision, and absolute confidentiality.",
        w1h: "Certified Accounting Team",
        w1p: "Certified chartered accountants with more than 26 years of experience at leading global audit firms and across the Middle East, North Africa, the United Kingdom, and the United States.",
        w2h: "Absolute Confidentiality",
        w2p: "We handle your financial data with the highest standards of privacy and protection, never shared with third parties unless required by Law or legal court.",
        w3h: "Full Accuracy & Transparency",
        w3p: "Clear, detailed reports giving you a true picture of your finances no complexity, no vague numbers.",
        w4h: "Flexible & Affordable",
        w4p: "Full accounting expertise at competitive prices without the cost of hiring a full in-house finance team.",
        w5h: "On-Time Commitment",
        w5p: "We deliver all returns and reports on their legal deadlines avoiding any penalties.",
        w6h: "Continuous Support",
        w6p: "A support team available year-round to answer your questions and resolve urgent financial issues.",

        /* Services */
        serv_h2: "Our Services",
        s1h: "Statutory Audit & Attestation Services",
        s1p: "Independent review of annual financial statements with official auditor reports per Egyptian Accounting Standards and International Standards on Auditing.",
        s2h: "Risk & Process Assurance Services",
        s2p: "Independent assessments of internal controls, operational processes, and compliance frameworks for reliable assurance.",
        s3h: "Tax Compliance & E-Invoicing Advisory",
        s3p: "Preparation of income, value-added, and payroll tax returns with full compliance with Egypt's E-Invoice and E-Receipt systems.",
        s4h: "Corporate Structuring & Business Setup",
        s4p: "End-to-end business setup support, legal entity selection, registration with the General Authority for Investment, and commercial licensing for local and international investors.",
        s5h: "Payroll & Social Insurance Compliance",
        s5p: "Full payroll processing, tax withholding, and legal reporting under Egyptian labor and social insurance laws.",
        s6h: "Bookkeeping & Financial Reporting",
        s6p: "Complete accounting records, bank reconciliations, chart of accounts, and periodic financial reports.",
        s7h: "M&A & Financial Due Diligence",
        s7p: "Buy-side and sell-side advisory, financial due diligence reports, valuation reviews, and M&A deal support.",
        s8h: "Enterprise Valuation & Financial Modeling",
        s8p: "Independent valuations and dynamic financial models for fundraising, equity restructuring, and legal requirements.",
        s9h: "Feasibility Studies & Capital Project Financing",
        s9p: "In-depth economic feasibility studies, capital budgeting analysis, and structured project finance models.",
        s10h: "Internal Audit & Governance Advisory",
        s10p: "Designing internal audit programs, identifying operational risks, building governance frameworks, and board advisory.",
        s11h: "Board Advisory & Strategic Counsel",
        s11p: "Strategic financial advice for board members, governance policy design, and formal board meeting attendance.",
        s12h: "Corporate Finance & Accounting Training",
        s12p: "Specialized training programs for finance teams — delivered through EgyCrest Academy.",
        s12_cta: "Visit the Academy",
        s13h: "Intellectual Property & Patent Registration",
        s13p: "Organizational support and registration of patents, trademarks, and IP rights with Egyptian government authorities.",
        s14h: "Forensic Accounting & Financial Investigation",
        s14p: "Specialized financial investigations to detect fraud and manipulation in records, with certified court-ready reports for legal disputes.",
        s15h: "Real Estate Appraisal & Asset Verification",
        s15p: "Professional real estate appraisal for banking, litigation, insurance, and investment purposes, with reports prepared under the International Valuation Standards (IVS) and FRA requirements.",
        
/* Sectors */
sec_eb: "SECTORS WE SERVE",
sec_h2: "Sectors We Specialize In",
sec_intro: "Our experience spans a diverse range of industries, giving us deep insight into the financial and tax challenges unique to each sector.",
sec1h: "Real Estate & Construction",
sec2h: "Retail & E-Commerce",
sec3h: "Professional Services",
sec4h: "Technology & Startups",
sec5h: "Manufacturing & Industrial",
sec6h: "Hospitality & F&B",
sec7h: "Healthcare",
sec8h: "NGOs & Non-profits",

/* E-Invoicing */
        ei_badge: "In-Demand Service",
        ei_h2: "E-Invoicing <span>& E-Receipt</span> is Your Legal Obligation",
        ei_lead: "Registration in the e-invoicing system is now mandatory for all companies in Egypt. We handle every step for you to avoid penalties and business suspension.",
        ei_f1: "Registration in the Egyptian Tax Authority system",
        ei_f2: "Obtaining the electronic signature (e-Signature)",
        ei_f3: "Integrating your accounting system with the platform",
        ei_f4: "Training your team to issue electronic invoices",
        ei_f5: "Ongoing support to resolve any technical issue",
        ei_cta: "Register Your Business Now",
        ei_s1h: "Review & Assessment", ei_s1p: "We identify your business requirements and current status",
        ei_s2h: "Registration & Activation", ei_s2p: "Completing registration and obtaining the electronic signature",
        ei_s3h: "Integration & Linking", ei_s3p: "Linking your system to the tax platform and configuring settings",
        ei_s4h: "Operation & Support", ei_s4p: "Begin issuing invoices with continuous technical support",

        /* Deadlines */
        dl_eb: "TAX DEADLINES",
        dl_h2: "Never Miss a Tax Deadline",
        dl_intro: "The key legal deadlines you must meet to avoid penalties and we track them on your behalf.",
        dl_w1: "Monthly", dl_w2: "Annual", dl_w4: "Quarterly", dl_w6: "Periodic",
        dl_c1h: "VAT Return", dl_c1p: "Submitted within two months after the end of the monthly tax period.", dl_f1: "Every month",
        dl_c2h: "Income Tax Return for Companies", dl_c2p: "Submitted within 4 months of the company's fiscal year-end.", dl_f2: "Annually",
        dl_c3h: "Income Tax Return for Individuals", dl_c3p: "Submitted before April 1st each year for the previous year's activity.", dl_f3: "Before April 1",
        dl_c4h: "Payroll Tax (Form 4)", dl_c4p: "Quarterly settlement of payroll tax on salaries and wages.", dl_f4: "Every 3 months",
        dl_c5h: "Social Insurance Contributions", dl_c5p: "Paid monthly to the National Social Insurance Authority for employees.", dl_f5: "Every month",
        dl_c6h: "Withholding Tax", dl_c6p: "Remitting amounts withheld from dues at legally prescribed times.", dl_f6: "Periodically",
        dl_rh: "Let Us Track Your Deadlines for You",
        dl_rp: "Subscribe to our tax monitoring service and never worry about a deadline or penalty again.",
        dl_rcta: "Get Tax Monitoring",

        /* Trust strip */
        tr1h: "Certified Chartered Accountant",
        tr10p: "Registered with the Accountants & Auditors Registry, Egyptian Ministry of Finance",
        tr11p: "Member of the Egyptian Tax Association",
        tr12p: "Member of the Egyptian Association of Real Estate Appraisers",
        tr13p: "Registered with the Egyptian Financial Regulatory Authority (FRA)",
        tr14p: "Member of the Egyptian Society of Accountants & Auditors",
        tr15p: "Member of the Saudi Organization for Chartered and Professional Accountants (SOCPA)",
        tr16p: "Member of the American Institute of Certified Public Accountants (AICPA)",
        tr17p: "Member of the CFA Institute",
        tr2h: "Registered with the Tax Authority",
        tr2p: "Official dealings with all government entities Reg. No. 630-562-067",
        tr3h: "Complete Data Confidentiality",
        tr3p: "Full protection of your financial information with the highest privacy standards.",
        tr4h: "Response Within 24 Hours",
        tr4p: "We commit to answering your inquiries within one business day.",

        /* Founder */
        fo_name: "Tamer Issa",
        fo_title: "Tamer Issa — Managing Partner",
        fo_h2: "26 Years of <span>International Expertise</span> at the Heart of Your Financial Decisions",
        fo_bio: "Tamer Issa is a certified chartered accountant with 26 years of experience at a global auditing firms, and as CFO and financial advisor at local and international companies across MENA, UK and United States. Specializing in taxation, auditing, financial consulting, M&A, and Forensic Accounting.",
        fo_s1: "Years Experience",
        fo_s2: "International Regions",
        fo_s3: "& Top 10 Firms",

        /* Process */
        pr_eb: "HOW WE WORK", pr_h2: "How Do We Start With You?",
        pr1h: "Contact Us", pr1p: "Via website or WhatsApp to identify your need.",
        pr2h: "Data Collection", pr2p: "We request the necessary documents and details.",
        pr3h: "Price Proposal", pr3p: "We provide a clear proposal outlining cost and details.",
        pr4h: "Contract Signing", pr4p: "A formal contract defining services and obligations.",
        pr5h: "Service Delivery", pr5p: "Our team begins work with quality and professionalism.",

        /* Testimonials */
        te_eb: "TESTIMONIALS", te_h2: "Satisfied Clients",
        te1p: "EgyCrest Financial saved us a lot of time in bookkeeping, and we now know our financial position accurately every month.",
        te1n: "Mahmoud Saeed", te1r: "Retail Store Owner",
        te2p: "The service was professional from day one, and tax returns are now submitted on time without any worry.",
        te2n: "Heba El-Gamal", te2r: "Financial Manager, Services Company",
        te3p: "EgyCrest's team helped us prepare financial statements that made it easier to get bank financing.",
        te3n: "Karim Adel", te3r: "Startup Founder",

        /* FAQ (home) */
        faq_eb: "FAQ", faq_h2: "Frequently Asked Questions",
        f1q: "Do you provide services for individuals, not just companies?", f1a: "Yes, we provide specialized tax and accounting consultations for individuals and freelancers in addition to companies of all sizes.",
        f2q: "How long does it take to prepare a tax return?", f2a: "The duration varies depending on the volume of data, but on average, a return is prepared within 5-7 working days of receiving all required documents.",
        f3q: "What do I do if I have a previous tax problem or penalty?", f3a: "Our team reviews the reasons for the penalty, submits the necessary objections, and works to settle the tax situation as quickly as possible.",
        f4q: "Can I communicate remotely without visiting the office?", f4a: "Absolutely, we provide full follow-up via WhatsApp, email, and remote communication tools to facilitate work from anywhere.",

        /* CTA strip */
        cta_h2: "Ready to Organize Your Accounts?",
        cta_p: "Contact us now and get a free initial consultation to determine the best plan for your business.",
        cta_wa: "Direct WhatsApp", cta_call: "Call Us",

        /* Footer */
        ft_desc: "EgyCrest Financial Office for Financial Consulting, Auditing & Taxation — Giza, Egypt.",
        ft_bot: "© 2026 EgyCrest Financial. All Rights Reserved.",
        ft_reg: "Tax Registration: 630-562-067",

        /* Academy */
        ac_back: "Back to home",
        ac_badge: "EgyCrest Academy",
        ac_h1: "Learn Finance from <span>Market Experts</span>",
        ac_p: "Specialized training programs for finance teams and accountants — covering accounting standards updates, taxation, financial analysis, and IFRS with a practical, applied approach.",
        ac_cta1: "Register Now",
        ac_cta2: "Browse Courses",
        ac_s1: "Specialized Courses",
        ac_s2: "Trainees per Year",
        ac_s3: "Years of Experience",
        ac_s4: "International Standards",
        ac_courses_eb: "ACADEMY COURSES",
        ac_courses_h2: "Our Training Courses",
        c1_tag: "Accounting", c1_h: "Egyptian Accounting Standards (EAS)",
        c1_p: "Updates to EAS and practical application to financial statements.",
        c2_tag: "International", c2_h: "IFRS International Standards",
        c2_p: "Comprehensive study of IFRS with practical applications.",
        c3_tag: "Taxation", c3_h: "Practical Egyptian Taxation",
        c3_p: "Income tax, VAT, and payroll — return filing and inspection handling.",
        c4_tag: "Analysis", c4_h: "Advanced Financial Analysis",
        c4_p: "Financial statement analysis, ratios, valuation, and decision-making.",
        c5_tag: "Audit", c5_h: "Modern Internal Audit",
        c5_p: "Modern audit methodologies, risk assessment, and internal audit reports.",
        c6_tag: "Forensic", c6_h: "Forensic Accounting",
        c6_p: "Detecting financial fraud, investigation, and certified court-ready reporting.",
        c_level1: "Intermediate",
        c_level2: "Advanced",
        c_cta: "Enroll",
        ac_why_eb: "WHY OUR ACADEMY",
        ac_why_h2: "Why EgyCrest Academy?",
        af1_h: "Practitioner Instructors",
        af1_p: "Instructors with Big 4 experience and real CFO roles in Egypt and globally.",
        af2_h: "Applied Practical Content",
        af2_p: "Case studies and real examples from the Egyptian market instead of theory.",
        af3_h: "Certified Completion",
        af3_p: "Certified completion certificate from EgyCrest to strengthen your CV.",
        af4_h: "Online or On-site",
        af4_p: "Choose between live online sessions or attending at our Giza office.",
        ac_end_h2: "Ready to start your <span>EgyCrest Academy</span> journey?",
        ac_end_p: "Register for any course, or contact us to design a custom training program for your company.",
        ac_end_cta1: "Contact to Register",
        ac_end_cta2: "Back to Services",
        ac_ft_desc: "EgyCrest Academy for Financial & Accounting Training — Giza, Egypt.",

        /* Blog */
        bl_eb: "Blog",
        bl_h1: "Accounting & Tax Articles and Tips",
        bl_p: "Practical information from our experts to help you understand your obligations and develop your business.",
        bl_tag_tax: "Taxes",
        bl_tag_acc: "Accounting",
        bl_tag_pay: "Payroll",
        bl_tag_fin: "Finance",
        bl_jun: "June 2024",
        bl_may: "May 2024",
        bl_apr: "April 2024",
        bl_mar: "March 2024",
        bl_feb: "February 2024",
        bl_jan: "January 2024",
        bl_b1h: "Everything You Need to Know About VAT in Egypt",
        bl_b2h: "5 Common Accounting Mistakes in Startups",
        bl_b3h: "Social Insurance in Egypt: Employer's Guide",
        bl_b4h: "How to Prepare Financials That Convince the Bank",
        bl_b5h: "Tax Inspection: Preparation and Your Rights",
        bl_b6h: "Manual Bookkeeping vs Accounting Software",
        art1_p1: "Value-Added Tax (VAT) is an indirect tax imposed on most goods and services in Egypt at a base rate of 14% per the Value-Added Tax Law No. 67 of 2016. Every registered business must file a monthly tax return within two months after the end of the tax period, regardless of the sales volume in that month.",
        art1_p2: "Core obligations include: issuing certified e-invoices, maintaining detailed purchase and sales records, and complying with the e-receipt system. Late filing or payment exposes the business to penalties starting at 200 EGP and reaching percentages of the tax due. We recommend relying on a specialized accountant to ensure full compliance and avoid penalties.",
        art2_p1: "The five most common accounting mistakes we see in startups: mixing personal and business accounts, postponing bookkeeping for months, ignoring the separation between assets and liabilities, failing to document expenses with official invoices, and overlooking tax obligations in the first year of operation.",
        art2_p2: "Correcting these mistakes early saves the company significant costs later and makes financial reports credible and ready for any purpose — bank financing, partnership, or tender submission. We recommend setting up an accounting system from month one and updating it weekly instead of compiling it at year-end.",
        art3_p1: "Per the Social Insurance and Pensions Law No. 148 of 2019, the employer bears 18.75% of the insurable wage while the employee bears 11%. The maximum insurable wage is currently 10,000 EGP per month. Contributions are paid monthly to the National Social Insurance Authority within the prescribed deadlines.",
        art3_p2: "Employers must register new hires within the first week of joining, update their data upon any wage change, and submit Forms 1, 2, and 6 on time. Late payment incurs escalating penalties and affects the employee's insurance rights, so we recommend maintaining a precise monthly tracking schedule.",
        art4_p1: "Banks examine three core areas before granting any loan: the credibility of financial statements, cash flow continuity, and the debt-to-equity ratio. Statements audited by a certified chartered accountant carry much more weight than unaudited ones and are often a prerequisite for institutional financing.",
        art4_p2: "To prepare convincing statements: keep business and owner accounts strictly separate, provide income statements, balance sheets, and cash flow statements for at least the last two years, and attach an analysis of key financial ratios with clear explanations of any deviations. Early planning with your accountant six months before approaching the bank saves significant time.",
        art5_p1: "Tax inspection is a legitimate right of the Tax Authority, but it is governed by clear legal procedures. Before inspection, ensure the readiness of core documents: organized accounting books, documented purchase and sale invoices, tax returns filed on time, and matching bank statements. Missing any of these may lead to arbitrary assessments by the Authority.",
        art5_p2: "Your rights during inspection include: receiving a formal prior notice, having your chartered accountant present, reviewing the reasons for the inspection, submitting additional documents within the granted deadline, and objecting to the results within 30 days of notification. Retaining a specialized accountant before and after inspection reduces risks and accelerates settlement.",
        art6_p1: "Manual bookkeeping is suitable only for very small businesses whose daily transactions don't exceed 5-10 entries. As the business grows, human error accumulates and monthly reconciliations become complex. Accounting software such as QuickBooks, Zoho Books, or any approved local system provides instant reports, integration with the e-invoicing system, and automatic backups.",
        art6_p2: "The decisive criterion: if you need accurate monthly reports, handle more than 20 invoices per month, or are required to register in the e-invoicing system, software is the right choice. The monthly cost of the software is far less than the overtime hours that will be wasted on manual reconciliations.",

        /* Newsletter */
        nl_h: "Subscribe to Our Accounting Newsletter",
        nl_p: "Monthly tax and accounting tips directly to your inbox — no spam.",
        nl_ph: "Your email address",
        nl_btn: "Subscribe for Free",

        /* Pricing */
        pr_eb2: "Our Packages",
        pr_h1: "Packages for Every Stage of Your Project",
        pr_p2: "Choose the package that aligns with your business size, with full customization options.",
        pl_name: "Corporate Package",
        pl_desc: "A comprehensive solution for large companies with complex needs.",
        pl_price: "On Request",
        pl_f1: "All Advanced Package features",
        pl_f2: "Prior years account auditing",
        pl_f3: "Feasibility studies and cost analysis",
        pl_f4: "Preparing planning budgets",
        pl_f5: "Customized financial and administrative consulting",
        pl_cta: "Contact for Pricing",
        cmp_eb: "COMPARE", cmp_h2: "Compare Packages in Detail",
        cmp_feat: "Feature", cmp_basic: "Basic", cmp_adv: "Advanced", cmp_corp: "Corporate",
        cmp_r1: "Bookkeeping", cmp_r2: "Tax Returns", cmp_r3: "Payroll Management",
        cmp_r4: "Monthly Financial Statements", cmp_r5: "Account Auditing",
        cmp_r6: "Feasibility Studies & Consulting", cmp_r7: "Follow-up Meetings", cmp_r8: "Technical Support",
        cmp_quarterly: "Quarterly", cmp_monthly: "Monthly", cmp_custom: "Custom",
        cmp_bh: "During business hours", cmp_atm: "Throughout the month", cmp_247: "24/7",
        pf_eb: "FAQ", pf_h2: "Package Questions",
        pf1q: "Can I change the package at any time?", pf1a: "Yes, you can upgrade or change your package at any time to match your business growth.",
        pf2q: "Are there any additional unlisted fees?", pf2a: "No, all prices are inclusive of the mentioned services with no hidden fees. Any additional services are agreed upon in advance.",
        pf3q: "Is there a long-term contract?", pf3a: "We offer flexibility in contracting, with monthly and annual options, and subscriptions can be cancelled with prior notice per agreed terms.",
        pfcta_h: "Didn't Find the Right Package?",
        pfcta_p: "Contact us to design a custom package that precisely meets your business needs.",
        pfcta_btn: "Contact Us",

        /* Contact */
        cn_eb: "Contact Us",
        cn_h1: "We Are Here to Help You",
        cn_p: "Get your first consultation for free — our team is ready to answer your inquiries and determine the best solution for your business.",
        cn_wa_h: "Direct WhatsApp", cn_wa_p: "Instant communication with our team — available throughout the week",
        cn_ph_h: "Phone",
        cn_em_h: "Email",
        cn_lo_h: "Location",
        cn_lo_p: "Giza, Arab Republic of Egypt",
        cn_hr_h: "Working Hours",
        cn_hr_p: "Saturday – Thursday: 9 AM – 6 PM",
        cn_hr_p2: "Friday: Closed",
        cn_form_h: "Send Us a Message",
        cn_form_p: "Tell us your needs and one of our consultants will contact you within 24 hours.",
        cf_name: "Full Name *",
        cf_name_ph: "John Smith",
        cf_phone: "Phone Number *",
        cf_email: "Email",
        cf_service: "Required Service",
        cf_select: "Select a Service",
        cf_other: "Other",
        cf_msg: "Additional Details",
        cf_msg_ph: "Tell us about your business and what you need in detail...",
        cf_send: "Send via WhatsApp",
        cf_send_email: "Send by Email",
        cm_h: "Send Us a Message",
        cm_p: "Tell us your needs and one of our consultants will contact you within 24 hours.",

        /* Validation */
        v_required: "This field is required.",
        v_phone: "Please enter a valid phone number.",
        v_email: "Please enter a valid email address.",

        /* Calculator */
        calc_h: "🧮 Tax & Fees Calculator",
        calc_sub: "Calculate VAT, income tax, social insurance, company setup fees, or startup ROI.",
        calc_t1: "VAT",
        calc_t2: "Income Tax",
        calc_t3: "Payroll & Insurance",
        calc_t4: "Company Setup Fees",
        calc_t5: "ROI & Break-even",
        calc_country: "Country",
        calc_amount: "Amount (EGP)",
        calc_type: "Calculation Type",
        calc_add: "Add tax to price (price before tax)",
        calc_extract: "Extract tax from amount (tax-inclusive price)",
        calc_base: "Base Amount",
        calc_total: "Total Including Tax",
        calc_vat_label: "Value-Added Tax",
        calc_vat_note: "Egypt's VAT rate is 14% per VAT Law No. 67 of 2016.",
        calc_inc_amount: "Annual Net Income (EGP)",
        calc_exempt: "Annual Personal Exemption",
        calc_taxable: "Taxable Income",
        calc_taxdue: "Tax Due",
        calc_eff: "Effective Rate",
        calc_inc_note: "Calculated per Egypt's 2024 amended income tax brackets — for guidance only, not a substitute for tax advice.",
        calc_inc_note_other: "Simplified estimate based on the corporate income tax rate. Actual liability depends on local brackets and exemptions.",
        calc_salary: "Monthly Basic Salary (EGP)",
        calc_emp: "Social Insurance (Employee 11%)",
        calc_er: "Social Insurance (Employer 18.75%)",
        calc_cost: "Total Cost to Company",
        calc_net: "Net Salary (Before Income Tax)",
        calc_pay_note: "Per current Egyptian social insurance rates. Maximum insurable wage is EGP 10,000.",
        calc_law_vat: "Per the Value-Added Tax Law No. 67 of 2016 (as amended by Law No. 149 of 2026).",
        calc_law_income: "Per the Income Tax Law No. 91 of 2005 (as amended by Law No. 151 of 2026). Personal exemption applies to individuals only.",
        calc_law_payroll: "Per the Social Insurance and Pensions Law No. 148 of 2019 (as amended by Law No. 11 of 2026). Maximum insurable wage: EGP 16,700.",
        calc_law_roi: "Estimate based on the inputs provided. Does not include taxes, financing costs, or non-recurring expenses.",
        calc_disclaimer: "Disclaimer: This calculator provides indicative estimates for guidance purposes only, based on the tax and social insurance legislation in force in Egypt at the time of publication. These results do not constitute an official tax return or legal opinion, and do not replace the advice of a certified chartered accountant or tax advisor. Results may be affected by multiple factors including the nature of the business, personal exemptions, applicable brackets, and future legislative amendments. EgyCrest is not liable for any decisions taken based on these results.",
        c_eg: "🇪🇬 Egypt — 14%",
        c_sa: "🇸🇦 Saudi Arabia — 15%",
        c_ae: "🇦🇪 UAE — 5%",
        c_qa: "🇶🇦 Qatar — 0%",
        c_kw: "🇰🇼 Kuwait — 0%",
        c_bh: "🇧🇭 Bahrain — 10%",
        c_om: "🇴🇲 Oman — 5%",
        c_jo: "🇯🇴 Jordan — 16%",
        c_us: "🇺🇸 USA — 0%",
        c_gb: "🇬🇧 UK — 20%",
        c_de: "🇩🇪 Germany — 19%",
        c_fr: "🇫🇷 France — 20%",
        c_tr: "🇹🇷 Turkey — 20%",
        c_ma: "🇲🇦 Morocco — 20%",

        /* Company Setup Calculator */
        calc_company_type: "Company Type",
        calc_capital: "Registered Capital (EGP)",
        calc_extra_services: "Additional Services",
        comp_llc: "Limited Liability Company (LLC)",
        comp_opc: "Single Person Company (OPC)",
        comp_jsc: "Joint Stock Company (JSC)",
        comp_sole: "Sole Proprietorship",
        comp_esign: "E-Signature (1 year) - 700 EGP",
        comp_eseal: "E-Seal (1 year) - 1,600 EGP",
        comp_reg_fee: "Registration & Recording Fees",
        comp_notary: "Notarization & Real Estate Registry",
        comp_publish: "Investment Newspaper Publication",
        comp_bar: "Bar Association Certification",
        comp_chamber: "Chamber of Commerce Fees",
        comp_stamp: "Stamp Duties & Official Documents",
        comp_extra: "Additional Services",
        comp_total: "Estimated Total",
        calc_law_company: "Per Companies Law No. 159 of 1981 (as amended by Law No. 4 of 2018) and Investment Law No. 72 of 2017 (as amended by Law No. 160 of 2023). Fees are estimates and may change by ministerial decree.",

        /* ROI Calculator */
        roi_initial: "Initial Capital Investment (EGP)",
        roi_monthly_revenue: "Expected Monthly Revenue (EGP)",
        roi_fixed_costs: "Monthly Fixed Costs (EGP)",
        roi_variable_cost: "Variable Cost as % of Revenue",
        roi_horizon: "Target Payback Horizon",
        roi_12m: "12 months",
        roi_24m: "24 months",
        roi_contribution: "Monthly Contribution Margin",
        roi_monthly_profit: "Monthly Net Profit",
        roi_breakeven_units: "Break-even — Monthly Revenue Needed",
        roi_payback: "Payback Period",
        roi_annual: "Annual ROI (Estimated)",
        roi_verdict: "Verdict",
        roi_verdict_excellent: "✓ Excellent — strong payback within target",
        roi_verdict_good: "✓ Good — payback within target horizon",
        roi_verdict_slow: "⚠ Slow — payback exceeds target horizon",
        roi_verdict_negative: "✗ Loss-making — revenue below break-even",
        roi_months_suffix: " months",

        /* AI chatbot */
        ai_title: "EgyCrest Assistant",
        ai_online: "Online now",
        ai_welcome: "Hello! 👋 I'm the EgyCrest assistant. How can I help you?",
        q1: "Services", q2: "Academy", q3: "E-Invoicing", q4: "Contact",
        ai_ph: "Type your question...",

        /* Cookie */
        cookie_text: "We use cookies to improve your experience and analyze traffic. <a href=\"#\" onclick=\"return false;\">Learn more</a>",
        cookie_link: "Learn more",
        cookie_decline: "Decline",
        cookie_accept: "Accept"
    },
    ar: {}
};

/* ========== STATE ========== */
let currentLang = 'ar';
let detectedCountry = 'EG';
let activeVatRate = 14;
let activeCurrency = 'ج.م';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const smoothBehavior = prefersReducedMotion ? 'auto' : 'smooth';

/* =========================================================
   COUNTRY TAX DATA
   Each country carries: VAT rate, VAT law reference, CIT rate,
   CIT law reference, personal exemption (individuals), currency,
   and a marketing note.
   ========================================================= */
const COUNTRY_TAX = {
    EG: { ar: 'مصر', en: 'Egypt', vat: 14, corp: 22.5, cur: 'ج.م', curEn: 'EGP', flag: '🇪🇬',
         personalExemption: 20000,
         vatLawAr: 'وفقًا لقانون الضريبة على القيمة المضافة رقم 67 لسنة 2016 (المعدل بالقانون 149 لسنة 2026).',
         vatLawEn: 'Per the Value-Added Tax Law No. 67 of 2016 (as amended by Law No. 149 of 2026).',
         citLawAr: 'وفقًا لقانون الضريبة على الدخل رقم 91 لسنة 2005 (المعدل بالقانون 151 لسنة 2026). الإعفاء الشخصي يُطبق على الأفراد فقط.',
         citLawEn: 'Per the Income Tax Law No. 91 of 2005 (as amended by Law No. 151 of 2026). Personal exemption applies to individuals only.',
         noteAr: 'خبراء في الضرائب المصرية والاستشارات الدولية.',
         noteEn: 'Experts in Egyptian taxation and international consulting.' },

    SA: { ar: 'السعودية', en: 'Saudi Arabia', vat: 15, corp: 20, cur: 'ر.س', curEn: 'SAR', flag: '🇸🇦',
         personalExemption: 0,
         vatLawAr: 'وفقًا لنظام ضريبة القيمة المضافة السعودي الصادر بالمرسوم الملكي م/113 لعام 2017.',
         vatLawEn: 'Per the Saudi VAT Law issued by Royal Decree No. M/113 of 2017.',
         citLawAr: 'ضريبة دخل الشركات بنسبة 20% وفق نظام ضريبة الدخل السعودي. الزكاة تُطبق على الشركات المملوكة للسعوديين والخليجيين.',
         citLawEn: 'Corporate income tax of 20% per the Saudi Income Tax Law. Zakat applies to Saudi/GCC-owned companies.',
         noteAr: 'نساعد عملاءنا في السعودية على الامتثال لضريبة القيمة المضافة وأنظمة هيئة الزكاة والضريبة.',
         noteEn: 'We help our Saudi clients comply with VAT and ZATCA regulations.' },

    AE: { ar: 'الإمارات', en: 'UAE', vat: 5, corp: 9, cur: 'د.إ', curEn: 'AED', flag: '🇦🇪',
         personalExemption: 0,
         vatLawAr: 'وفقًا للمرسوم بقانون اتحادي رقم 8 لسنة 2017 بشأن ضريبة القيمة المضافة.',
         vatLawEn: 'Per Federal Decree-Law No. 8 of 2017 on Value Added Tax.',
         citLawAr: 'ضريبة الشركات 9% على الدخل الذي يتجاوز 375,000 درهم، وفق المرسوم بقانون اتحادي رقم 47 لسنة 2022.',
         citLawEn: 'Corporate tax of 9% on income above AED 375,000 per Federal Decree-Law No. 47 of 2022.',
         noteAr: 'خدمات محاسبية وضريبية متوافقة مع أنظمة الهيئة الاتحادية للضرائب في الإمارات.',
         noteEn: 'Accounting and tax services compliant with the UAE Federal Tax Authority.' },

    QA: { ar: 'قطر', en: 'Qatar', vat: 0, corp: 10, cur: 'ر.ق', curEn: 'QAR', flag: '🇶🇦',
         personalExemption: 0,
         vatLawAr: 'لا توجد ضريبة قيمة مضافة مطبقة حاليًا في قطر.',
         vatLawEn: 'No VAT currently implemented in Qatar.',
         citLawAr: 'ضريبة دخل الشركات 10% وفق قانون ضريبة الدخل رقم 24 لسنة 2018.',
         citLawEn: 'Corporate income tax of 10% per Income Tax Law No. 24 of 2018.',
         noteAr: 'استشارات محاسبية ومالية لعملائنا في قطر وفق الأنظمة المحلية.',
         noteEn: 'Accounting and financial consulting for our clients in Qatar.' },

    KW: { ar: 'الكويت', en: 'Kuwait', vat: 0, corp: 15, cur: 'د.ك', curEn: 'KWD', flag: '🇰🇼',
         personalExemption: 0,
         vatLawAr: 'لا توجد ضريبة قيمة مضافة مطبقة حاليًا في الكويت.',
         vatLawEn: 'No VAT currently implemented in Kuwait.',
         citLawAr: 'ضريبة دخل الشركات الأجنبية 15% وفق القانون رقم 3 لسنة 1955.',
         citLawEn: 'Corporate income tax on foreign entities of 15% per Law No. 3 of 1955.',
         noteAr: 'خدمات محاسبية واستشارية لأصحاب الأعمال في الكويت.',
         noteEn: 'Accounting and advisory services for business owners in Kuwait.' },

    BH: { ar: 'البحرين', en: 'Bahrain', vat: 10, corp: 0, cur: 'د.ب', curEn: 'BHD', flag: '🇧🇭',
         personalExemption: 0,
         vatLawAr: 'وفقًا للمرسوم بقانون رقم 48 لسنة 2018 بشأن ضريبة القيمة المضافة.',
         vatLawEn: 'Per Decree-Law No. 48 of 2018 on Value Added Tax.',
         citLawAr: 'لا توجد ضريبة دخل على الشركات في البحرين (باستثناء قطاع النفط والغاز).',
         citLawEn: 'No corporate income tax in Bahrain (except oil & gas sector).',
         noteAr: 'دعم الامتثال لضريبة القيمة المضافة في البحرين وإعداد الإقرارات.',
         noteEn: 'VAT compliance support and return preparation in Bahrain.' },

    OM: { ar: 'عُمان', en: 'Oman', vat: 5, corp: 15, cur: 'ر.ع', curEn: 'OMR', flag: '🇴🇲',
         personalExemption: 0,
         vatLawAr: 'وفقًا للمرسوم السلطاني رقم 121 لسنة 2020 بشأن ضريبة القيمة المضافة.',
         vatLawEn: 'Per Royal Decree No. 121 of 2020 on Value Added Tax.',
         citLawAr: 'ضريبة دخل الشركات 15% وفق قانون ضريبة الدخل رقم 28 لسنة 2009.',
         citLawEn: 'Corporate income tax of 15% per Income Tax Law No. 28 of 2009.',
         noteAr: 'خدمات ضريبية ومحاسبية متوافقة مع أنظمة سلطنة عُمان.',
         noteEn: 'Tax and accounting services compliant with Oman regulations.' },

    JO: { ar: 'الأردن', en: 'Jordan', vat: 16, corp: 20, cur: 'د.أ', curEn: 'JOD', flag: '🇯🇴',
         personalExemption: 0,
         vatLawAr: 'وفقًا لقانون ضريبة المبيعات رقم 6 لسنة 1994 وتعديلاته.',
         vatLawEn: 'Per the Sales Tax Law No. 6 of 1994 and its amendments.',
         citLawAr: 'ضريبة دخل الشركات 20% وفق قانون ضريبة الدخل رقم 34 لسنة 2014.',
         citLawEn: 'Corporate income tax of 20% per Income Tax Law No. 34 of 2014.',
         noteAr: 'إعداد إقرارات ضريبة المبيعات والدخل لعملائنا في الأردن.',
         noteEn: 'Sales tax and income tax return preparation for clients in Jordan.' },

    US: { ar: 'الولايات المتحدة', en: 'United States', vat: 0, corp: 21, cur: '$', curEn: 'USD', flag: '🇺🇸',
         personalExemption: 0,
         vatLawAr: 'لا توجد ضريبة قيمة مضافة فدرالية في الولايات المتحدة. تُطبق ضرائب المبيعات على مستوى الولايات.',
         vatLawEn: 'No federal VAT in the US. State-level sales taxes apply instead.',
         citLawAr: 'ضريبة الدخل الفدرالية للشركات 21% وفق قانون التخفيضات الضريبية والوظائف (TCJA) لعام 2017.',
         citLawEn: 'Federal corporate income tax of 21% per the Tax Cuts and Jobs Act (TCJA) of 2017.',
         noteAr: 'دعم محاسبي للشركات الأمريكية والمستثمرين العرب في السوق الأمريكي.',
         noteEn: 'Accounting support for US businesses and Arab investors.' },

    GB: { ar: 'المملكة المتحدة', en: 'United Kingdom', vat: 20, corp: 25, cur: '£', curEn: 'GBP', flag: '🇬🇧',
         personalExemption: 0,
         vatLawAr: 'وفقًا لقانون ضريبة القيمة المضافة البريطاني لعام 1994 (VATA 1994).',
         vatLawEn: 'Per the UK Value Added Tax Act 1994 (VATA 1994).',
         citLawAr: 'ضريبة دخل الشركات 25% للأرباح التي تتجاوز 250,000 جنيه إسترليني، و19% للأرباح الأقل.',
         citLawEn: 'Corporate income tax of 25% on profits above £250,000, and 19% below that threshold.',
         noteAr: 'خدمات محاسبية متوافقة مع نظام الإيرادات والجمارك البريطاني وضريبة القيمة المضافة.',
         noteEn: 'Accounting services compliant with HMRC and UK VAT.' },

    DE: { ar: 'ألمانيا', en: 'Germany', vat: 19, corp: 30, cur: '€', curEn: 'EUR', flag: '🇩🇪',
         personalExemption: 0,
         vatLawAr: 'وفقًا لقانون ضريبة القيمة المضافة الألماني (UStG).',
         vatLawEn: 'Per the German Value Added Tax Act (UStG).',
         citLawAr: 'ضريبة دخل الشركات 15% + ضريبة التجارة (~15%) بمعدل إجمالي ~30%.',
         citLawEn: 'Corporate income tax of 15% + trade tax (~15%) for a combined effective rate of ~30%.',
         noteAr: 'دعم الامتثال الضريبي للشركات العاملة في ألمانيا.',
         noteEn: 'Tax compliance support for companies in Germany.' },

    FR: { ar: 'فرنسا', en: 'France', vat: 20, corp: 25, cur: '€', curEn: 'EUR', flag: '🇫🇷',
         personalExemption: 0,
         vatLawAr: 'وفقًا للقانون العام للضرائب الفرنسي (Code général des impôts).',
         vatLawEn: 'Per the French General Tax Code (Code général des impôts).',
         citLawAr: 'ضريبة دخل الشركات 25% (مع معدل مخفض 15% للشركات الصغيرة).',
         citLawEn: 'Corporate income tax of 25% (with a reduced rate of 15% for small companies).',
         noteAr: 'خدمات محاسبية وضريبية للشركات في السوق الفرنسي.',
         noteEn: 'Accounting and tax services in the French market.' },

    TR: { ar: 'تركيا', en: 'Turkey', vat: 20, corp: 25, cur: '₺', curEn: 'TRY', flag: '🇹🇷',
         personalExemption: 0,
         vatLawAr: 'وفقًا لقانون ضريبة القيمة المضافة التركي رقم 3065.',
         vatLawEn: 'Per the Turkish Value Added Tax Law No. 3065.',
         citLawAr: 'ضريبة دخل الشركات 25% وفق قانون ضريبة الدخل التركي رقم 193.',
         citLawEn: 'Corporate income tax of 25% per the Turkish Income Tax Law No. 193.',
         noteAr: 'استشارات ضريبية ومحاسبية للمستثمرين في تركيا.',
         noteEn: 'Tax and accounting consulting for investors in Turkey.' },

    MA: { ar: 'المغرب', en: 'Morocco', vat: 20, corp: 31, cur: 'د.م', curEn: 'MAD', flag: '🇲🇦',
         personalExemption: 0,
         vatLawAr: 'وفقًا للمدونة العامة للضرائب المغربية (CGI) - ضريبة القيمة المضافة.',
         vatLawEn: 'Per the Moroccan General Tax Code (CGI) — Value Added Tax.',
         citLawAr: 'ضريبة دخل الشركات بحد أقصى 31% وفق المدونة العامة للضرائب.',
         citLawEn: 'Corporate income tax up to 31% per the General Tax Code.',
         noteAr: 'خدمات محاسبية متوافقة مع الأنظمة الضريبية المغربية.',
         noteEn: 'Accounting services compliant with Moroccan tax regulations.' }
};

/* ========== SCROLL HELPERS ========== */
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = (document.querySelector('.site-head')?.offsetHeight || 0) + 10;
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: y, behavior: smoothBehavior });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: smoothBehavior });
}

/* ========== ROUTER ========== */
const VALID_PAGES = ['home', 'academy', 'blog', 'pricing', 'contact'];

function gotoPage(page, anchor) {
    if (!VALID_PAGES.includes(page)) page = 'home';

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    setActiveNav(page === 'home' && anchor ? anchor : page);

    if (page === 'home') {
        initNavObserver();
    } else if (navObserver) {
        navObserver.disconnect();
    }

    if (anchor) {
        requestAnimationFrame(() => scrollToSection(anchor));
    } else {
        window.scrollTo({ top: 0, behavior: smoothBehavior });
    }
}

/* ========== NAV HIGHLIGHTING ========== */
let navObserver = null;

function setActiveNav(sectionId) {
    document.querySelectorAll('nav [data-section]').forEach(el => {
        el.classList.toggle('nav-active', el.dataset.section === sectionId);
    });
}

function initNavObserver() {
    const homePage = document.getElementById('page-home');
    if (!homePage || !homePage.classList.contains('active')) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = ['home', 'why', 'services'].map(id => document.getElementById(id)).filter(Boolean);
    if (navObserver) navObserver.disconnect();

    navObserver = new IntersectionObserver(entries => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
            const id = visible[0].target.id;
            if (id === 'home') setActiveNav('home');
            else if (id === 'services') setActiveNav('services');
        }
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

    sections.forEach(s => navObserver.observe(s));
}

/* ========== LANGUAGE ========== */
function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.remove('preload-en');
    document.body.classList.toggle('lang-en', lang === 'en');
    document.getElementById('btnAr')?.classList.toggle('active', lang === 'ar');
    document.getElementById('btnEn')?.classList.toggle('active', lang === 'en');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (lang === 'ar') {
            if (!el.dataset.ar) el.dataset.ar = el.innerHTML;
            el.innerHTML = el.dataset.ar;
        } else {
            if (!el.dataset.ar) el.dataset.ar = el.innerHTML;
            if (TRANSLATIONS.en[key]) el.innerHTML = TRANSLATIONS.en[key];
        }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (!el.dataset.arPh) el.dataset.arPh = el.placeholder;
        el.placeholder = lang === 'ar' ? el.dataset.arPh : (TRANSLATIONS.en[key] || el.dataset.arPh);
    });

    document.title = lang === 'ar'
        ? 'EgyCrest Financial | محاسب قانوني واستشارات مالية'
        : 'EgyCrest Financial | Chartered Accountant & Financial Consulting';

    try { localStorage.setItem('egycrest_lang', lang); } catch (e) {}

    applyCountry(detectedCountry, false);
}

/* ========== HAMBURGER MENU ========== */
function toggleMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const btn = document.getElementById('hamburger');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.classList.toggle('no-scroll', isOpen);

    /* Force inline styles — overrides any CSS specificity issue */
    if (isOpen) {
        drawer.style.position = 'fixed';
        drawer.style.top = '0';
        drawer.style.height = '100vh';
        drawer.style.width = '320px';
        drawer.style.maxWidth = '85vw';
        drawer.style.background = '#FFFFFF';
        drawer.style.display = 'flex';
        drawer.style.flexDirection = 'column';
        drawer.style.visibility = 'visible';
        drawer.style.pointerEvents = 'auto';
        drawer.style.zIndex = '9999';
        drawer.style.boxShadow = '0 0 32px rgba(0,0,0,0.35)';

        // Position based on language direction
        if (document.documentElement.dir === 'rtl') {
            drawer.style.left = '0';
            drawer.style.right = 'auto';
        } else {
            drawer.style.right = '0';
            drawer.style.left = 'auto';
        }
        drawer.style.transform = 'translateX(0)';
    } else {
        // Reset to closed state (CSS takes over again)
        drawer.style.transform = '';
        drawer.style.visibility = '';
        drawer.style.pointerEvents = '';
        drawer.style.left = '';
        drawer.style.right = '';
        drawer.style.zIndex = '';
        drawer.style.boxShadow = '';
    }
}    /* DIAGNOSTIC — remove after fixing */
    alert(
        'Lang: ' + document.documentElement.lang + '\n' +
        'Dir: ' + document.documentElement.dir + '\n' +
        'isOpen: ' + isOpen + '\n' +
        'drawer class: ' + drawer.className + '\n' +
        'drawer z-index: ' + getComputedStyle(drawer).zIndex + '\n' +
        'drawer transform: ' + getComputedStyle(drawer).transform
    );
}

function closeMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const btn = document.getElementById('hamburger');
    if (!drawer || !overlay) return;

    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    /* Clear inline styles so CSS takes over */
    drawer.style.transform = '';
    drawer.style.visibility = '';
    drawer.style.pointerEvents = '';
    drawer.style.left = '';
    drawer.style.right = '';
    drawer.style.zIndex = '';
    drawer.style.boxShadow = '';
}
/* ========== BLOG ACCORDION ========== */
function togglePost(btn) {
    const post = btn.parentElement;
    const body = post.querySelector('.blog-post-body');
    const isOpen = post.classList.contains('open');

    document.querySelectorAll('.blog-post.open').forEach(other => {
        if (other !== post) {
            other.classList.remove('open');
            const otherBody = other.querySelector('.blog-post-body');
            if (otherBody) otherBody.style.maxHeight = null;
            const otherBtn = other.querySelector('.blog-post-head');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
    });

    if (isOpen) {
        post.classList.remove('open');
        body.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
    } else {
        post.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
    }
}

/* ========== FORM VALIDATION ========== */
const VALIDATORS = {
    required: (value) => value.length > 0,
    phone: (value) => /^[\d\s\+\-\(\)]{8,20}$/.test(value.trim()),
    email: (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
};

function validateField(input) {
    const rule = input.dataset.validate;
    if (!rule || !VALIDATORS[rule]) return true;
    const value = input.value.trim();
    if (rule === 'email' && value === '') return true;
    return VALIDATORS[rule](value);
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorEl = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearFieldError(input) {
    input.classList.remove('error');
    const errorEl = document.querySelector(`.field-error[data-error-for="${input.id}"]`);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

function validateForm(formEl) {
    let isValid = true;
    const fields = formEl.querySelectorAll('[data-validate]');
    fields.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            const rule = input.dataset.validate;
            const msgKey = 'v_' + rule;
            const msg = (TRANSLATIONS.en[msgKey] && currentLang === 'en')
                ? TRANSLATIONS.en[msgKey]
                : (currentLang === 'ar' ? getArabicError(rule) : TRANSLATIONS.en[msgKey]);
            showFieldError(input, msg);
        } else {
            clearFieldError(input);
        }
    });
    return isValid;
}

function getArabicError(rule) {
    return {
        required: 'هذا الحقل مطلوب.',
        phone: 'يرجى إدخال رقم هاتف صحيح.',
        email: 'يرجى إدخال بريد إلكتروني صحيح.'
    }[rule] || 'يرجى التحقق من هذا الحقل.';
}

/* ========== CONTACT FORMS ========== */
function openContactModal() { document.getElementById('contactModal').classList.add('open'); }
function closeContactModal() { document.getElementById('contactModal').classList.remove('open'); }

function buildContactLines(name, phone, email, service, msg) {
    const lines = [
        currentLang === 'ar' ? `مرحبًا، أنا ${name}` : `Hello, I am ${name}`,
        currentLang === 'ar' ? `رقم التواصل: ${phone}` : `Contact number: ${phone}`
    ];
    if (email) lines.push(currentLang === 'ar' ? `البريد: ${email}` : `Email: ${email}`);
    if (service) lines.push(currentLang === 'ar' ? `الخدمة المطلوبة: ${service}` : `Service: ${service}`);
    if (msg) lines.push(currentLang === 'ar' ? `التفاصيل: ${msg}` : `Details: ${msg}`);
    return lines;
}

function sendContactViaWhatsApp() {
    const form = document.getElementById('modalContactForm');
    if (!validateForm(form)) return;

    const name = document.getElementById('modal-name').value.trim();
    const phone = document.getElementById('modal-phone').value.trim();
    const email = document.getElementById('modal-email').value.trim();
    const service = document.getElementById('modal-service').value;
    const msg = document.getElementById('modal-message').value.trim();

    const text = buildContactLines(name, phone, email, service, msg).join('\n');
    window.open('https://wa.me/201152255991?text=' + encodeURIComponent(text), '_blank');
    closeContactModal();
}

function sendContactViaEmail() {
    const form = document.getElementById('modalContactForm');
    if (!validateForm(form)) return;

    const name = document.getElementById('modal-name').value.trim();
    const phone = document.getElementById('modal-phone').value.trim();
    const email = document.getElementById('modal-email').value.trim();
    const service = document.getElementById('modal-service').value;
    const msg = document.getElementById('modal-message').value.trim();

    const subject = currentLang === 'ar'
        ? `استفسار جديد من ${name}`
        : `New inquiry from ${name}`;

    const body = buildContactLines(name, phone, email, service, msg).join('\n\n');

    window.location.href = `mailto:egycrest@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    closeContactModal();
}

function sendPageContact() {
    const form = document.getElementById('pageContactForm');
    if (!validateForm(form)) return;

    const name = document.getElementById('page-name').value.trim();
    const phone = document.getElementById('page-phone').value.trim();
    const email = document.getElementById('page-email').value.trim();
    const msg = document.getElementById('page-message').value.trim();

    const text = buildContactLines(name, phone, email, '', msg).join('\n');
    window.open('https://wa.me/201152255991?text=' + encodeURIComponent(text), '_blank');
}

function sendPageContactEmail() {
    const form = document.getElementById('pageContactForm');
    if (!validateForm(form)) return;

    const name = document.getElementById('page-name').value.trim();
    const phone = document.getElementById('page-phone').value.trim();
    const email = document.getElementById('page-email').value.trim();
    const msg = document.getElementById('page-message').value.trim();

    const subject = currentLang === 'ar'
        ? `استفسار جديد من ${name}`
        : `New inquiry from ${name}`;

    const body = buildContactLines(name, phone, email, '', msg).join('\n\n');
    window.location.href = `mailto:egycrest@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ========== NEWSLETTER ========== */
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !email.includes('@')) {
        alert(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
        return;
    }
    const subject = currentLang === 'ar' ? 'اشتراك في النشرة البريدية' : 'Newsletter Subscription';
    const body = currentLang === 'ar'
        ? `مرحبًا، أرغب في الاشتراك في النشرة البريدية.\nبريدي: ${email}`
        : `Hello, I would like to subscribe to the newsletter.\nMy email: ${email}`;
    window.location.href = `mailto:egycrest@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ========== AI CHATBOT ========== */
function toggleChat() {
    const chat = document.getElementById('aiChat');
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) {
        requestAnimationFrame(() => {
            const rect = chat.getBoundingClientRect();
            if (rect.top < 0) window.scrollBy({ top: rect.top - 10, behavior: smoothBehavior });
        });
    }
}

function addMsg(text, who) {
    const body = document.getElementById('aiBody');
    const div = document.createElement('div');
    div.className = 'ai-msg ' + who;
    div.textContent = text;
    body.appendChild(div);
    requestAnimationFrame(() => body.scrollTo({ top: body.scrollHeight, behavior: smoothBehavior }));
}

const KB = {
    ar: [
        { k: ['خدمات', 'بتقدم', 'services'], r: 'نقدّم مجموعة واسعة من الخدمات تشمل: التدقيق، الضرائب، الاستشارات المالية، الاندماج والاستحواذ، المحاسبة الجنائية، وأكاديمية تدريب.' },
        { k: ['أكاديمية', 'تدريب', 'دورات', 'academy', 'courses'], r: 'EgyCrest Academy تقدم دورات في: معايير EAS وIFRS، الضرائب المصرية، التحليل المالي، التدقيق الداخلي، والمحاسبة الجنائية.' },
        { k: ['سعر', 'تكلفة', 'باقة', 'price'], r: 'الأسعار مرنة حسب حجم النشاط. تواصل معنا على واتساب 01152255991 أو عبر egycrest@icloud.com لعرض سعر مخصص.' },
        { k: ['فاتورة', 'الكترونية', 'إلكترونية'], r: 'الفاتورة الإلكترونية إلزامية. نساعدك في التسجيل والربط مع منظومة الضرائب.' },
        { k: ['جنائية', 'forensic', 'احتيال'], r: 'خدمة المحاسبة الجنائية: تحقيقات مالية لكشف الاحتيال والتلاعب، وتقارير قضائية معتمدة للنزاعات القانونية.' },
        { k: ['تواصل', 'رقم', 'هاتف', 'contact'], r: 'البريد الإلكتروني: egycrest@icloud.com\nواتساب: 01152255991\nساعات العمل: السبت إلى الخميس، 9 ص – 6 م' },
        { k: ['حاسبة', 'حاسبات', 'ضريبة'], r: 'لدينا حاسبات لضريبة القيمة المضافة، ضريبة الدخل، التأمينات، رسوم تأسيس الشركات، والعائد على الاستثمار. اضغط على "حاسبة الضريبة والرسوم" في القائمة العلوية.' },
        { k: ['موعد', 'مواعيد', 'deadline'], r: 'أهم المواعيد: إقرار القيمة المضافة (شهري)، ضريبة الدخل (سنوي)، ضريبة المرتبات (ربع سنوي)، والتأمينات (شهري).' },
        { k: ['مرحبا', 'اهلا', 'سلام', 'hello', 'hi'], r: 'أهلاً بك! اسألني عن خدماتنا، الأكاديمية، الحاسبات، أو الفاتورة الإلكترونية.' }
    ],
    en: [
        { k: ['service', 'offer'], r: 'We offer wide range of services including: Audit, Taxation, Financial Consulting, M&A, Forensic Accounting, and our Training Academy.' },
        { k: ['academy', 'courses', 'training'], r: 'EgyCrest Academy offers courses in: EAS & IFRS, Egyptian Taxation, Financial Analysis, Internal Audit, and Forensic Accounting.' },
        { k: ['price', 'cost', 'package'], r: 'Pricing is flexible based on business size. WhatsApp us at 01152255991 or email egycrest@icloud.com for a custom quote.' },
        { k: ['invoice', 'e-invoice'], r: 'E-Invoicing is mandatory in Egypt. We help with registration and integration.' },
        { k: ['forensic', 'fraud'], r: 'Forensic Accounting: financial investigations to detect fraud, with court-ready reports for legal disputes.' },
        { k: ['contact', 'phone', 'whatsapp', 'email'], r: 'Email: egycrest@icloud.com\nWhatsApp: 01152255991\nWorking hours: Saturday to Thursday, 9 AM – 6 PM' },
        { k: ['calculator', 'calculators', 'tax', 'roi'], r: 'We have calculators for VAT, Income Tax, Social Insurance, Company Setup Fees, and Startup ROI. Click "Tax & Fees Calculator" in the top menu.' },
        { k: ['deadline', 'due date'], r: 'Key deadlines: VAT (monthly), Income Tax (annual), Payroll Tax (quarterly), and Social Insurance (monthly).' },
        { k: ['hello', 'hi', 'hey'], r: 'Welcome! Ask me about our services, the Academy, calculators, or e-invoicing.' }
    ]
};

function aiAsk(q) {
    addMsg(q, 'user');
    aiRespond(q);
}

function aiSend() {
    const inp = document.getElementById('aiInput');
    const q = inp.value.trim();
    if (!q) return;
    addMsg(q, 'user');
    inp.value = '';
    aiRespond(q);
}

function aiRespond(q) {
    const lower = q.toLowerCase();
    const list = KB[currentLang] || KB.ar;
    let ans = currentLang === 'ar'
        ? 'سؤال ممتاز! تواصل معنا على واتساب 01152255991 أو عبر egycrest@icloud.com.'
        : 'Great question! Reach us on WhatsApp 01152255991 or at egycrest@icloud.com.';
    for (const item of list) {
        if (item.k.some(k => lower.includes(k))) { ans = item.r; break; }
    }
    setTimeout(() => addMsg(ans, 'bot'), 400);
}

/* ========== CALCULATOR ========== */
function openCalc() {
    document.getElementById('calcModal').classList.add('open');
}

function closeCalc() {
    document.getElementById('calcModal').classList.remove('open');
}

function switchTab(tab, btn) {
    document.getElementById('tab-vat').style.display = tab === 'vat' ? 'block' : 'none';
    document.getElementById('tab-income').style.display = tab === 'income' ? 'block' : 'none';
    document.getElementById('tab-payroll').style.display = tab === 'payroll' ? 'block' : 'none';
    document.getElementById('tab-company').style.display = tab === 'company' ? 'block' : 'none';
    document.getElementById('tab-roi').style.display = tab === 'roi' ? 'block' : 'none';
    document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (tab === 'company' && document.getElementById('company-capital')?.value) {
        calcCompanyFees();
    }
    if (tab === 'roi' && document.getElementById('roi-initial')?.value) {
        calcRoi();
    }
}

function fmt(n) {
    const cur = currentLang === 'en'
        ? (COUNTRY_TAX[detectedCountry]?.curEn || 'EGP')
        : (COUNTRY_TAX[detectedCountry]?.cur || 'ج.م');
    return Math.round(n).toLocaleString('en-US') + ' ' + cur;
}

function calcVat() {
    const amount = parseFloat(document.getElementById('vat-amount').value) || 0;
    const type = document.getElementById('vat-type').value;
    const rate = (typeof activeVatRate === 'number' ? activeVatRate : 14) / 100;
    const res = document.getElementById('vat-result');
    if (!amount) { res.style.display = 'none'; return; }
    res.style.display = 'block';

    const taxLabel = document.getElementById('vat-tax-label');
    if (taxLabel) {
        const pct = (rate * 100).toFixed(0);
        if (currentLang === 'en') taxLabel.textContent = `Value-Added Tax (${pct}%)`;
        else taxLabel.textContent = `ضريبة القيمة المضافة (${pct}%)`;
    }

    if (type === 'add') {
        const tax = amount * rate;
        document.getElementById('vat-base').textContent = fmt(amount);
        document.getElementById('vat-tax').textContent = fmt(tax);
        document.getElementById('vat-total').textContent = fmt(amount + tax);
    } else {
        const base = amount / (1 + rate);
        const tax = amount - base;
        document.getElementById('vat-base').textContent = fmt(base);
        document.getElementById('vat-tax').textContent = fmt(tax);
        document.getElementById('vat-total').textContent = fmt(amount);
    }
}

function calcIncome() {
    const annual = parseFloat(document.getElementById('inc-amount').value) || 0;
    const res = document.getElementById('inc-result');
    if (!annual) { res.style.display = 'none'; return; }
    res.style.display = 'block';

    const code = detectedCountry || 'EG';
    const c = COUNTRY_TAX[code] || COUNTRY_TAX.EG;
    let taxable, tax;

    const exemptValueEl = document.getElementById('inc-exempt-value');
    const exRow = document.getElementById('inc-exemption-row');
    if (exemptValueEl) exemptValueEl.textContent = fmt(c.personalExemption || 0);
    if (exRow) exRow.style.display = c.personalExemption > 0 ? 'flex' : 'none';

    if (code === 'EG') {
        const exemption = c.personalExemption;
        taxable = Math.max(0, annual - exemption);
        if (taxable <= 15000) tax = 0;
        else if (taxable <= 30000) tax = (taxable - 15000) * 0.10;
        else if (taxable <= 45000) tax = 1500 + (taxable - 30000) * 0.15;
        else if (taxable <= 60000) tax = 3750 + (taxable - 45000) * 0.20;
        else if (taxable <= 200000) tax = 6750 + (taxable - 60000) * 0.225;
        else if (taxable <= 400000) tax = 38250 + (taxable - 200000) * 0.25;
        else tax = 88250 + (taxable - 400000) * 0.275;
    } else {
        taxable = annual;
        tax = annual * (c.corp / 100);
    }

    const rateEff = annual > 0 ? ((tax / annual) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('inc-taxable').textContent = fmt(taxable);
    document.getElementById('inc-tax').textContent = fmt(tax);
    document.getElementById('inc-rate').textContent = rateEff;
}

function calcPayroll() {
    const salary = parseFloat(document.getElementById('pay-salary').value) || 0;
    const res = document.getElementById('pay-result');
    if (!salary) { res.style.display = 'none'; return; }
    res.style.display = 'block';
    
    const insurable = Math.min(salary, 16700);
    const empIns = insurable * 0.11;
    const erIns = insurable * 0.1875;
    const net = salary - empIns;
    
    document.getElementById('pay-emp').textContent = fmt(empIns);
    document.getElementById('pay-er').textContent = fmt(erIns);
    document.getElementById('pay-total').textContent = fmt(salary + erIns);
    document.getElementById('pay-net').textContent = fmt(net);
}

/* ========== COMPANY SETUP FEE CALCULATOR ========== */
function calcCompanyFees() {
    const typeEl = document.getElementById('company-type');
    const capitalEl = document.getElementById('company-capital');
    const res = document.getElementById('company-result');
    if (!typeEl || !capitalEl || !res) return;

    const type = typeEl.value;
    const capital = parseFloat(capitalEl.value) || 0;
    const config = COMPANY_FEES[type];
    if (!config) return;

    if (!capital && type !== 'sole') {
        res.style.display = 'none';
        return;
    }
    res.style.display = 'block';

    const regFee     = config.regFee(capital);
    const notaryFee  = config.notaryFee(capital);
    const publishFee = config.publishFee(capital);
    const barFee     = config.barFee(capital);
    const chamberFee = config.chamberFee(capital);
    const stampFee   = config.stampFee;

    let extra = 0;
    Object.values(COMPANY_ADDONS).forEach(addon => {
        if (document.getElementById(addon.id)?.checked) extra += addon.price;
    });

    const total = regFee + notaryFee + publishFee + barFee + chamberFee + stampFee + extra;

    document.getElementById('comp-reg').textContent     = fmt(regFee);
    document.getElementById('comp-notary').textContent  = fmt(notaryFee);
    document.getElementById('comp-publish').textContent = fmt(publishFee);
    document.getElementById('comp-bar').textContent     = fmt(barFee);
    document.getElementById('comp-chamber').textContent = fmt(chamberFee);
    document.getElementById('comp-stamp').textContent   = fmt(stampFee);

    const extraRow = document.getElementById('comp-extra-row');
    if (extra > 0) {
        document.getElementById('comp-extra').textContent = fmt(extra);
        extraRow.style.display = 'flex';
    } else {
        extraRow.style.display = 'none';
    }

    document.getElementById('comp-total').textContent = fmt(total);
}

/* ========== ROI / BREAK-EVEN CALCULATOR ========== */
function calcRoi() {
    const initial   = parseFloat(document.getElementById('roi-initial')?.value)   || 0;
    const revenue   = parseFloat(document.getElementById('roi-revenue')?.value)   || 0;
    const fixed     = parseFloat(document.getElementById('roi-fixed')?.value)     || 0;
    const varPctRaw = parseFloat(document.getElementById('roi-variable')?.value);
    const varPct    = isNaN(varPctRaw) ? 0 : Math.min(100, Math.max(0, varPctRaw));
    const horizon   = parseFloat(document.getElementById('roi-horizon')?.value)   || 24;

    const res = document.getElementById('roi-result');
    if (!res) return;

    if (!initial || !revenue) {
        res.style.display = 'none';
        return;
    }
    res.style.display = 'block';

    const varCost        = revenue * (varPct / 100);
    const contribution   = revenue - varCost;
    const monthlyProfit  = contribution - fixed;
    const contributionRatio = revenue > 0 ? contribution / revenue : 0;

    let breakEvenRevenue = 0;
    if (contributionRatio > 0) {
        breakEvenRevenue = fixed / contributionRatio;
    } else {
        breakEvenRevenue = Infinity;
    }

    let payback = Infinity;
    if (monthlyProfit > 0) payback = initial / monthlyProfit;

    const annualProfit = monthlyProfit * 12;
    const annualRoi = initial > 0 ? (annualProfit / initial) * 100 : 0;

    document.getElementById('roi-contribution').textContent  = fmt(contribution);
    document.getElementById('roi-monthly-profit').textContent = fmt(monthlyProfit);
    document.getElementById('roi-breakeven').textContent =
        breakEvenRevenue === Infinity
            ? (currentLang === 'ar' ? 'غير ممكن' : 'Not achievable')
            : fmt(breakEvenRevenue);
    document.getElementById('roi-payback').textContent =
        payback === Infinity
            ? (currentLang === 'ar' ? 'لا يوجد استرداد' : 'No payback')
            : payback.toFixed(1) + (currentLang === 'ar' ? ' شهر' : ' months');
    document.getElementById('roi-annual').textContent = annualRoi.toFixed(1) + '%';

    const verdictEl = document.getElementById('roi-verdict');
    const verdictRow = document.getElementById('roi-verdict-row');
    let verdictText = '';
    let verdictColor = '';

    if (monthlyProfit <= 0) {
        verdictText = TRANSLATIONS.en.roi_verdict_negative;
        verdictColor = '#F87171';
    } else if (payback <= horizon * 0.75) {
        verdictText = TRANSLATIONS.en.roi_verdict_excellent;
        verdictColor = '#34D399';
    } else if (payback <= horizon) {
        verdictText = TRANSLATIONS.en.roi_verdict_good;
        verdictColor = '#FBBF24';
    } else {
        verdictText = TRANSLATIONS.en.roi_verdict_slow;
        verdictColor = '#FB923C';
    }

    if (currentLang === 'ar') {
        if (monthlyProfit <= 0) verdictText = '✗ خاسر — الإيراد أقل من نقطة التعادل';
        else if (payback <= horizon * 0.75) verdictText = '✓ ممتاز — استرداد سريع ضمن الهدف';
        else if (payback <= horizon) verdictText = '✓ جيد — استرداد ضمن الأفق المستهدف';
        else verdictText = '⚠ بطيء — الاسترداد يتجاوز الأفق المستهدف';
    }

    verdictEl.textContent = verdictText;
    verdictEl.style.color = verdictColor;
    if (verdictRow) verdictRow.style.display = 'flex';
}

/* ========== COUNTRY DETECTION ========== */
async function detectCountry() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('geo failed');
        const data = await res.json();
        const code = data.country_code;
        if (code && COUNTRY_TAX[code]) detectedCountry = code;
    } catch (e) {
        detectedCountry = 'EG';
    }
    applyCountry(detectedCountry, false);
}

function applyCountry(code, fromSelector) {
    if (!COUNTRY_TAX[code]) code = 'EG';
    detectedCountry = code;
    const c = COUNTRY_TAX[code];
    const lang = currentLang;

    /* --- Geo banner --- */
    const banner = document.getElementById('geoBanner');
    if (banner) {
        if (code === 'EG') {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'block';
            const name = lang === 'en' ? c.en : c.ar;
            const note = lang === 'en' ? c.noteEn : c.noteAr;
            const vatTxt = c.vat > 0
                ? (lang === 'en' ? `VAT: <strong>${c.vat}%</strong>` : `ض.ق.م: <strong>${c.vat}%</strong>`)
                : (lang === 'en' ? `<strong>No VAT</strong>` : `<strong>بدون ض.ق.م</strong>`);
            const corpTxt = lang === 'en' ? `Corporate tax: <strong>${c.corp}%</strong>` : `ضريبة الشركات: <strong>${c.corp}%</strong>`;
            const welcome = lang === 'en' ? `Welcome from ${c.flag} ${name}!` : `أهلًا بزائرنا من ${c.flag} ${name}!`;
            const text = document.getElementById('geoBannerText');
            if (text) {
                text.innerHTML = `<strong>${welcome}</strong> &nbsp;·&nbsp; ${vatTxt} &nbsp;·&nbsp; ${corpTxt} &nbsp;·&nbsp; ${note}`;
            }
        }
    }

    /* --- Active rate + currency --- */
    activeVatRate = c.vat;
    activeCurrency = lang === 'en' ? c.curEn : c.cur;

    /* --- VAT rate label under country select --- */
    const vatLabel = document.getElementById('vatRateLabel');
    if (vatLabel) {
        vatLabel.textContent = lang === 'en'
            ? `VAT rate for ${c.en}: ${c.vat}%`
            : `نسبة الضريبة في ${c.ar}: ${c.vat}%`;
    }

    /* --- DYNAMIC LAW REFERENCES (Point 3) --- */
    const vatLawEl = document.getElementById('vat-law-ref');
    if (vatLawEl) {
        vatLawEl.textContent = lang === 'en' ? c.vatLawEn : c.vatLawAr;
    }
    const incLawEl = document.getElementById('inc-law-ref');
    if (incLawEl) {
        incLawEl.textContent = lang === 'en' ? c.citLawEn : c.citLawAr;
    }

    /* --- Country select sync --- */
    const sel = document.getElementById('countrySelect');
    if (sel && !fromSelector) sel.value = code;

    /* --- Re-run active calculations with new rate --- */
    if (document.getElementById('vat-amount')?.value) calcVat();
    if (document.getElementById('inc-amount')?.value) calcIncome();
    if (document.getElementById('pay-salary')?.value) calcPayroll();
}

/* ========== FAQ ACCORDION ========== */
function initFaq() {
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const wasOpen = item.classList.contains('open');
            item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
}

/* ========== COOKIE CONSENT ========== */
function setCookieChoice(choice) {
    try { localStorage.setItem('egycrest_cookie_consent', choice); } catch (e) {}
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('visible');
}

function initCookieBanner() {
    let saved = null;
    try { saved = localStorage.getItem('egycrest_cookie_consent'); } catch (e) {}
    if (saved) return;
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    setTimeout(() => banner.classList.add('visible'), 1200);
}

/* ========== SCROLL PROGRESS ========== */
let progressTicking = false;
function updateScrollProgress() {
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    const bar = document.getElementById('scrollProgress');
    if (bar) bar.style.width = pct + '%';
    progressTicking = false;
}

/* ========== BACK TO TOP ========== */
function updateBackToTop() {
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', window.pageYOffset > 500);
}

/* ========== KEYBOARD ========== */
function handleKeydown(e) {
    if (e.key === 'Escape') {
        const chat = document.getElementById('aiChat');
        if (chat && chat.classList.contains('open')) toggleChat();
        closeCalc();
        closeContactModal();
        closeMenu();
    }
}

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
    initNavObserver();
    initCookieBanner();
    initFaq();
    updateScrollProgress();
    updateBackToTop();

    let saved = null;
    try { saved = localStorage.getItem('egycrest_lang'); } catch (e) {}
    if (saved === 'en' || saved === 'ar') {
        setLang(saved);
    } else {
        setLang('ar');
    }

    detectCountry();

    const h = (location.hash || '').replace('#', '').split('/')[0];
    if (VALID_PAGES.includes(h)) {
        gotoPage(h);
    }

    const calcModal = document.getElementById('calcModal');
    if (calcModal) {
        calcModal.addEventListener('click', function (e) {
            if (e.target === this) closeCalc();
        });
    }
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.addEventListener('click', function (e) {
            if (e.target === this) closeContactModal();
        });
    }
});

/* ========== GLOBAL EVENT LISTENERS ========== */
window.addEventListener('scroll', () => {
    if (!progressTicking) {
            requestAnimationFrame(() => {
            updateScrollProgress();
            updateBackToTop();
        });
        progressTicking = true;
    }
}, { passive: true });
window.addEventListener('resize', updateScrollProgress);
document.addEventListener('keydown', handleKeydown);
