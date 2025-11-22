# Accessibility Statement

## Commitment

Supranorma is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Conformance Status

We aim to conform to **WCAG 2.1 Level AA** standards.

**Current Status**: Partially Conformant

This means that some parts of the content may not fully conform to the accessibility standard, but we are actively working to improve.

## Accessible Features

### Web Application

#### Keyboard Navigation
- ✅ All interactive elements accessible via keyboard
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ Skip links for main content

#### Visual Design
- ✅ Sufficient color contrast (Tailwind CSS defaults)
- ✅ Responsive text sizing
- ✅ No information conveyed by color alone
- ✅ Readable fonts (system font stack)

#### Screen Reader Support
- ✅ Semantic HTML5 elements
- ✅ ARIA labels where needed
- ✅ Alternative text for images
- ✅ Form labels properly associated

#### Content
- ✅ Clear headings hierarchy
- ✅ Descriptive link text
- ✅ Error messages clearly stated
- ✅ Form validation feedback

### Command-Line Interface

#### Output
- ✅ Plain text output (screen reader friendly)
- ✅ Structured information
- ✅ Color optional (via `--no-color` flag)
- ✅ Progress indicators

#### Input
- ✅ Clear command syntax
- ✅ Comprehensive help text
- ✅ Error messages with suggestions
- ✅ Confirmation prompts

### Documentation

#### Structure
- ✅ Clear heading hierarchy
- ✅ Table of contents
- ✅ Descriptive titles
- ✅ Logical reading order

#### Content
- ✅ Plain language
- ✅ Code examples with explanations
- ✅ Alternative formats (Markdown, HTML)
- ✅ Diagrams with text descriptions

## Known Limitations

We are aware of the following accessibility limitations:

### Web Application
1. **Dynamic Content Updates**: Some AI-generated content updates may not properly announce to screen readers
2. **Complex Interactions**: File upload interfaces may have limited keyboard support
3. **Real-time Features**: Chat interface streaming may be challenging for screen readers

### Documentation
1. **Diagrams**: ASCII art diagrams may not translate well to screen readers
2. **Code Examples**: Long code blocks can be difficult to navigate

### CLI
1. **Interactive Prompts**: Some inquirer prompts may have limited screen reader support
2. **Progress Bars**: Visual progress indicators are not accessible to all users

## Assistive Technologies Tested

We have tested Supranorma with:

- ✅ **Keyboard Only**: Full navigation without mouse
- ⚠️ **NVDA** (Windows): Partially tested
- ⚠️ **JAWS** (Windows): Not yet tested
- ⚠️ **VoiceOver** (macOS/iOS): Partially tested
- ⚠️ **TalkBack** (Android): Not applicable (no mobile app)

## Accessibility Features by Package

### @supranorma/web-app Frontend

#### Login/Register Pages
- Semantic form structure
- Clear error messages
- Password visibility toggle
- Focus management

#### Dashboard
- Landmark regions (header, main, nav)
- Keyboard navigable cards
- Status indicators with text labels
- Accessible data visualizations (text alternatives)

#### Projects/Tasks Pages
- Sortable/filterable with keyboard
- Modal dialogs with focus trapping
- Confirmation dialogs for destructive actions
- Loading states announced

#### AI Assistant
- Chat history navigable with keyboard
- Message input accessible
- Streaming responses announced
- Code blocks with syntax highlighting (semantic)

### @supranorma/cli

#### Command Output
- Structured, linear output
- Color optional (detects NO_COLOR env var)
- Progress indicators with text fallback
- Tables with clear headers

#### Interactive Prompts
- Clear question text
- Validation feedback
- Default values shown
- Cancel option available

### @supranorma/data-framework

#### Error Messages
- Clear, actionable error text
- Context provided
- Suggested fixes included

## Accessibility Testing

### Automated Testing
```bash
# Run accessibility tests (planned)
npm run test:a11y
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] Skip links work

#### Screen Reader
- [ ] All content announced
- [ ] Landmarks properly labeled
- [ ] Forms properly associated
- [ ] Dynamic updates announced
- [ ] Images have alt text

#### Color Contrast
- [ ] Text contrast ≥ 4.5:1 (normal text)
- [ ] Text contrast ≥ 3:1 (large text)
- [ ] Interactive elements ≥ 3:1
- [ ] Focus indicators ≥ 3:1

#### Responsive Design
- [ ] Works at 200% zoom
- [ ] No horizontal scrolling (at normal zoom)
- [ ] Touch targets ≥ 44x44 pixels
- [ ] Content reflows properly

## Reporting Accessibility Issues

We welcome feedback on accessibility. If you encounter an accessibility barrier:

### How to Report
1. **Email**: accessibility@supranorma.dev
2. **GitHub Issue**: [Create accessibility issue](https://github.com/Hyperpolymath/supranorma/issues/new?labels=accessibility)

### What to Include
- Description of the barrier
- Assistive technology used (if applicable)
- Browser/platform information
- Steps to reproduce
- Screenshots or screen recordings (if helpful)

### Response Time
- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix** Timeline**: Based on severity
  - **Critical**: 2 weeks
  - **High**: 1 month
  - **Medium**: 3 months
  - **Low**: Next major release

## Roadmap

### Short Term (3 months)
- [ ] Complete WCAG 2.1 AA audit
- [ ] Fix all Level A violations
- [ ] Add automated accessibility testing
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation audit

### Medium Term (6 months)
- [ ] Fix all Level AA violations
- [ ] User testing with people with disabilities
- [ ] Accessibility documentation improvements
- [ ] ARIA patterns review
- [ ] Form accessibility enhancements

### Long Term (12 months)
- [ ] WCAG 2.1 Level AAA consideration
- [ ] Accessibility statement on website
- [ ] Accessibility training for contributors
- [ ] Continuous monitoring process
- [ ] Third-party accessibility audit

## Standards and Guidelines

We follow these accessibility standards:

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Web Content Accessibility Guidelines
- [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) - Accessible Rich Internet Applications
- [Section 508](https://www.section508.gov/) - U.S. Federal accessibility requirements
- [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf) - European accessibility standard

## Resources

### For Users
- [WebAIM](https://webaim.org/) - Web accessibility resources
- [A11Y Project](https://www.a11yproject.com/) - Community-driven accessibility resource

### For Contributors
- [Inclusive Components](https://inclusive-components.design/) - Accessible component patterns
- [Deque University](https://dequeuniversity.com/) - Accessibility training
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Developer docs

## Credits

We thank the following for accessibility guidance:
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [The A11Y Project](https://www.a11yproject.com/)
- Accessibility testers and advocates in our community

## Legal

This accessibility statement was created on 2025-11-22 and last updated on 2025-11-22.

Our commitment to accessibility is ongoing. We continuously work to improve the accessibility of our software and services.

---

Last updated: 2025-11-22
Next review: 2026-02-22

For questions about this statement or accessibility in general:
- Email: accessibility@supranorma.dev
- GitHub: https://github.com/Hyperpolymath/supranorma/issues
