---
# Basic Project Information
title: "DUMBO Improvement District"
description: "Analysis of the DUMBO Improvement District in Brooklyn, an area known for its tech innovation and arts scene."
publishDate: 2023-09-25
updatedDate: 2023-10-10
thumbnail: "../../assets/placeholder.jpg"

# BID-specific Information
bidName: "DUMBO"
borough: "Brooklyn"
yearEstablished: 2006

# Content Classification
featured: true
draft: false
revisionMode: true
tags: ["Tech Hub", "Arts", "Waterfront", "Historic Industrial"]

# Visualization Component References - empty arrays to be filled by students
insightComponents: ["/components/groups/dumbo/york st station.JPG",
                    "/components/groups/dumbo/dock st.JPG"]
transformationComponents: ["/components/groups/dumbo/trail.png"]
predictionComponents: ["https://www.youtube.com/embed/rHzQ4340RnY", 
                        "https://www.youtube.com/embed/I_0m2gpL_gE"]
consensusComponents: ["/components/groups/dumbo/consensus 1.png", 
                        "/components/groups/dumbo/consensus 2.png"]

# Data Sources and techniques
dataSource: "NYC Open Data, DUMBO Improvement District Annual Reports, Census Data, Real Estate Market Data, Tourism Statistics"
visualizationTechniques: ["Time Series Analysis", "Comparative Metrics", "Spatial Analysis", "Economic Impact Assessment"]
---

Our project addresses the unique challenges facing one of Brooklyn’s most iconic neighborhoods. As a historic industrial district transformed into a thriving tech and creative hub, DUMBO suffers from extreme visitor concentration at a single photo location while many of its cultural and commercial assets remain underutilized. 

Our approach tackles this imbalance through strategic interventions that redistribute foot traffic, enhance the pedestrian experience, and activate underused public spaces. Based on interviews with residents, business owners, and visitors, we’ve developed solutions that benefit all stakeholders while preserving DUMBO’s distinctive character. 

One of the project’s transformations is the DUMBO Discovery Trail, a self-guided walking path connecting scenic views, cultural landmarks, and local businesses throughout the district. Complemented by targeted streetscape enhancements and strategic activation of underutilized spaces, our plan creates a more balanced, engaging, and economically vibrant neighborhood experience. 

Key Facts: 
- Location: DUMBO (Down Under the Manhattan Bridge Overpass), Brooklyn, NY
Challenge: 80% of visitors cluster at one photo spot (Washington St), straining infrastructure and limiting neighborhood exploration 
- Economic Context: Median income $163K (vs. NYC’s average of $55K)
- Neighborhood Assets: Iconic bridge views, cobblestone streets, 140+ art studios/galleries, Brooklyn Tech Triangle anchor (1,000+ tech firms) 
- Project Goal: Disperse tourist traffic, enhance the pedestrian experience, and activate underused public space 
![overview](/components/groups/dumbo/overview.jpg)


# Insight Analysis

Through interviews with tourists, local businesses, and visitors, research, and field visit to DUMBO, we observed a significant imbalance in how people experience the neighborhood, with most visitors gravitating to a single attraction while missing the area’s rich diversity. 

Washington Street’s famous Manhattan Bridge view has become a victim of its own Instagram success, creating severe bottlenecks that disrupt pedestrian flow and overwhelm local infrastructure. During peak hours, the concentration of tourists and photographers creates a congested environment that diminishes the experience for everyone. This over-concentration demonstrates a missed opportunity, as many visitors leave without experiencing DUMBO’s broader offerings. 

![washington](/components/groups/dumbo/Washington%20St.JPG)

Meanwhile, several potentially vibrant public spaces throughout the district sit underutilized. Areas like Dock Street, Anchorage Plaza, and the York Street subway entrance lack distinctive identity and programming, appearing as “dead zones” to visitors with no compelling reason to linger. These spaces have tremendous potential for activation through strategic interventions such as seating, public art, and temporary markets that could transform them into worthy destinations. 

The absence of an intuitive wayfinding system compounds these issues. Without clear signage or suggested routes, visitors struggle to discover attractions beyond Washington Street. Cultural venues, local businesses, and alternative viewpoints remain hidden gems, unknown to most tourists who visit. This navigation challenge prevents organic exploration and limits economic benefits from spreading throughout the neighborhood. 

Ultimately, DUMBO’s fundamental challenge is a disconnected visitor experience where scenic spots, shops, and cultural sites exist in isolation rather than as part of a cohesive journey. This fragmentation stems from a mismatch between the neighborhood’s potential (its diverse assets) and current perception (as a single-photo destination). Our interventions, therefore, focus on redistributing visitor density, enhancing physical and digital connectivity, and creating compelling reasons for exploration throughout the district. 


# Transformation Analysis

Based on our insights, our transformation aims at addressing DUMBO’s issues of tourist congestion, underutilized public spaces, and fragmented visitor experiences. We proposed two main transformations: the DUMBO discovery trail and streetscape enhancements. 

