# Quickstart Guide: Member Management System (Frontend)

**Feature**: Member Management System
**Date**: 2025-12-09
**Purpose**: Step-by-step guide to set up and run the Vue 3 frontend application

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For version control
- **IDE**: VS Code recommended with extensions:
  - Volar (Vue Language Features)
  - TypeScript Vue Plugin (Volar)
  - ESLint
  - Prettier

## Project Initialization

### Step 1: Create Vue 3 + TypeScript + Vite Project

```bash
# Navigate to project root
cd /Users/benben/Documents/git-space.nosync/benben6515/metc

# Create Vite project with Vue + TypeScript template
npm create vite@latest . -- --template vue-ts

# If directory is not empty, confirm overwrite or use different approach
```

**Alternative if directory exists**:
```bash
# Initialize package.json if not exists
npm init -y

# Install core dependencies manually (see Step 2)
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install vue@^3.4.0
npm install vue-router@^4.2.0
npm install pinia@^2.1.0
npm install axios@^1.6.0
npm install quasar@^2.14.0
npm install @quasar/extras@^1.16.0

# Validation
npm install zod@^3.22.0

# Development dependencies
npm install --save-dev @vitejs/plugin-vue@^5.0.0
npm install --save-dev vite@^5.0.0
npm install --save-dev typescript@^5.3.0
npm install --save-dev @vue/tsconfig@^0.5.0

# Testing dependencies
npm install --save-dev vitest@^1.0.0
npm install --save-dev @vue/test-utils@^2.4.0
npm install --save-dev jsdom@^23.0.0

# Linting and formatting
npm install --save-dev eslint@^8.56.0
npm install --save-dev @vue/eslint-config-typescript@^12.0.0
npm install --save-dev prettier@^3.1.0

# Quasar Vite plugin
npm install --save-dev @quasar/vite-plugin@^1.6.0
```

## Configuration Files

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/styles/quasar-variables.sass'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api-frontend-interview-server.metcfire.com.tw',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/"
  }
}
```

### .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
```

## Project Structure Setup

### Create directory structure

```bash
# Create source directories
mkdir -p src/components/auth
mkdir -p src/components/members
mkdir -p src/components/common
mkdir -p src/pages
mkdir -p src/services/api
mkdir -p src/services/validation
mkdir -p src/stores
mkdir -p src/router
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/styles

# Create test directories
mkdir -p tests/unit/components
mkdir -p tests/unit/services
mkdir -p tests/integration
mkdir -p tests/e2e

# Create public directory
mkdir -p public
```

### Create main entry files

**src/main.ts**:
```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import router from './router';
import App from './App.vue';

// Import Quasar styles
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Quasar, {
  plugins: {} // import Quasar plugins as needed
});

app.mount('#app');
```

**src/App.vue**:
```vue
<template>
  <q-layout view="hHh lpR fFf">
    <router-view />
  </q-layout>
</template>

<script setup lang="ts">
// Root component - Quasar layout wrapper
</script>

<style scoped>
/* Global styles */
</style>
```

**index.html**:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Member Management System</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Development Workflow

### Start development server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

### Run tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test -- --coverage
```

### Build for production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview production build

```bash
npm run preview
```

## API Integration Setup

### Step 1: Create Axios client

**src/services/api/client.ts**:
```typescript
import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  'https://api-frontend-interview-server.metcfire.com.tw/';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'interviewerName': 'Benben'  // Required custom header for interview tracking
  }
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Will be implemented with auth store
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
```

### Step 2: Create environment file

**.env.development**:
```
VITE_API_BASE_URL=https://api-frontend-interview-server.metcfire.com.tw/
VITE_APP_TITLE=Member Management System
```

**.env.production**:
```
VITE_API_BASE_URL=https://api-frontend-interview-server.metcfire.com.tw/
VITE_APP_TITLE=Member Management System
```

## Testing the Setup

### Quick validation

1. **Check dependencies**:
```bash
npm list vue quasar pinia axios
```

2. **Test TypeScript compilation**:
```bash
npx vue-tsc --noEmit
```

3. **Test dev server**:
```bash
npm run dev
# Should start without errors
```

4. **Test API connectivity** (create a test file):

**src/test-api.ts**:
```typescript
import { apiClient } from './services/api/client';

async function testAPI() {
  try {
    const response = await apiClient.get('/health'); // or any endpoint
    console.log('API Connection successful:', response.data);
  } catch (error) {
    console.error('API Connection failed:', error);
  }
}

testAPI();
```

Run: `npx tsx src/test-api.ts` (install tsx: `npm i -D tsx`)

## API Documentation Access

⚠️ **IMPORTANT**: Before implementing API integration, review the official API documentation:

**URL**: https://api-frontend-interview-server.metcfire.com.tw/api-docs

**Steps**:
1. Open the URL in browser
2. Identify actual endpoints for:
   - Authentication (login/logout)
   - Member CRUD operations
   - Pagination and filtering
3. Note request/response structures
4. Update TypeScript interfaces in `src/types/`
5. Update Zod schemas in `src/services/validation/schemas.ts`

**Test Credentials** (per task.md):
- Username: `[隨便打]` (any value)
- Password: `[隨便打]` (any value)

## Common Issues and Solutions

### Issue: Module not found errors

**Solution**: Ensure path aliases are configured in both `vite.config.ts` and `tsconfig.json`:
```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

### Issue: Quasar components not rendering

**Solution**: Ensure Quasar plugin is registered in `main.ts`:
```typescript
import { Quasar } from 'quasar';
app.use(Quasar);
```

### Issue: TypeScript strict mode errors

**Solution**: TypeScript strict mode is mandatory per constitution. Fix errors instead of disabling:
- Add proper type annotations
- Handle null/undefined cases
- Use type guards

### Issue: CORS errors

**Solution**:
1. Check if API has CORS enabled
2. Use Vite proxy (already configured in `vite.config.ts`)
3. Verify API base URL is correct

### Issue: Axios interceptor not working

**Solution**:
- Ensure auth store is initialized before making requests
- Check Pinia store is properly registered
- Verify token is stored correctly

## Next Steps

After setup is complete:

1. ✅ Verify all dependencies installed
2. ✅ Confirm dev server runs without errors
3. ✅ Review API documentation at provided URL
4. ✅ Create initial TypeScript types based on API docs
5. ✅ Implement authentication flow (login page + auth store)
6. ✅ Test API integration with browser DevTools
7. ✅ Proceed to task implementation (`/speckit.tasks`)

## Development Best Practices

Per METC constitution:

1. **Component-First**: Create reusable components with clear prop/emit contracts
2. **Test-First**: Write tests before implementation (TDD mandatory)
3. **Type Safety**: No `any` types, validate API responses with Zod
4. **Observability**: Log API calls and errors for debugging
5. **Simplicity**: Use direct implementations, avoid premature abstraction

## Reference Figma Design

**Design URL**: https://server-door-49461275.figma.site/

Review Figma designs to understand:
- Layout structure
- Component hierarchy
- Color scheme and typography
- Responsive breakpoints
- Interaction patterns

Map Figma screens to Vue pages and components according to the planned structure in `plan.md`.

## Support

For issues or questions:
- Check `research.md` for technical decisions
- Review `data-model.md` for type definitions
- Refer to `contracts/api-contracts.md` for API integration (update based on actual API docs)
- Constitution: `.specify/memory/constitution.md`
