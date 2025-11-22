# Tri-Perimeter Contribution Framework (TPCF)

## Overview

The Tri-Perimeter Contribution Framework (TPCF) is a graduated trust model for open source contributions that balances security with openness. It provides three distinct zones of access, allowing contributors to earn trust progressively.

## The Three Perimeters

```
┌─────────────────────────────────────────────────────────────┐
│  Perimeter 3: Community Sandbox (Fully Open)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Perimeter 2: Contributor Pipeline (Graduated Trust)  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Perimeter 1: Core Trust (Maintainer Only)     │  │  │
│  │  │                                                 │  │  │
│  │  │  - Production deployments                      │  │  │
│  │  │  - Security-critical code                      │  │  │
│  │  │  - Release management                          │  │  │
│  │  │  - Access control                              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  - Vetted contributions                                 │  │
│  │  - Feature development                                  │  │
│  │  - Bug fixes                                            │  │
│  │  - Documentation                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  - Public forks                                               │
│  - Experiments                                                │
│  - Learning projects                                          │
│  - Community plugins                                          │
└─────────────────────────────────────────────────────────────┘
```

## Perimeter 1: Core Trust

### Who: Core Maintainers Only

### Access Level: Full

### Responsibilities:
- Production deployment credentials
- Security incident response
- Release management and signing
- Access control management
- Critical infrastructure decisions
- Sensitive data handling

### Entry Requirements:
- Nominated by existing core maintainer
- Minimum 6 months active contribution
- Demonstrated security awareness
- Agreement to security policies
- Background verification (for corporate contexts)
- Unanimous vote of existing core team

### Tools & Systems:
- npm publish access
- Production server access
- Security reporting inbox
- Release signing keys
- GitHub admin permissions
- Domain name management

## Perimeter 2: Contributor Pipeline

### Who: Trusted Contributors

### Access Level: Graduated

### Tiers Within Perimeter 2:

#### Tier 2A: Recognized Contributor
**Requirements:**
- 3+ merged pull requests
- 1+ month of activity
- Code review participation

**Permissions:**
- Create feature branches
- Review others' PRs (non-binding)
- Participate in discussions
- Early access to beta features

#### Tier 2B: Established Contributor
**Requirements:**
- 10+ merged pull requests
- 3+ months of activity
- Demonstrated code quality
- Community engagement

**Permissions:**
- All Tier 2A permissions
- Binding code review votes
- Issue triage and labeling
- Documentation write access
- Beta feature development

#### Tier 2C: Senior Contributor
**Requirements:**
- 25+ merged pull requests
- 6+ months of activity
- Mentorship of new contributors
- Technical leadership

**Permissions:**
- All Tier 2B permissions
- Feature branch approval
- Architectural input
- Release notes contribution
- Conference speaking (representing project)

### Advancement Process:
1. Contributions tracked automatically (PR count, reviews, etc.)
2. Monthly review by core team
3. Automated notifications when tier requirements met
4. Manual approval for tier advancement
5. Public recognition in CONTRIBUTORS.md

### Responsibilities:
- Code review quality
- Constructive feedback
- Mentorship of newer contributors
- Following security guidelines
- Upholding Code of Conduct

## Perimeter 3: Community Sandbox

### Who: Everyone

### Access Level: Public

### What's Included:
- Public repository access (read)
- Fork and clone capabilities
- Issue reporting
- Discussion participation
- Pull request submission
- Community forums

### No Requirements:
- No registration needed to read code
- No verification needed to fork
- No approval needed to experiment
- No credentials needed to learn

### Purpose:
- **Learning**: Experiment with the codebase
- **Innovation**: Try new ideas in forks
- **Contribution**: Submit PRs to move to Perimeter 2
- **Feedback**: Report bugs and suggest features
- **Adoption**: Use in your own projects

### Tools & Systems:
- Public GitHub repository
- GitHub Discussions
- Issue tracker (read/write)
- Documentation site
- Example projects
- Community chat (planned)

## Trust Progression Path

```
New User (P3)
    ↓
First PR merged → Recognized Contributor (P2A)
    ↓
Consistent quality → Established Contributor (P2B)
    ↓
Leadership shown → Senior Contributor (P2C)
    ↓
Core nomination → Core Maintainer (P1)
```

## Security Model

### Threat Mitigation by Perimeter:

**Perimeter 3 (Public):**
- **Risk**: Malicious PRs, spam, abuse
- **Mitigation**: Code review required, CI/CD checks, CoC enforcement

**Perimeter 2 (Contributors):**
- **Risk**: Insider threats, credential theft
- **Mitigation**: Graduated access, audit logs, time-based trust

**Perimeter 1 (Core):**
- **Risk**: Complete system compromise
- **Mitigation**: Multi-factor auth, minimal access, audit trails, background checks

### Principle of Least Privilege:
- Default to lowest necessary access
- Temporary elevated access for specific tasks
- Regular access audits (quarterly)
- Automatic downgrade after inactivity (6 months)