The first transformation is the creation of the DUMBO discovery trail. This is a self-guided walking path that links scenic views, cultural landmarks, small businesses, and art installations. The aim of this transformation is to disperse tourists beyond Washington Street by offering an intuitive, enriched, and more comprehensive exploration experience. There will be navigational signage and markers with QR codes to offer navigation assistance, historical context. There will also be seasonal themes (such as food, art, or heritage) that will encourage repeat visits. More importantly, the trail will also be integrated into major digital mapping platforms (e.g., Google Maps, Apple Maps), so visitors naturally encounter the trail when they open their apps in DUMBO. This multi-layered approach both physically and digitally weaves together DUMBO’s diverse attractions into a more cohesive journey that highlights DUMBO’s artistic characteristics and supports local business, while dispersing the tourist traffic on Washington Street. 

The second transformation focuses on streetscape enhancements in underused areas such as Dock Street, Anchorage Plaza, Water & Adams Street, and the York Street Subway entrance. These spaces currently lack comfort, events, and do not look as appealing as other areas in DUMBO. The streetscape enhancements include widening sidewalks, adding seating, integrating more planters, and creating flexible open spaces for rotating public art, performances, and markets. The design language will draw from DUMBO’s industrial heritage, using cobblestones, and materials like weathered steel and bricks, to ensure that improvements reinforce the neighborhood’s unique industrial identity. Furthermore, the addition of more art pieces will help reinforce DUMBO’s identity as a creative district. The goal is to make these currently underutilized spaces more comfortable, visually cohesive, and attractive to both visitors and residents, effectively transforming “dead zones” into vibrant secondary destinations.

Together, these transformations aim to redistribute foot traffic across DUMBO, enhance visitor engagement, support local businesses, and reinforce the area’s cultural and historical character, creating a richer and more sustainable urban experience.


# Prediction Analysis

To evaluate the effectiveness of our proposed crowd intervention strategies, we developed an agent-based simulation model using the GAMA platform to replicate tourist movement patterns in the DUMBO area. In the simulation, tourists enter the neighborhood from predefined entry points such as the subway station or Brooklyn Bridge, and proceed to explore the area based on their assigned behavioral profiles. Some tourists head directly to popular photo spots like the Manhattan Bridge, while others wander more randomly or follow interest-based paths. The model integrates real-world spatial data, including shapefiles for roads and buildings, and incorporates network-based pathfinding to ensure realistic movement along streets. By comparing scenarios with and without interventions—such as the addition of new attractions—we assessed the impact of these strategies on crowd distribution. The simulation results demonstrate that our intervention significantly dispersed tourist flows, reducing congestion at overly crowded landmarks and promoting a more balanced spatial distribution.

# Consensus Analysis

## Stakeholder Survey Engagement
To evaluate our transformation proposals with real stakeholders, we conducted on-site fieldwork in DUMBO again and asked 40 participants to do a survey. The participants included visitors, local business owners, and residents. The main part of the survey was to evaluate current and transformed spaces based on the before-and-after images. 

The survey results strongly validated our design direction. Transformed locations consistently received higher appeal scores than their current state. For example, the Water & Adams area improvement shows the most dramatic increase (from 2.9 to 4.5 on a 5-point scale). The majority of participants expressed a preference for wandering and exploring different parts of DUMBO rather than visiting only the famous photo spot, supporting our Discovery Trail concept. 


We also gained valuable insights into visitor types, with the data showing a diverse mix of sightseers (30.8%), culture and history enthusiasts (15.4%), food explorers (10.3%), and other categories that help calibrate our activation strategies. This real-world feedback provided empirical support for our hypothesis that visitors would enjoy a more distributed experience throughout DUMBO if appropriate infrastructure and wayfinding were in place. 


The survey data will serve as a powerful communication tool in our broader consensus-building efforts. We can present visual preference results to the DUMBO BID and NYC agencies to demonstrate public support, share tourist type data with local businesses to highlight economic benefits, and use the findings as a baseline for continued engagement throughout implementation. 

## Broader Stakeholder Strategy
Beyond our survey work, we identified key stakeholders whose input and support are essential for successful implementation, including: 
- DUMBO BID: Core implementation partner; coordinates with businesses, manages public space programming
- NYC DOT & DCP: Infrastructure approvals, street design changes, signage, and sidewalk updates
- Local Business Owners: Can help offer incentives, co-host events 
- Residents: Community stewards vital for long-term support and maintenance 
- Tourists & Visitors: End users whose behavior drives the success of the public space enhancements 

Our collaborative process will follow a four-stage approach: 
- Share & Visualize the Proposal: Present the Insight, Transformation, and Prediction narrative using visuals to make ideas clear for all audiences 
- Engage Stakeholders in Dialogue: Host workshops to gather input and surface priorities
- Collect Public Feedback: Use QR codes, surveys, and comment boards at proposed sites
- Prioritize & Adapt: Synthesize feedback to refine proposals and create a shared action plan 


## Additional Resources

- [DUMBO Improvement District Website](https://dumbo.org/)
- [Annual Report (PDF)](https://dumbo.org/annual-reports/)
- [NYC Small Business Services - BID Directory](https://www1.nyc.gov/site/sbs/neighborhoods/business-improvement-districts.page)