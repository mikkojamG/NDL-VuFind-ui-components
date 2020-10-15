---
state: complete
---

#### Description

A keywords component, used for both displaying and editing keywords/tags related to a list of items. The list of items can be a general purpose list for all the users or a customisable list owned by a single user.

#### Properties

| Prop       | Type      | Value (example)                                                                                       | Required |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------- | -------- |
| addKeyword | `String`  | `Add keyword`                                                                                         | Yes      |
| alert      | `String`  | `Adding keywords is in testing feature`                                                               | Yes      |
| form       | `Object`  | `{"label": "Type a keyword and click Enter", "button": "Enter", "error": "Please provide a keyword"}` | Yes      |
| editable   | `Boolean` | `true`                                                                                                | No       |

#### Child components

- `molecules/messaging/in-testing-alert/in-testing-alert.phtml`
- `molecules/forms/add-keyword/add-keyword.phtml`
