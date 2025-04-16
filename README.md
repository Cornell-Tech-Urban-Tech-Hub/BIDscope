# BIDSpec Project Website

This is the official website for the BIDSpec (Business Improvement District) project from Cornell Tech. Built with [Astro](https://astro.build/), the site showcases our research on Business Improvement Districts (BIDs) and their impact on urban development and community engagement.

## [FOR STUDENTS] Editing Guidelines. 

Project pages are stored in src/content/projects/BID_NAME.md. Your BID should already have a file for it created. In this file, you will see a header at the top with metadata for your BID (general info about the BID, etc.). Also of note are the *component* fields. These correspond to the visualizations to be rendered for your Insight, Transformation, Prediction, and/or Consensus portions of your analysis. Put code for your visualizations in /src/components/groups/BID_NAME/ , and reference them appropriately in the header of your markdown file. 

Please do NOT change the first-level section titles (#Insight Analysis, etc.). I have regex that searches for these headers and puts the interactive components in the correct location. 


## About BIDSpec

BIDSpec is a comprehensive analysis platform for Business Improvement Districts, providing insights into how these special assessment districts function, their economic impact, and their role in urban development. The project combines geospatial data visualization, economic analysis, and policy research to create a holistic understanding of BIDs across various cities.

## Development

### Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                             |
| :-------------------- | :------------------------------------------------- |
| `pnpm install`        | Installs dependencies                              |
| `pnpm dev`            | Starts local dev server at `localhost:4321`        |
| `pnpm build`          | Build your production site to `./dist/`            |
| `pnpm preview`        | Preview your build locally, before deploying       |
| `pnpm astro ...`      | Run CLI commands like `astro add`, `astro preview` |
| `pnpm astro --help`   | Get help using the Astro CLI                       |

## Technical Overview

### Built with Astro

This website is built using Astro, a modern static site generator that delivers excellent performance by shipping minimal JavaScript.

### TailwindCSS

The site uses TailwindCSS for styling, a utility-first CSS framework that enables rapid UI development.

### Components

The website features several custom components:
- Interactive maps showing BID locations and boundaries
- Data visualization tools for BID financial analysis
- Project showcase highlighting specific BID case studies
- Comparative analysis of BID structures across different cities

## Project Structure

- `/src/pages/` - Page templates including the main index
- `/src/components/` - UI components organized by function
- `/src/layouts/` - Layout templates for consistent page structure
- `/public/` - Static assets like images, logos, and geospatial data

## Deployment

The site is deployed at [urban.tech.cornell.edu/bidspec](https://urban.tech.cornell.edu/bidspec) via GitHub Pages.

## Team

- Matt Franchi - Computer Science PhD Candidate
- [Additional team members]

## Contact

For more information about the BIDSpec project, please contact [project email/contact].
