---
state: complete
---

#### Description

List component for static and dynamically generated organisation service data.

#### Properties

| Prop                        | Type       | Value (example)                            | Required |
| --------------------------- | ---------- | ------------------------------------------ | -------- |
| informationNotAvailableText | `String`   | `Information not available at the moment.` | Yes      |
| listDataKey                 | `String`   | `hardware`                                 | Yes      |
| listWrapperClass            | `String`   | `js-services-hardware`                     | Yes      |
| organisation                | `String`   | `Vaski`                                    | Yes      |
| servicePointId              | `Number`   | `85141`                                    | Yes      |
| wrapperClass                | `String`   | `js-service-list-hardware`                 | Yes      |
| items                       | `Object[]` | -                                          | No       |
| title                       | `String`   | `Hardware`                                 | No       |

#### Child components

- `atoms/tooltips/tooltip/tooltip.phtml`
- `molecules/messaging/alert/alert.phtml`
