Create a new React Router v7 route following the project's established folder structure pattern.

**Usage:** Create route for `{route-name}` (replace with your desired route name) 

**Route Structure Requirements:**
- Use kebab-case for route names (e.g., `user-profile`, `article-single`)
- Create the main folder: `app/routes/{route-name}/`
- Include required `route.tsx` file
- Optionally add: `loader.ts`, `action.ts`, `meta.ts`, `types.ts`, `{route-name}.data.ts`
- Create `components/` folder for route-specific components
- Create `partials/` folder for page sections/partials
- Use `.component.tsx` suffix for components
- Use `.partial.tsx` suffix for page sections

**File Templates:**
- `route.tsx` - Main route component with proper imports and composition
- `loader.ts` - Server-side data loading with Response.json() returns
- `action.ts` - Form submissions with proper validation
- `meta.ts` - SEO metadata and page titles
- `types.ts` - TypeScript interfaces for route data
- `{route-name}.data.ts` - Static data and constants

**Code Standards:**
- Use single quotes, 2-space indentation
- Follow import order: React Router → React → third-party → app imports
- Use named exports for all functions
- Implement proper TypeScript types
- Use Response.json() or new Response() for server returns
- Ensure accessibility with semantic HTML and ARIA labels

**Examples:**
- Simple route: `app/routes/about/route.tsx`
- Complex route: `app/routes/articles/article-single/` with full structure
- Resource route: `app/routes/navbar/route.ts` (data only, no UI)

**Instructions:**
1. Replace `{route-name}` with your desired route name (use kebab-case)
2. Specify which files you need (route.tsx, loader.ts, action.ts, meta.ts, types.ts, data.ts)
3. Indicate if you need components/ and partials/ folders

Return the complete folder structure with all necessary files and boilerplate code following React Router v7 best practices.
