---
# Basic Project Information
title: "5th Avenue BID - Brooklyn"
description: "Analysis of the 5th Avenue Business Improvement District in Park Slope, Brooklyn."
publishDate: 2023-09-15
updatedDate: 2023-10-01
thumbnail: "/src/components/groups/fifth-avenue-brooklyn/5th_thumbnail.png"

# BID-specific Information
bidName: "Park Slope 5th Avenue"
borough: "Brooklyn"
yearEstablished: 1992

# Content Classification
featured: true
draft: false
revisionMode: false
tags: ["Retail", "Small Business", "Community Development"]

# Visualization Component References - empty arrays to be filled by students


# No components, We show only static images, not .jsx elements
insightComponents: ["/components/groups/fifth-avenue-brooklyn/5th_avenue_nlp.png", "/components/groups/fifth-avenue-brooklyn/5th_avenue_nlp2.png"]
transformationComponents: ["/components/groups/fifth-avenue-brooklyn/average_streetmix.png"]
predictionComponents: ["/components/groups/fifth-avenue-brooklyn/floodnet_elevation.png", "/components/groups/fifth-avenue-brooklyn/floodnet_flood_map.png"]
consensusComponents: [/components/groups/fifth-avenue-brooklyn/consensus.png]

---

The 5th Avenue Business Improvement District serves one of Brooklyn's most vibrant commercial corridors in Park Slope. Established in 1992, the BID supports approximately 500 businesses along a 1.5-mile stretch of 5th Avenue from Dean Street to 18th Street. The district is known for its eclectic mix of independent retailers, restaurants, and service businesses.

# Insight Analysis

To obtain a better understanding of Park Slope's 5th Avenue, we interviewed a diverse range of stakeholders, including business owners, employees, long-time residents, and newcomers. Several key themes emerged from these conversations. Participants consistently highlighted Park Slope's supportive atmosphere for local enterprises. The walkable nature of the neighborhood was frequently mentioned as a significant asset. The varied population was cited as contributing to the area's unique character and appeal. Respondents also valued the gatherings that bring residents together and foster neighborhood cohesion.

The Fifth Avenue BID strengthens community ties and supports local businesses through various initiatives. Annual family-friendly events include the holiday tree lighting at 4th Street Plaza and free children's workshops in partnership with organizations like the Textile Arts Center and Private Picassos. The BID also cultivates community partnerships, collaborating with the Park Slope Jewish Center on community projects and supporting local sustainability efforts.

These events serve multiple purposes. They attract foot traffic that boosts sales for local shops, cafes, and restaurants. They draw and retain residents who contribute to long-term local stability. Perhaps most importantly, they foster a sense of belonging and community pride that defines Park Slope's character.

### Data-Driven Insights
To ground our work in local perspectives, we analyzed community-generated data using natural language processing (NLP) techniques. We performed Topic modeling analysis of hundreds of online reviews, testimonials, and social media posts related to 5th Avenue revealed recurring themes shown in Insight Visualization 1 (word clouds) and Insight Visualization 2 (pipeline).

Residents and visitors frequently comment on 5th Avenue's active street life with vibrant pedestrian activity at various times of day. There's widespread appreciation for the diverse dining and retail options that line the avenue. During the COVID-19 pandemic, safety concerns became more prominent in community discussions, though many praised the area's resilience. The Open Streets initiative received positive reception, with many valuing these pedestrian-friendly spaces. In recent years, there's been increasing attention to green infrastructure and environmental practices, reflecting the community's forward-thinking values and growing recognition of climate vulnerabilities that threaten both businesses and residential areas. 


### COVID & Open Streets

On the other hand, the residents and business owners of Park Slope faced many hardships during the COVID-19 pandemic. We spoke to Brooklynites about the impact. Many small businesses struggled to keep up revenue & pay rent. For some, financial hardship lead them to closing permanently. However, the Open Streets Program transformed sections of 5th Avenue into pedestrian-friendly zones and allowed for outdoor dining helped local businesses sustain revenue. 

