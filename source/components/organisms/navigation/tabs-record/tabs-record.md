#### Description

Record tabs component, with the last tab aligned to right. Tab contents are dynamically loaded from a feed. Used on record landing pages.

#### Properties

| Prop         | Type       | Value (example)                                                              | Required |
| ------------ | ---------- | ---------------------------------------------------------------------------- | -------- |
| tablistLabel | `String`   | `Finna record tabs`                                                          | Yes      |
| tabs         | `Object[]` | `[{"name": "Example tab 1", "id": "tab1", "href": "#", "active": true}...}]` | Yes      |
| menuClass    | `String`   | `js-records-tablist`                                                         | No       |
| tablistClass | `String`   | `visible-md visible-lg`                                                      | No       |

#### Child components

- `molecules/navigation/tabs/tabs-record.phtml`
