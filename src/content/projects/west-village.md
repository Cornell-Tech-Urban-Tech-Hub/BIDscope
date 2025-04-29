---
# Basic Project Information
title: "West Village BID"
description: "Analysis of the West Village Business Improvement District in Manhattan."
publishDate: 2023-09-20
updatedDate: 2023-10-05
thumbnail: "../../assets/placeholder.jpg"

# BID-specific Information
bidName: "West Village"
borough: "Manhattan"
yearEstablished: 2007

# Content Classification
featured: true
draft: false
revisionMode: true
tags: ["Historic District", "Retail", "Tourism", "Cultural Heritage"]

# Visualization Component References - empty arrays to be filled by students
insightComponents:
    - "../../components/visualizations/WestVillageStreetView.jsx"
transformationComponents: []
predictionComponents: []
consensusComponents: []

# Data Sources and techniques
dataSource: "NYC Open Data, West Village BID Annual Reports, Census Data, Tourism Statistics"
visualizationTechniques:
    ["Time Series Analysis", "Comparative Metrics", "Spatial Analysis"]
---

The West Village Business Improvement District serves one of Manhattan's most iconic and historic neighborhoods. Established in 2007, the BID supports local businesses in an area known for its distinctive architectural character, winding streets, and vibrant mix of shops, restaurants, and cultural venues. The district encompasses several blocks of primarily commercial streets within the larger West Village neighborhood.

# Insight Analysis

## West Village BID - Insight

West Village BID, established in 2022, is the fourth newest business improvement district in New York City. Covering approximately 46 acres (0.07 square miles), it is relatively small compared to other major city districts. With a moderate annual budget of around $595,000, the BID mainly focuses on providing essential services such as sanitation and public safety. Situated within the historic Greenwich Village Historic District, an area celebrated for its rich cultural and architectural legacy, West Village BID is surrounded by older, well-established BIDs like the Village Alliance (founded in 1993) and the Union Square Partnership (founded in 1984).

### Key Observations

-   **Land Use**: Predominantly mixed residential and commercial buildings, with higher density toward the north.
-   **Mobility**: 7th Avenue South serves as a major traffic corridor, while Bleecker Street and Christopher Street are more pedestrian-focused.
-   **Public Spaces**: Parks like Father Demo Square and the Stonewall National Monument serve as important community spaces.

### Challenges Identified

-   **Sanitation**: Garbage pickup was reduced during the pandemic and has only recently returned to pre-pandemic levels; maintaining cleanliness remains a priority.
-   **Pedestrian Experience**: Narrow sidewalks in parts of the district combined with heavy foot traffic pose challenges for walkability.
-   **Business Dynamics**: Restaurants, boutique shops, and cultural venues experience varying levels of activity, with concerns related to safety and sanitation expressed during interviews.

# Transformation Analysis

## West Village BID - Transformation

West Village’s historic streets are struggling to accommodate today’s pedestrian volumes, commercial churn, and tourist pressure. Targeted sidewalk widening and heritage-styled streetscape upgrades directly tackle current issues, restoring safe pedestrian flow, reinforcing the area’s cultural identity​​. Through these interventions, we’re shaping a future that respects the past while supporting local businesses and the community.

### Current State

-   **Narrow Sidewalk**: on Bleecker street, queues outside storefronts + two-sided parking cut pedestrian level-of-service.
-   **Limited Rest Area**: lacks pedestrian-friendly elements (e.g. benches)
-   **Fragmented streetscape language**: mix of modern fixtures next to landmark façades undermines sense of place

### Interventions

-   **Removing parking space**: provide more space for pedestrain
-   **Pavement expansion**: provide more space for walking, accessibility, and outdoor seating and will have more foot traffic & higher retail engagement
-   **Adding historically inspired design elements**: like historic barriers, retro-style streetlights, and vintage benches to create a historical and attractive environment for both residents and visitors

### Estimate Cost

| Element                    | Estimated Cost per Unit     | Total Units (Approx.) | Total Cost Estimate       |
| -------------------------- | --------------------------- | --------------------- | ------------------------- |
| Vintage Bench              | \$2,000 – \$4,000 per bench | ~5 – 8                | ~\$10,000 – \$32,000      |
| Historic Barrier           | \$500 – \$1,500 per section | ~8 – 12               | ~\$4,000 – \$18,000       |
| Retro Streetlight          | \$2,000 – \$8,000 per light | ~3 – 5                | ~\$6,000 – \$40,000       |
| Installation Costs         | \$500 – \$5,000 per element | –                     | ~\$4,000 – \$40,000       |
| Permitting & Misc.         | Varies (5–10 % of project)  | –                     | ~\$3,000 – \$10,000       |
| **Total Estimated Budget** | –                           | –                     | **~\$30,000 – \$110,000** |

### Estimate Timeline

| Phase                        | Time                |               |
| ---------------------------- | ------------------- | ------------- |
| Design & Planning            | 1 – 2 months        | Month 0 – 2   |
| Permitting & Approvals       | 2 – 4 months        | Month 2 – 6   |
| Procurement & Manufacturing  | 3 – 6 months        | Month 6 – 12  |
| Installation                 | 1 – 2 months        | Month 12 – 14 |
| **Total Estimated Timeline** | **≈ 7 – 14 months** |               |

### Estimate Impact

