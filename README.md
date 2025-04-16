# BIDSpec Project Website

This is the official website for the BIDSpec (Business Improvement District) project from Cornell Tech. Built with [Astro](https://astro.build/), the site showcases our research on Business Improvement Districts (BIDs) and their impact on urban development and community engagement.

## [FOR STUDENTS] Editing Guidelines. 

Project pages are stored in src/content/projects/BID_NAME.md. Your BID should already have a file for it created. In this file, you will see a header at the top with metadata for your BID (general info about the BID, etc.). Also of note are the *component* fields. These correspond to the visualizations to be rendered for your Insight, Transformation, Prediction, and/or Consensus portions of your analysis. Put code for your visualizations in /src/components/groups/BID_NAME/ , and reference them appropriately in the header of your markdown file. 

Please do NOT change the first-level section titles (#Insight Analysis, etc.). I have regex that searches for these headers and puts the interactive components in the correct location. Feel free to add your own second-level (##) and third-level (###) headers. 

**Please do not push directly to the repo. Instead, add your content and code on branches, and submit pull requests. I will review code and approve pull requests.** 

If you need to add extra modules to the project, please email me at mwf62@cornell.edu, and I can install them into the project environment.

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

## Contact

For more information about the BIDSpec project, please contact [project email/contact].
