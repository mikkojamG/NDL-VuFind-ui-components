---
state: inprogress
---

#### Description

Organisation feed component, which displays organisation RSS data in a grid layout.

#### Properties

| Prop             | Type     | Value (example)                                 | Required |
| ---------------- | -------- | ----------------------------------------------- | -------- |
| generalErrorText | `String` | `Something went wrong! Please try again later.` | Yes      |
| organisationId   | `Number` | `85141`                                         | Yes      |
| parent           | `String` | `Vaski`                                         | Yes      |
| rssId            | `String` | `events`                                        | Yes      |
| wrapperClass     | `String` | `js-organisation-feed`                          | Yes      |
| rssUrl           | `String` | -                                               | No       |

#### Child components

- `molecules/messaging/alert/alert.phtml`
- `atoms/messaging/loader/loader.phtml`
