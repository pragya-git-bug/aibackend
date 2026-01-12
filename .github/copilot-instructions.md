# Copilot Instructions for Learning Portal Backend

## Architecture Overview

This is a Node.js/Express learning management system with MongoDB. The application follows an **MVC-like pattern**:
- **Models** ([model/](model/)): Mongoose schemas for Users, Assignments, and Quizzes with validation rules and pre-save hooks
- **Controllers** ([controller/](controller/)): Business logic handling CRUD operations and request validation
- **Routes** ([route/](route/)): Express route definitions with JSDoc annotations for Swagger documentation
- **Config** ([config/](config/)): MongoDB connection setup with cloud Atlas (MongoDB+srv URI)

## Environment Configuration (.env File)

**CRITICAL**: Use `.env` file for all configuration instead of hardcoding values.

1. **Local Development**: 
   - Create `.env` from `.env.example` and populate with local values (do NOT use example's MongoDB credentials)
   - Example:
     ```
     NODE_ENV=development
     PORT=3000
     HOST=localhost
     MONGODB_URI=mongodb://localhost:27017/learning_local
     SWAGGER_HOST=localhost:3000
     ```

2. **Production**: Create `.env` on server with production values:
   ```
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   SWAGGER_HOST=api.ventureconsultancyservices.com
   ```

3. **Never commit `.env`** - It's already in `.gitignore`. Keep `.env.example` generic without real credentials

The app loads `.env` via `require('dotenv').config()` in [server.js](server.js#L2).

**⚠️ Security Issue**: [db.js](config/db.js) contains hardcoded MongoDB credentials in fallback URI. These should be removed or replaced with placeholder text matching `.env.example` convention.

## Key Design Patterns & Conventions

### 1. Data Models with Pre-Hooks
All models use Mongoose pre-save hooks for:
- **Auto-generated codes**: `userCode` (3-letter name prefix + 4 random digits), `assignmentCode`, `quizeCode` with uniqueness checks and retry logic
- **Password hashing**: bcryptjs hashing with modification checks (`isModified()`) to prevent re-hashing

See [model/userInformation.js](model/userInformation.js) for the complete pattern.

### 2. Consistent Response Format
All endpoints return standardized JSON:
```json
{ "success": true/false, "message": "...", "data": {...} }
```
Always delete sensitive fields (password) before responding. Status codes: 201 (created), 400 (validation), 500 (server errors).

### 3. Nested Data Structures
Assignments and Quizzes use MongoDB **Map types** for questions and submissions to allow dynamic keying:
- `questions: Map<questionNo, {question, options/difficulties, ...}>`
- `submissions: Map<userCode, {answers[], overallScore, submissionDate, ...}>`

This avoids array index limitations when adding/removing items.

### 4. Validation at Schema Level
Use Mongoose validators with custom messages:
```javascript
email: { type: String, required: [true, 'Email is required'], unique: true, match: [/regex/, 'message'] }
```

## Development Workflow

### Commands
- **Start production**: `npm start` (runs [server.js](server.js) with .env loaded)
- **Start development**: `npm run dev` (nodemon auto-reload)
- **Generate/update Swagger docs**: `npm run swagger-autogen` (reads route JSDoc comments, generates [swagger-output.json](swagger-output.json) using SWAGGER_HOST from .env)
- Access API docs at: `http://localhost:3000/api-docs` (dev) or `https://api.ventureconsultancyservices.com/api-docs` (prod)

**Critical**: Always add JSDoc comments above route handlers with `@route`, `@desc`, `@access`, `@tags`, `@param` tags. Swagger generation depends on these.

### Database
- **Connection string**: Loaded from `MONGODB_URI` environment variable in `.env`
- **Connection logs**: Server logs connection status and host; check "✓ MongoDB Connected" message in console

### ⚠️ Current Issue: Server Not Starting
The `app.listen()` call is **commented out** in [server.js](server.js#L16-L18). To enable the server:
1. Uncomment lines 16-18 in [server.js](server.js)
2. Ensure `.env` has valid `MONGODB_URI` before starting
3. Run `npm start` or `npm run dev`

## Route Structure & Controller Patterns

Each feature (User, Assignment, Quiz) has three files in parallel:
- [route/userInformationRoutes.js](route/userInformationRoutes.js) → [controller/userInformationController.js](controller/userInformationController.js) → [model/userInformation.js](model/userInformation.js)

Controllers handle:
1. **Input validation**: Check required fields before querying DB
2. **Duplicate/conflict checks**: Email uniqueness for users, existing codes for assignments
3. **Response sanitization**: Remove password fields before sending
4. **Error handling**: Try-catch wrapping with 500 responses and `console.error()` logging

## CORS & Middleware Setup

- **CORS**: Enabled for all origins (`*`) with credentials support. If restricting, update allowed domains in [app.js](app.js#L12).
- **Middleware order** (in [app.js](app.js)):
  1. CORS
  2. JSON/URL-encoded body parsing
  3. Swagger UI (conditional on swagger-output.json existence)
  4. Routes

## Deployment Checklist

Before deploying to production:
1. ✅ Create `.env` file on server with `NODE_ENV=production` and `SWAGGER_HOST=api.ventureconsultancyservices.com`
2. ✅ Run `npm install` to ensure dependencies are fresh
3. ✅ Run `npm run swagger-autogen` to generate docs with production domain
4. ✅ Test API endpoints at `https://api.ventureconsultancyservices.com/api-docs`
5. ✅ Never commit `.env` file (use `.env.example` template instead)

## Vercel Deployment

[vercel.json](vercel.json) is configured for serverless deployment:
- **Entry point**: `server.js` (configured as `vercel-start` script in package.json)
- **Environment variables**: Must be set in Vercel project settings dashboard (mirrors `.env` values)
- **Key variables**: `MONGODB_URI`, `SWAGGER_HOST`, `NODE_ENV`
- During deployment, Vercel runs `npm run vercel-start` which executes `node server.js`

## Extension Points

When adding new entities (e.g., Submissions, Grades):
1. Create [model/entityName.js](model/) with Mongoose schema + pre-save hooks for auto-codes and hashing
2. Create [controller/entityNameController.js](controller/) following existing CRUD patterns
3. Create [route/entityNameRoutes.js](route/) with JSDoc comments
4. Wire routes in [app.js](app.js) with `app.use('/api/path', routes)`
5. Run `npm run swagger-autogen` to update documentation

## Critical Issues to Watch

- **Password security**: Always hash before storing; never log passwords
- **Unique field conflicts**: Handle MongoDB E11000 errors (duplicate key) gracefully in catch blocks
- **Pre-hook race conditions**: If multiple pre-hooks exist, ensure `return` statements to prevent sequential execution
- **Swagger sync**: JSDoc comments must match actual route definitions; mismatch causes generation gaps
- **Environment mismatch**: Always verify `.env` values before deployment - wrong `SWAGGER_HOST` or `MONGODB_URI` will cause API issues