Unfortunately, the Open Streets Program has faced issues securing funding for some years. When the program was revoked in March 2024, 5th Avenue merchants formed their own association, partnering with New York Presbyterian Hospital, U. Santini Moving & Storage, and the NYC Department of Transportation. While they were only approved for a scaled-down version, with a reduced footprint from 16 blocks to 4 blocks, operating every Saturday from May to November. Nonetheless, 5th Avenue continues to push for policies that support affordability and long-term sustainability for Park Slope’s independent businesses.

### The Climate Imperative

The community's increasing focus on sustainability and environmental practices has proven especially crucial as Park Slope faces growing climate challenges. Beyond aesthetic improvements, these environmental concerns have become an existential priority for the neighborhood's businesses and residents alike.

In recent years, this particular area in Brooklyn has seen severe flooding instances. Joanna Tallantire, Executive Director of the Park Slope Fifth Avenue BID, was quoted in the Brooklyn Paper in 2023: “...over 30 businesses on 5th Avenue in Park Slope experienced up to six feet of water in their basements, destroying equipment and inventory” (Fishman). This severe flooding caused substantial damage to businesses within the BID. The overwhelmed local infrastructure eventually led to projects that aim to combat and prevent flooding in Park Slope. For example, The NYC Department of Environmental Protection (DEP) has since installed "...70 curbside rain gardens and Green Infrastructure playgrounds at P.S. 282 in Park Slope and P.S. 38 in Boerum Hill...allowing stormwater to be naturally absorbed into the ground, thereby keeping it out of the sewer system where it could contribute to flooding and overflows into the Canal" (DEP). This approach notes the curvature of the land in Park Slope. From prior reports, it is clear that flooding is far more severe near the Gowanus Canal as well as near 3rd and 4th Avenues. However, 5th Avenue sits atop the slope. Focusing on preventing stormwater runoff from reaching the lower avenues can allow for less flooding altogether. 

In October 2024, “Vice President Kamala Harris, as part of the Biden administration, supported one of the largest federal investments in cleaning up legacy pollution through the Bipartisan Infrastructure Law, which earmarked $3.5 billion toward environmental remediation at Superfund sites” (EPA). The Gowanus Canal was also listed as a Superfund Site. In November 2024, the NYC Department of Design and Construction completed a $40.7 million project in Park Slope, replacing over 1.6 miles of older water mains and upgrading local combined sewers to improve stormwater drainage (NYC BERS). Later, in January 2025, $160 million in federal funding was secured to enhance climate resiliency efforts across New York City, including areas like Park Slope. (Brooklyn Eagle). 

Our research uncovered numerous multi-million and even billion-dollar projects aimed at flood mitigation and strengthening climate resilience. However, none were aimed at mitigating rainfall that trickled down from 5th avenue to avenues with lower altitudes. From this, we noticed an opportunity with intercepting and managing water before it reaches 4th Avenue and below. 

# Transformation Analysis

In an effort to aid the issues we’ve mentioned so far, we propose assisting in flood prevention methods while also redesigning streets to accommodate and encourage the Open Streets Initiative. 

There is a range of improvements we can make to 5th Avenue that will allow it to become a proactive area for flood mitigation. Expanding rain gardens, bioswales, and permeable surfaces to absorb excess rainwater naturally can aid in green stormwater management. As shown in Transformation Visualization, we used Streetmix to show some examples of improvements (discussed further). Installing strategic water catchment areas to prevent overflow into vulnerable streets via retention basins and flood barriers can further contribite to flood prevention. Lastly, using sensors and real-time monitoring to optimize water flow and prevent backups via smart drainaige systems can assure that sewers do not go beyong their capacity. 

To fund improvements, we suggest reallocating a portion of the Gowanus Canal Superfund investment toward upstream flood prevention, especially on 5th Avenue because keeping water from reaching 4th Avenue now will reduce future remediation costs downstream. We also see potential in local revenue tools, like shoreline protection districts, targeted taxes, or partnerships with the insurance industry where insurers could invest in risk reduction that directly benefits their bottom line. We suggest a public-private partnership model. Local businesses, whose storefronts and operations are directly affected by flooding could co-fund the project, while federal Superfund dollars would match private contributions.

