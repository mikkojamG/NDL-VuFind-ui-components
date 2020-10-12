---
state: inprogress
---

#### Description

A tooltip element which can be used to show information when user hovers/clicks on a element. Tooltip can be placed on different positions around the triggering element (top, bottom, left, right).

#### Properties

| Prop          | Type       | Value (example)                                                                             | Required |
| ------------- | ---------- | ------------------------------------------------------------------------------------------- | -------- |
| buttonClasses | `String[]` | `['btn', 'btn-link']`                                                                       | Yes      |
| buttonText    | `String`   | `<i class="fa fa-question-circle-big" aria-hidden="true"></i> <span>Show tooltip</span>`    | Yes      |
| content       | `String`   | `<h4>Tooltip bottom</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed...` | Yes      |
| label         | `String`   | -                                                                                           | No       |
| position      | `String`   | `bottom`                                                                                    | No       |
