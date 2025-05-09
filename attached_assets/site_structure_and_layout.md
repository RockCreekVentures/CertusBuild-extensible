# CertusBuild Static Site: Structure and Layout Design

## 1. Overall Site Structure / Sitemap

The static site will serve as a central repository for all research conducted and pitch materials developed for CertusBuild. The structure aims for clarity and ease of navigation.

*   **Homepage (`index.html`)**
    *   Overview of the CertusBuild project initiative.
    *   Quick links to the main sections: Research Archive and Pitch Materials.
    *   Brief statement on the mission/goal of CertusBuild.
*   **Research Archive (`research/index.html`)**
    *   A central hub to access all research documents and supporting assets.
    *   Content will be categorized for better organization.
    *   **Sub-sections (each potentially its own page or a section on `research/index.html` with anchor links):**
        *   **Market & Competitor Analysis (`research/market_competitors.html`)**
            *   `initial_software_list.md`
            *   `procore_research.md`
            *   `buildertrend_research.md`
            *   `autodesk_cc_research.md`
            *   `synthesis_and_recommendations.md` (Initial high-level synthesis)
            *   `market_segment_analysis.md`
            *   `pricing_model_analysis.md`
            *   `construction_software_gap_analysis.md`
        *   **Technology Landscape (`research/tech_landscape.html`)**
            *   `construction_tech_trends.md`
            *   `emerging_construction_tech.md`
        *   **MVP Definition & Research (`research/mvp_definition.html`)**
            *   `certusbuild_mvp_research.md` (Durations, Bid Prep, Uncertainty)
        *   **UX Research & Design (`research/ux_design.html`)**
            *   `comparative_ux_analysis.md`
            *   `workspace_design_synthesis.md`
            *   `wireframe_annotations.md` (Initial wireframes)
            *   `certusbuild_wireframe_annotations.md` (Themed wireframes)
            *   Relevant images: `procore_estimation_workflow.png`, `procore_scheduling_workflow.png`, `buildertrend_estimation_workflow.png`, `buildertrend_scheduling_workflow.png`, `acc_estimation_workflow.png`, `acc_scheduling_workflow.png`, `procore_estimating_demo_main_screen.png`, `procore_pm_demo_linking_items.png`, `buildertrend_scheduling_tutorial_gantt.png`, `acc_live_demo_interface.webp`, `wireframe_concept_1_modular.png`, `wireframe_concept_2_dashboard.png`, `certusbuild_themed_wireframe_1_modular.png`.
            *   `wireframe.html` and `style.css` (for the dark mode wireframe example)
        *   **Branding & Identity (`research/branding.html`)**
            *   `brand_name_ideas.md` (and rounds 2, 3)
            *   `domain_checks.txt` (and rounds 2, 3)
            *   `brand_name_synthesis.md` (and rounds 2, 3)
            *   `certusbuild_logo_annotations.md`
            *   `certusbuild_logo_synthesis.md`
            *   `certusbuild_visual_guidelines.md`
            *   Logo concept images: `certusbuild_logo_concept_1.png`, `certusbuild_logo_concept_2.png`, `certusbuild_logo_concept_2_dark_mode.png` (and .svg), `certusbuild_logo_concept_2_ochre_C.png` (and .svg), etc.
        *   **Miscellaneous Assets (`research/misc_assets.html`)**
            *   `generate_diagrams.py`
            *   `upload/pasted_content.txt`
*   **Pitch Materials (`pitch_materials/index.html`)**
    *   A section to host downloadable pitch decks and related content.
    *   **Sub-sections (each linking to a downloadable file or a brief description page):**
        *   Executive Summary Pitch Deck (`pitch_materials/executive_summary_deck.html` or direct PDF link)
        *   Technical / User Workflow Pitch Deck (`pitch_materials/technical_user_deck.html` or direct PDF link)
        *   Investor Pitch Deck (Core) (`pitch_materials/investor_deck_core.html` or direct PDF link)
        *   Financials Module (for Investor Deck) (`pitch_materials/financials_module.html` or direct PDF link/spreadsheet)