And lastly, transforming community outreach by partnering with more public schools to install rain gardens, launching a “Resilient Open Streets” model where public funding supports community-led maintenance, and adding educational signage will help residents understand and contribute to flood mitigation efforts. 


# Prediction Analysis

###  Flooding Sources – 5th Avenue BID

While 5th Avenue sits at a higher elevation, GAMA simulations and community input reveal that the corridor remains vulnerable to several systemic flood risks:

- **Stormwater Runoff (High Risk)**  
  The natural slope of Park Slope funnels rainwater downhill. Without sufficient green infrastructure, 5th Avenue channels excess water toward lower avenues, especially during heavy rain events.

- **Combined Sewer Backflow (Medium Risk)**  
  During high-intensity storms, NYC’s combined sewer system can overflow. GAMA models indicate potential for basement-level flooding along 5th Avenue through backflow in drainage lines.

- **Insufficient Onsite Absorption (High Risk)**  
  GAMA simulations highlight the lack of permeable surfaces and bioswales, showing minimal water retention on-site. This exacerbates runoff and reduces flood buffering capacity.

- **Lateral Spillover from Adjacent Areas (Low–Medium Risk)**  
  Severe flooding in lower zones (like 4th Ave and near Gowanus) can extend laterally via intersecting side streets, creating secondary risks for the BID area.

>  **GAMA Insight:**  
> Under high-risk scenarios, cells around 5th Avenue show increasing water height over time, especially in areas near side streets and drains. Without interventions, simulations project overflow cascading from elevated areas into low-lying zones — a problem preventable with upstream retention.

> *Conclusion: Preventing flooding on 5th Avenue is less about direct rainfall and more about managing how the corridor interacts with larger urban drainage systems. GAMA confirms that targeted interventions—bioswales, permeable sidewalks, and smart drainage—can intercept runoff and protect both 5th Avenue and downstream neighborhoods.*


Our analysis utilizes three complementary simulation tools to evaluate different scenarios for 5th Avenue and their impact on the broader Park Slope area:

- StreetMix: Measures changes in foot traffic, flood prevention effectiveness, and traffic congestion based on different street configurations.  
- FloodNet: Visualizes flooding patterns from the Gowanus Canal during major storm events, based on elevation data.  
- GAMA: Models localized flooding from rainfall and storms showing water diffusion and barrier effectiveness. GAMA depicts generic flooding behavior across the terrain, regardless of whether water originates from rainfall, canal overflow, or runoff.

We modeled three distinct scenarios to assess potential interventions:


The FloodNet Elevation Map in Prediction Visualization 1 clearly illustrates the topographical reality of Park Slope - a neighborhood that truly lives up to its name. The color gradient shows how 5th Avenue sits at a significantly higher elevation (depicted in orange-yellow tones) compared to the progressively lower-lying areas to the west. The Gowanus Canal and its immediate surroundings (shown in blue-green) represent the lowest points in the area.

The Flood Vulnerability Map in Prediction Visualization 2 demonstrates the direct consequences of this elevation differential. Areas along the Gowanus Canal and 3rd Avenue display high vulnerability to flooding (indicated by the intense red zones), while vulnerability gradually decreases as elevation increases eastward toward 5th Avenue. This clear visual correlation between elevation and flood risk validates our upstream intervention approach.

By implementing water management solutions at 5th Avenue's higher elevation, we can intercept rainwater before it naturally flows downhill, preventing the accumulation of stormwater in the more vulnerable lower-lying areas. This preventative strategy addresses flooding at its source rather than merely reacting to flooding events after they've occurred in the canal area.

### View 1: Average Flooding/Baseline Scenario
This view represents the current state of 5th Avenue with existing infrastructure and typical flooding patterns.

<figure>
  <img
  src="/components/groups/fifth-avenue-brooklyn/average_streetmix.png"
  alt="Figure 1. StreetMix View 1: Baseline Scenario">
  <figcaption>Figure 1. StreetMix View 1: Baseline Scenario</figcaption>
