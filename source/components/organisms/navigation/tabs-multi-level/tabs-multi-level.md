#### Description

Multi level tabs navigation, containing primary and secondary navigations.

#### Properties

| Prop                  | Type       | Value (example)                                                                          | Required |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------- | -------- |
| fallbackLabel         | `String`   | `Submit`                                                                                 | Yes      |
| iconLabel             | `String`   | `More`                                                                                   | Yes      |
| secondaryTablistLabel | `String`   | `Finna secondary tabs`                                                                   | Yes      |
| secondaryTabs         | `Object[]` | `[{"name": "Secondary tab 1", "id": "secondaryTab1", "href": "#", "active": true},...}]` | Yes      |
| tablistLabel          | `String`   | `Finna main tabs`                                                                        | Yes      |
| tabs                  | `Object[]` | `[{"name": "Primary tab 1", "id": "tab1", "href": "#", "active": true},...}]`            | Yes      |
| menuClass             | `String`   | -                                                                                        | No       |

#### Child components

- `molecules/navigation/tabs/tabs.phtml`
- `molecules/navigation/dropdowns/sort.phtml`
- `molecules/navigation/tabs/tabs-secondary.phtml`