*   **About CertusBuild (`about.html`)** (Optional - can be a simple page or section on Homepage)
    *   Placeholder for future mission, vision, team information.

## 2. Page Layout Designs (Conceptual)

**Common Elements:**
*   **Header:** CertusBuild Logo (e.g., `certusbuild_logo_concept_2_dark_mode.svg`), Main Navigation (Home, Research Archive, Pitch Materials, About).
*   **Footer:** Copyright CertusBuild [Year], basic links.
*   **Styling:** Clean, modern, professional. Utilize the CertusBuild color palette: Navy Blue #0A2342 (primary background for dark theme, or text/accents on light theme), Muted Green #5B8C5A (accents, call-to-actions), Blueprint Blue from logo as accent, Grays for text and secondary elements, White for backgrounds (light theme) or text (dark theme).

**A. Homepage (`index.html`) Layout:**
*   **Hero Section:** Large headline (e.g., "CertusBuild: Revolutionizing Construction Management with Intelligent Automation"), brief tagline explaining the core value proposition.
*   **Introduction:** Short paragraph about the project and its goals.
*   **Key Pillars/Sections (Cards or Grid Layout):**
    *   Card 1: "Explore Our Research" -> Links to `research/index.html`. Brief description.
    *   Card 2: "View Pitch Materials" -> Links to `pitch_materials/index.html`. Brief description.
*   **(Optional) Vision Statement:** A more aspirational statement about the future of CertusBuild.

**B. Research Archive (`research/index.html`) Layout:**
*   **Page Title:** "CertusBuild Research Archive"
*   **Introduction:** Brief overview of the research areas.
*   **Categorized Links (could use a sidebar for categories or a tabbed interface):**
    *   Market & Competitor Analysis
    *   Technology Landscape
    *   MVP Definition & Research
    *   UX Research & Design
    *   Branding & Identity
    *   Miscellaneous Assets
*   Each category link would lead to a dedicated page (e.g., `research/market_competitors.html`) or expand a section on the same page.

**C. Research Category Page (e.g., `research/market_competitors.html`) Layout:**
*   **Page Title:** e.g., "Market & Competitor Analysis"
*   **List of Documents/Assets:**
    *   Each item listed with its filename (e.g., `procore_research.md`).
    *   A brief description or key takeaway if possible (can be added manually later).
    *   Direct link to view/download the file (Markdown files could be converted to HTML for direct viewing, or linked as .md for download. Images/SVGs linked directly).

**D. Pitch Materials (`pitch_materials/index.html`) Layout:**
*   **Page Title:** "CertusBuild Pitch Materials"
*   **Introduction:** Brief overview of the available pitch resources.
*   **Sections for Each Deck Type (Cards or List):**
    *   Executive Summary Pitch Deck: Description, Download Link (e.g., PDF).
    *   Technical / User Workflow Pitch Deck: Description, Download Link.
    *   Investor Pitch Deck (Core): Description, Download Link.
    *   Financials Module: Description, Download Link.

## 3. Content Organization for Research Archive

*   All files currently in `/home/ubuntu/certusbuild_site/research_archive/` will be sorted into the sub-directories/pages outlined above.
*   Markdown files (`.md`) will be the primary format for text-based research. These can be converted to HTML for display on the website or offered as downloads.
*   Images (`.png`, `.svg`, `.webp`) will be embedded or linked directly.
*   Other files (`.txt`, `.py`, `.html`, `.css` for wireframe example) will be offered as downloads or displayed appropriately (e.g., HTML example in an iframe or linked).

## 4. Next Steps for Implementation

1.  Create the base HTML structure for the main pages (`index.html`, `research/index.html`, `pitch_materials/index.html`, `about.html`).
2.  Develop a common CSS stylesheet (`main_style.css`) incorporating the CertusBuild branding and responsive design principles.
3.  Populate the research category pages by linking to the organized files.
4.  Create placeholder content/links for the pitch materials (actual deck creation is a separate sub-task).

