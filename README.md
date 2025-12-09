# METC - Member Management System

A modern member management system built with Vue 3, TypeScript, and Quasar Framework. This application provides a complete solution for managing user accounts with authentication, CRUD operations, and role-based access control.

## Features

- **Authentication**: Secure login system with JWT token-based authentication
- **Account Management**: View, create, update, and delete member accounts
- **Role Management**: Support for ADMIN, EDITOR, USER, and CLIENT roles
- **Status Control**: Toggle account status between ON and OFF
- **Responsive Design**: Mobile-first UI using Quasar Material Design components
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testing**: Comprehensive unit and integration tests with Vitest

## Technologies

- **Frontend Framework**: Vue 3 (Composition API)
- **UI Framework**: Quasar 2.x (Material Design)
- **Language**: TypeScript (Strict Mode)
- **State Management**: Pinia 2.x
- **HTTP Client**: Axios 1.x
- **Validation**: Zod (Runtime schema validation)
- **Build Tool**: Vite 5.x
- **Testing**: Vitest + Vue Test Utils
- **Code Quality**: ESLint + Prettier

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/benben6515/metc.git
cd metc
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):

Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://api-frontend-interview-server.metcfire.com.tw
```

If not specified, the default API URL will be used.

## Running the Project

### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Testing

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:ui
```

This opens Vitest UI for interactive test debugging.

### Test Coverage

The project includes:
- **Unit Tests**: Component and store tests
- **Integration Tests**: API and authentication flow tests
- **Current Coverage**: 36 tests passing

## Code Quality

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

## Project Structure

```
metc/
├── src/
│   ├── components/          # Vue components
│   │   ├── auth/           # Authentication components
│   │   ├── accounts/       # Account management components
│   │   └── common/         # Reusable common components
│   ├── pages/              # Page-level components
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores
│   ├── services/           # API and validation services
│   │   ├── api/           # Axios client and API calls
│   │   └── validation/    # Zod schemas
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── public/                  # Static assets
├── dist/                    # Production build output
└── package.json            # Project dependencies
```

## API Configuration

The application connects to the backend API with the following configuration:

- **Base URL**: `https://api-frontend-interview-server.metcfire.com.tw`
- **Custom Header**: `interviewerName: Benben` (automatically included in all requests)
- **Authentication**: Bearer token stored in localStorage

### API Endpoints

- `POST /login` - User authentication
- `GET /accounts` - Fetch all accounts
- `GET /account/{id}` - Fetch single account
- `POST /create-account` - Create new account
- `PATCH /update-account/{id}` - Update account
- `DELETE /delete-account/{id}` - Delete account

## Authentication

The application uses token-based authentication:

1. Login credentials are sent to `/login`
2. JWT token is stored in localStorage
3. Token is automatically included in subsequent requests via Axios interceptor
4. 401 responses trigger automatic logout and redirect to login page

## Development Guidelines

### TypeScript

- Strict mode is enabled
- All types must be explicitly defined
- Use Zod schemas for runtime validation

### Component Structure

- Use Composition API with `<script setup>`
- Props and emits must be typed with TypeScript interfaces
- Follow single responsibility principle

### Testing

- Write tests before implementation (TDD approach)
- Test user interactions, not implementation details
- Mock external dependencies (API calls, router)

### State Management

- Use Pinia stores for shared state
- Keep component-local state in components
- Use getters for derived state

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
export default defineConfig({
  server: { port: 3001 } // Change to desired port
})
```

### Build Errors

If you encounter build errors:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear Vite cache:
```bash
rm -rf node_modules/.vite
```

### Test Failures

If tests fail:

1. Ensure all dependencies are installed
2. Check Node.js version compatibility (v18+)
3. Run tests with verbose output: `npm run test -- --reporter=verbose`

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

ISC

## Contact

**Author**: Benben
**Repository**: https://github.com/benben6515/metc