</figure>

The current street design includes standard sidewalks, transit shelters, bicycle lanes, and parking areas, but lacks significant water management features. Two trees provide minimal stormwater interception.

<figure>
  <img src="/components/groups/fifth-avenue-brooklyn/average-gama.gif" alt="Figure 2. GAMA View 1: Average Flooding Scenario"/>
  <figcaption>Figure 2. GAMA View 1: Average Flooding Scenario</figcaption>
</figure>

### Baseline Flooding Conditions in GAMA Model

The GAMA model reveals important baseline conditions:

- All cells start with low water height (~2.0).
- The **Fifth Avenue BID area** consistently exhibits *lower water levels* (light blue), indicating partial inundation but reduced severity compared to surrounding regions.
- The **BID polygon border** functions as a passive containment zone that limits water exchange.
- The **interior maintains lower water accumulation**, suggesting that its elevated position provides **partial protection** under low-risk scenarios.
- The **square-shaped BID polygon** reflects the inclusion of not only Fifth Avenue but also **adjacent areas along 3rd and 4th Avenues**, capturing the broader commercial and mixed-use zone it is meant to represent.

> This confirms that while Fifth Avenue’s topography helps **mitigate flood intensity** during minor events, it does **not fully prevent water intrusion** and offers limited protection to downstream areas such as the **Gowanus Canal**.


### View 2: Increased Flooding/High-Risk Scenario
This view illustrates what happens during severe weather events with the current infrastructure.

<div style="display: flex; gap: 1rem;">
<figure style="width: 33%;">
  <img
  src="/components/groups/fifth-avenue-brooklyn/increased_streetmix.png"
  alt="Figure 3.1. StreetMix View 2: High-Risk Scenario">
  <figcaption>Figure 3.1. StreetMix View 2: High-Risk Scenario</figcaption>
</figure>

<figure style="width: 33%;">
  <img
  src="/components/groups/fifth-avenue-brooklyn/increased_flood_streetmix.gif"
  alt="Figure 3.2. StreetMix Simulation: Increased Flooding Scenario"/>
  <figcaption>Figure 3.2. StreetMix Simulation: Increased Flooding Scenario</figcaption>
</figure>

<figure style="width: 33%;">
  <img
  src="/components/groups/fifth-avenue-brooklyn/increased_flood_street.png"
  alt="Figure 3.3. Street Gen: Street view generated similar to StreetMix design for High-Risk scenario"
  style="width: 100%; height: 185px; object-fit: cover;" >
  <figcaption>Figure 3.3.  Street Gen: Street view generated similar to StreetMix design for High-Risk scenario</figcaption>
</figure>
</div>

During heavy rainfall, the current configuration fails to adequately manage stormwater, leading to reduced pedestrian activity as the street becomes less hospitable.

<!-- ![Figure 4. GAMA View 2: Increased Flooding Scenario] -->

<figure>
  <img
  src="/components/groups/fifth-avenue-brooklyn/increased_gama.gif"
  alt="Figure 4. GAMA View 2: Increased Flooding Scenario"/>
  <figcaption>Figure 4. GAMA View 2: Increased Flooding Scenario</figcaption>
</figure>

The integrated simulation demonstrates severe flooding dynamics:
- Gowanus Canal overflows into surrounding area triggered by heavy rainfall
- All cells begin to flood; BID area gradually floods as dykes are overwhelmed
- Simulations show real-time water diffusion and barrier failure, helping visualize how low-lying areas transition from dry to saturated.

> While the barrier/dyke model in GAMA does **not replicate engineered flood infrastructure in precise detail**, it effectively simulates the **basic protective function** of elevation-based or physical boundaries—such as raised sidewalks, berms, or zoning boundaries—that slow water ingress.
>
> Even though the **Fifth Avenue BID border lacks a physical barrier**, simulating it as a **virtual containment zone** allows planners to:
> - Visualize the impact of **zoning boundaries** on flood behavior
> - **Estimate timing of flood onset** in targeted commercial zones
> - Explore **policy-driven interventions** (e.g., permeable pavement, green buffers) within a defined footprint
>
> This abstraction is useful for **urban planning and resilience testing**, helping stakeholders prioritize areas for real-world flood mitigation strategies.



