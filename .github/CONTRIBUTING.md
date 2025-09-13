# Contributing to Mango VPN Connect

First off, thank you for considering contributing to Mango VPN Connect! It's people like you that make this project great. Your help is appreciated, and every contribution, no matter how small, is valuable.

This document provides a set of guidelines for contributing to the project. These are mostly guidelines, not strict rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct (we'll assume one exists for now). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

There are many ways to contribute, from writing code and documentation to submitting bug reports and feature requests.

### Reporting Bugs

If you find a bug, please ensure it hasn't already been reported by searching our [issues on GitHub](https://github.com/your-repo/mango-vpn-suite/issues). If you can't find an open issue addressing the problem, please [open a new one](https://github.com/your-repo/mango-vpn-suite/issues/new). Be sure to use the **Bug Report** template and include as much detail as possible.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please check the [issues on GitHub](https://github.com/your-repo/mango-vpn-suite/issues) to see if it has been discussed before. If not, feel free to [submit a new issue](https://github.com/your-repo/mango-vpn-suite/issues/new) using the **Feature Request** template.

### Your First Code Contribution

Unsure where to begin? You can start by looking through issues tagged with `good first issue` or `help wanted`. These are issues that have been identified as good starting points for new contributors.

## Development Workflow

Ready to contribute some code? Here’s how to set up your fork and submit a pull request.

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/mango-vpn-suite.git
    ```
3.  **Set up your development environment** by following the instructions in our [README.md](./README.md).
4.  **Create a new branch** for your changes. Use a descriptive name:
    ```bash
    git checkout -b feat/add-new-cool-feature
    ```
5.  **Make your changes** to the code.
6.  **Run the tests** to ensure you haven't broken anything:
    ```bash
    npm test
    ```
7.  **Commit your changes** using a descriptive commit message that follows our conventions (see below).
    ```bash
    git add .
    git commit -m "feat: Add new cool feature that does X"
    ```
8.  **Push your branch** to your fork on GitHub:
    ```bash
    git push origin feat/add-new-cool-feature
    ```
9.  **Open a Pull Request** to the `main` branch of the original repository. Provide a clear title and description of your changes. Link to any relevant issues.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps us generate automated changelogs and makes the commit history easier to read.

Your commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Common types:**
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

Example: `fix: Correctly handle disconnection errors in the client`

## Coding Style

- **TypeScript**: We use TypeScript for type safety. Please include types for all new code.
- **Linting**: We use a linter to maintain a consistent code style. Please ensure your code passes the linting checks.
- **Comments**: Write comments for complex logic or parts of the code that may be hard to understand.

Thank you again for your interest in contributing!
