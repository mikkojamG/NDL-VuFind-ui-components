#### Description

Schedule widget component, used for displaying schedules and other for one or multiple organisations.

#### Properties

| Prop                     | Type      | Value (example)                       | Required |
| ------------------------ | --------- | ------------------------------------- | -------- |
| id                       | `String`  | `86154`                               | Yes      |
| nextWeekLabel            | `String`  | `Next week`                           | Yes      |
| noSchedulesAvailableText | `String`  | `No schedules available`              | Yes      |
| parent                   | `String`  | `NFL`                                 | Yes      |
| previousWeekLabel        | `String`  | `Previous week`                       | Yes      |
| selfServiceText          | `String`  | `(self service)`                      | Yes      |
| staffAvailableText       | `String`  | `Staff available`                     | Yes      |
| target                   | `String`  | `widget`                              | Yes      |
| weekText                 | `String`  | `Week`                                | Yes      |
| closedText               | `String`  | `Closed`                              | No       |
| dropdownFallbackLabel    | `String`  | `Select library`                      | No       |
| directionsText           | `String`  | `Directions`                          | No       |
| emailText                | `String`  | `Email`                               | No       |
| facebookText             | `String`  | `Facebook`                            | No       |
| facilityLink             | `String`  | `https://finna.fi/`                   | No       |
| facilityPlaceholderImage | `String`  | `https://via.placeholder.com/149x100` | No       |
| openText                 | `String`  | `Open`                                | No       |
| phoneText                | `String`  | `Phone`                               | No       |
| printText                | `String`  | `Print`                               | No       |
| servicePointInfoText     | `String`  | `Service point information`           | No       |
| showDetails              | `Boolean` | `true`                                | No       |
| wifiText                 | `String`  | `Wifi`                                | No       |
| widgetHeading            | `String`  | `Widget Heading`                      | No       |

#### Child components

- `molecules/messaging/loader/loader.phtml`
- `molecules/navigation/dropdowns/sort.phtml`
- `molecules/navigation/pagination/pager-with-label.phtml`
- `molecules/tooltips/tooltip/tooltip.phtml`