The aerial view clearly shows the spread of floodwaters across lower-elevation areas, with 5th Avenue serving as a conduit that channels water toward lower avenues rather than absorbing or redirecting it.

### View 3: Reduced Flooding/Intervention Scenario

This view represents our proposed intervention scenario with enhanced green infrastructure and stormwater management.

<div style="display: flex; gap: 1rem;">
<figure style="width: 33%;">
  <img
  src="/components/groups/fifth-avenue-brooklyn/reduced_streetmix.png"
  alt="Figure 5.1. StreetMix View 3: Intervention Scenario">
  <figcaption>Figure 5.1. StreetMix View 3: Intervention Scenario</figcaption>
</figure>

<figure style="width: 33%;">
  <img
  src="/components/groups/fifth-avenue-brooklyn/reduced_flood_streetmix.gif"
  alt="Figure 5.2. StreetMix Simulation 2: Reduced Flooding Scenario"/>
  <figcaption>Figure 5.2. StreetMix Simulation: Reduced Flooding Scenario</figcaption>
</figure>

<figure style="width: 33%;">
  <img
  src="/components/groups/fifth-avenue-brooklyn/reduced_flood_street.png"
  alt="Figure 5.2. Street Gen: Street view generated similar to StreetMix design for Intervention scenario"
  style="width: 100%; height: 185px; object-fit: cover;" />
  <figcaption>Figure 5.2. Street Gen: Street view generated similar to StreetMix design for Intervention scenario</figcaption>
</figure>
</div>

The redesigned street features expanded sidewalks, improved transit infrastructure, and critically, increased vegetation and permeable surfaces. The street view image reveals a dramatically greener environment, with tree canopy coverage significantly higher than in the current configuration.

<figure>
  <img
  src="/components/groups/fifth-avenue-brooklyn/reduced_gama.gif"
  alt="Figure 6. GAMA View 3: Reduced Flooding Scenario"/>
  <figcaption>Figure 6. GAMA View 3: Reduced Flooding Scenario</figcaption>
</figure>


The GAMA simulation results demonstrate the effectiveness of the intervention:

- BID area and surroundings are affected by increased water levels
- Vegetation (green patches) appear as water recedes and cells near the BID
- The intervention successfully manages the water that would otherwise flow downhill

The aerial view shows reduced blue coloration in lower areas, indicating that the 5th Avenue interventions are successfully intercepting and managing stormwater before it can accumulate downstream.

### Key Findings

The intervention scenario demonstrating reduced funding shows that strategic modifications to 5th Avenue can have dual benefits: improved business conditions through enhanced foot traffic and aesthetics, alongside significant flood prevention capacity that protects not just 5th Avenue but the downstream neighborhoods as well.

Firstly, upstream flood prevention is critical and effective. Our simulations validate that targeted green infrastructure along 5th Avenue—Park Slope's higher-elevation commercial spine—can significantly intercept and manage stormwater. By addressing runoff at the source, these interventions protect more vulnerable low-lying areas like 4th Avenue and the Gowanus Canal from severe flooding.

Notably, these changes leverage the momentum of the Open Streets initiative, which already reimagines parts of 5th Avenue as a more pedestrian-friendly space. While the redesign introduces disruption—shifting the corridor’s balance away from car traffic—it aligns with a broader citywide vision for accessible, community-first streetscapes. In this context, 5th Avenue becomes a testbed for resilient urban design, where stormwater solutions integrate naturally into public space upgrades.

Beyond flood mitigation, the proposed interventions also yield strong community and economic co-benefits. Enhanced streetscapes with widened sidewalks, tree canopy, and permeable surfaces transform 5th Avenue into a greener, more inviting corridor. This attracts foot traffic, increases dwell time, and boosts retail activity—directly benefiting local businesses participating in or adjacent to the Open Streets program.

