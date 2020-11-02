---
state: inprogress
---

#### Description

Schedule widget component, for displaying service point weekly schedules.

#### Properties

| Prop                        | Type      | Value (example)                       | Required |
| --------------------------- | --------- | ------------------------------------- | -------- |
| informationNotAvailableText | `String`  | `No schedules available`              | Yes      |
| nextWeekLabel               | `String`  | `Next week`                           | Yes      |
| organisation                | `String`  | `NFL`                                 | Yes      |
| previousWeekLabel           | `String`  | `Previous week`                       | Yes      |
| selfServiceText             | `String`  | `(self service)`                      | Yes      |
| staffAvailableText          | `String`  | `Staff available`                     | Yes      |
| weekText                    | `String`  | `Week`                                | Yes      |
| wrapperClass                | `String`  | `js-widget-schedule-wrapper`          | Yes      |
| closedText                  | `String`  | `Closed`                              | No       |
| dropdownFallbackLabel       | `String`  | `Select library`                      | No       |
| directionsText              | `String`  | `Directions`                          | No       |
| emailText                   | `String`  | `Email`                               | No       |
| facebookText                | `String`  | `Facebook`                            | No       |
| facilityLink                | `String`  | `https://finna.fi/`                   | No       |
| facilityPlaceholderImage    | `String`  | `https://via.placeholder.com/149x100` | No       |
| openText                    | `String`  | `Open`                                | No       |
| phoneText                   | `String`  | `Phone`                               | No       |
| printText                   | `String`  | `Print`                               | No       |
| servicePointId              | `String`  | `85141`                               | No       |
| servicePointInfoText        | `String`  | `Service point information`           | No       |
| showControls                | `Boolean` | `true`                                | No       |
| showDetails                 | `Boolean` | `true`                                | No       |
| target                      | `String`  | `page`                                | No       |
| wifiText                    | `String`  | `Wifi`                                | No       |
| widgetHeading               | `String`  | `Widget Heading`                      | No       |

#### Child components

- `atoms/messaging/loader/loader.phtml`
- `atoms/tooltips/tooltip/tooltip.phtml`
- `molecules/messaging/alert/alert.phtml`
- `molecules/navigation/dropdowns/sort.phtml`
- `molecules/navigation/pagination/pager-with-label.phtml`