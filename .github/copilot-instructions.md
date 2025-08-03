<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Portfolio Project Instructions

This is a Next.js 14 project with TypeScript and Tailwind CSS using the App Router. The project is structured as a portfolio website with both public-facing portfolio sections and protected admin sections for content management.

## Project Structure
- Uses Next.js App Router with route groups for organization
- Admin routes are protected under the `(admin)` route group
- Portfolio public pages are under the `(portfolio)` route group
- API routes provide backend functionality
- Components are organized by feature area

## Key Technologies
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Route groups for logical organization

## Code Style Guidelines
- Use TypeScript interfaces for all data types
- Follow Next.js App Router conventions
- Use Tailwind CSS for all styling
- Implement responsive design patterns
- Use server components by default, client components only when needed