Even with these transformations, traffic flow remains resilient. StreetMix models show that despite the introduction of bioswales, rain gardens, and pedestrian zones, vehicular disruptions are modest and remain within a manageable 10% threshold. This confirms the feasibility of integrating climate adaptation features without sacrificing transportation performance.

Ultimately, this is about more than risk mitigation—it’s about community-building. A redesigned 5th Avenue becomes a climate asset and a cultural one: a model for how urban corridors can embrace sustainability without losing identity. It offers Park Slope and surrounding areas not just protection, but pride and permanence in the face of climate change.

# Consensus Analysis

Achieving consensus on upstream flood prevention and green infrastructure redesign hinges on coordinated action across a diverse network of stakeholders. As shown in Consensus Visualization, core agencies like the DEP, DDC, DOT, and EPA are already engaged in parallel efforts, from stormwater management to Superfund remediation. Their technical expertise and regulatory authority make them essential partners in implementing infrastructure changes along 5th Avenue. At the same time, civic tech groups and academic experts provide critical support for modeling and analysis, while insurers represent a promising avenue for co-funding through risk reduction strategies.

Equally important are the community voices shaping and experiencing these changes firsthand. Residents, school leaders, and business owners along 4th and 5th Avenues are not only impacted by flooding but also stand to benefit most from a greener, more resilient corridor. Organizations like the Fifth Avenue BID and Gowanus Canal Conservancy bridge institutional and local knowledge, ensuring our interventions reflect both environmental science and neighborhood priorities. Through targeted outreach—policy briefs for officials, hands-on workshops for residents, and collaborative dashboards for experts—we’re building shared understanding and mutual investment. Consensus here isn’t uniform agreement; it’s a shared framework where every group has tools to visualize, evaluate, and act on a better future.

## References

