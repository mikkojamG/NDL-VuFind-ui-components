---
state: inprogress
---

#### Description

Contact list component for static and dynamically generated content. For dynamic items `content` property can be left empty and `dynamicKey` property should be added with the key in which content appears in organisation data.

#### Properties

| Prop           | Type       | Value (example)                                                                                                 | Required |
| -------------- | ---------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| items          | `Object[]` | `[{"title": "Address", "class": "js-contact-address", "content": "Linnankatu 2, 20100 Keskusta (Turku)"},...}]` | Yes      |
| organisationId | `Number`   | `85141`                                                                                                         | Yes      |
| parent         | `Object[]` | `Vaski`                                                                                                         | Yes      |
| wrapperClass   | `String`   | `js-pl-contact-list`                                                                                            | Yes      |