## Emotional Safety Integration

### Perimeter 3:
- **Experimentation**: Safe to try anything in forks
- **No punishment**: Learn without fear in sandbox
- **Reversibility**: All changes can be undone

### Perimeter 2:
- **Mentorship**: Senior contributors guide newer ones
- **Constructive feedback**: Focus on improvement, not blame
- **Undo path**: Reverted PRs are learning, not failure

### Perimeter 1:
- **Blameless postmortems**: Learn from incidents
- **Stress management**: Rotating on-call duties
- **Shared responsibility**: No single point of failure

## Contribution Types by Perimeter

### Perimeter 3 Can Contribute:
- Bug reports
- Feature requests
- Documentation fixes (via PR)
- Example code
- Translation
- Community support

### Perimeter 2 Can Contribute:
- All Perimeter 3 contributions
- Bug fixes
- Feature implementation
- Test coverage
- Performance improvements
- Architecture proposals

### Perimeter 1 Exclusive:
- Security patches
- Release management
- Access control changes
- Infrastructure changes
- Legal/licensing decisions

## Automated Governance

### GitHub Actions for TPCF:
1. **PR Labeling**: Auto-label based on contributor tier
2. **Required Reviewers**: Assign based on code ownership and tier
3. **Automated Tests**: Different test suites for different tiers
4. **Tier Notifications**: Alert when advancement criteria met
5. **Inactivity Warnings**: Remind before tier downgrade

### Metrics Tracked:
- PRs submitted/merged
- Code review quality
- Response time
- Community engagement
- Security awareness
- Mentorship activity

## Edge Cases

### Departing Contributor:
- Graceful downgrade to lower tier or Perimeter 3
- Recognition preserved
- Re-entry path clearly defined

### Security Incident:
- Immediate tier suspension (reversible)
- Investigation with privacy
- Restoration or termination based on findings

### Corporate Contributors:
- Same tier system applies
- Company affiliation declared
- Conflict of interest monitoring

### Major Contributors from Hostile Actors:
- Code accepted on merit
- Extra scrutiny for security implications
- Tier advancement may be delayed

## Benefits by Perimeter

### Perimeter 3 Benefits:
- Learn from production code
- Build portfolio with contributions
- Network with community
- Free software usage

### Perimeter 2 Benefits:
- All Perimeter 3 benefits
- Resume/CV recognition
- Early feature access
- Speaking opportunities
- Deeper technical knowledge
- Mentorship skills

### Perimeter 1 Benefits:
- All Perimeter 2 benefits
- Strategic input
- Conference keynotes
- Industry recognition
- Leadership experience

## Implementation Status

**Current Status**: Perimeter 3 (Community Sandbox)

Supranorma is currently operating as a **Perimeter 3** project:
- Fully open contribution
- All features publicly accessible
- No restricted areas (yet)
- Learning-focused

### Progression Plan:
1. **Phase 1 (Current)**: Establish community, gather contributors
2. **Phase 2 (Future)**: Implement Perimeter 2 tiers as project matures
3. **Phase 3 (Future)**: Activate Perimeter 1 when production deployments exist

## Comparison with Other Models

### vs. Traditional Open Source:
- **Similarity**: Public repository, open contributions
- **Difference**: Explicit graduated trust levels

### vs. InnerSource:
- **Similarity**: Structured contribution paths
- **Difference**: Fully public, not corporate-internal

### vs. Wikipedia Model:
- **Similarity**: Graduated permissions
- **Difference**: Code review vs. content moderation

### vs. Linux Kernel Model:
- **Similarity**: Maintainer hierarchy
- **Difference**: Explicit tiers, automated tracking

## FAQ

**Q: Can I contribute without being in Perimeter 2?**
A: Yes! Perimeter 3 is fully open for contributions.

**Q: How long to reach Perimeter 2?**
A: As fast as you can make 3 quality contributions (weeks to months).

**Q: Can I skip tiers?**
A: Tier 2A is required, but exceptional contributors may advance quickly.

**Q: What if I disagree with tier assignment?**
A: Contact maintainers via conduct@supranorma.dev for review.

**Q: Does company sponsorship affect tiers?**
A: No. Tier advancement is merit-based only.

**Q: How does inactivity affect my tier?**
A: 6 months inactivity → warning, 12 months → downgrade. Easily restored on return.

## Contact

- **Questions**: tpcf@supranorma.dev
- **Tier Review**: maintainers@supranorma.dev
- **Governance Discussion**: https://github.com/Hyperpolymath/supranorma/discussions

## References

- [Contributor Covenant](https://www.contributor-covenant.org/) - Code of Conduct
- [CHAOSS Metrics](https://chaoss.community/) - Contributor metrics
- [Apache Maturity Model](https://community.apache.org/apache-way/apache-project-maturity-model.html)
- [CNCF Graduation Criteria](https://www.cncf.io/project-metrics/)

---

Last updated: 2025-11-22
Version: 1.0
