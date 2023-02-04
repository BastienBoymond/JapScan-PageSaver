name: Bug Report
description: File a bug report
title: "[BUG]: "
labels: ["🕷️ bug", "verification"]
assignees:
  - fyroeo
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: Tell us what you see!
    validations:
      required: true
  - type: dropdown
    id: version
    attributes:
      label: Version
      description: Are you using the last version ? Check in your navigator or in manifest.json (same as main branch)
      options:
        - "Yes"
        - "No"
    validations:
      required: true
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Relevant output
      description: Please copy and paste any relevant output (F12 on page that you got a problem) or a screen of render. This will be automatically formatted into code, so no need for backticks.
      render: shell
