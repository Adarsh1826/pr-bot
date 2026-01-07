# Contribution Guidelines

Thank you for your interest in contributing to the PR Review System 🎉
This document outlines the **rules, standards, and workflow** for contributing to this repository.

These guidelines exist to keep the codebase **clean, scalable, and production-ready**.

---

## 1. Who Can Contribute?

Contributions are welcome from:

* Open-source contributors
* Backend engineers
* DevOps / infra enthusiasts
* Anyone improving reliability, performance, or documentation

All contributors are expected to follow the rules below.

---

## 2. Types of Contributions

You may contribute in the following ways:

* 🧠 Architecture improvements
* 🐞 Bug fixes
* 🚀 Performance optimizations
* 📄 Documentation improvements
* 🧪 Tests and tooling
* 🔒 Security hardening

Low-quality or purely cosmetic changes may be rejected.

---

## 3. Development Workflow

### 3.1 Fork & Clone

```bash
git fork <repo-url>
git clone <your-fork-url>
cd pr-review-system
```

---

### 3.2 Create a Branch

Branch naming convention:

```text
feat/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
```

Examples:

* `feat/job-deduplication`
* `fix/worker-crash-on-retry`
* `docs/architecture-update`

---

### 3.3 Local Setup

Follow the setup instructions in:

```
docs/setup.md
```

Ensure:

* API server runs successfully
* Worker processes jobs correctly
* No errors in logs

---

## 4. Code Standards

### 4.1 General Rules

* Use **ESM modules** only
* Follow existing project structure
* Keep functions small and focused
* Avoid unnecessary abstractions

---

### 4.2 Backend Rules

* API layer must remain **stateless**
* No AI calls inside API routes
* All heavy work must go through the queue
* Workers must be idempotent

---

### 4.3 Queue & Worker Rules

* Always use deterministic `jobId`
* Ensure safe retries
* Do not assume exactly-once execution
* Handle external API failures gracefully

---

## 5. Commit Message Convention

Use **conventional commits**:

```text
feat: add job deduplication
fix: handle redis connection retry
docs: update architecture diagram
chore: upgrade dependencies
```

Bad commits may be rejected.

---

## 6. Pull Request Guidelines

Before opening a PR, ensure:

* [ ] Code builds successfully
* [ ] No breaking changes without discussion
* [ ] New logic is documented
* [ ] Logs are meaningful and structured

### PR Description Should Include:

* What changed
* Why it was needed
* Any trade-offs or risks

---

## 7. Review Process

* Maintainers review PRs asynchronously
* Feedback must be addressed respectfully
* PRs may be requested to be split if too large

Approval is based on:

* Code quality
* Architectural correctness
* Long-term maintainability

---

## 8. Security Contributions

If you discover a security issue:

* **Do NOT** open a public issue
* Contact the maintainer privately
* Provide reproduction steps if possible

Responsible disclosure is expected.

---

## 9. Documentation Rules

* Keep docs concise and accurate
* Update diagrams if architecture changes
* Avoid duplicating content across files

---

## 10. Code of Conduct

* Be respectful and professional
* No harassment or abusive behavior
* Constructive feedback only

Violations may result in removal from the project.

---

## 11. Final Notes

This project prioritizes **engineering quality over speed**.

If you're unsure about a change, open an issue or discussion first.

Thank you for contributing 🚀

---

**Maintainer:** Adarsh
