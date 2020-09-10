---
title: Tabs Main
---

#### Description

Finna main tabs component. Can be used for navigations and for showing/hiding content on a page. Turns into a dropdown menu on mobile devices.

#### Properties

| Prop          | Type       | Value (example)                                                                | Required |
| ------------- | ---------- | ------------------------------------------------------------------------------ | -------- |
| fallbackLabel | `String`   | `Submit`                                                                       | Yes      |
| iconLabel     | `String`   | `More`                                                                         | Yes      |
| tablistLabel  | `String`   | `Finna main tabs`                                                              | Yes      |
| tabs          | `Object[]` | `[{"name": "Example tab 1", "id": "tab1", "href": "#", "active": true}, {...]` | Yes      |
| menuClass     | `String`   | `js-pl-example-tabs`                                                           | No       |

#### Child components

- `molecules/navigation/tabs/tabs.phtml`
- `molecules/navigation/dropdowns/sort.phtml`
