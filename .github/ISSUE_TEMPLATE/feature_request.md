name: Feature Request
description: Propose a Feature for extension
title: "[FEATURE]: "
labels: ["🏷️ Feature"]
assignees:
  - BastienBoymond
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this feature report!
  - type: textarea
    id: what-would-you-like
    attributes:
      label: What would you like to be added ?
      description: Anything you might found useful !
      placeholder: Write it down there.
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
  - type: dropdown
    id: check
    attributes:
      label: Did you check your request is not already asked ?
      description: Search in the open issues of the repository
      options:
        - "Yes"
        - "No"
    validations:
      required: true