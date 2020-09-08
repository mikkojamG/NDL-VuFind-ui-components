#### Description

Finna main tabs component with tooltips. Can be used for navigations and for showing/hiding content on a page. Turns into a dropdown menu on mobile devices.

#### Properties

| Prop          | Type       | Value (example)                                                                                                                            | Required |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| fallbackLabel | `String`   | `Submit`                                                                                                                                   | Yes      |
| iconLabel     | `String`   | `More`                                                                                                                                     | Yes      |
| tablistLabel  | `String`   | `Finna main tabs`                                                                                                                          | Yes      |
| tabs          | `Object[]` | `["name": "Example tab 1", "id": "tab1", "href": "#", "active": true,"tooltip": "<h4>Tab 1 tooltip</h4><p>Lorem ipsum dolor sit amet...}]` | Yes      |
| menuClass     | `String`   | `js-pl-example-tabs`                                                                                                                       | No       |

#### Child components

- `molecules/navigation/tabs/_tabs-tooltip.phtml`
- `molecules/navigation/dropdowns/sort.phtml`
