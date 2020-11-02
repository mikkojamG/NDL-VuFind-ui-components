---
state: inprogress
---

#### Description

Service point schedule component, for displaying weekly opening times.

#### Properties

| Prop                        | Type      | Value (example)              | Required |
| --------------------------- | --------- | ---------------------------- | -------- |
| closedText                  | `String`  | `Closed`                     | Yes      |
| informationNotAvailableText | `String`  | `No schedules available`     | Yes      |
| nextWeekLabel               | `String`  | `Next week`                  | Yes      |
| openText                    | `String`  | `Open`                       | Yes      |
| organisation                | `String`  | `NFL`                        | Yes      |
| previousWeekLabel           | `String`  | `Previous week`              | Yes      |
| selfServiceText             | `String`  | `(self service)`             | Yes      |
| servicePointId              | `Number`  | `85141`                      | Yes      |
| staffAvailableText          | `String`  | `Staff available`            | Yes      |
| weekText                    | `String`  | `Week`                       | Yes      |
| wrapperClass                | `String`  | `js-widget-schedule-wrapper` | Yes      |
| dropdownFallbackLabel       | `String`  | `Select library`             | No       |
| showControls                | `Boolean` | `Yes`                        | No       |

#### Child components

- `atoms/messaging/loader/loader.phtml`
- `molecules/messaging/alert/alert.phtml`
- `molecules/navigation/dropdowns/sort.phtml`
- `molecules/navigation/pagination/pager-with-label.phtml`
