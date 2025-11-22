# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by email to: security@supranorma.dev

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information (as much as you can provide):

* Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Update Process

1. **Report received** - We acknowledge receipt within 48 hours
2. **Triage** - We assess the vulnerability within 7 days
3. **Fix development** - We develop and test a fix
4. **Coordinated disclosure** - We work with reporter on disclosure timeline
5. **Release** - Security patch released with CVE if applicable
6. **Announcement** - Security advisory published

## Security Measures

### Code Security

- **TypeScript Strict Mode** - All code uses TypeScript strict mode for type safety
- **No `eval()`** - No dynamic code evaluation
- **Input Validation** - All inputs validated with Zod schemas
- **SQL Injection Prevention** - Drizzle ORM with parameterized queries
- **XSS Prevention** - React escapes all output by default
- **CSRF Protection** - JWT tokens with proper validation

### Dependency Security

- **Minimal Dependencies** - We minimize dependency count
- **Automated Scanning** - GitHub Dependabot enabled
- **Regular Updates** - Dependencies updated quarterly minimum
- **Audit Process** - `npm audit` run in CI/CD

### API Security

- **Authentication** - JWT-based authentication
- **Password Hashing** - bcryptjs with salt rounds ≥ 10
- **Rate Limiting** - Recommended for production deployments
- **HTTPS Only** - All production traffic must use HTTPS
- **CORS** - Proper CORS configuration required

### Environment Security

- **No Secrets in Code** - All secrets via environment variables
- **`.env` in `.gitignore`** - Environment files never committed
- **Secret Scanning** - Recommended GitHub secret scanning enabled

## Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Use Zod schemas
3. **Sanitize outputs** - Rely on React's default escaping
4. **Review dependencies** - Check new dependencies for security issues
5. **Write tests** - Include security-focused tests

### For Deployers

1. **Use HTTPS** - Always use TLS/SSL in production
2. **Set JWT_SECRET** - Use cryptographically secure random string
3. **Enable rate limiting** - Prevent abuse
4. **Regular updates** - Keep dependencies current
5. **Monitor logs** - Watch for suspicious activity
6. **Backup database** - Regular automated backups

## Known Security Considerations

### Offline-First Limitations

- AI features require external API calls (Anthropic/OpenAI)
- Not fully air-gapped due to AI provider dependency
- Core utilities and data processing work offline

### Third-Party Services

We integrate with:
- **Anthropic Claude API** - For AI code analysis and generation
- **OpenAI API** - Alternative AI provider

Users are responsible for:
- Securing their API keys
- Understanding provider data policies
- Compliance with provider terms of service

## Security Hardening Checklist

For production deployments:

- [ ] HTTPS/TLS configured
- [ ] Strong JWT_SECRET set (≥32 random characters)
- [ ] Rate limiting enabled
- [ ] CORS properly configured for your domain
- [ ] Database backups automated
- [ ] Logs monitored
- [ ] Secrets in secure vault (not environment files)
- [ ] Security headers configured (Helmet.js)
- [ ] SQL injection testing performed
- [ ] XSS testing performed
- [ ] Authentication testing performed
- [ ] Dependency audit passing

## Security Features by Package

### @supranorma/shared
- Error handling with context (no sensitive data leakage)
- Input validation utilities
- Safe async utilities

### @supranorma/ai-core
- API key protection (environment-based)
- No code execution from AI responses
- Prompt injection awareness

### @supranorma/data-framework
- Schema validation
- Type checking
- Safe data transformation

### @supranorma/web-app
- JWT authentication
- Password hashing
- CORS protection
- Helmet security headers
- Parameterized SQL queries

### @supranorma/cli
- No elevated privileges required
- Local file system only
- API keys via environment

## Compliance

- **OWASP Top 10** - Addressed in design
- **GDPR** - No personal data collected by default
- **SOC 2** - Suitable for SOC 2 compliant deployments
- **NIST** - Follows NIST cybersecurity framework principles

## Attribution

This security policy follows industry best practices and is inspired by:
- OWASP Security Guidelines
- GitHub Security Best Practices
- RFC 9116 security.txt standard

## Contact

- **Security Issues**: security@supranorma.dev
- **General Questions**: https://github.com/Hyperpolymath/supranorma/issues
- **PGP Key**: [To be added]

---

Last updated: 2025-11-22
