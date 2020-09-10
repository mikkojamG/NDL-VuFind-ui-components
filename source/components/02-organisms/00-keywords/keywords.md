#### Description

A keywords component, used for both displaying and editing keywords/tags related to a list of items. The list of items can be a general purpose list for all the users or a customisable list owned by a single user.

#### Properties

| Prop              | Type       | Required |
| ----------------- | ---------- | -------- |
| editable          | `Boolean`  | No       |
| addKeyword        | `String`   | Yes      |
| currentKeywords   | `String`   | Yes      |
| toggleButtonLabel | `String`   | Yes      |
| alert             | `String`   | Yes      |
| submitError       | `String`   | Yes      |
| form              | `Object`   | Yes      |
| tags              | `String[]` | Yes      |

#### Child components

- `01-molecules/02-messaging/00-error-alert.phtml`
- `00-atoms/02-alerts/in-testing-alert.phtml`
- `01-molecules/00-forms/add-keyword.phtml`