- [5th Avenue BID Website](https://parkslopefifthavenuebid.com/)
- [Annual Report (PDF)](https://parkslopefifthavenuebid.com/annual-reports/)
- [NYC Small Business Services - BID Directory](https://www1.nyc.gov/site/sbs/neighborhoods/business-improvement-districts.page)
- [5th Avenue Streetmix](https://streetmix.net//2882362) (Streetmix.net, 2025). Accessed 4 Mar. 2025.

- [After a Century of Flooding on Brooklyn’s Fourth Avenue, City Says It’ll Be Fixed ... By 2033](https://nyc.streetsblog.org/2023/10/06/afteracenturyoffloodingonbrooklynsfourthavenuecitysaysitllbefixedby2033) (Streetsblog.org, 6 Oct. 2023). Accessed 3 Mar. 2025.

- [Bioswales | LID SWM Planning and Design Guide](https://wiki.sustainabletechnologies.ca/wiki/Bioswales) (Sustainabletechnologies.ca, 2022). Accessed 22 Mar. 2025.

- [City Upgrades over 1.6 Miles of Water Mains in Park Slope and Renovates Flatbush Avenue Plaza](https://www.bers.nyc.gov/site/ddc/about/pressreleases/2024/pr110124ParkSlope.page) (Nyc.gov, 2024). Accessed 10 Feb. 2025.

- [Cleaning up Superfund Sites: Highlights of Bipartisan Infrastructure Law Funding](https://www.epa.gov/infrastructure/cleaningsuperfundsiteshighlightsbipartisaninfrastructurelawfunding) (US EPA, 6 Oct. 2022). Accessed 3 Mar. 2025.

- [Gowanus Framework | DCP](https://www.nyc.gov/site/planning/plans/gowanus/gowanusframework.page) (Nyc.gov, 2021). Accessed 3 Mar. 2025.

- [Improving Water Efficiency: Residential Bioswales and Bioretention Ponds](https://www.asla.org/bioswales.aspx) (Asla.org, 2024). Accessed 5 Mar. 2025.

- [NYC Recommends Plan for Flood Infrastructure without Federal Money](https://www.bloomberg.com/news/articles/20250317/nycrecommendsplanforfloodinfrastructurewithoutfederalmoney?srnd=homepageamericas&sref=8DkxYiqF) (Bloomberg.com, 17 Mar. 2025). Accessed 24 Mar. 2025.

- [NYC Seeks Flood Protection Financing without Federal Funds](https://www.credaily.com/briefs/nycseeksfloodprotectionfinancingwithoutfederalfunds/) (CRE Daily, 19 Mar. 2025). Accessed 24 Mar. 2025.

- [Mayor Adams, EPA Break Ground on $1.6 Billion Project to Protect Gowanus Canal from Sewage Overflow](https://www.nyc.gov/officeofthemayor/news/18623/mayoradamsepabreakground16billionprojectprotectgowanuscanalsewage) (City of New York). Accessed 3 Mar. 2025.

- [Dredging the Gowanus Canal Will Likely Continue – regardless of the next President](https://www.cityandstateny.com/policy/2024/10/dredginggowanuscanalwilllikelycontinueregardlessnextpresident/400547/) (McPartland, Janna. *City & State NY*, 25 Oct. 2024). Accessed 3 Mar. 2025.

- [Money Problems: Brooklyn’s Fifth Ave. Open Street Loses Sponsor, While Vanderbilt Gets Trimmed](https://nyc.streetsblog.org/2024/03/07/moneyproblemsbrooklynsfifthaveopenstreetlosessponsorwhilevanderbiltgetstrimmed) (*Streetsblog New York City*, 7 Mar. 2024). Accessed 6 Feb. 2025.

- [Newly Completed $54 Million Storm Sewer Project Alleviates Flooding along 3rd Avenue in Gowanus](https://www.nyc.gov/site/dep/news/23032/newlycompleted54millionstormsewerprojectalleviatesflooding3rdavenuegowanus/0) (*City of New York*, July 2023). Accessed 10 Feb. 2025.

- [Map of NYC Neighborhoods (60.jpg)](https://www.nyc.gov/assets/sbs/images/content/neighborhoods/maps/60.jpg) (*Nyc.gov*, 2025). Accessed 12 Feb. 2025.

- [Brooklyn Businesses Struggle to Recover after Record-Breaking Rains](https://www.brownstoner.com/brooklynlife/brooklynbusinessesfloodrecovery/) (*Brooklyn Paper*, *Brownstoner*, 9 Oct. 2023). Accessed 12 Feb. 2025.

- [Facing a Future Shaped by Climate Change, Brooklyn Prepares for Hotter Summers and More Intense Storms](https://www.brooklynpaper.com/bkpreparesfutureclimatechange/) (*Brooklyn Paper*, 4 Dec. 2023). Accessed 12 Feb. 2025.

- [Park Slope Fifth Avenue BID Helps Local Retailers Rebound from Pandemic](https://www.citybiz.co/article/288308/parkslopefifthavenuebidhelpslocalretailersreboundfrompandemic/) (Parker, Kevin. *Citybiz*, 5 July 2022). Accessed 12 Feb. 2025.

- [Park Slope Residents Connect over Rising Flood Risks and Growing Climate Concerns](https://journalism.blog.brooklyn.edu/parksloperesidentsconnectoverrisingfloodrisksandgrowingclimateconcerns/) (*Brooklyn News Service*, *Brooklyn.edu*, 2024). Accessed 10 Feb. 2025.

- [Brooklyn’s Congressional Team Secures $160M to Improve Climate Resiliency](https://brooklyneagle.com/articles/2025/01/10/brooklynrepssecure160mforclimateresiliency/) (Staff, Brooklyn Eagle. *Brooklyn Eagle*, 10 Jan. 2025). Accessed 12 Feb. 2025.

- [What’s Happening to Open Streets?](https://www.curbed.com/article/openstreetsfinancialproblemsparkslope.html) (Velsey, Kim. *Curbed*, 12 Mar. 2024). Accessed 22 Mar. 2025.

- [What Are Rain Gardens? Benefits to Your Landscape Design](https://warelandscaping.com/resources/raingarden/) (Ware, Michael. *Ware Landscaping*, 21 Aug. 2024). Accessed 5 Mar. 2025.