|               | Walkability Intervention (Phase 1)                                                                   | Aesthetic Intervention (Phase 2)                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Cost**      | Low (trial run)                                                                                      | Moderate                                                                         |
| **Trade-off** | Loss of parking may inconvenience visitors and residents who rely on cars                            | Long-term maintenance costs to keep the elements in good condition               |
| **Impact**    | More space for walking, accessibility, and outdoor seating → higher foot traffic & retail engagement | More historical and attractive environment → increased visitors & local commerce |
| **Summary**   | Prioritizing long-term pedestrian and business benefits                                              | Prioritizing historical enhancement                                              |

### Challenges and Strategies

-   **Funding**
    -   Public grants (historical preservation funds), private donors, and BID budgets
    -   Start with a trial project on a high-foot-traffic street, then expand based on success
    -   Consider public-private partnerships
-   **Permitting and Landmark Regulations**
    -   Work closely with city agencies (Landmarks Preservation Commission, NYC DOT) to ensure compliance
    -   Use historically accurate designs to gain faster approval
-   **Construction Disruptions**
    -   Schedule construction during low-traffic seasons to minimize disruptions
    -   Provide temporary pedestrian paths to maintain accessibility
    -   Offer business relief programs, such as temporary outdoor vending permits

# Prediction Analysis

## Streetscape Visualization

To visualize our proposed streetscape transformations, we developed [Stable Diffusion Street](https://github.com/ethan-yz-hao/stable-diffusion-street), an AI-powered street view image generator. This tool allows us to transform existing West Village street scenes while preserving their distinctive architectural character and spatial layout.

<iframe width="100%" height="600px" src="https://www.youtube.com/embed/5z-ai3G0_HQ" title="West Village Transformation Visualization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The tool offers several key features that were essential for our visualization process:

1. **Map & Image Acquisition**:

    - Interactive Map Interface for navigating and selecting West Village locations
    - Street View Capture functionality to directly capture representative street scenes
    - Image Upload capability for incorporating our own street photography

2. **Image Processing**:

    - Semantic Segmentation to automatically identify sidewalks, roads, buildings, and other urban elements
    - Structure-Preserving Editing to maintain the original street layout while implementing changes

3. **Editing Tools**:

    - Segmentation Editing through ControlNet to modify specific elements like sidewalk width
    - Preservation Masking to protect the West Village's iconic architectural facades

4. **Generation**:
    - Text-Prompt Generation to transform scenes based on our design specifications (e.g., "historic street furniture," "vintage lighting")

Using these features, we created before-and-after visualizations that demonstrate how our proposed interventions would enhance the pedestrian experience while respecting the neighborhood's historic character. The visualizations clearly illustrate the potential improvements in walkability, aesthetic cohesion, and public space utilization that align with our transformation goals.

## Economic Impact

### Business Activities

There are some BID made similar improvements. In Brooklyn's Dumbo section, the retail sales jumped **172%** three years after the first pedestrian plaza opened. On Pearl Street, sales during peak seasons increased **14%** in stores along a mini plaza. Open Streets corridors provided an averaging **19%** sales boost for restaurants and bars.

Therefore, the interventions should also lead to a **20%** increase in business activities.

### Employment Opportunities

Long-Term Growth in Tourism will create more Employment Opportunities and increasing the local economy. Restaurants, retail shops, guided tours, and artisan markets need more staff to run the business.
Based on **20%** increase, this is estimate increase of job opportunities.

|                     | Current Employment | Predicted Employment (Post-Intervention) | Net Gain |
| ------------------- | ------------------ | ---------------------------------------- | -------- |
| Cafés & Restaurants | 150                | 180                                      | +30      |
| Retail Shops        | 50                 | 60                                       | +10      |
| Guided Tours        | 10                 | 15                                       | +5       |
| Artisan Markets     | 8                  | 12                                       | +4       |

# Consensus Analysis

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et tortor eget magna consequat tincidunt. Phasellus neque nulla, finibus ac sollicitudin non, convallis vel nisi. Etiam auctor placerat faucibus. Ut vitae mollis ante, et tempus mauris. Quisque ac urna purus. Aliquam vulputate molestie lectus, non volutpat risus vehicula luctus. Aenean ac quam eu purus eleifend placerat at eget diam. Morbi dapibus at elit in convallis. Mauris posuere leo quam, vitae fringilla leo tempor vel. Ut quis mi porta, suscipit ligula ac, consequat leo. Cras id imperdiet lectus. Aenean quis arcu nisi. Nulla vel nisl eu eros finibus auctor ac ut urna. Suspendisse ac luctus arcu.

Donec vitae justo vitae turpis rutrum vestibulum vel at tortor. Aliquam quis tellus ut quam viverra fermentum in vitae nulla. Sed mattis accumsan libero, vel sollicitudin ante fringilla at. Nulla facilisi. Duis dignissim varius est, nec dignissim eros. Nullam orci risus, fermentum eu faucibus sit amet, laoreet quis eros. Proin bibendum, metus id bibendum pretium, quam urna dapibus leo, eget tempor magna sem at purus. Praesent faucibus dui id varius elementum. Sed consectetur, orci id rhoncus eleifend, enim magna pellentesque ante, et ornare lectus diam sit amet diam. Integer at magna et arcu iaculis consectetur at dictum lacus.

## Additional Resources

-   [West Village BID Website](https://westvillagebid.org/)
-   [Annual Report (PDF)](https://westvillagebid.org/annual-reports/)
-   [NYC Small Business Services - BID Directory](https://www1.nyc.gov/site/sbs/neighborhoods/business-improvement-districts.page)
