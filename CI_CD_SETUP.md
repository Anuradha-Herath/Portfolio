# CI/CD Pipeline Documentation

This document outlines the CI/CD pipeline setup for the Portfolio project deployed on Vercel.

## 📋 Overview

The CI/CD pipeline automatically:
- Lints and type-checks code on every push/PR
- Builds and validates the application
- Runs security scans
- Deploys preview versions for PRs
- Deploys to production on main branch merges

## 🔧 Setup Instructions

### 1. GitHub Secrets Configuration

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Required Secrets:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NEXT_PUBLIC_SITE_URL`: Your site URL (e.g., https://yoursite.vercel.app)

### 2. Vercel Integration

The pipeline uses Vercel for deployments with the following configuration:

#### Getting Vercel Credentials:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Get project details
vercel env ls
```

### 3. Branch Protection Rules

Recommended GitHub branch protection settings for `main`:

#### Required Status Checks:
- `Lint and Type Check`
- `Build and Test`
- `Security Scan`

#### Settings to Enable:
- ✅ Require a pull request before merging
- ✅ Require approvals (1 minimum)
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes that create files larger than 100MB

## 🚀 Pipeline Stages

### Stage 1: Code Quality
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Runs on**: All pushes and PRs

### Stage 2: Build & Test
- **Build**: Creates production build
- **Environment**: Validates required env vars
- **Artifacts**: Uploads build files
- **Runs on**: After code quality passes

### Stage 3: Security
- **Audit**: Checks for security vulnerabilities
- **Dependencies**: Reports outdated packages
- **Runs on**: Parallel with build stage

### Stage 4: Deployment
- **Preview**: Deploys PR to preview URL
- **Production**: Deploys main branch to production
- **Runs on**: After all previous stages pass

## 📁 Files Created

```
.github/workflows/ci-cd.yml    # Main CI/CD pipeline
vercel.json                    # Vercel configuration
validate-env.js                # Environment validation script
```

## 🔍 Environment Validation

The `validate-env.js` script ensures all required environment variables are set:

```bash
# Manual validation
npm run validate-env

# Automatic validation (runs before build/dev)
npm run build
npm run dev
```

## 🛠️ Available Scripts

```json
{
  "validate-env": "node validate-env.js",
  "type-check": "tsc --noEmit", 
  "ci": "npm run lint && npm run type-check && npm run build",
  "prebuild": "npm run validate-env",
  "predev": "npm run validate-env"
}
```

## 🌟 Features

### Automatic Preview Deployments
- Every PR gets a unique preview URL
- Automatic cleanup when PR is closed
- Environment variables isolated per deployment

### Production Deployments
- Only from `main` branch
- Automatic rollback on failure
- Health checks after deployment

### Security Features
- Dependency vulnerability scanning
- Content Security Policy headers
- Environment variable validation

### Performance Optimizations
- Build artifact caching
- Parallel job execution
- Conditional deployment logic

## 🔧 Troubleshooting

### Build Failures
1. Check environment variables are set correctly
2. Run `npm run ci` locally to reproduce
3. Verify TypeScript types are correct

### Deployment Issues
1. Verify Vercel credentials in GitHub secrets
2. Check Vercel project is linked correctly
3. Review deployment logs in Vercel dashboard

### Environment Variable Issues
1. Run `npm run validate-env` locally
2. Check case sensitivity of variable names
3. Ensure URLs are properly formatted

## 📚 Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## 🚨 Important Notes

1. **Never commit `.env.local`** - it's in `.gitignore` for security
2. **Use GitHub Secrets** for sensitive environment variables
3. **Test locally** before pushing to ensure builds work
4. **Monitor deployments** through Vercel dashboard
5. **Review security audits** regularly